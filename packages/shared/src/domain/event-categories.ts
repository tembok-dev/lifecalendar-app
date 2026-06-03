export const EVENT_CATEGORIES = [
  "memory",
  "newborn",
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
  | "carriage"
  | "cake"
  | "heart"
  | "users"
  | "plane"
  | "house"
  | "briefcase"
  | "book"
  | "pulse"
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
  memory: { emotionalTone: "reflective", iconKey: "star", colorKey: "amber" },
  newborn: { emotionalTone: "warm", iconKey: "carriage", colorKey: "coral" },
  birthday: { emotionalTone: "joyful", iconKey: "cake", colorKey: "rose" },
  relationship: { emotionalTone: "warm", iconKey: "heart", colorKey: "rose" },
  family: { emotionalTone: "warm", iconKey: "users", colorKey: "emerald" },
  travel: { emotionalTone: "reflective", iconKey: "plane", colorKey: "cyan" },
  home: { emotionalTone: "neutral", iconKey: "house", colorKey: "stone" },
  career: { emotionalTone: "neutral", iconKey: "briefcase", colorKey: "blue" },
  education: { emotionalTone: "hopeful", iconKey: "book", colorKey: "violet" },
  health: { emotionalTone: "reflective", iconKey: "pulse", colorKey: "lime" },
  loss: { emotionalTone: "difficult", iconKey: "cross", colorKey: "slate" },
  achievement: { emotionalTone: "joyful", iconKey: "trophy", colorKey: "amber" },
  challenge: { emotionalTone: "difficult", iconKey: "mountain", colorKey: "orange" },
  goal: { emotionalTone: "hopeful", iconKey: "target", colorKey: "indigo" },
  custom: { emotionalTone: "neutral", iconKey: "dot", colorKey: "cyan" }
};

export function deriveEventVisuals(category: EventCategory): EventCategoryDefaults {
  return EVENT_CATEGORY_DEFAULTS[category];
}
