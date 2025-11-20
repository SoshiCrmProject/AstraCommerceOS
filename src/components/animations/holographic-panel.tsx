type HolographicPanelProps = {
  title: string;
  pills: string[];
  signalLabel: string;
};

export function HolographicPanel({
  title,
  pills,
  signalLabel,
}: HolographicPanelProps) {
  const gradientStyle = {
    background:
      "radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent-secondary) 55%, var(--text-primary) 45%) 0%, transparent 40%), radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--accent-primary) 65%, var(--text-primary) 35%) 0%, transparent 50%), linear-gradient(135deg, color-mix(in srgb, var(--accent-primary) 60%, var(--text-primary) 40%), color-mix(in srgb, var(--accent-secondary) 65%, var(--bg-surface) 35%))",
  } as const;

  return (
    <div
      className="relative overflow-hidden rounded-card border border-[color:color-mix(in_srgb,var(--accent-primary)_40%,var(--border-strong)_60%)] p-6 shadow-strong"
      style={gradientStyle}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--bg-surface) 25%, transparent) 0%, transparent 65%)",
        }}
      />
      <div className="relative space-y-4 text-[color:var(--bg-surface)]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--accent-secondary)]" />
          <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
            {title}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-pill border border-[color:color-mix(in_srgb,var(--bg-surface)_45%,var(--accent-primary)_55%)] bg-[color:color-mix(in_srgb,var(--bg-surface)_15%,transparent)] px-3 py-1 text-xs font-semibold text-[color:var(--bg-surface)] shadow-soft backdrop-blur"
            >
              {pill}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-card bg-[color:color-mix(in_srgb,var(--bg-surface)_12%,transparent)] p-3 backdrop-blur-sm">
          {pills.slice(0, 3).map((pill) => (
            <div key={pill} className="space-y-1 rounded-xl bg-[color:color-mix(in_srgb,var(--bg-surface)_8%,transparent)] p-3">
              <p className="text-xs uppercase tracking-wide text-[color:color-mix(in_srgb,var(--bg-surface)_75%,transparent)]">
                {signalLabel}
              </p>
              <p className="text-sm font-semibold text-[color:var(--bg-surface)]">
                {pill}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
