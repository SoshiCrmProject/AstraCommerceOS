-- Core workspace tables for AstraCommerce OS

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  owner_email text not null,
  created_at timestamptz not null default now()
);

create table if not exists workspace_memberships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_email text not null,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

create table if not exists workspace_invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  invitee_email text not null,
  inviter_email text not null,
  role text not null default 'member',
  status text not null default 'pending',
  token text unique,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  workspace_id uuid references workspaces(id) on delete cascade,
  actor_email text,
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

-- Recommended indexes
create index if not exists idx_workspaces_slug on workspaces(slug);
create index if not exists idx_memberships_workspace_user on workspace_memberships(workspace_id, user_email);
create index if not exists idx_invites_workspace_invitee on workspace_invites(workspace_id, invitee_email);
create index if not exists idx_audit_workspace on audit_logs(workspace_id);

-- Suggested RLS policies (enable RLS and adapt to your auth strategy)
-- alter table workspaces enable row level security;
-- alter table workspace_memberships enable row level security;
-- alter table workspace_invites enable row level security;
-- alter table audit_logs enable row level security;

-- Example policy placeholders:
-- create policy "owners manage workspace" on workspaces
--   for all using (auth.email() = owner_email);

-- create policy "members read workspace" on workspaces
--   for select using (exists (
--     select 1 from workspace_memberships m where m.workspace_id = id and m.user_email = auth.email()
--   ));

