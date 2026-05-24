import { EmptyCanvasState } from "./EmptyCanvasState";
import { LifeCalendarCanvas } from "./LifeCalendarCanvas";
import { LoadingState } from "./LoadingState";
import { useCalendarData } from "../../hooks/useCalendarData";

export function CalendarCanvasPage() {
  const { loading, error, profile, calendar, reload } = useCalendarData();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-xl bg-surface/80 px-5 py-4 text-sm text-zinc-100 shadow-soft">
          <p className="font-medium">Calendar loading failed</p>
          <p className="mt-2 text-muted">{error}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 rounded-full bg-surface px-3 py-1.5 text-xs text-zinc-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !calendar) {
    return <EmptyCanvasState />;
  }

  return <LifeCalendarCanvas calendar={calendar} />;
}