"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const canvasEl: HTMLCanvasElement = el;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let frame = 0;
    let particles: Particle[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const { width, height } = canvasEl.getBoundingClientRect();
      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((width * height) / 9000);
      particles = Array.from({ length: Math.min(count, 160) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        hue: Math.random() > 0.5 ? 45 : 175,
      }));
    }

    function draw() {
      const { width, height } = canvasEl.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          p.vx -= (dx / dist) * 0.02;
          p.vy -= (dy / dist) * 0.02;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 45 ? "rgba(212, 175, 55, 0.75)" : "rgba(20, 184, 166, 0.65)";
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.15 * (1 - d / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvasEl.addEventListener("mousemove", onMove);
    canvasEl.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvasEl.removeEventListener("mousemove", onMove);
      canvasEl.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`} aria-hidden />;
}
