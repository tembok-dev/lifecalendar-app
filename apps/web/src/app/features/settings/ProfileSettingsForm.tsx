import { CalendarDays, Hourglass, User } from "lucide-react";
import { InlineError } from "../ui/primitives/InlineError";
import { FloatingInput } from "../ui/primitives/FloatingInput";
import { ModalField } from "../ui/primitives/ModalField";

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
    <div className="grid gap-3">
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">Profile</p>
        <p className="text-[11px] text-[var(--text-muted)]">Keep the identity metadata calm and accurate.</p>
      </div>
      <ModalField label="Name">
        <FloatingInput
          leadingIcon={<User size={16} />}
          value={props.name}
          onChange={(event) => props.onNameChange(event.target.value)}
          placeholder="Your name"
          className="h-[44px]"
        />
      </ModalField>

      <ModalField label="Birthdate">
        <FloatingInput
          type="date"
          leadingIcon={<CalendarDays size={16} />}
          value={props.birthDate}
          onChange={(event) => props.onBirthDateChange(event.target.value)}
          className="h-[44px]"
        />
      </ModalField>

      <ModalField label="Expected lifespan (years)">
        <FloatingInput
          type="number"
          min={1}
          max={130}
          leadingIcon={<Hourglass size={16} />}
          value={props.expectedLifespanYears}
          onChange={(event) => props.onExpectedLifespanChange(event.target.value)}
          className="h-[44px]"
        />
      </ModalField>

      <InlineError message={props.error} />
    </div>
  );
}
