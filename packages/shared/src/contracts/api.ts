import type { EventCategory } from "../domain/event-categories.js";
import type { AppSettings, LifeEvent, Profile } from "../domain/models.js";
import type { CalendarSummary, CalendarWeek } from "../calendar/types.js";

export interface CreateProfileInput {
  name: string;
  birthDate: string;
  expectedLifespanYears?: number | null;
}

export interface PatchProfileInput {
  name?: string;
  birthDate?: string;
  expectedLifespanYears?: number | null;
}

export interface CreateLifeEventInput {
  date: string;
  weekIndex: number;
  category: EventCategory;
  title: string;
  note?: string | null;
  isPrivate?: boolean;
  showOnExport?: boolean;
}

export interface PatchLifeEventInput {
  date?: string;
  weekIndex?: number;
  category?: EventCategory;
  title?: string;
  note?: string | null;
  isPrivate?: boolean;
  showOnExport?: boolean;
}

export interface PatchAppSettingsInput {
  gridDensity?: "compact" | "comfortable";
  showYearMarkers?: boolean;
  showWeekNumbers?: boolean;
  showEventIcons?: boolean;
  exportTheme?: "night" | "paper";
}

export interface ApiHealthResponse {
  status: "ok";
}

export interface GetProfilesResponse {
  profiles: Profile[];
}

export interface GetProfileResponse {
  profile: Profile;
}

export interface GetProfileEventsResponse {
  events: LifeEvent[];
}

export interface GetProfileSettingsResponse {
  settings: AppSettings;
}

export interface GetProfileCalendarResponse {
  profile: Profile;
  settings: AppSettings;
  summary: CalendarSummary;
  weeks: CalendarWeek[];
}

export interface MutationProfileResponse {
  profile: Profile;
}

export interface MutationEventResponse {
  event: LifeEvent;
}

export interface MutationSettingsResponse {
  settings: AppSettings;
}