import type { CalendarScaleMode } from "../calendar/hooks/useCalendarZoom";
import type { CalendarDisplayMode } from "../calendar/LifeCalendarGrid";
import { Field } from "../ui/primitives/Field";

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
    <section className="space-y-2">
      <p className="text-xs font-medium text-zinc-100">Calendar view</p>

      <Field label="Default display mode">
        <select
          value={props.displayMode}
          onChange={(event) => props.onDisplayModeChange(event.target.value as CalendarDisplayMode)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2.5 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        >
          <option value="auto">Auto</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </Field>

      <Field label="Default scale mode">
        <select
          value={props.scaleMode}
          onChange={(event) => props.onScaleModeChange(event.target.value as CalendarScaleMode)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2.5 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        >
          <option value="fit-width">Fit width</option>
          <option value="contain">Contain</option>
        </select>
      </Field>

      <div className="flex items-center gap-3 text-[11px] text-zinc-300/85">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={props.showYearMarkers}
            onChange={(event) => props.onShowYearMarkersChange(event.target.checked)}
          />
          Show year markers
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={props.showEventMarkers}
            onChange={(event) => props.onShowEventMarkersChange(event.target.checked)}
          />
          Show event markers
        </label>
      </div>
    </section>
  );
}
