import type {
  CreateLifeEventInput,
  CreateProfileInput,
  GetProfileCalendarResponse,
  GetProfileEventsResponse,
  GetProfileResponse,
  GetProfileSettingsResponse,
  GetProfilesResponse,
  MutationEventResponse,
  MutationProfileResponse,
  MutationSettingsResponse,
  PatchAppSettingsInput,
  PatchLifeEventInput,
  PatchProfileInput
} from "@lifecalendar/shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  getProfiles: () => request<GetProfilesResponse>("/profiles"),
  createProfile: (input: CreateProfileInput) =>
    request<MutationProfileResponse>("/profiles", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  getProfile: (profileId: string) => request<GetProfileResponse>(`/profiles/${profileId}`),
  patchProfile: (profileId: string, input: PatchProfileInput) =>
    request<MutationProfileResponse>(`/profiles/${profileId}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  getProfileEvents: (profileId: string) =>
    request<GetProfileEventsResponse>(`/profiles/${profileId}/events`),
  createProfileEvent: (profileId: string, input: CreateLifeEventInput) =>
    request<MutationEventResponse>(`/profiles/${profileId}/events`, {
      method: "POST",
      body: JSON.stringify(input)
    }),
  patchEvent: (eventId: string, input: PatchLifeEventInput) =>
    request<MutationEventResponse>(`/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  deleteEvent: (eventId: string) =>
    request<{ ok: true }>(`/events/${eventId}`, {
      method: "DELETE"
    }),
  getProfileSettings: (profileId: string) =>
    request<GetProfileSettingsResponse>(`/profiles/${profileId}/settings`),
  patchProfileSettings: (profileId: string, input: PatchAppSettingsInput) =>
    request<MutationSettingsResponse>(`/profiles/${profileId}/settings`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),
  getProfileCalendar: (profileId: string) =>
    request<GetProfileCalendarResponse>(`/profiles/${profileId}/calendar`)
};