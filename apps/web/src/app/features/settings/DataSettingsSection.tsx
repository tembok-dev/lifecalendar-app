interface DataSettingsSectionProps {
  profileId: string;
  onReload: () => Promise<void> | void;
}

export function DataSettingsSection({ profileId, onReload }: DataSettingsSectionProps) {
  return (
    <section className="space-y-2">
      <p className="text-xs font-medium text-zinc-100">Data</p>
      <p className="text-[10px] text-zinc-300/70">Profile id: {profileId}</p>
      <button
        type="button"
        onClick={() => void onReload()}
        className="rounded-full border border-line/60 px-2.5 py-1 text-[10px] text-zinc-200/85"
      >
        Reload calendar
      </button>
    </section>
  );
}

