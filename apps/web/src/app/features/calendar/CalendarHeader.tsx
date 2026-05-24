import type { Profile } from "@lifecalendar/shared";

interface CalendarHeaderProps {
  profile: Profile;
}

export function CalendarHeader({ profile }: CalendarHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10">
      <p className="text-[10px] tracking-[0.28em] text-muted/70">Life Calendar</p>
      <h1 className="mt-2 text-[2.1rem] font-medium tracking-tight text-zinc-100 sm:text-[2.6rem]">{profile.name}</h1>
      <p className="mt-1 text-[11px] text-muted/65">A quiet map of weeks lived and unlived.</p>
    </header>
  );
}