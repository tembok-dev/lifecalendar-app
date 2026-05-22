import type { ColorKey, EmotionalTone, EventCategory, IconKey } from "./event-categories.js";

export interface Profile {
  id: string;
  name: string;
  birthDate: string;
  expectedLifespanYears: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LifeEvent {
  id: string;
  profileId: string;
  date: string;
  weekIndex: number;
  category: EventCategory;
  title: string;
  note: string | null;
  emotionalTone: EmotionalTone;
  iconKey: IconKey;
  colorKey: ColorKey;
  isPrivate: boolean;
  showOnExport: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  id: string;
  profileId: string;
  gridDensity: "compact" | "comfortable";
  showYearMarkers: boolean;
  showWeekNumbers: boolean;
  showEventIcons: boolean;
  exportTheme: "night" | "paper";
  createdAt: string;
  updatedAt: string;
}