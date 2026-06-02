import { CalendarCanvasPage } from "./app/features/calendar/CalendarCanvasPage";
import { LayoutVerticalSandboxPage } from "./app/features/calendar/LayoutVerticalSandboxPage";

export function App() {
  // TEMP/DEV-ONLY route sandbox for manual vertical poster composition tuning.
  if (window.location.pathname === "/layoutvertical") {
    return <LayoutVerticalSandboxPage />;
  }

  return <CalendarCanvasPage />;
}
