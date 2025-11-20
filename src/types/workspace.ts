export type Workspace = {
  id: string;
  name: string;
  slug: string;
  owner_email: string;
  created_at: string;
};

export type WorkspaceInvite = {
  id: string;
  workspace_id: string;
  invitee_email: string;
  inviter_email: string;
  role: string;
  status: string;
  token: string | null;
  expires_at: string | null;
  created_at: string;
};
