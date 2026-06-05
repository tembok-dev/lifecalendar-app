import { APP_NAME, type Profile } from "@lifecalendar/shared";
import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandAsset } from "../../brand/BrandAsset";
import { LifeProgressRail } from "./LifeProgressRail";
import { PosterNavIcons } from "./PosterNavIcons";

interface PosterTopRailProps {
  profile: Profile;
  completedWeeks: number;
  totalWeeks: number;
  currentAgeYears: number;
  upcomingCount: number;
  onQuickAdd: (anchor: { x: number; y: number }) => void;
  onOpenSettings: () => void;
  showAddHint: boolean;
}

export function PosterTopRail({
  profile,
  completedWeeks,
  totalWeeks,
  currentAgeYears,
  upcomingCount,
  onQuickAdd,
  onOpenSettings,
  showAddHint
}: PosterTopRailProps) {
  const [compactDock, setCompactDock] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompactDock(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative pb-4 pt-[5%]">
      <div
        className={
          compactDock
            ? "fixed left-1/2 top-[6px] z-40 w-[min(100%-20px,var(--poster-top-dock-width))] -translate-x-1/2 scale-[0.92] opacity-92 transition-all duration-300"
            : "fixed left-1/2 top-[var(--poster-top-dock-offset)] z-40 w-[min(100%-20px,var(--poster-top-dock-width))] -translate-x-1/2 scale-100 opacity-100 transition-all duration-300"
        }
      >
        <PosterNavIcons
          onQuickAdd={onQuickAdd}
          onOpenSettings={onOpenSettings}
          showHint={showAddHint}
          compact={compactDock}
        />
        <div className={compactDock ? "mt-1.5 opacity-88 transition-all duration-300" : "mt-2.5 transition-all duration-300"}>
          <LifeProgressRail completedWeeks={completedWeeks} totalWeeks={totalWeeks} compact={compactDock} />
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-7xl">
        <div className="relative z-20 flex w-full justify-between" style={{ minHeight: "var(--poster-identity-height)" }}>
          <div className="relative flex items-start">
            <div className="pointer-events-none absolute -left-4 -top-5 h-16 w-16 text-[var(--color-brand-watermark)] opacity-70">
              <BrandAsset asset="mark" className="h-full w-full scale-75" />
            </div>
            <BrandAsset
              asset="logo"
              className="relative z-10 h-[25px] w-[100px] text-[var(--color-brand-primary)]"
              label={APP_NAME}
            />
          </div>

          <div className="relative flex flex-col items-end gap-2 text-right">
            <div className="pointer-events-none absolute -right-3 -top-8 h-[74px] w-[74px] text-[var(--color-brand-watermark)]">
              <BrandAsset asset="mark" className="h-full w-full" />
            </div>
            <p className="text-balance text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-100">{profile.name}</p>
            <div className="relative z-10 text-xs text-zinc-400">
              <p>{currentAgeYears} years old</p>
              <p className="mt-0.5 inline-flex items-center gap-1">
                <CalendarClock className="h-3.5 w-3.5" />
                {upcomingCount} upcoming
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
