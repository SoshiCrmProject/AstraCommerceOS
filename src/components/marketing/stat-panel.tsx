type StatPanelProps = {
  title: string;
  metrics: { label: string; value: string; change: string }[];
  liveLabel: string;
};

export function StatPanel({ title, metrics, liveLabel }: StatPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-card border border-default bg-gradient-to-br from-accent-primary-soft via-white to-white p-5 shadow-token-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,123,255,0.16),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,0.12),transparent_35%)]" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-success" />
          <p className="text-sm font-semibold text-primary">{title}</p>
        </div>
        <div className="flex items-center gap-1 rounded-pill border border-default bg-white/80 px-2 py-1 text-xs text-secondary backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
          <span>{liveLabel}</span>
        </div>
      </div>

      <div className="mt-4 rounded-card border border-default bg-white/80 p-3 shadow-soft backdrop-blur">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-card border border-default bg-white">
          <svg
            viewBox="0 0 320 180"
            role="presentation"
            aria-hidden
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <g stroke="var(--border-default)" strokeWidth="1">
              <path d="M0 140h320M0 110h320M0 80h320M0 50h320M0 20h320" />
              <path d="M20 0v180M80 0v180M140 0v180M200 0v180M260 0v180" />
            </g>
            <path
              d="M10 130C40 105 70 92 96 84c24-7 44-46 70-46 34 0 50 74 82 80 20 4 42-5 62-12"
              stroke="var(--accent-primary)"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 130C40 105 70 92 96 84c24-7 44-46 70-46 34 0 50 74 82 80 20 4 42-5 62-12L280 170 10 170Z"
              fill="url(#chartGradient)"
            />
            <g fill="var(--accent-secondary)">
              <circle cx="70" cy="94" r="6" />
              <circle cx="140" cy="38" r="6" />
              <circle cx="210" cy="124" r="6" />
              <circle cx="270" cy="108" r="6" />
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-card border border-default bg-surface-muted p-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-wide text-muted">
              {metric.label}
            </p>
            <p className="text-lg font-semibold text-primary">{metric.value}</p>
            <p className="text-xs text-accent-success">{metric.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
