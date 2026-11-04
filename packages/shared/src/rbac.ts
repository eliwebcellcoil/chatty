/** Roles */
export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  AGENT: "agent",
  CONTENT: "content", // ניהול תוכן / Canned בלבד
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Permissions */
export const PERMISSIONS = {
  // Agents
  AGENTS_VIEW: "agents:view",
  AGENTS_MANAGE: "agents:manage", // create/edit/disable

  // Conversations / Queue
  CHAT_HANDLE: "chat:handle",
  QUEUE_VIEW: "queue:view",
  QUEUE_CLAIM: "queue:claim",
  QUEUE_TRANSFER: "queue:transfer",
  ROUTING_MANAGE: "routing:manage",

  // Content
  CANNED_VIEW: "canned:view",
  CANNED_MANAGE: "canned:manage",

  // Analytics
  ANALYTICS_VIEW: "analytics:view",

  // Settings
  SETTINGS_MANAGE: "settings:manage",
  ROLES_MANAGE: "roles:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/** Role → Permissions matrix */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.AGENTS_VIEW,
    PERMISSIONS.AGENTS_MANAGE,
    PERMISSIONS.CHAT_HANDLE,
    PERMISSIONS.QUEUE_VIEW,
    PERMISSIONS.QUEUE_CLAIM,
    PERMISSIONS.QUEUE_TRANSFER,
    PERMISSIONS.ROUTING_MANAGE,
    PERMISSIONS.CANNED_VIEW,
    PERMISSIONS.CANNED_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  agent: [
    PERMISSIONS.CHAT_HANDLE,
    PERMISSIONS.QUEUE_VIEW,
    PERMISSIONS.QUEUE_CLAIM,
    PERMISSIONS.QUEUE_TRANSFER,
    PERMISSIONS.CANNED_VIEW,
  ],
  content: [
    PERMISSIONS.CANNED_VIEW,
    PERMISSIONS.CANNED_MANAGE,
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as Role];
  if (!perms) return false;
  return perms.includes(permission);
}

export function roleLabel(role: string): string {
  const map: Record<string, string> = {
    super_admin: "אדמין על",
    admin: "אדמין",
    agent: "נציג",
    content: "ניהול תוכן",
  };
  return map[role] || role;
}
