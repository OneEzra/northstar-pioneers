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

const STAR_COLOR = '#1E8EFF';
const STAR_INNER_RATIO = 0.45;
const STAR_ROUNDING = 0.14;
const BACKING_FRACTION = 0.17;
const STAR_FILL = 0.84;

export function QRCodeCanvas({ value, size = 256, level = 'M', logo = true, className }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const backing = canvas.width * BACKING_FRACTION;
        const bx = (canvas.width - backing) / 2;
        const by = (canvas.height - backing) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(bx, by, backing, backing, backing * 0.2);
        ctx.fill();

        // Regular five-point star with softly rounded tips, centered by its bounding box.
        const extent = (backing * STAR_FILL) / 1.902;
        const lineWidth = extent * STAR_ROUNDING;
        const outer = extent - lineWidth / 2;
        const inner = outer * STAR_INNER_RATIO;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + (extent * (1 - Math.cos(Math.PI / 5))) / 2;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outer : inner;
          const a = -Math.PI / 2 + (i * Math.PI) / 5;
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = STAR_COLOR;
        ctx.strokeStyle = STAR_COLOR;
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.fill();
        ctx.stroke();
      }
    );
  }, [value, size, level, logo]);

  return <canvas ref={canvasRef} className={className} />;
}
