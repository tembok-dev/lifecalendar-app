import type { PropsWithChildren, RefObject } from "react";

interface CalendarStageProps extends PropsWithChildren {
  scale: number;
  contentRef: RefObject<HTMLDivElement>;
}

export function CalendarStage({ scale, contentRef, children }: CalendarStageProps) {
  return (
    <div className="origin-top-left transition-transform duration-300" style={{ transform: `scale(${scale})` }}>
      <div ref={contentRef} className="w-fit">
        {children}
      </div>
    </div>
  );
}