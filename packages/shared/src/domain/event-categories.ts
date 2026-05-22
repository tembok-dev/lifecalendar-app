export const EVENT_CATEGORIES = [
  "birthday",
  "relationship",
  "family",
  "travel",
  "home",
  "career",
  "education",
  "health",
  "loss",
  "achievement",
  "challenge",
  "goal",
  "memory",
  "custom"
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type EmotionalTone =
  | "joyful"
  | "warm"
  | "neutral"
  | "reflective"
  | "difficult"
  | "hopeful";

export type IconKey =
  | "cake"
  | "heart"
  | "users"
  | "plane"
  | "house"
  | "briefcase"
  | "book"
  | "cross"
  | "moon"
  | "trophy"
  | "mountain"
  | "target"
  | "star"
  | "dot";

export type ColorKey =
  | "rose"
  | "coral"
  | "amber"
  | "teal"
  | "indigo"
  | "slate"
  | "emerald"
  | "blue"
  | "violet"
  | "orange"
  | "cyan"
  | "lime"
  | "stone"
  | "gray";

export interface EventCategoryDefaults {
  emotionalTone: EmotionalTone;
  iconKey: IconKey;
  colorKey: ColorKey;
}

export const EVENT_CATEGORY_DEFAULTS: Record<EventCategory, EventCategoryDefaults> = {
  birthday: { emotionalTone: "joyful", iconKey: "cake", colorKey: "rose" },
  relationship: { emotionalTone: "warm", iconKey: "heart", colorKey: "coral" },
  family: { emotionalTone: "warm", iconKey: "users", colorKey: "amber" },
  travel: { emotionalTone: "reflective", iconKey: "plane", colorKey: "teal" },
  home: { emotionalTone: "neutral", iconKey: "house", colorKey: "indigo" },
  career: { emotionalTone: "neutral", iconKey: "briefcase", colorKey: "slate" },
  education: { emotionalTone: "hopeful", iconKey: "book", colorKey: "emerald" },
  health: { emotionalTone: "reflective", iconKey: "cross", colorKey: "blue" },
  loss: { emotionalTone: "difficult", iconKey: "moon", colorKey: "violet" },
  achievement: { emotionalTone: "joyful", iconKey: "trophy", colorKey: "orange" },
  challenge: { emotionalTone: "difficult", iconKey: "mountain", colorKey: "cyan" },
  goal: { emotionalTone: "hopeful", iconKey: "target", colorKey: "lime" },
  memory: { emotionalTone: "reflective", iconKey: "star", colorKey: "stone" },
  custom: { emotionalTone: "neutral", iconKey: "dot", colorKey: "gray" }
};

export function deriveEventVisuals(category: EventCategory): EventCategoryDefaults {
  return EVENT_CATEGORY_DEFAULTS[category];
}