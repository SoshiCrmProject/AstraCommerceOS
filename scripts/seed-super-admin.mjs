import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SUPER_ADMIN_EMAIL;
const password = process.env.SUPER_ADMIN_PASSWORD;
const workspaceSlug = process.env.SUPER_ADMIN_WORKSPACE_SLUG || "super-admin";
const workspaceName = process.env.SUPER_ADMIN_WORKSPACE_NAME || "Super Admin Workspace";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}
if (!email || !password) {
  console.error("Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD env vars.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function ensureUser() {
  const { data: existing, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) throw listError;
  const found = existing.users?.find((u) => u.email === email);
  if (found) {
    console.log("Super admin user already exists:", email);
    return found;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "superadmin" },
  });
  if (error) throw error;
  console.log("Created super admin user:", email);
  return data.user;
}

async function ensureWorkspace() {
  const { data: existing, error: wsError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("slug", workspaceSlug)
    .maybeSingle();
  if (wsError) throw wsError;
  if (existing) {
    console.log("Workspace already exists:", workspaceSlug);
    return existing.id;
  }
  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name: workspaceName,
      slug: workspaceSlug,
      owner_email: email.toLowerCase(),
    })
    .select("id")
    .single();
  if (error) throw error;
  console.log("Created workspace:", workspaceSlug);
  return data.id;
}

async function ensureMembership(workspaceId) {
  const { data: existing, error } = await supabase
    .from("workspace_memberships")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_email", email.toLowerCase())
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  if (existing) {
    console.log("Membership already exists for super admin.");
    return;
  }
  const { error: insertError } = await supabase.from("workspace_memberships").insert({
    workspace_id: workspaceId,
    user_email: email.toLowerCase(),
    role: "owner",
  });
  if (insertError) throw insertError;
  console.log("Created membership for super admin.");
}

async function run() {
  try {
    await ensureUser();
    const workspaceId = await ensureWorkspace();
    await ensureMembership(workspaceId);
    console.log("Super admin seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

run();
