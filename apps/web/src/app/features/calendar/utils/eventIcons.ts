import type { ColorKey, EventCategory, IconKey } from "@lifecalendar/shared";
import {
  AirplaneTiltIcon,
  BabyCarriageIcon,
  BriefcaseIcon,
  CakeIcon,
  CrossIcon,
  DotOutlineIcon,
  FlagIcon,
  GraduationCapIcon,
  HeartIcon,
  HeartbeatIcon,
  HouseIcon,
  MountainsIcon,
  SparkleIcon,
  UsersThreeIcon,
  TrophyIcon,
  type Icon as PhosphorIconType
} from "@phosphor-icons/react";

export type EventIconComponent = PhosphorIconType;

const CATEGORY_ICON_MAP: Record<EventCategory, EventIconComponent> = {
  memory: SparkleIcon,
  newborn: BabyCarriageIcon,
  birthday: CakeIcon,
  relationship: HeartIcon,
  family: UsersThreeIcon,
  travel: AirplaneTiltIcon,
  home: HouseIcon,
  career: BriefcaseIcon,
  education: GraduationCapIcon,
  health: HeartbeatIcon,
  loss: CrossIcon,
  achievement: TrophyIcon,
  challenge: MountainsIcon,
  goal: FlagIcon,
  custom: SparkleIcon
};

const ICON_KEY_MAP: Record<IconKey, EventIconComponent> = {
  carriage: BabyCarriageIcon,
  cake: CakeIcon,
  heart: HeartIcon,
  users: UsersThreeIcon,
  plane: AirplaneTiltIcon,
  house: HouseIcon,
  briefcase: BriefcaseIcon,
  book: GraduationCapIcon,
  pulse: HeartbeatIcon,
  cross: CrossIcon,
  moon: CrossIcon,
  trophy: TrophyIcon,
  mountain: MountainsIcon,
  target: FlagIcon,
  star: SparkleIcon,
  dot: DotOutlineIcon
};

export const EVENT_COLOR_TEXT_CLASS: Record<ColorKey, string> = {
  rose: "text-rose-400",
  coral: "text-orange-400",
  amber: "text-amber-400",
  teal: "text-teal-400",
  indigo: "text-indigo-400",
  slate: "text-slate-300",
  emerald: "text-emerald-400",
  blue: "text-blue-400",
  violet: "text-violet-400",
  orange: "text-orange-400",
  cyan: "text-cyan-400",
  lime: "text-lime-400",
  stone: "text-stone-400",
  gray: "text-zinc-400"
};

export const EVENT_COLOR_FILL_CLASS: Record<ColorKey, string> = {
  rose: "bg-rose-400/90",
  coral: "bg-orange-400/90",
  amber: "bg-amber-400/90",
  teal: "bg-teal-400/90",
  indigo: "bg-indigo-500/90",
  slate: "bg-slate-700/92",
  emerald: "bg-emerald-400/90",
  blue: "bg-blue-500/90",
  violet: "bg-violet-500/90",
  orange: "bg-orange-500/90",
  cyan: "bg-cyan-400/90",
  lime: "bg-lime-400/90",
  stone: "bg-stone-400/88",
  gray: "bg-zinc-400/88"
};

export const EVENT_COLOR_RING_CLASS: Record<ColorKey, string> = {
  rose: "ring-rose-300/55",
  coral: "ring-orange-300/55",
  amber: "ring-amber-300/58",
  teal: "ring-teal-300/55",
  indigo: "ring-indigo-400/58",
  slate: "ring-slate-400/58",
  emerald: "ring-emerald-300/55",
  blue: "ring-blue-400/56",
  violet: "ring-violet-400/58",
  orange: "ring-orange-400/56",
  cyan: "ring-cyan-300/55",
  lime: "ring-lime-300/55",
  stone: "ring-stone-300/48",
  gray: "ring-zinc-300/46"
};

export const EVENT_COLOR_CONTRAST_ICON_CLASS: Record<ColorKey, string> = {
  rose: "text-zinc-950",
  coral: "text-zinc-950",
  amber: "text-zinc-950",
  teal: "text-zinc-950",
  indigo: "text-white",
  slate: "text-white",
  emerald: "text-zinc-950",
  blue: "text-white",
  violet: "text-white",
  orange: "text-zinc-950",
  cyan: "text-zinc-950",
  lime: "text-zinc-950",
  stone: "text-zinc-950",
  gray: "text-zinc-950"
};

export function resolveEventFillClass(category: EventCategory, colorKey: ColorKey): string {
  if (category === "loss") {
    return "bg-stone-300/95";
  }
  return EVENT_COLOR_FILL_CLASS[colorKey] ?? "bg-zinc-400/90";
}

export function resolveEventRingClass(category: EventCategory, colorKey: ColorKey): string {
  if (category === "loss") {
    return "ring-stone-200/70";
  }
  return EVENT_COLOR_RING_CLASS[colorKey] ?? "ring-zinc-300/45";
}

export function resolveEventContrastIconClass(category: EventCategory, colorKey: ColorKey): string {
  if (category === "loss") {
    return "text-zinc-950";
  }
  return EVENT_COLOR_CONTRAST_ICON_CLASS[colorKey] ?? "text-zinc-950";
}

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  memory: "Moment",
  newborn: "New Born",
  birthday: "Birthday",
  relationship: "Relationship",
  family: "Family",
  travel: "Travel",
  home: "Home",
  career: "Career",
  education: "Education",
  health: "Health",
  loss: "Loss",
  achievement: "Achievement",
  challenge: "Challenge",
  goal: "Goal",
  custom: "Custom"
};

export function resolveEventIcon(category: EventCategory, iconKey?: IconKey): EventIconComponent {
  if (category === "health" && iconKey === "cross") {
    return HeartbeatIcon;
  }
  if (iconKey) {
    return ICON_KEY_MAP[iconKey] ?? CATEGORY_ICON_MAP[category];
  }
  return CATEGORY_ICON_MAP[category];
}
