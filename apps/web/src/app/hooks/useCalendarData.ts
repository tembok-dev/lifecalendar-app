import { useCallback, useEffect, useState } from "react";
import type { CreateLifeEventInput, GetProfileCalendarResponse, PatchAppSettingsInput, PatchLifeEventInput, PatchProfileInput, Profile } from "@lifecalendar/shared";
import { getWeekIndexFromDate } from "@lifecalendar/shared";
import { apiClient } from "../../lib/api/client";

export interface CalendarDataState {
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  calendar: GetProfileCalendarResponse | null;
  onboardingRequired: boolean;
  creatingProfile: boolean;
  createError: string | null;
}

export function useCalendarData() {
  const [state, setState] = useState<CalendarDataState>({
    loading: true,
    error: null,
    profile: null,
    calendar: null,
    onboardingRequired: false,
    creatingProfile: false,
    createError: null
  });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null, createError: null }));

    try {
      const profilesResponse = await apiClient.getProfiles();
      const profile =
        [...profilesResponse.profiles].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0] ?? null;

      if (!profile) {
        setState((current) => ({
          ...current,
          loading: false,
          error: null,
          profile: null,
          calendar: null,
          onboardingRequired: true
        }));
        return;
      }

      const calendar = await apiClient.getProfileCalendar(profile.id);
      setState((current) => ({
        ...current,
        loading: false,
        error: null,
        profile,
        calendar,
        onboardingRequired: false
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown calendar loading error",
        profile: null,
        calendar: null
      }));
    }
  }, []);

  const refreshCalendar = useCallback(async (profile: Profile) => {
    const calendar = await apiClient.getProfileCalendar(profile.id);
    setState((current) => ({ ...current, profile, calendar }));
  }, []);

  const createProfile = useCallback(async (input: { name: string; birthDate: string }) => {
    const trimmedName = input.name.trim();
    if (!trimmedName) {
      setState((current) => ({ ...current, createError: "Name is required." }));
      return;
    }
    if (!input.birthDate) {
      setState((current) => ({ ...current, createError: "Birthdate is required." }));
      return;
    }

    setState((current) => ({ ...current, creatingProfile: true, createError: null }));

    try {
      const isoBirthDate = `${input.birthDate}T00:00:00.000Z`;
      const created = await apiClient.createProfile({
        name: trimmedName,
        birthDate: isoBirthDate
      });
      const calendar = await apiClient.getProfileCalendar(created.profile.id);

      setState((current) => ({
        ...current,
        creatingProfile: false,
        onboardingRequired: false,
        profile: created.profile,
        calendar
      }));
    } catch (error) {
      setState((current) => ({
        ...current,
        creatingProfile: false,
        createError: error instanceof Error ? error.message : "Unable to create profile"
      }));
    }
  }, []);

  const createEvent = useCallback(
    async (input: Omit<CreateLifeEventInput, "weekIndex"> & { weekIndex?: number }) => {
      const profile = state.profile;
      if (!profile) {
        throw new Error("Profile is not loaded.");
      }

      const dateIso = input.date.endsWith("Z") ? input.date : `${input.date}T00:00:00.000Z`;
      const weekIndex = input.weekIndex ?? getWeekIndexFromDate(profile.birthDate, dateIso);

      await apiClient.createProfileEvent(profile.id, {
        ...input,
        date: dateIso,
        weekIndex
      });
      await refreshCalendar(profile);
    },
    [refreshCalendar, state.profile]
  );

  const updateEvent = useCallback(
    async (eventId: string, input: Omit<PatchLifeEventInput, "weekIndex"> & { weekIndex?: number }) => {
      const profile = state.profile;
      if (!profile) {
        throw new Error("Profile is not loaded.");
      }

      const payload: PatchLifeEventInput = { ...input };
      if (input.date) {
        const dateIso = input.date.endsWith("Z") ? input.date : `${input.date}T00:00:00.000Z`;
        payload.date = dateIso;
        payload.weekIndex = input.weekIndex ?? getWeekIndexFromDate(profile.birthDate, dateIso);
      } else if (input.weekIndex !== undefined) {
        payload.weekIndex = input.weekIndex;
      }

      await apiClient.patchEvent(eventId, payload);
      await refreshCalendar(profile);
    },
    [refreshCalendar, state.profile]
  );

  const deleteEvent = useCallback(
    async (eventId: string) => {
      const profile = state.profile;
      if (!profile) {
        throw new Error("Profile is not loaded.");
      }
      await apiClient.deleteEvent(eventId);
      await refreshCalendar(profile);
    },
    [refreshCalendar, state.profile]
  );

  const updateProfile = useCallback(
    async (input: PatchProfileInput) => {
      const profile = state.profile;
      if (!profile) {
        throw new Error("Profile is not loaded.");
      }
      await apiClient.patchProfile(profile.id, input);
      await refreshCalendar(profile);
    },
    [refreshCalendar, state.profile]
  );

  const updateSettings = useCallback(
    async (input: PatchAppSettingsInput) => {
      const profile = state.profile;
      if (!profile) {
        throw new Error("Profile is not loaded.");
      }
      await apiClient.patchProfileSettings(profile.id, input);
      await refreshCalendar(profile);
    },
    [refreshCalendar, state.profile]
  );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    ...state,
    createProfile,
    createEvent,
    updateEvent,
    deleteEvent,
    updateProfile,
    updateSettings,
    reload: load
  };
}
