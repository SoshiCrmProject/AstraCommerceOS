import { type Locale } from "@/i18n/config";
import { AuthCard } from "@/components/auth/auth-card";
import { inviteMemberAction } from "./actions";

export const dynamic = "force-static";

type InvitePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { locale } = await params;
  const isJa = locale === "ja";

  return (
    <div className="flex justify-center">
      <AuthCard
        title={isJa ? "メンバー招待" : "Invite a teammate"}
        subtitle={isJa ? "ワークスペースに新しいメンバーを追加します。" : "Invite a teammate to your workspace."}
      >
        <form action={inviteMemberAction} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="workspaceSlug">
              {isJa ? "ワークスペーススラッグ" : "Workspace slug"}
            </label>
            <input
              id="workspaceSlug"
              name="workspaceSlug"
              required
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="inviteeEmail">
              {isJa ? "招待メール" : "Invitee email"}
            </label>
            <input
              id="inviteeEmail"
              name="inviteeEmail"
              type="email"
              required
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="inviterEmail">
              {isJa ? "招待者メール" : "Inviter email"}
            </label>
            <input
              id="inviterEmail"
              name="inviterEmail"
              type="email"
              required
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-primary" htmlFor="role">
              {isJa ? "ロール" : "Role"}
            </label>
            <select
              id="role"
              name="role"
              className="w-full rounded-card border border-default bg-surface px-3 py-2 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/30"
            >
              <option value="member">{isJa ? "メンバー" : "Member"}</option>
              <option value="admin">{isJa ? "管理者" : "Admin"}</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-pill bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
          >
            {isJa ? "招待を送信" : "Send invite"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
