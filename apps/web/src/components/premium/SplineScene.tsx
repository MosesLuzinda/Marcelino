"use client";

export function SplineScene({ className = "" }: { className?: string }) {
  const scene = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL;

  if (!scene) {
    return (
      <section
        className={`relative flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-brand-950 to-teal-950/40 ${className}`}
      >
        <section className="text-center p-12 max-w-md z-10">
          <p className="text-accent-gold font-display text-lg font-semibold mb-2">Spline 3D Campus</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create your scene at{" "}
            <a href="https://spline.design" className="text-accent-teal underline" target="_blank" rel="noopener noreferrer">
              spline.design
            </a>
            , export a <strong>public URL</strong>, and set{" "}
            <code className="text-xs bg-white/10 px-1 rounded">NEXT_PUBLIC_SPLINE_SCENE_URL</code> in{" "}
            <code className="text-xs bg-white/10 px-1 rounded">.env.local</code>.
          </p>
        </section>
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.4),transparent_60%)]" />
      </section>
    );
  }

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-white/10 ${className}`}>
      <iframe
        src={scene}
        title="Marcelino 3D campus experience"
        className="w-full min-h-[420px] h-full border-0"
        loading="lazy"
        allow="fullscreen"
      />
    </section>
  );
}
