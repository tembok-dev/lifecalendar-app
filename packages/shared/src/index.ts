import { APP_NAME, APP_VERSION } from "./constants.js";
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_DEFAULTS,
  deriveEventVisuals,
  type ColorKey,
  type EmotionalTone,
  type EventCategory,
  type IconKey
} from "./domain/event-categories.js";
import type { AppSettings, LifeEvent, Profile } from "./domain/models.js";
import type {
  ApiHealthResponse,
  CreateLifeEventInput,
  CreateProfileInput,
  GetProfileEventsResponse,
  GetProfileResponse,
  GetProfileSettingsResponse,
  GetProfilesResponse,
  MutationEventResponse,
  MutationProfileResponse,
  MutationSettingsResponse,
  PatchAppSettingsInput,
  PatchLifeEventInput,
  PatchProfileInput
} from "./contracts/api.js";

export { APP_NAME, APP_VERSION, EVENT_CATEGORIES, EVENT_CATEGORY_DEFAULTS, deriveEventVisuals };

export type { AppSettings, LifeEvent, Profile };
export type { ColorKey, EmotionalTone, EventCategory, IconKey };

export type {
  ApiHealthResponse,
  CreateLifeEventInput,
  CreateProfileInput,
  GetProfileEventsResponse,
  GetProfileResponse,
  GetProfileSettingsResponse,
  GetProfilesResponse,
  MutationEventResponse,
  MutationProfileResponse,
  MutationSettingsResponse,
  PatchAppSettingsInput,
  PatchLifeEventInput,
  PatchProfileInput
};