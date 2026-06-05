import { APP_NAME, APP_TAGLINE } from "@lifecalendar/shared";
import { BrandAsset } from "../brand/BrandAsset";
import { Frame } from "../../primitives/Frame";

export function AppShellPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10">
      <Frame>
        <BrandAsset asset="logo" className="h-7 w-[110px] text-[var(--color-brand-primary)]" label={APP_NAME} />
        <p className="mt-3 text-sm text-muted">
          {APP_TAGLINE} The Life Calendar canvas and data models will continue to evolve in upcoming stages.
        </p>
      </Frame>
    </main>
  );
}
