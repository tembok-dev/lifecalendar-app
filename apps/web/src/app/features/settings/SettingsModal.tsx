import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import type { AppSettings, Profile } from "@lifecalendar/shared";
import type { CalendarScaleMode } from "../calendar/hooks/useCalendarZoom";
import type { CalendarDisplayMode } from "../calendar/LifeCalendarGrid";
import { CalendarViewSettingsForm } from "./CalendarViewSettingsForm";
import { DataSettingsSection } from "./DataSettingsSection";
import { ProfileSettingsForm } from "./ProfileSettingsForm";
import { ModalAccentOrb } from "../ui/primitives/ModalAccentOrb";
import { ModalBody } from "../ui/primitives/ModalBody";
import { ModalFooter } from "../ui/primitives/ModalFooter";
import { ModalHeader } from "../ui/primitives/ModalHeader";
import { ModalSurface } from "../ui/primitives/ModalSurface";
import { TabRail } from "../ui/primitives/TabRail";

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
  const [activeTab, setActiveTab] = useState<"view" | "profile" | "data">("view");
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
    setActiveTab("view");
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
    <ModalSurface open={open} onClose={onClose} ariaLabel="Settings" size="default" maxWidthPx={560} maxHeightPx={680}>
      <ModalHeader
        title="Settings"
        subtitle="Tune the poster quietly."
        onClose={onClose}
        ornament={
          <ModalAccentOrb>
            <Sparkles size={14} className="text-[var(--accent-primary)]" />
          </ModalAccentOrb>
        }
      />

      <TabRail
        value={activeTab}
        onChange={setActiveTab}
        items={[
          { value: "view", label: "View" },
          { value: "profile", label: "Profile" },
          { value: "data", label: "Data" }
        ]}
      />

      <ModalBody>
        {activeTab === "view" ? (
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
        ) : null}

        {activeTab === "profile" ? (
          <ProfileSettingsForm
            name={name}
            birthDate={birthDate}
            expectedLifespanYears={expectedLifespanYears}
            onNameChange={setName}
            onBirthDateChange={setBirthDate}
            onExpectedLifespanChange={setExpectedLifespanYears}
            error={error ?? validationError}
          />
        ) : null}

        {activeTab === "data" ? <DataSettingsSection profileId={profile.id} onReload={onReload} /> : null}
      </ModalBody>

      <ModalFooter>
        <button type="button" onClick={onClose} className="ui-radius-pill border border-[var(--border-soft)] px-4 py-2 text-[12px] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">
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
          className="ui-radius-pill bg-[linear-gradient(135deg,rgba(112,232,224,0.94),rgba(83,185,205,0.9))] px-5 py-2 text-[12px] font-medium text-slate-950 shadow-[0_0_24px_var(--accent-primary-glow)] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </ModalFooter>
    </ModalSurface>
  );
}

function toDateInput(dateIso: string): string {
  return new Date(dateIso).toISOString().slice(0, 10);
}
