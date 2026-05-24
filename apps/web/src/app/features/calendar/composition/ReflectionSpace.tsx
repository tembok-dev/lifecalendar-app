import type { CalendarWeek } from "@lifecalendar/shared";

interface ReflectionSpaceProps {
  selectedWeek: CalendarWeek | null;
}

export function ReflectionSpace({ selectedWeek }: ReflectionSpaceProps) {
  return (
    <aside className="hidden w-[38%] min-w-[360px] px-8 pt-20 text-zinc-200/70 xl:block">
      <p className="max-w-[360px] text-[34px] leading-[1.15] text-zinc-100/90">
        Placeholder area for additional context, reflections, or upcoming event cues.
      </p>

      <div className="mt-24 text-zinc-200/70">
        <p className="text-[64px] font-semibold leading-none">{selectedWeek ? selectedWeek.lifeYear + 1 : "--"}</p>
        <p className="mt-2 text-xl">years old</p>
      </div>
    </aside>
  );
}