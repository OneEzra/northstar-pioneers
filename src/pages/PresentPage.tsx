// -----------------------------------------------------------------
//  Presentation mode: /events/:slug/present  (and /present for the
//  next gathering). Full-screen slides built from the event's data.
//
//  Controls: → / Space / PageDown / click right side = next
//            ← / PageUp / click left side = back
//            Home / End = first / last slide · F = full screen
//            Esc = exit (in full screen: first Esc leaves full screen)
//  Presentation clickers send PageUp/PageDown, so they just work.
// -----------------------------------------------------------------

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Maximize, Minimize, X } from 'lucide-react';
import { useMeetupEvents } from '@/hooks/useMeetupEvents';
import { usePageSeo } from '@/lib/seo';
import { buildSlides, clampSlide, toggleFullscreen } from '@/lib/presentation';
import { SlideView } from '@/components/present/Slides';
import NotFound from './NotFound';

const STAGE_W = 1920;
const STAGE_H = 1080;
const IDLE_MS = 2500;

/** Scale factor that fits the 1920×1080 stage inside the window. */
function useStageScale(): number {
  const get = () => Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
  const [scale, setScale] = useState(get);
  useEffect(() => {
    const onResize = () => setScale(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}

/** Keep the screen awake while presenting (where the browser allows it). */
function useWakeLock() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = async () => {
      try {
        if ('wakeLock' in navigator && document.visibilityState === 'visible') {
          lock = await navigator.wakeLock.request('screen');
          if (cancelled) void lock.release();
        }
      } catch {
        // Not supported or not allowed -- presenting still works.
      }
    };
    void request();
    const onVisible = () => void request();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      void lock?.release().catch(() => {});
    };
  }, []);
}

function useIsFullscreen(): boolean {
  const [fs, setFs] = useState(() => !!document.fullscreenElement);
  useEffect(() => {
    const onChange = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  return fs;
}

/** /present -> the next gathering's slides (or the latest one). */
export function PresentNextPage() {
  const { next, past, isLoading } = useMeetupEvents();
  const target = next ?? past[0];
  if (!target) return isLoading ? <div className="fixed inset-0 bg-black" /> : <NotFound />;
  return <Navigate to={`/events/${target.slug}/present`} replace />;
}

export default function PresentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { bySlug, isLoading } = useMeetupEvents();
  const event = slug ? bySlug(slug) : undefined;
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  usePageSeo({
    title: event ? `Presenting · ${event.title} | Northstar Pioneers` : 'Presenting | Northstar Pioneers',
    path: `/events/${slug ?? ''}/present`,
    noindex: true,
  });

  const slides = useMemo(() => (event ? buildSlides(event) : []), [event]);
  const index = clampSlide(params.get('s'), slides.length);
  const scale = useStageScale();
  const isFullscreen = useIsFullscreen();
  useWakeLock();

  // ---- navigation
  const go = useCallback(
    (i: number) => {
      const next = Math.min(Math.max(i, 0), slides.length - 1);
      setParams(next === 0 ? {} : { s: String(next + 1) }, { replace: true });
    },
    [slides.length, setParams],
  );

  const from = (location.state as { from?: string } | null)?.from;
  const exit = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => {});
    navigate(from ?? `/events/${event?.slug ?? slug ?? ''}`);
  }, [navigate, from, event?.slug, slug]);

  // ---- controls auto-hide (and the mouse cursor with them)
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const wake = useCallback(() => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
  }, []);
  useEffect(() => {
    // Start the first countdown; controls are visible until it fires.
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS);
    return () => window.clearTimeout(idleTimer.current);
  }, []);

  // ---- keyboard / clicker
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
        case 'Enter':
          e.preventDefault();
          go(index + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          go(index - 1);
          break;
        case 'Home':
          e.preventDefault();
          go(0);
          break;
        case 'End':
          e.preventDefault();
          go(slides.length - 1);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          // In full screen most browsers keep Esc for themselves (it just
          // leaves full screen); a second Esc then exits presentation mode.
          exit();
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, slides.length, exit]);

  // ---- tap / click sides, swipe
  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);
  const onStageClick = (e: React.MouseEvent) => {
    if (swiped.current) {
      swiped.current = false; // the click that follows a swipe
      return;
    }
    if ((e.target as HTMLElement).closest('a,button')) return;
    if (e.clientX < window.innerWidth / 3) go(index - 1);
    else go(index + 1);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchX.current;
    touchX.current = null;
    const end = e.changedTouches[0]?.clientX;
    if (start == null || end == null) return;
    const dx = end - start;
    if (Math.abs(dx) > 50) {
      swiped.current = true;
      window.setTimeout(() => (swiped.current = false), 400);
      go(index + (dx < 0 ? 1 : -1));
    }
  };

  if (!event) {
    if (isLoading) return <div className="fixed inset-0 bg-black" />;
    return <NotFound />;
  }
  if (slug !== event.slug) {
    return <Navigate to={`/events/${event.slug}/present${location.search}`} replace state={location.state} />;
  }

  const slide = slides[index];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black select-none overflow-hidden"
      style={{ cursor: idle ? 'none' : 'default' }}
      onMouseMove={wake}
      onClick={onStageClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="slideshow"
      aria-label={`${event.title} presentation`}
    >
      {/* 1920×1080 stage, centered and scaled to fit */}
      <div
        className="absolute"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
        aria-live="polite"
        aria-label={`Slide ${index + 1} of ${slides.length}`}
      >
        {slide && <SlideView key={slide.key} slide={slide} event={event} />}
      </div>

      {/* Progress line */}
      <div className="absolute left-0 bottom-0 h-[3px] bg-[#1E8EFF]/70 transition-all duration-300" style={{ width: `${((index + 1) / slides.length) * 100}%` }} />

      {/* Controls (fade out when the mouse is still) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-1 rounded-full bg-black/80 border border-white/15 px-2 py-1.5 text-white text-sm transition-opacity duration-500"
        style={{ opacity: idle ? 0 : 1, pointerEvents: idle ? 'none' : 'auto' }}
        onMouseEnter={wake}
      >
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30" aria-label="Previous slide">
          <ChevronLeft className="size-5" />
        </button>
        <span className="tabular-nums px-2 font-semibold min-w-[4.5rem] text-center">
          {index + 1} / {slides.length}
        </span>
        <button type="button" onClick={() => go(index + 1)} disabled={index === slides.length - 1} className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30" aria-label="Next slide">
          <ChevronRight className="size-5" />
        </button>
        <span className="w-px h-5 bg-white/20 mx-1" />
        <button type="button" onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-white/10" aria-label={isFullscreen ? 'Leave full screen' : 'Full screen'} title="Full screen (F)">
          {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
        </button>
        <button type="button" onClick={exit} className="flex items-center gap-1.5 pl-2 pr-3 py-2 rounded-full hover:bg-white/10 text-xs font-bold uppercase tracking-widest" title="Exit (Esc)">
          <X className="size-4" /> Exit
        </button>
      </div>
    </div>
  );
}
