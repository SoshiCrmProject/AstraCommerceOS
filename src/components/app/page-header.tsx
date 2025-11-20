type Crumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {breadcrumbs && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {breadcrumbs.map((crumb, idx) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <a href={crumb.href} className="text-accent-primary hover:underline">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold text-primary sm:text-2xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-secondary">{subtitle}</p> : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
