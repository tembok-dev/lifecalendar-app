interface DataSettingsSectionProps {
  profileId: string;
  onReload: () => Promise<void> | void;
}

export function DataSettingsSection({ profileId, onReload }: DataSettingsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">Data</p>
        <p className="text-[11px] text-[var(--text-muted)]">Quiet maintenance actions for the active poster.</p>
      </div>
      <div className="space-y-1 border-b border-[var(--border-soft)] pb-3">
        <p className="text-[10px] tracking-[0.03em] text-[var(--text-muted)]">Profile id</p>
        <p className="break-all text-[12px] text-[var(--text-secondary)]">{profileId}</p>
      </div>
      <button
        type="button"
        onClick={() => void onReload()}
        className="rounded-[12px] border border-[var(--border-soft)] bg-white/[0.02] px-3 py-2 text-[11px] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      >
        Reload calendar
      </button>
    </section>
  );
}
