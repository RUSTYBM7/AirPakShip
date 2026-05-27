/**
 * AirPak Express - Roles & Permissions Page
 */

import React, { useState } from 'react';
import { Shield, Plus, Trash2, Check, Users, Lock } from 'lucide-react';

interface Permission { id: string; name: string; description: string; category: string; }
interface Role { id: string; name: string; displayName: string; color: string; description: string; userCount: number; permissions: string[]; isSystem: boolean; }

const PERMISSIONS: Permission[] = [
  { id: 'shipments.view', name: 'View Shipments', description: 'View shipment details', category: 'Shipments' },
  { id: 'shipments.create', name: 'Create Shipments', description: 'Create new shipments', category: 'Shipments' },
  { id: 'shipments.edit', name: 'Edit Shipments', description: 'Modify shipment data', category: 'Shipments' },
  { id: 'users.view', name: 'View Users', description: 'View user list', category: 'Users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user data', category: 'Users' },
  { id: 'finances.view', name: 'View Finances', description: 'View financial data', category: 'Finances' },
  { id: 'finances.invoices', name: 'Manage Invoices', description: 'Create invoices', category: 'Finances' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'Settings' },
  { id: 'reports.export', name: 'Export Reports', description: 'Export report data', category: 'Reports' },
  { id: 'ai.documents', name: 'AI Documents', description: 'Use AI document tools', category: 'AI Tools' },
  { id: 'admin.system', name: 'System Admin', description: 'Full system access', category: 'Admin' },
];

const ROLES_DATA: Role[] = [
  { id: 'super_admin', name: 'super_admin', displayName: 'Super Admin', color: 'purple', description: 'Full system access', userCount: 2, permissions: PERMISSIONS.map(p => p.id), isSystem: true },
  { id: 'admin', name: 'admin', displayName: 'Administrator', color: 'red', description: 'Administrative access', userCount: 5, permissions: ['shipments.view', 'shipments.create', 'shipments.edit', 'users.view', 'finances.view', 'ai.documents'], isSystem: true },
  { id: 'manager', name: 'manager', displayName: 'Manager', color: 'blue', description: 'Manager access', userCount: 12, permissions: ['shipments.view', 'shipments.create', 'finances.view', 'reports.export'], isSystem: true },
  { id: 'staff', name: 'staff', displayName: 'Staff', color: 'green', description: 'Basic staff access', userCount: 28, permissions: ['shipments.view', 'shipments.create'], isSystem: true },
  { id: 'customer', name: 'customer', displayName: 'Customer', color: 'gray', description: 'Customer portal access', userCount: 156, permissions: ['shipments.view'], isSystem: true },
];

const CATEGORIES = ['All', 'Shipments', 'Users', 'Finances', 'Settings', 'Reports', 'AI Tools', 'Admin'];

const RolesPermissionsPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(ROLES_DATA);
  const [selectedRole, setSelectedRole] = useState<Role | null>(ROLES_DATA[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPermissions = PERMISSIONS.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  const getRoleColorClass = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRole || selectedRole.isSystem && selectedRole.id === 'super_admin') return;
    setRoles(roles.map(role => {
      if (role.id === selectedRole.id) {
        const newPermissions = role.permissions.includes(permissionId)
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
    setSelectedRole(prev => prev ? {
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    } : null);
  };

  return (
    <div className="p-6 space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Roles & Permissions</h1><p className="text-slate-400 text-sm mt-1">Manage user roles and access permissions</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800"><h3 className="text-sm font-medium text-slate-400 uppercase">Roles</h3></div>
          <div className="divide-y divide-slate-800">
            {roles.map((role) => (
              <button key={role.id} onClick={() => setSelectedRole(role)} className={`w-full p-4 text-left hover:bg-slate-800/50 ${selectedRole?.id === role.id ? 'bg-slate-800/70' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColorClass(role.color)}`}>{role.displayName}</span>
                  {role.isSystem && <Lock className="w-4 h-4 text-slate-500" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400"><Users className="w-4 h-4" />{role.userCount} users</div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          {selectedRole && (
            <>
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">{selectedRole.displayName}</h3>
                <p className="text-sm text-slate-400">{selectedRole.description}</p>
              </div>
              <div className="p-4 border-b border-slate-800 flex gap-2 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{cat}</button>
                ))}
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPermissions.map((permission) => (
                    <button key={permission.id} onClick={() => togglePermission(permission.id)} disabled={selectedRole.isSystem && selectedRole.id === 'super_admin'} className={`p-3 rounded-xl border text-left transition-all ${selectedRole.permissions.includes(permission.id) ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-800/50 border-slate-700'} ${selectedRole.isSystem && selectedRole.id === 'super_admin' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div><p className="text-white font-medium">{permission.name}</p><p className="text-slate-400 text-sm">{permission.description}</p></div>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center ${selectedRole.permissions.includes(permission.id) ? 'bg-green-500 border-green-500' : 'border-slate-600'}`}>
                          {selectedRole.permissions.includes(permission.id) && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-400">{permission.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionsPage;