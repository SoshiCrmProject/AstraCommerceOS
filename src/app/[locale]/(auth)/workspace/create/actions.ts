"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

export async function createWorkspaceAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const ownerEmail = String(formData.get("ownerEmail") ?? "").trim().toLowerCase();

  if (!name || !slug || !ownerEmail) {
    throw new Error("Missing required fields");
  }

  const supabase = supabaseServer();

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      id: uuid(),
      name,
      slug,
      owner_email: ownerEmail,
    })
    .select("id")
    .single();

  if (error) {
    console.error("createWorkspace error", error);
    throw new Error(error.message);
  }

  await supabase.from("workspace_memberships").insert({
    workspace_id: workspace.id,
    user_email: ownerEmail,
    role: "owner",
  });

  revalidatePath("/");
  redirect("/en/app");
}
