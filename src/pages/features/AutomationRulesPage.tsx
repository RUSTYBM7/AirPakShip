import React, { useState } from 'react';
import { Zap, Plus, Search, Filter, Play, Pause, Trash2, Edit, Copy, Clock, Check, AlertTriangle, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'shipment_created' | 'shipment_delivered' | 'payment_received' | 'user_signup' | 'custom_schedule' | 'status_change';
  condition: string;
  action: string[];
  status: 'active' | 'paused' | 'disabled';
  lastTriggered?: string;
  executionCount: number;
  createdAt: string;
}

const AutomationRulesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample automation rules
  const [rules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Shipment Delivered Notification',
      description: 'Send email notification when shipment is delivered',
      trigger: 'shipment_delivered',
      condition: 'Always',
      action: ['Send Email', 'Update Dashboard'],
      status: 'active',
      lastTriggered: '2024-01-28 15:30',
      executionCount: 1250,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'New Customer Welcome',
      description: 'Send welcome email and setup intro when new user signs up',
      trigger: 'user_signup',
      condition: 'Email verified = true',
      action: ['Send Welcome Email', 'Create Welcome Task', 'Add to Newsletter'],
      status: 'active',
      lastTriggered: '2024-01-28 10:15',
      executionCount: 456,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Overdue Invoice Reminder',
      description: 'Send reminder for unpaid invoices after 7 days',
      trigger: 'custom_schedule',
      condition: 'Invoice status = overdue AND days past due >= 7',
      action: ['Send Reminder Email', 'Notify Admin'],
      status: 'active',
      lastTriggered: '2024-01-28 09:00',
      executionCount: 89,
      createdAt: '2024-01-20'
    },
    {
      id: '4',
      name: 'Delivery Delay Alert',
      description: 'Alert customer when shipment is delayed',
      trigger: 'status_change',
      condition: 'Status = delayed',
      action: ['Send Delay Notification', 'Log Support Ticket'],
      status: 'paused',
      lastTriggered: '2024-01-25 14:00',
      executionCount: 234,
      createdAt: '2024-01-05'
    },
    {
      id: '5',
      name: 'Payment Received Confirmation',
      description: 'Send payment confirmation and receipt',
      trigger: 'payment_received',
      condition: 'Always',
      action: ['Send Receipt', 'Update Invoice Status'],
      status: 'active',
      lastTriggered: '2024-01-28 16:45',
      executionCount: 890,
      createdAt: '2024-01-12'
    },
    {
      id: '6',
      name: 'Weekly Analytics Report',
      description: 'Generate and send weekly performance report',
      trigger: 'custom_schedule',
      condition: 'Every Monday at 9 AM',
      action: ['Generate Report', 'Send to Admin'],
      status: 'disabled',
      executionCount: 12,
      createdAt: '2024-01-01'
    },
    {
      id: '7',
      name: 'Shipment Created Workflow',
      description: 'Auto-assign and notify when new shipment is created',
      trigger: 'shipment_created',
      condition: 'Always',
      action: ['Auto-assign Driver', 'Send SMS to Customer', 'Update Analytics'],
      status: 'active',
      lastTriggered: '2024-01-28 17:00',
      executionCount: 2341,
      createdAt: '2023-12-20'
    }
  ]);

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'shipment_created':
        return <Zap size={14} className="text-blue-400" />;
      case 'shipment_delivered':
        return <Check size={14} className="text-green-400" />;
      case 'payment_received':
        return <Zap size={14} className="text-yellow-400" />;
      case 'user_signup':
        return <Zap size={14} className="text-purple-400" />;
      case 'custom_schedule':
        return <Clock size={14} className="text-orange-400" />;
      case 'status_change':
        return <AlertTriangle size={14} className="text-red-400" />;
      default:
        return <Zap size={14} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'paused':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'disabled':
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const activeRules = rules.filter(r => r.status === 'active').length;
  const totalExecutions = rules.reduce((sum, r) => sum + r.executionCount, 0);
  const avgExecutions = Math.round(totalExecutions / rules.length);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Automation Rules</h1>
        <p className="text-slate-400">Create automated workflows to streamline operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Rules</p>
              <p className="text-xl font-bold text-green-400">{activeRules}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Executions</p>
              <p className="text-xl font-bold text-white">{totalExecutions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Avg per Rule</p>
              <p className="text-xl font-bold text-white">{avgExecutions}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Pause size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Paused</p>
              <p className="text-xl font-bold text-yellow-400">{rules.filter(r => r.status === 'paused').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search automation rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-red-500/50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-red-500/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Rule
          </button>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-colors cursor-pointer"
            onClick={() => setSelectedRule(rule)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rule.status === 'active' ? 'bg-green-600/20' :
                  rule.status === 'paused' ? 'bg-yellow-600/20' : 'bg-slate-600/20'
                }`}>
                  <Zap size={20} className={
                    rule.status === 'active' ? 'text-green-400' :
                    rule.status === 'paused' ? 'text-yellow-400' : 'text-slate-400'
                  } />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{rule.name}</h3>
                  <p className="text-sm text-slate-400">{rule.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(rule.status)}`}>
                {rule.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-slate-500">Trigger:</span>
                  <span className="flex items-center gap-1">
                    {getTriggerIcon(rule.trigger)}
                    {rule.trigger.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-slate-500">Condition:</span>
                  {rule.condition}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {rule.action.map((action, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs border border-blue-500/30">
                    {action}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>Executions: {rule.executionCount}</span>
                {rule.lastTriggered && <span>Last: {rule.lastTriggered}</span>}
              </div>
              <div className="flex items-center gap-1">
                {rule.status === 'active' ? (
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Pause">
                    <Pause size={16} className="text-yellow-400" />
                  </button>
                ) : (
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Activate">
                    <Play size={16} className="text-green-400" />
                  </button>
                )}
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Edit">
                  <Edit size={16} className="text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Delete">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-12 text-center">
          <Zap size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No automation rules found</p>
        </div>
      )}

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold text-white mb-6">Create Automation Rule</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g., New Order Alert"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Trigger Event</label>
                <select className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-red-500/50">
                  <option value="">Select a trigger...</option>
                  <option value="shipment_created">Shipment Created</option>
                  <option value="shipment_delivered">Shipment Delivered</option>
                  <option value="payment_received">Payment Received</option>
                  <option value="user_signup">User Signup</option>
                  <option value="custom_schedule">Custom Schedule</option>
                  <option value="status_change">Status Change</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Condition (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., amount > 100"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Actions</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600" />
                    <span className="text-white">Send Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600" />
                    <span className="text-white">Send SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600" />
                    <span className="text-white">Update Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600" />
                    <span className="text-white">Create Task</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationRulesPage;
