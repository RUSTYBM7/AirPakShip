// RBAC - Role-Based Access Control
// 5-tier system for AirPak Express Admin

export type Role = 'super_admin' | 'admin' | 'manager' | 'staff' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'execute')[];
}

export interface RolePermissions {
  role: Role;
  label: string;
  permissions: Permission[];
}

// Permission matrix for each role
export const rolePermissions: Record<Role, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    permissions: [
      // Full access to everything
      { resource: 'dashboard', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'shipments', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'customers', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'businesses', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'invoices', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'documents', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'ai-documents', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'ai-invoices', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'ai-creative', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'email-system', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'workflows', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'autopilot', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'automation-rules', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'ai-analyst', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'document-parser', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'voice-tools', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'api-playground', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'audit-logs', actions: ['read'] },
      { resource: 'roles', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'permissions', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'branches', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'system-settings', actions: ['read', 'update'] },
    ],
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    permissions: [
      { resource: 'dashboard', actions: ['create', 'read', 'update', 'execute'] },
      { resource: 'shipments', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'customers', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'businesses', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'invoices', actions: ['create', 'read', 'update', 'delete', 'approve'] },
      { resource: 'documents', actions: ['create', 'read', 'update', 'delete', 'approve', 'execute'] },
      { resource: 'ai-documents', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'ai-invoices', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'ai-creative', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'email-system', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'workflows', actions: ['create', 'read', 'update', 'delete', 'execute'] },
      { resource: 'autopilot', actions: ['read', 'update'] },
      { resource: 'automation-rules', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'ai-analyst', actions: ['create', 'read', 'execute'] },
      { resource: 'document-parser', actions: ['create', 'read', 'execute'] },
      { resource: 'voice-tools', actions: ['create', 'read', 'execute'] },
      { resource: 'api-playground', actions: ['create', 'read', 'execute'] },
      { resource: 'audit-logs', actions: ['read'] },
      { resource: 'users', actions: ['create', 'read', 'update'] },
      { resource: 'branches', actions: ['create', 'read', 'update'] },
    ],
  },
  manager: {
    role: 'manager',
    label: 'Manager',
    permissions: [
      { resource: 'dashboard', actions: ['read', 'execute'] },
      { resource: 'shipments', actions: ['create', 'read', 'update', 'approve'] },
      { resource: 'customers', actions: ['read', 'update'] },
      { resource: 'businesses', actions: ['read', 'update'] },
      { resource: 'invoices', actions: ['read', 'update'] },
      { resource: 'documents', actions: ['create', 'read', 'update'] },
      { resource: 'ai-documents', actions: ['create', 'read', 'execute'] },
      { resource: 'ai-invoices', actions: ['create', 'read', 'execute'] },
      { resource: 'ai-creative', actions: ['create', 'read', 'execute'] },
      { resource: 'email-system', actions: ['create', 'read', 'execute'] },
      { resource: 'workflows', actions: ['read', 'update'] },
      { resource: 'ai-analyst', actions: ['read'] },
      { resource: 'document-parser', actions: ['read', 'execute'] },
      { resource: 'audit-logs', actions: ['read'] },
    ],
  },
  staff: {
    role: 'staff',
    label: 'Staff',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'shipments', actions: ['create', 'read', 'update'] },
      { resource: 'customers', actions: ['read'] },
      { resource: 'businesses', actions: ['read'] },
      { resource: 'invoices', actions: ['read'] },
      { resource: 'documents', actions: ['read'] },
      { resource: 'ai-documents', actions: ['read'] },
      { resource: 'email-system', actions: ['read'] },
      { resource: 'ai-analyst', actions: ['read'] },
    ],
  },
  viewer: {
    role: 'viewer',
    label: 'Viewer',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'shipments', actions: ['read'] },
      { resource: 'customers', actions: ['read'] },
    ],
  },
};

// Permission checking utility
export const hasPermission = (
  role: Role,
  resource: string,
  action: string
): boolean => {
  const roleData = rolePermissions[role];
  if (!roleData) return false;

  const resourcePermission = roleData.permissions.find(p => p.resource === resource);
  if (!resourcePermission) return false;

  return resourcePermission.actions.includes(action as any);
};

// Get all actions for a resource
export const getResourceActions = (role: Role, resource: string): string[] => {
  const roleData = rolePermissions[role];
  if (!roleData) return [];

  const resourcePermission = roleData.permissions.find(p => p.resource === resource);
  if (!resourcePermission) return [];

  return resourcePermission.actions;
};

// Get all accessible resources for a role
export const getAccessibleResources = (role: Role): string[] => {
  const roleData = rolePermissions[role];
  if (!roleData) return [];

  return roleData.permissions.map(p => p.resource);
};