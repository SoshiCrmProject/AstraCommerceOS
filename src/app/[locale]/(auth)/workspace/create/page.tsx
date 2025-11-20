import { type Locale } from "@/i18n/config";
import { AuthCard } from "@/components/auth/auth-card";
import { createWorkspaceAction } from "./actions";

export const dynamic = "force-static";

type WorkspaceCreatePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function WorkspaceCreatePage({
  params,
}: WorkspaceCreatePageProps) {
  const { locale } = await params;
  const isJa = locale === "ja";

  return (
    <div className="flex justify-center">
      <AuthCard
        title={isJa ? "ワークスペース作成" : "Create workspace"}
        subtitle={
          isJa
            ? "チームとマーケットプレイス接続のための新しいワークスペースを作成します。"
            : "Create a new workspace for your team and marketplace connections."
        }
      >
        <form action={createWorkspaceAction} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="name">
              {isJa ? "ワークスペース名" : "Workspace name"}
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="slug">
              {isJa ? "スラッグ" : "Slug"}
            </label>
            <input
              id="slug"
              name="slug"
              required
              placeholder="acme-team"
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
            <p className="text-xs text-secondary">
              {isJa ? "URLに使われる識別子です。" : "Used in URLs for this workspace."}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="ownerEmail">
              {isJa ? "管理者メール" : "Admin email"}
            </label>
            <input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              required
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
          >
            {isJa ? "作成する" : "Create workspace"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
