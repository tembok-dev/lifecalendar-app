import { Field } from "../ui/primitives/Field";
import { InlineError } from "../ui/primitives/InlineError";

interface ProfileSettingsFormProps {
  name: string;
  birthDate: string;
  expectedLifespanYears: string;
  onNameChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onExpectedLifespanChange: (value: string) => void;
  error: string | null;
}

export function ProfileSettingsForm(props: ProfileSettingsFormProps) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-medium text-zinc-100">Profile</p>

      <Field label="Name">
        <input
          value={props.name}
          onChange={(event) => props.onNameChange(event.target.value)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2.5 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        />
      </Field>

      <Field label="Birthdate">
        <input
          type="date"
          value={props.birthDate}
          onChange={(event) => props.onBirthDateChange(event.target.value)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2.5 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        />
      </Field>

      <Field label="Expected lifespan (years)">
        <input
          type="number"
          min={1}
          max={130}
          value={props.expectedLifespanYears}
          onChange={(event) => props.onExpectedLifespanChange(event.target.value)}
          className="w-full rounded-md border border-line/60 bg-zinc-900/35 px-2.5 py-1.5 text-[12px] text-zinc-100 outline-none focus:border-zinc-300/65"
        />
      </Field>

      <InlineError message={props.error} />
    </section>
  );
}
