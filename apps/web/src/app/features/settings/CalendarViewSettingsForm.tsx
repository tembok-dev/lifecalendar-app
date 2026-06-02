import { Eye, LayoutGrid, Scaling } from "lucide-react";
import type { CalendarScaleMode } from "../calendar/hooks/useCalendarZoom";
import type { CalendarDisplayMode } from "../calendar/LifeCalendarGrid";
import { FloatingSelect } from "../ui/primitives/FloatingSelect";
import { ModalField } from "../ui/primitives/ModalField";
import { ToggleSwitch } from "../ui/primitives/ToggleSwitch";

interface CalendarViewSettingsFormProps {
  displayMode: CalendarDisplayMode;
  scaleMode: CalendarScaleMode;
  showYearMarkers: boolean;
  showEventMarkers: boolean;
  onDisplayModeChange: (value: CalendarDisplayMode) => void;
  onScaleModeChange: (value: CalendarScaleMode) => void;
  onShowYearMarkersChange: (value: boolean) => void;
  onShowEventMarkersChange: (value: boolean) => void;
}

export function CalendarViewSettingsForm(props: CalendarViewSettingsFormProps) {
  return (
    <div className="grid gap-3">
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">View</p>
        <p className="text-[11px] text-[var(--text-muted)]">Quiet defaults for how the poster composes itself.</p>
      </div>
      <ModalField label="Default display mode">
        <FloatingSelect
          leadingIcon={<LayoutGrid size={16} />}
          value={props.displayMode}
          onChange={(event) => props.onDisplayModeChange(event.target.value as CalendarDisplayMode)}
          className="h-[44px]"
        >
          <option value="auto">Auto</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </FloatingSelect>
      </ModalField>

      <ModalField label="Default scale mode">
        <FloatingSelect
          leadingIcon={<Scaling size={16} />}
          value={props.scaleMode}
          onChange={(event) => props.onScaleModeChange(event.target.value as CalendarScaleMode)}
          className="h-[44px]"
        >
          <option value="fit-width">Fit width</option>
          <option value="contain">Contain</option>
        </FloatingSelect>
      </ModalField>

      <div className="space-y-2 border-t border-[var(--border-soft)] pt-3">
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <Eye size={14} />
          <span>Markers</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <ToggleSwitch checked={props.showYearMarkers} onChange={props.onShowYearMarkersChange} label="Show year markers" />
          <ToggleSwitch checked={props.showEventMarkers} onChange={props.onShowEventMarkersChange} label="Show event markers" />
        </div>
      </div>
    </div>
  );
}
