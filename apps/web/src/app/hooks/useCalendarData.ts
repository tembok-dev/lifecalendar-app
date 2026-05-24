import { useCallback, useEffect, useState } from "react";
import type { GetProfileCalendarResponse, Profile } from "@lifecalendar/shared";
import { apiClient } from "../../lib/api/client";

export interface CalendarDataState {
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  calendar: GetProfileCalendarResponse | null;
}

export function useCalendarData() {
  const [state, setState] = useState<CalendarDataState>({
    loading: true,
    error: null,
    profile: null,
    calendar: null
  });

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const profilesResponse = await apiClient.getProfiles();
      const profile = profilesResponse.profiles[0] ?? null;

      if (!profile) {
        setState({ loading: false, error: null, profile: null, calendar: null });
        return;
      }

      const calendar = await apiClient.getProfileCalendar(profile.id);
      setState({ loading: false, error: null, profile, calendar });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown calendar loading error",
        profile: null,
        calendar: null
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    ...state,
    reload: load
  };
}