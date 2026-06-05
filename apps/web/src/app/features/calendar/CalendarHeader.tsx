import { APP_NAME, APP_TAGLINE, type Profile } from "@lifecalendar/shared";
import { BrandAsset } from "../brand/BrandAsset";

interface CalendarHeaderProps {
  profile: Profile;
}

export function CalendarHeader({ profile }: CalendarHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10">
      <BrandAsset asset="wordmark" className="h-5 w-[110px] text-[var(--color-brand-muted)]" label={APP_NAME} />
      <h1 className="mt-2 text-[2.1rem] font-medium tracking-tight text-zinc-100 sm:text-[2.6rem]">{profile.name}</h1>
      <p className="mt-1 text-[11px] text-muted/65">{APP_TAGLINE}</p>
    </header>
  );
}
