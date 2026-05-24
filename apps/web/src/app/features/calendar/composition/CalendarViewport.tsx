import type { PropsWithChildren, RefObject } from "react";

interface CalendarViewportProps extends PropsWithChildren {
  viewportRef: RefObject<HTMLDivElement>;
  centerStage: boolean;
}

export function CalendarViewport({ viewportRef, centerStage, children }: CalendarViewportProps) {
  return (
    <div ref={viewportRef} className="calendar-viewport no-scrollbar relative w-full overflow-auto pb-4">
      <div className={centerStage ? "relative mx-auto w-fit pl-2" : "relative w-fit pl-2"}>{children}</div>
    </div>
  );
}
