import type { AppSettings, LifeEvent, Profile } from "@lifecalendar/shared";

type WithDateStrings<T> = {
  [K in keyof T]: T[K];
};

export function toProfile(model: {
  id: string;
  name: string;
  birthDate: Date;
  expectedLifespanYears: number | null;
  createdAt: Date;
  updatedAt: Date;
}): WithDateStrings<Profile> {
  return {
    ...model,
    birthDate: model.birthDate.toISOString(),
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString()
  };
}

export function toEvent(model: {
  id: string;
  profileId: string;
  date: Date;
  weekIndex: number;
  category: string;
  title: string;
  note: string | null;
  emotionalTone: string;
  iconKey: string;
  colorKey: string;
  isPrivate: boolean;
  showOnExport: boolean;
  createdAt: Date;
  updatedAt: Date;
}): WithDateStrings<LifeEvent> {
  return {
    ...model,
    category: model.category as LifeEvent["category"],
    emotionalTone: model.emotionalTone as LifeEvent["emotionalTone"],
    iconKey: model.iconKey as LifeEvent["iconKey"],
    colorKey: model.colorKey as LifeEvent["colorKey"],
    date: model.date.toISOString(),
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString()
  };
}

export function toSettings(model: {
  id: string;
  profileId: string;
  gridDensity: string;
  showYearMarkers: boolean;
  showWeekNumbers: boolean;
  showEventIcons: boolean;
  exportTheme: string;
  createdAt: Date;
  updatedAt: Date;
}): WithDateStrings<AppSettings> {
  return {
    ...model,
    gridDensity: model.gridDensity as AppSettings["gridDensity"],
    exportTheme: model.exportTheme as AppSettings["exportTheme"],
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString()
  };
}