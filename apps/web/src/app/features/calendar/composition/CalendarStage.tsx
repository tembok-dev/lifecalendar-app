import type { PropsWithChildren, RefObject } from "react";

interface CalendarStageProps extends PropsWithChildren {
  scale: number;
  contentRef: RefObject<HTMLDivElement>;
  fitContent?: boolean;
}

export function CalendarStage({ scale, contentRef, fitContent = true, children }: CalendarStageProps) {
  return (
    <div className="origin-top-left transition-transform duration-300" style={{ transform: `scale(${scale})` }}>
      <div ref={contentRef} className={fitContent ? "w-fit" : "w-full"}>
        {children}
      </div>
    </div>
  );
}
