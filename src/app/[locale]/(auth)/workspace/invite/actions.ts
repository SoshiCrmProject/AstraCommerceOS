"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

export async function inviteMemberAction(formData: FormData) {
  const workspaceSlug = String(formData.get("workspaceSlug") ?? "").trim();
  const inviteeEmail = String(formData.get("inviteeEmail") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "member");
  const inviterEmail = String(formData.get("inviterEmail") ?? "").trim().toLowerCase();

  if (!workspaceSlug || !inviteeEmail || !inviterEmail) {
    throw new Error("Missing required fields");
  }

  const supabase = supabaseServer();

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("slug", workspaceSlug)
    .single();

  if (workspaceError || !workspace) {
    throw new Error("Workspace not found");
  }

  const token = uuid();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  const { error } = await supabase.from("workspace_invites").insert({
    workspace_id: workspace.id,
    invitee_email: inviteeEmail,
    inviter_email: inviterEmail,
    role,
    token,
    expires_at: expires,
  });

  if (error) {
    console.error("inviteMember error", error);
    throw new Error(error.message);
  }

  await supabase.from("audit_logs").insert({
    workspace_id: workspace.id,
    actor_email: inviterEmail,
    action: "invite.create",
    details: { inviteeEmail, role },
  });

  revalidatePath("/");
  redirect("/en/app/settings/team");
}
