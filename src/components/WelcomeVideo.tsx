import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WelcomeVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let visible = false;
    let started = false;
    const markStarted = () => { started = true; };
    const tryStart = () => {
      if (!visible || started || video.readyState < 3) return;
      // Give playback a head start rather than starting on the first decoded frame.
      const required = Number.isFinite(video.duration)
        ? Math.min(3, video.duration - video.currentTime)
        : 3;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= video.currentTime &&
            video.buffered.end(i) - video.currentTime >= required) {
          started = true;
          void video.play().catch(() => {
            // Browser autoplay policies may require the native play button.
          });
          break;
        }
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      tryStart();
    }, { threshold: [0, 0.35] });

    observer.observe(video);
    video.addEventListener('play', markStarted);
    video.addEventListener('progress', tryStart);
    video.addEventListener('canplay', tryStart);
    video.addEventListener('canplaythrough', tryStart);
    return () => {
      observer.disconnect();
      video.removeEventListener('play', markStarted);
      video.removeEventListener('progress', tryStart);
      video.removeEventListener('canplay', tryStart);
      video.removeEventListener('canplaythrough', tryStart);
    };
  }, [src]);

  return (
    <section className="max-w-6xl mx-auto px-6 mb-20" aria-label="Northstar Pioneers welcome video">
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        <video
          ref={videoRef}
          className="block w-full aspect-video"
          src={src}
          muted={muted}
          playsInline
          controls
          preload="auto"
          aria-label="Welcome to Northstar Pioneers"
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onError={() => setFailed(true)}
        >
          Your browser does not support video playback.
        </video>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <p className="text-sm text-muted-foreground">
          {failed ? 'The video couldn’t load. Please try again later.' : (
            <>
              Credit: <a
                href="https://www.linkedin.com/in/maksym-alaybov-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5AB0FF] underline underline-offset-4 hover:text-foreground"
              >Maksym Alaybov</a>, AI Video Production.
            </>
          )}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const video = videoRef.current;
            if (video) video.muted = !video.muted;
          }}
          disabled={failed}
          aria-label={muted ? 'Unmute welcome video' : 'Mute welcome video'}
        >
          {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          {muted ? 'Sound on' : 'Sound off'}
        </Button>
      </div>
    </section>
  );
}
