import type { ColorKey, EventCategory, IconKey } from "@lifecalendar/shared";
import {
  AirplaneTiltIcon,
  BabyIcon,
  BriefcaseIcon,
  CakeIcon,
  DotOutlineIcon,
  FlagIcon,
  GraduationCapIcon,
  HeartIcon,
  HeartbeatIcon,
  HouseIcon,
  MoonIcon,
  MountainsIcon,
  SparkleIcon,
  StarIcon,
  TrophyIcon,
  type Icon as PhosphorIconType
} from "@phosphor-icons/react";

export type EventIconComponent = PhosphorIconType;

const CATEGORY_ICON_MAP: Record<EventCategory, EventIconComponent> = {
  birthday: CakeIcon,
  relationship: HeartIcon,
  family: BabyIcon,
  travel: AirplaneTiltIcon,
  home: HouseIcon,
  career: BriefcaseIcon,
  education: GraduationCapIcon,
  health: HeartbeatIcon,
  loss: MoonIcon,
  achievement: TrophyIcon,
  challenge: MountainsIcon,
  goal: FlagIcon,
  memory: StarIcon,
  custom: SparkleIcon
};

const ICON_KEY_MAP: Record<IconKey, EventIconComponent> = {
  cake: CakeIcon,
  heart: HeartIcon,
  users: BabyIcon,
  plane: AirplaneTiltIcon,
  house: HouseIcon,
  briefcase: BriefcaseIcon,
  book: GraduationCapIcon,
  cross: HeartbeatIcon,
  moon: MoonIcon,
  trophy: TrophyIcon,
  mountain: MountainsIcon,
  target: FlagIcon,
  star: StarIcon,
  dot: DotOutlineIcon
};

export const EVENT_COLOR_TEXT_CLASS: Record<ColorKey, string> = {
  rose: "text-rose-400",
  coral: "text-orange-400",
  amber: "text-amber-400",
  teal: "text-teal-400",
  indigo: "text-indigo-400",
  slate: "text-slate-400",
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
  indigo: "bg-indigo-400/90",
  slate: "bg-slate-400/90",
  emerald: "bg-emerald-400/90",
  blue: "bg-blue-400/90",
  violet: "bg-violet-400/90",
  orange: "bg-orange-400/90",
  cyan: "bg-cyan-400/90",
  lime: "bg-lime-400/90",
  stone: "bg-stone-400/90",
  gray: "bg-zinc-400/90"
};

export const EVENT_COLOR_RING_CLASS: Record<ColorKey, string> = {
  rose: "ring-rose-300/45",
  coral: "ring-orange-300/45",
  amber: "ring-amber-300/45",
  teal: "ring-teal-300/45",
  indigo: "ring-indigo-300/45",
  slate: "ring-slate-300/45",
  emerald: "ring-emerald-300/45",
  blue: "ring-blue-300/45",
  violet: "ring-violet-300/45",
  orange: "ring-orange-300/45",
  cyan: "ring-cyan-300/45",
  lime: "ring-lime-300/45",
  stone: "ring-stone-300/45",
  gray: "ring-zinc-300/45"
};

export const EVENT_COLOR_CONTRAST_ICON_CLASS: Record<ColorKey, string> = {
  rose: "text-zinc-950",
  coral: "text-zinc-950",
  amber: "text-zinc-950",
  teal: "text-zinc-950",
  indigo: "text-white",
  slate: "text-zinc-950",
  emerald: "text-zinc-950",
  blue: "text-zinc-950",
  violet: "text-white",
  orange: "text-zinc-950",
  cyan: "text-zinc-950",
  lime: "text-zinc-950",
  stone: "text-zinc-950",
  gray: "text-zinc-950"
};

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
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
  memory: "Memory",
  custom: "Custom"
};

export function resolveEventIcon(category: EventCategory, iconKey?: IconKey): EventIconComponent {
  if (iconKey) {
    return ICON_KEY_MAP[iconKey] ?? CATEGORY_ICON_MAP[category];
  }
  return CATEGORY_ICON_MAP[category];
}
