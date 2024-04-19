type Role = {
  display_name: string,
  name: string
}

enum Status {
  active = "active",
  inactive = "inactive"
}

export type CoderUser = {
  avatar_url: string
  created_at: string,
  email: string,
  id: string,
  last_seen_at: string,
  login_type: string,
  name: string,
  organization_ids: string[],
  roles: Role[],
  status: Status,
  theme_preference: string,
  username: string
}

enum Provisioner {
  terraform = "terraform"
}

export type CoderTemplate = {
  id: string,
  created_at: string,
  updated_at: string,
  organization_id: string,
  name: string,
  display_name: string,
  provisioner: Provisioner,
  active_version_id: string,
  active_user_count: number,
  build_time_stats: any,
  description: string,
  deprecated: boolean,
  deprecation_message: string,
  icon: string,
  default_ttl_ms: number,
  activity_bump_ms: number,
  use_max_ttl: boolean,
  max_ttl_ms: number,
  autostop_requirement: any,
  autostart_requirement: any,
  created_by_id: string,
  created_by_name: string,
  allow_user_autostart: boolean,
  allow_user_autostop: boolean,
  allow_user_cancel_workspace_jobs: boolean,
  failure_ttl_ms: number,
  time_til_dormant_ms: number,
  time_til_dormant_autodelete_ms: number,
  require_active_version: boolean,
  max_port_share_level: string
}

export type CoderWorkspace = {
  id: string,
  created_at: string,
  updated_at: string,
  owner_id: string,
  owner_name: string,
  owner_avatar_url: string,
  organization_id: string,
  template_id: string,
  template_name: string,
  template_display_name: string,
  template_icon: string,
  template_allow_user_cancel_workspace_jobs: boolean,
  template_active_version_id: string,
  template_require_active_version: boolean,
  latest_build: any,
  outdated: boolean,
  name: string,
  ttl_ms: number,
  last_used_at: string,
  deleting_at: string | null,
  dormant_at: string | null,
  health: { healthy: boolean, failing_agents: string[] },
  automatic_updates: string,
  allow_renames: boolean,
  favorite: boolean
}

enum WorkspaceTransition {
  START = "start",
  STOP = "stop",
  DESTROY = "destroy"
}

export type CoderTemplateResource = {
  id: string,
  agents?: any[]
  created_at: string,
  daily_cost: number,
  hide: boolean,
  name: string,
  type: string,
  icon: string,
  job_id: string,
  workspace_transition: WorkspaceTransition,
  metadata?: [
    {
      key: string,
      value: string,
      sensitive: boolean
    }
  ]
}