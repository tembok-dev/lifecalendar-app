import { useMemo, useState } from "react";

export type CalendarScaleMode = "fit-width" | "contain";

interface UseCalendarZoomInput {
  mode: CalendarScaleMode;
  viewportWidth: number;
  viewportHeight: number;
  stageWidth: number;
  stageHeight: number;
}

const FIT_WIDTH_MIN_SCALE = 0.24;
const CONTAIN_MIN_SCALE = 0.34;
const MAX_SCALE = 1.25;

function clamp(value: number, min: number, max = MAX_SCALE) {
  return Math.min(max, Math.max(min, value));
}

export function useCalendarZoom(input: UseCalendarZoomInput) {
  const [mode, setMode] = useState<CalendarScaleMode>(input.mode);

  const baseScale = useMemo(() => {
    if (input.stageWidth <= 0 || input.stageHeight <= 0 || input.viewportWidth <= 0 || input.viewportHeight <= 0) {
      return 1;
    }

    if (mode === "fit-width") {
      const safeWidth = Math.max(0, input.viewportWidth - 12);
      return clamp(safeWidth / input.stageWidth, FIT_WIDTH_MIN_SCALE, 1);
    }

    const widthScale = input.viewportWidth / input.stageWidth;
    const heightScale = input.viewportHeight / input.stageHeight;
    return clamp(Math.min(widthScale, heightScale), CONTAIN_MIN_SCALE);
  }, [input.stageHeight, input.stageWidth, input.viewportHeight, input.viewportWidth, mode]);

  const scale = clamp(baseScale, mode === "fit-width" ? FIT_WIDTH_MIN_SCALE : CONTAIN_MIN_SCALE);

  return {
    mode,
    scale,
    toggleMode: () => setMode((value) => (value === "fit-width" ? "contain" : "fit-width"))
  };
}
