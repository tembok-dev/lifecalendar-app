import type { Profile } from "@lifecalendar/shared";
import { Aperture } from "lucide-react";
import type { CalendarScaleMode } from "../hooks/useCalendarZoom";
import { LifeProgressRail } from "./LifeProgressRail";
import { PosterNavIcons } from "./PosterNavIcons";

interface PosterTopRailProps {
  profile: Profile;
  completedWeeks: number;
  totalWeeks: number;
  currentAgeYears: number;
  mode: CalendarScaleMode;
  onToggleMode: () => void;
  onToggleInfo: (anchor: { x: number; y: number }) => void;
}

export function PosterTopRail({
  profile,
  completedWeeks,
  totalWeeks,
  currentAgeYears,
  mode,
  onToggleMode,
  onToggleInfo
}: PosterTopRailProps) {
  return (
    <header className="relative pb-3 pt-8 sm:pt-9">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-zinc-100/96">
          <Aperture size={20} strokeWidth={1.8} className="opacity-90" />
          <div className="leading-none">
            <p className="text-[30px] font-semibold leading-[0.92]">{profile.name}</p>
            <p className="mt-1 text-xs text-zinc-300/75">{currentAgeYears} years old</p>
          </div>
        </div>

        <div className="text-right text-zinc-300/80">
          <p className="text-[11px]">Life Calendar</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 sm:mt-4">
        <PosterNavIcons mode={mode} onToggleMode={onToggleMode} onToggleInfo={onToggleInfo} />
        <LifeProgressRail completedWeeks={completedWeeks} totalWeeks={totalWeeks} />
      </div>
    </header>
  );
}
