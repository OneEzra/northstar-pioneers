import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WelcomeVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [autoplay] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  return (
    <section className="max-w-6xl mx-auto px-6 mb-20" aria-label="Northstar Pioneers welcome video">
      <div className="overflow-hidden rounded-xl border border-border bg-black">
        <video
          ref={videoRef}
          className="block w-full aspect-video"
          src={src}
          autoPlay={autoplay}
          muted={muted}
          playsInline
          controls
          preload="metadata"
          aria-label="Welcome to Northstar Pioneers"
          onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
          onError={() => setFailed(true)}
        >
          Your browser does not support video playback.
        </video>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <p className="text-sm text-muted-foreground">
          {failed ? 'The video couldn’t load. Please try again later.' : 'A welcome from Northstar Pioneers.'}
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
