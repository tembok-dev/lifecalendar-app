import { Frame } from "../../primitives/Frame";

export function AppShellPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10">
      <Frame>
        <h1 className="text-2xl font-medium tracking-tight">Life Calendar</h1>
        <p className="mt-3 text-sm text-muted">
          Foundation shell is running. Calendar canvas and data models will be added in upcoming stages.
        </p>
      </Frame>
    </main>
  );
}