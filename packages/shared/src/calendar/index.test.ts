import { describe, expect, it } from "vitest";
import { attachEventsToWeeks, buildLifeCalendar, getCurrentLifeWeekIndex, getLifeWeekRange, getWeekIndexFromDate } from "./index.js";
import type { LifeEvent, Profile } from "../domain/models.js";

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "p1",
    name: "Ava",
    birthDate: "1995-04-10T00:00:00.000Z",
    expectedLifespanYears: 90,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

function makeEvent(overrides: Partial<LifeEvent> = {}): LifeEvent {
  return {
    id: "e1",
    profileId: "p1",
    date: "2020-01-15T00:00:00.000Z",
    weekIndex: 10,
    category: "travel",
    title: "Trip",
    note: null,
    emotionalTone: "reflective",
    iconKey: "plane",
    colorKey: "teal",
    isPrivate: false,
    showOnExport: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

describe("calendar engine", () => {
  it("builds summary and weeks", () => {
    const now = new Date("2026-05-21T00:00:00.000Z");
    const result = buildLifeCalendar({ profile: makeProfile(), events: [], now });

    expect(result.summary.totalWeeks).toBe(4680);
    expect(result.weeks.length).toBe(4680);
    expect(result.summary.currentAgeYears).toBeGreaterThanOrEqual(31);
  });

  it("derives week index and range deterministically", () => {
    const index = getWeekIndexFromDate("1995-04-10T00:00:00.000Z", "1995-04-17T00:00:00.000Z");
    const range = getLifeWeekRange("1995-04-10T00:00:00.000Z", 1);

    expect(index).toBe(1);
    expect(range.startDate).toBe("1995-04-17T00:00:00.000Z");
    expect(range.endDate).toBe("1995-04-24T00:00:00.000Z");
  });

  it("attaches events and ignores out-of-range weekIndex", () => {
    const now = new Date("2026-05-21T00:00:00.000Z");
    const result = buildLifeCalendar({
      profile: makeProfile({ expectedLifespanYears: 1 }),
      events: [makeEvent({ weekIndex: 1 }), makeEvent({ id: "e2", weekIndex: 1000 })],
      now
    });

    const weekOne = result.weeks[1];
    expect(weekOne?.events.length ?? 0).toBe(1);
    expect(result.weeks.every((week) => week.events.every((event) => event.weekIndex < result.weeks.length))).toBe(true);
  });

  it("handles future birthDate gracefully", () => {
    const now = new Date("2026-05-21T00:00:00.000Z");
    const result = buildLifeCalendar({
      profile: makeProfile({ birthDate: "2030-01-01T00:00:00.000Z" }),
      events: [],
      now
    });

    expect(result.summary.completedWeeks).toBe(0);
    expect(result.summary.currentWeekIndex).toBe(0);
    expect(getCurrentLifeWeekIndex("2030-01-01T00:00:00.000Z", now)).toBeLessThan(0);
  });

  it("clamps invalid lifespan values", () => {
    const now = new Date("2026-05-21T00:00:00.000Z");

    const low = buildLifeCalendar({ profile: makeProfile({ expectedLifespanYears: 0 }), events: [], now });
    const high = buildLifeCalendar({ profile: makeProfile({ expectedLifespanYears: 200 }), events: [], now });
    const missing = buildLifeCalendar({ profile: makeProfile({ expectedLifespanYears: null }), events: [], now });

    expect(low.summary.expectedLifespanYears).toBe(1);
    expect(high.summary.expectedLifespanYears).toBe(140);
    expect(missing.summary.expectedLifespanYears).toBe(90);
  });
});
