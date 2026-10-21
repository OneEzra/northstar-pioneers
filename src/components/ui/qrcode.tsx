import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  /** Draw the blue star mark in the center. Forces error correction to H so the code still scans. */
  logo?: boolean;
  className?: string;
}

const LOGO_SRC = '/star-mark-blue.svg';
const BACKING_FRACTION = 0.17;
const STAR_FILL = 0.84;

export function QRCodeCanvas({ value, size = 256, level = 'M', logo = true, className }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    QRCode.toCanvas(
      canvas,
      value,
      {
        width: size,
        margin: 1,
        errorCorrectionLevel: logo ? 'H' : level,
      },
      (error) => {
        if (error) {
          console.error('QR Code generation error:', error);
          return;
        }
        if (!logo) return;

        const img = new Image();
        img.onload = () => {
          if (cancelled) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          const backing = canvas.width * BACKING_FRACTION;
          const star = backing * STAR_FILL;
          const bx = (canvas.width - backing) / 2;
          const by = (canvas.height - backing) / 2;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(bx, by, backing, backing, backing * 0.2);
          ctx.fill();
          ctx.drawImage(img, (canvas.width - star) / 2, (canvas.height - star) / 2, star, star);
        };
        img.src = LOGO_SRC;
      }
    );

    return () => {
      cancelled = true;
    };
  }, [value, size, level, logo]);

  return <canvas ref={canvasRef} className={className} />;
}
