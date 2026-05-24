interface LifeProgressRailProps {
  completedWeeks: number;
  totalWeeks: number;
}

export function LifeProgressRail({ completedWeeks, totalWeeks }: LifeProgressRailProps) {
  const ratio = totalWeeks > 0 ? Math.min(1, Math.max(0, completedWeeks / totalWeeks)) : 0;

  return (
    <div className="w-full max-w-[340px] sm:max-w-[430px]">
      <div className="h-[2px] w-full overflow-hidden rounded-full bg-zinc-300/14">
        <div className="h-full rounded-full bg-zinc-100/68 transition-all duration-500" style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
