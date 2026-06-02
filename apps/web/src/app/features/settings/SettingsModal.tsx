import { useEffect, useMemo, useState } from "react";
import type { AppSettings, Profile } from "@lifecalendar/shared";
import type { CalendarScaleMode } from "../calendar/hooks/useCalendarZoom";
import type { CalendarDisplayMode } from "../calendar/LifeCalendarGrid";
import { CalendarViewSettingsForm } from "./CalendarViewSettingsForm";
import { DataSettingsSection } from "./DataSettingsSection";
import { ProfileSettingsForm } from "./ProfileSettingsForm";
import { ModalSurface } from "../ui/primitives/ModalSurface";

interface SettingsModalProps {
  open: boolean;
  profile: Profile;
  settings: AppSettings;
  displayMode: CalendarDisplayMode;
  scaleMode: CalendarScaleMode;
  onClose: () => void;
  onSave: (input: {
    profile: { name: string; birthDate: string; expectedLifespanYears: number | null };
    view: {
      displayMode: CalendarDisplayMode;
      scaleMode: CalendarScaleMode;
      showYearMarkers: boolean;
      showEventMarkers: boolean;
    };
  }) => Promise<void>;
  onReload: () => Promise<void>;
}

export function SettingsModal({
  open,
  profile,
  settings,
  displayMode,
  scaleMode,
  onClose,
  onSave,
  onReload
}: SettingsModalProps) {
  const [name, setName] = useState(profile.name);
  const [birthDate, setBirthDate] = useState(toDateInput(profile.birthDate));
  const [expectedLifespanYears, setExpectedLifespanYears] = useState(
    profile.expectedLifespanYears ? String(profile.expectedLifespanYears) : ""
  );
  const [defaultDisplayMode, setDefaultDisplayMode] = useState<CalendarDisplayMode>(displayMode);
  const [defaultScaleMode, setDefaultScaleMode] = useState<CalendarScaleMode>(scaleMode);
  const [showYearMarkers, setShowYearMarkers] = useState(settings.showYearMarkers);
  const [showEventMarkers, setShowEventMarkers] = useState(settings.showEventIcons);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setName(profile.name);
    setBirthDate(toDateInput(profile.birthDate));
    setExpectedLifespanYears(profile.expectedLifespanYears ? String(profile.expectedLifespanYears) : "");
    setDefaultDisplayMode(displayMode);
    setDefaultScaleMode(scaleMode);
    setShowYearMarkers(settings.showYearMarkers);
    setShowEventMarkers(settings.showEventIcons);
    setError(null);
  }, [displayMode, open, profile.birthDate, profile.expectedLifespanYears, profile.name, scaleMode, settings.showEventIcons, settings.showYearMarkers]);

  const validationError = useMemo(() => {
    if (!name.trim()) {
      return "Name is required.";
    }
    if (!birthDate) {
      return "Birthdate is required.";
    }
    if (expectedLifespanYears) {
      const parsed = Number(expectedLifespanYears);
      if (!Number.isFinite(parsed) || parsed < 1 || parsed > 130) {
        return "Expected lifespan must be between 1 and 130.";
      }
    }
    return null;
  }, [birthDate, expectedLifespanYears, name]);

  if (!open) {
    return null;
  }

  return (
    <ModalSurface open={open} onClose={onClose} ariaLabel="Settings">
      <section>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-zinc-100">Settings</p>
          <button type="button" onClick={onClose} className="text-xs text-zinc-300/80">
            Close
          </button>
        </div>

        <div className="mt-3 grid gap-4">
          <ProfileSettingsForm
            name={name}
            birthDate={birthDate}
            expectedLifespanYears={expectedLifespanYears}
            onNameChange={setName}
            onBirthDateChange={setBirthDate}
            onExpectedLifespanChange={setExpectedLifespanYears}
            error={error ?? validationError}
          />

          <CalendarViewSettingsForm
            displayMode={defaultDisplayMode}
            scaleMode={defaultScaleMode}
            showYearMarkers={showYearMarkers}
            showEventMarkers={showEventMarkers}
            onDisplayModeChange={setDefaultDisplayMode}
            onScaleModeChange={setDefaultScaleMode}
            onShowYearMarkersChange={setShowYearMarkers}
            onShowEventMarkersChange={setShowEventMarkers}
          />

          <DataSettingsSection profileId={profile.id} onReload={onReload} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line/60 px-3 py-1 text-xs text-zinc-200/86">
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || Boolean(validationError)}
            onClick={async () => {
              if (validationError) {
                return;
              }
              setSaving(true);
              setError(null);
              try {
                await onSave({
                  profile: {
                    name: name.trim(),
                    birthDate: `${birthDate}T00:00:00.000Z`,
                    expectedLifespanYears: expectedLifespanYears ? Number(expectedLifespanYears) : null
                  },
                  view: {
                    displayMode: defaultDisplayMode,
                    scaleMode: defaultScaleMode,
                    showYearMarkers,
                    showEventMarkers
                  }
                });
                onClose();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to save settings.");
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-full bg-zinc-100/95 px-3 py-1 text-xs font-medium text-zinc-900 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </section>
    </ModalSurface>
  );
}

function toDateInput(dateIso: string): string {
  return new Date(dateIso).toISOString().slice(0, 10);
}
