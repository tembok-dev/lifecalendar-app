import { useEffect, useState } from "react";

export type PosterLayoutMode = "vertical" | "horizontal";

export function usePosterLayout(): PosterLayoutMode {
  const [mode, setMode] = useState<PosterLayoutMode>("vertical");

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1600px)");

    const update = () => setMode(media.matches ? "horizontal" : "vertical");
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return mode;
}