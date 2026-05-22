import { APP_NAME, FOUNDATION_VERSION } from "./constants.js";
import type { AppStageMeta } from "./types.js";

export function getStageMeta(): AppStageMeta {
  return {
    version: FOUNDATION_VERSION,
    stage: "foundation"
  };
}

export { APP_NAME, FOUNDATION_VERSION };
export type { AppStageMeta };