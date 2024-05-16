import { z } from 'zod'

export const Role = z.object({
  display_name: z.string(),
  name: z.string()
})

export type RoleType = z.infer<typeof Role>;

export const Status = z.enum(["active", "inactive", "dormant"])

export const CoderUser = z.object({
  avatar_url: z.string(),
  created_at: z.string(),
  email: z.string(),
  id: z.string(),
  last_seen_at: z.string(),
  login_type: z.string(),
  name: z.string(),
  organization_ids: z.array(z.string()),
  roles: Role.array(),
  status: Status,
  theme_preference: z.string(),
  username: z.string()
})

export type CoderUserType = z.infer<typeof CoderUser>;

export const Provisioner = z.enum(["terraform"])

export const CoderTemplate = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  organization_id: z.string(),
  name: z.string(),
  display_name: z.string(),
  provisioner: Provisioner,
  active_version_id: z.string(),
  active_user_count: z.number(),
  build_time_stats: z.any(),
  description: z.string(),
  deprecated: z.boolean(),
  deprecation_message: z.string(),
  icon: z.string(),
  default_ttl_ms: z.number(),
  activity_bump_ms: z.number(),
  autostop_requirement: z.any(),
  autostart_requirement: z.any(),
  created_by_id: z.string(),
  created_by_name: z.string(),
  allow_user_autostart: z.boolean(),
  allow_user_autostop: z.boolean(),
  allow_user_cancel_workspace_jobs: z.boolean(),
  failure_ttl_ms: z.number(),
  time_til_dormant_ms: z.number(),
  time_til_dormant_autodelete_ms: z.number(),
  require_active_version: z.boolean(),
  max_port_share_level: z.string()
})

export type CoderTemplateType = z.infer<typeof CoderTemplate>;

export const CoderWorkspace = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  owner_id: z.string(),
  owner_name: z.string(),
  owner_avatar_url: z.string(),
  organization_id: z.string(),
  template_id: z.string(),
  template_name: z.string(),
  template_display_name: z.string(),
  template_icon: z.string(),
  template_allow_user_cancel_workspace_jobs: z.boolean(),
  template_active_version_id: z.string(),
  template_require_active_version: z.boolean(),
  latest_build: z.any(),
  outdated: z.boolean(),
  name: z.string(),
  ttl_ms: z.number(),
  last_used_at: z.string(),
  deleting_at: z.string().nullable(),
  dormant_at: z.string().nullable(),
  health: z.object({
    healthy: z.boolean(),
    failing_agents: z.string().array()
  }),
  automatic_updates: z.string(),
  allow_renames: z.boolean(),
  favorite: z.boolean()
})

export type CoderWorkspaceType = z.infer<typeof CoderWorkspace>;

export const WorkspaceTransition = z.enum(["start", "stop", "destroy"])

export const CoderTemplateResource = z.object({
  id: z.string(),
  agents: z.any().array().optional(),
  created_at: z.string(),
  daily_cost: z.number(),
  hide: z.boolean(),
  name: z.string(),
  type: z.string(),
  icon: z.string(),
  job_id: z.string(),
  workspace_transition: WorkspaceTransition,
  metadata: z.array(z.object({
    key: z.string(),
    value: z.string(),
    sensitive: z.boolean()
  })).optional()
})

export type CoderTemplateResourceType = z.infer<typeof CoderTemplateResource>;