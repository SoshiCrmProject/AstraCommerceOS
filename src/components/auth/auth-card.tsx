import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-card border border-default bg-surface p-8 shadow-token-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-primary">{title}</h1>
        {subtitle ? <p className="text-sm text-secondary">{subtitle}</p> : null}
      </div>
      <div className="mt-6 space-y-4">{children}</div>
      {footer ? <div className="mt-6 text-center text-sm text-secondary">{footer}</div> : null}
    </div>
  );
}
