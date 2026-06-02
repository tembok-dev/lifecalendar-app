interface LifeProgressRailProps {
  completedWeeks: number;
  totalWeeks: number;
  compact?: boolean;
}

export function LifeProgressRail({ completedWeeks, totalWeeks, compact = false }: LifeProgressRailProps) {
  const ratio = totalWeeks > 0 ? Math.min(1, Math.max(0, completedWeeks / totalWeeks)) : 0;

  return (
    <div className={compact ? "mx-auto w-full max-w-[150px]" : "mx-auto w-full max-w-[150px]"}>
      <div className={compact ? "h-[3px] w-full overflow-hidden rounded-full bg-[rgba(117,132,151,0.38)]" : "h-[4px] w-full overflow-hidden rounded-full bg-[rgba(117,132,151,0.38)]"}>
        <div
          className="h-full rounded-full bg-[rgba(242,247,252,0.96)] transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }}
        />
      </div>
    </div>
  );
}
