export function EmptyCanvasState() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-8">
      <section className="w-full rounded-3xl border border-line/70 bg-surface/50 p-10 shadow-soft backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted">Life Calendar</p>
        <h1 className="mt-2 text-2xl font-medium text-zinc-100">Canvas Ready</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          No profile found yet. Stage 5 will add a lightweight onboarding overlay to create the first profile
          without leaving this canvas.
        </p>
      </section>
    </div>
  );
}