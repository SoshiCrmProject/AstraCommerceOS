"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Workspace } from "@/types/workspace";

type WorkspaceSwitcherProps = {
  locale: string;
  userEmail: string;
};

export function WorkspaceSwitcher({ locale, userEmail }: WorkspaceSwitcherProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabaseBrowser
        .from("workspace_memberships")
        .select("workspace_id, workspaces ( id, name, slug, owner_email, created_at )")
        .eq("user_email", userEmail);
      if (fetchError) {
        setError(fetchError.message);
      } else {
        const mapped =
          data
            ?.map((row: { workspaces: Workspace | null }) => row.workspaces)
            .filter((ws): ws is Workspace => Boolean(ws)) || [];
        setWorkspaces(mapped || []);
      }
      setLoading(false);
    };
    if (userEmail) {
      void load();
    }
  }, [userEmail]);

  if (!userEmail) {
    return (
      <p className="text-sm text-secondary">
        {locale === "ja" ? "ユーザーが未認証です。" : "User not authenticated."}
      </p>
    );
  }

  if (loading) {
    return <p className="text-sm text-secondary">{locale === "ja" ? "読み込み中..." : "Loading..."}</p>;
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-primary">
        {locale === "ja" ? "ワークスペースを切り替え" : "Switch workspace"}
      </p>
      <div className="grid gap-2">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            type="button"
            className="flex items-center justify-between rounded-card border border-default bg-surface px-4 py-3 text-left text-sm shadow-soft transition hover:-translate-y-0.5 hover-shadow-strong"
          >
            <span className="font-semibold text-primary">{ws.name}</span>
            <span className="text-xs text-muted">{ws.slug}</span>
          </button>
        ))}
        {workspaces.length === 0 ? (
          <p className="text-sm text-secondary">
            {locale === "ja" ? "所属するワークスペースがありません。" : "No workspaces found."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
