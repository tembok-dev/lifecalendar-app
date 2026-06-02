import { useState } from "react";

interface MinimalOnboardingOverlayProps {
  open: boolean;
  creating: boolean;
  error: string | null;
  onCreate: (input: { name: string; birthDate: string }) => Promise<void> | void;
}

type Step = "intro" | "form";

export function MinimalOnboardingOverlay({ open, creating, error, onCreate }: MinimalOnboardingOverlayProps) {
  const [step, setStep] = useState<Step>("intro");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/36 px-6 backdrop-blur-[2px]">
      <section className="w-full max-w-md rounded-2xl border border-line/60 bg-surface/78 p-6 shadow-soft backdrop-blur-md">
        {step === "intro" ? (
          <>
            <p className="text-xs tracking-[0.22em] text-zinc-300/75">LIFE CALENDAR</p>
            <h2 className="mt-2 text-2xl font-medium text-zinc-100">Begin your poster</h2>
            <p className="mt-2 text-sm text-zinc-300/80">
              A calm life poster that maps your years in one canvas.
            </p>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="mt-5 rounded-full bg-zinc-100/95 px-4 py-1.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
            >
              Begin
            </button>
          </>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void onCreate({ name, birthDate });
            }}
          >
            <h2 className="text-lg font-medium text-zinc-100">Create profile</h2>

            <label className="mt-4 block text-xs text-zinc-300/80" htmlFor="onboarding-name">
              Name
            </label>
            <input
              id="onboarding-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ava Stone"
              className="mt-1 w-full rounded-lg border border-line/65 bg-zinc-900/35 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-300/55"
              autoComplete="name"
            />

            <label className="mt-3 block text-xs text-zinc-300/80" htmlFor="onboarding-birthdate">
              Birthdate
            </label>
            <input
              id="onboarding-birthdate"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              type="date"
              className="mt-1 w-full rounded-lg border border-line/65 bg-zinc-900/35 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-300/55"
            />

            {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}

            <div className="mt-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep("intro")}
                className="rounded-full border border-line/65 px-3 py-1.5 text-xs text-zinc-200/88"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={creating}
                className="rounded-full bg-zinc-100/95 px-4 py-1.5 text-sm font-medium text-zinc-900 transition disabled:cursor-not-allowed disabled:opacity-65"
              >
                {creating ? "Creating..." : "Create profile"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

