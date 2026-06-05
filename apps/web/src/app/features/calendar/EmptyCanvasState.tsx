import { APP_NAME, APP_TAGLINE } from "@lifecalendar/shared";
import { BrandAsset } from "../brand/BrandAsset";

export function EmptyCanvasState() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-8">
      <section className="w-full rounded-3xl border border-line/70 bg-surface/50 p-10 shadow-soft backdrop-blur">
        <BrandAsset asset="wordmark" className="h-5 w-[112px] text-[var(--color-brand-muted)]" label={APP_NAME} />
        <h1 className="mt-2 text-2xl font-medium text-zinc-100">Canvas Ready</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {APP_TAGLINE} Create your first profile directly on this canvas to begin filling in meaningful moments.
        </p>
      </section>
    </div>
  );
}
