import { APP_NAME, APP_TAGLINE, APP_VERSION } from "./constants.js";
import {
  EVENT_CATEGORIES,
  EVENT_CATEGORY_DEFAULTS,
  deriveEventVisuals,
  type ColorKey,
  type EmotionalTone,
  type EventCategory,
  type IconKey
} from "./domain/event-categories.js";
import { deriveRecurrenceDefaults } from "./domain/recurrence.js";
import type { AppSettings, LifeEvent, Profile } from "./domain/models.js";
import {
  attachEventsToWeeks,
  buildLifeCalendar,
  buildCalendarSummary,
  buildCalendarWeeks,
  getCalendarYearMonthSlot,
  getCalendarYearRowFromBirth,
  getCalendarYearWeekSlot,
  getCurrentLifeWeekIndex,
  getLifeWeekRange,
  getWeekSlotRange,
  getWeekIndexFromDate,
  groupWeeksByLifeYear,
  resolveVisualSlotStatus,
  buildRecurringPreviewEvents,
  getYearlyOccurrenceDate,
  isOccurrenceAfterToday,
  type BuiltCalendar,
  type CalendarDerivedData,
  type CalendarSummary,
  type CalendarWeek
} from "./calendar/index.js";
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
  PatchProfileInput,
  GetProfileCalendarResponse
} from "./contracts/api.js";

export {
  APP_NAME,
  APP_TAGLINE,
  APP_VERSION,
  EVENT_CATEGORIES,
  EVENT_CATEGORY_DEFAULTS,
  deriveEventVisuals,
  deriveRecurrenceDefaults,
  attachEventsToWeeks,
  buildLifeCalendar,
  buildCalendarSummary,
  buildCalendarWeeks,
  getCalendarYearMonthSlot,
  getCalendarYearRowFromBirth,
  getCalendarYearWeekSlot,
  getCurrentLifeWeekIndex,
  getLifeWeekRange,
  getWeekSlotRange,
  getWeekIndexFromDate,
  groupWeeksByLifeYear,
  resolveVisualSlotStatus,
  buildRecurringPreviewEvents,
  getYearlyOccurrenceDate,
  isOccurrenceAfterToday
};

export type { AppSettings, LifeEvent, Profile };
export type { ColorKey, EmotionalTone, EventCategory, IconKey };
export type { BuiltCalendar, CalendarDerivedData, CalendarSummary, CalendarWeek };

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
  PatchProfileInput,
  GetProfileCalendarResponse
};
