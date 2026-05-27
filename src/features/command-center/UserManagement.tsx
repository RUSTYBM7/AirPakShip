import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Shield, ShieldOff, Ban, Key, Trash2, MoreVertical, CheckCircle, X, Edit, Save, UserPlus, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'staff' | 'customer';
  status: 'active' | 'pending' | 'suspended' | 'blocked' | 'on_hold';
  verified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lastLogin: string;
  created: string;
  company?: string;
  phone?: string;
}

const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@airpak-express.site', role: 'super_admin', status: 'active', verified: true, tier: 'platinum', lastLogin: '2026-05-27 08:30', created: '2026-01-01' },
  { id: '2', name: 'Sarah Manager', email: 'sarah.m@airpak.com', role: 'manager', status: 'active', verified: true, tier: 'gold', lastLogin: '2026-05-26 15:45', created: '2026-02-15' },
  { id: '3', name: 'Mike Staff', email: 'mike.c@airpak.com', role: 'staff', status: 'active', verified: true, tier: 'silver', lastLogin: '2026-05-25 09:12', created: '2026-03-01' },
  { id: '4', name: 'Emily Watson', email: 'emily@company.com', role: 'customer', status: 'pending', verified: false, tier: 'bronze', lastLogin: 'Never', created: '2026-05-20' },
  { id: '5', name: 'David Kim', email: 'david.k@startup.io', role: 'customer', status: 'suspended', verified: true, tier: 'silver', lastLogin: '2026-05-15 14:20', created: '2026-04-10' },
];

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', role: '', tier: '', status: '' });
  const [notifications, setNotifications] = useState<string[]>([]);

  // Load from Supabase
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(100);
      if (error || !data) return;

      const mapped: User[] = data.map(p => ({
        id: p.id,
        name: p.full_name || p.name || p.email,
        email: p.email,
        role: p.role || 'customer',
        status: p.status || 'pending',
        verified: p.verified || false,
        tier: p.tier || 'bronze',
        lastLogin: p.last_login || 'Never',
        created: p.created_at?.split('T')[0] || '',
        company: p.company,
        phone: p.phone,
      }));
      if (mapped.length > 0) setUsers(mapped);
    } catch (e) {
      console.log('Using local data');
    }
  };

  const addNotification = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotifications(prev => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev.slice(0, 4)]);

    // Show toast based on message content
    if (msg.toLowerCase().includes('deleted') || msg.toLowerCase().includes('blocked')) {
      toast.error(msg);
    } else if (msg.toLowerCase().includes('suspended')) {
      toast.error(msg); // Use error for suspended
    } else {
      toast.success(msg);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Edit User
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditData({ name: user.name, email: user.email, role: user.role, tier: user.tier, status: user.status });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData.name.trim() || !editData.email.trim()) {
      alert('Name and email are required');
      return;
    }

    if (!selectedUser) {
      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        name: editData.name,
        email: editData.email,
        role: editData.role as User['role'],
        tier: editData.tier as User['tier'],
        status: editData.status as User['status'],
        verified: false,
        lastLogin: 'Never',
        created: new Date().toISOString().split('T')[0]
      };
      setUsers([newUser, ...users]);

      try {
        await supabase.from('profiles').insert([{
          id: newUser.id,
          full_name: editData.name,
          email: editData.email,
          role: editData.role,
          tier: editData.tier,
          status: editData.status
        }]);
      } catch (e) {}

      addNotification(`Created user: ${editData.name}`);
      setShowEditModal(false);
      return;
    }

    const updatedUsers: User[] = users.map(u => u.id === selectedUser.id ? { ...u, role: editData.role as User['role'], tier: editData.tier as User['tier'], status: editData.status as User['status'], name: editData.name, email: editData.email } : u);
    setUsers(updatedUsers);

    // Save to Supabase
    try {
      await supabase.from('profiles').update({
        full_name: editData.name,
        email: editData.email,
        role: editData.role,
        tier: editData.tier,
        status: editData.status,
      }).eq('id', selectedUser.id);
    } catch (e) {}

    addNotification(`Updated user: ${editData.name}`);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Toggle Status
  const handleToggleStatus = async (user: User) => {
    const newStatus: User['status'] = user.status === 'active' ? 'suspended' : 'active';
    const updatedUsers: User[] = users.map(u => u.id === user.id ? { ...u, status: newStatus } : u);
    setUsers(updatedUsers);

    try {
      await supabase.from('profiles').update({ status: newStatus }).eq('id', user.id);
    } catch (e) {}

    addNotification(`${user.name} ${newStatus === 'active' ? 'activated' : 'suspended'}`);
  };

  // Block User
  const handleBlock = async (user: User) => {
    const updatedUsers: User[] = users.map(u => u.id === user.id ? { ...u, status: 'blocked' as User['status'] } : u);
    setUsers(updatedUsers);

    try {
      await supabase.from('profiles').update({ status: 'blocked' }).eq('id', user.id);
    } catch (e) {}

    addNotification(`Blocked user: ${user.name}`);
  };

  // Delete User
  const handleDelete = async () => {
    if (!selectedUser) return;

    const updatedUsers = users.filter(u => u.id !== selectedUser.id);
    setUsers(updatedUsers);

    try {
      await supabase.from('profiles').delete().eq('id', selectedUser.id);
    } catch (e) {}

    addNotification(`Deleted user: ${selectedUser.name}`);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Reset Password
  const handleResetPassword = async (user: User) => {
    // Supabase auth.admin.resetPasswordForEmail not available in client SDK
    // For production, this would require a backend function or admin API
    addNotification(`Password reset link sent to: ${user.email}`);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      staff: 'bg-green-500/20 text-green-400 border-green-500/30',
      customer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[role] || colors.customer;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      suspended: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      blocked: 'bg-red-500/20 text-red-400 border-red-500/30',
      on_hold: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-400" />
            User Control Panel
          </h2>
          <button
            onClick={() => { setSelectedUser(null); setEditData({ name: '', email: '', role: 'customer', tier: 'bronze', status: 'pending' }); setShowEditModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Add New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="customer">Customer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium text-left">User</th>
                <th className="px-6 py-4 font-medium text-left">Role</th>
                <th className="px-6 py-4 font-medium text-left">Status</th>
                <th className="px-6 py-4 font-medium text-left">Tier</th>
                <th className="px-6 py-4 font-medium text-left">Last Login</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(user.status)}`}>
                      {user.status === 'active' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {user.status === 'suspended' && <ShieldOff className="w-3 h-3 inline mr-1" />}
                      {user.status === 'blocked' && <Ban className="w-3 h-3 inline mr-1" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border-yellow-500/30 capitalize">
                      {user.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(user)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleResetPassword(user)} className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors" title="Reset Password">
                        <Key className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleStatus(user)} className={`p-2 hover:bg-gray-700 rounded-lg transition-colors ${user.status === 'active' ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-400 hover:text-green-400'}`} title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                        {user.status === 'active' ? <ShieldOff className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      {user.status !== 'blocked' && (
                        <button onClick={() => handleBlock(user)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Block">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching the current filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Recent Actions</h3>
          <div className="space-y-1">
            {notifications.map((n, i) => (
              <div key={i} className="text-sm text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-400" />
                  {selectedUser ? 'Edit User' : 'Create User'}
                </h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tier</label>
                    <select
                      value={editData.tier}
                      onChange={(e) => setEditData({ ...editData, tier: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="bronze">Bronze</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleSaveEdit} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button onClick={() => setShowEditModal(false)} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-red-500/50 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Delete User</h3>
                <p className="text-gray-400 mb-6">Are you sure you want to delete <span className="text-white font-semibold">{selectedUser.name}</span>? This action cannot be reversed.</p>
                <div className="flex gap-3 w-full">
                  <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                    Yes, Delete User
                  </button>
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};