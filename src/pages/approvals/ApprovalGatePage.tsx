/**
 * AirPak Express - AI Approval Gate Dashboard
 * Inbox-style approval system for AI-generated content
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, X, AlertTriangle, ShieldAlert, FileEdit,
  Search, Filter, MoreVertical, PlayCircle, Clock,
  User, Eye, Edit, Trash2, Zap, ArrowRight, RefreshCw,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ApprovalItem {
  id: string;
  type: 'document' | 'invoice' | 'email' | 'workflow' | 'graphic' | 'pricing';
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'modified' | 'requested_changes';
  preview?: string;
  content?: any;
}

const mockApprovals: ApprovalItem[] = [
  {
    id: '1',
    type: 'document',
    title: 'Customs Invoice for Shipment #APK88421',
    description: 'AI auto-generated commercial invoice for UK customs clearance',
    requestedBy: 'System',
    requestedAt: new Date(Date.now() - 3600000),
    priority: 'high',
    status: 'pending',
  },
  {
    id: '2',
    type: 'email',
    title: 'Welcome Email Sequence - New User Onboarding',
    description: '3-email sequence for new customer onboarding triggered by signup',
    requestedBy: 'marketing@airpak.com',
    requestedAt: new Date(Date.now() - 7200000),
    priority: 'medium',
    status: 'pending',
  },
  {
    id: '3',
    type: 'workflow',
    title: 'Exception Handler - Weather Delays',
    description: 'Automated workflow to handle weather-related shipment delays',
    requestedBy: 'ops@airpak.com',
    requestedAt: new Date(Date.now() - 14400000),
    priority: 'urgent',
    status: 'pending',
  },
  {
    id: '4',
    type: 'graphic',
    title: 'Summer Sale Promotional Banner',
    description: 'Social media banner for summer shipping promotion',
    requestedBy: 'design@airpak.com',
    requestedAt: new Date(Date.now() - 28800000),
    priority: 'low',
    status: 'approved',
  },
  {
    id: '5',
    type: 'invoice',
    title: 'Bulk Invoice - Account ACME Corp',
    description: 'Monthly consolidated invoice for enterprise customer',
    requestedBy: 'billing@airpak.com',
    requestedAt: new Date(Date.now() - 86400000),
    priority: 'high',
    status: 'modified',
  },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  document: { icon: FileEdit, color: 'text-blue-500', bg: 'bg-blue-100' },
  invoice: { icon: AlertCircle, color: 'text-green-500', bg: 'bg-green-100' },
  email: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-100' },
  workflow: { icon: RefreshCw, color: 'text-orange-500', bg: 'bg-orange-100' },
  graphic: { icon: Eye, color: 'text-pink-500', bg: 'bg-pink-100' },
  pricing: { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-100' },
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' },
  high: { label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
  medium: { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  low: { label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
};

const ApprovalGatePage: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch approvals from Supabase
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const { data, error } = await supabase
          .from('approvals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching approvals:', error);
          // Fall back to mock data
          setApprovals(mockApprovals);
          return;
        }

        if (data && data.length > 0) {
          // Transform Supabase data to ApprovalItem format
          const transformedData = data.map((item: any) => ({
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            requestedBy: item.requested_by || 'System',
            requestedAt: new Date(item.requested_at || item.created_at),
            priority: item.priority,
            status: item.status,
            content: item.content
          }));
          setApprovals(transformedData);
        } else {
          // Use mock data if no real data
          setApprovals(mockApprovals);
        }
      } catch (err) {
        console.error('Error:', err);
        setApprovals(mockApprovals);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovals();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('approvals-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'approvals' },
        () => {
          fetchApprovals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredApprovals = approvals.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedApproval = approvals.find(a => a.id === selectedId);

  const handleApprove = async (id: string) => {
    // Optimistic update
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a));

    try {
      await supabase
        .from('approvals')
        .update({ status: 'approved' })
        .eq('id', id);
    } catch (err) {
      console.error('Error approving (using mock data):', err);
      // Removed revert to handle mock data gracefully
    }
  };

  const handleReject = async (id: string) => {
    // Optimistic update
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));

    try {
      await supabase
        .from('approvals')
        .update({ status: 'rejected' })
        .eq('id', id);
    } catch (err) {
      console.error('Error rejecting (using mock data):', err);
      // Removed revert to handle mock data gracefully
    }
  };

  const handleModify = async (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'modified' as const } : a));
    try {
      await supabase
        .from('approvals')
        .update({ status: 'modified' })
        .eq('id', id);
    } catch (err) {
      console.error('Error modifying (using mock data):', err);
      // Removed revert to handle mock data gracefully
    }
  };

  const handleRequestChanges = async (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'requested_changes' as const } : a));
    try {
      await supabase
        .from('approvals')
        .update({ status: 'requested_changes' })
        .eq('id', id);
    } catch (err) {
      console.error('Error requesting changes (using mock data):', err);
      // Removed revert to handle mock data gracefully
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - List */}
      <div className="w-96 border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              Approval Gate
            </h1>
            <span className="text-sm text-slate-400">
              {approvals.filter(a => a.status === 'pending').length} pending
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approvals..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  filter === f
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredApprovals.map((approval) => {
            const config = typeConfig[approval.type];
            const Icon = config.icon;
            const priority = priorityConfig[approval.priority];
            const isSelected = selectedId === approval.id;

            return (
              <motion.button
                key={approval.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedId(approval.id)}
                className={`w-full p-4 border-b border-slate-800 text-left transition-colors ${
                  isSelected ? 'bg-slate-800' : 'hover:bg-slate-800/50'
                } ${approval.status === 'pending' ? 'border-l-4 border-l-yellow-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white truncate">{approval.title}</h3>
                      {approval.priority === 'urgent' && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mb-2">{approval.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priority.bg} ${priority.color}`}>
                        {priority.label}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(approval.requestedAt)}
                      </span>
                      {approval.status !== 'pending' && (
                        <span className={`text-xs font-medium ${
                          approval.status === 'approved' ? 'text-green-500' :
                          approval.status === 'rejected' ? 'text-red-500' :
                          approval.status === 'requested_changes' ? 'text-orange-500' : 'text-yellow-500'
                        }`}>
                          {approval.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {filteredApprovals.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No approvals found</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Detail */}
      <div className="flex-1 flex flex-col">
        {selectedApproval ? (
          <>
            {/* Detail Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeConfig[selectedApproval.type].bg}`}>
                      {React.createElement(typeConfig[selectedApproval.type].icon, {
                        className: `w-6 h-6 ${typeConfig[selectedApproval.type].color}`
                      })}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedApproval.title}</h2>
                      <p className="text-sm text-slate-400">{selectedApproval.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedApproval.requestedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(selectedApproval.requestedAt)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig[selectedApproval.priority].bg} ${priorityConfig[selectedApproval.priority].color}`}>
                      {priorityConfig[selectedApproval.priority].label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {selectedApproval.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestChanges(selectedApproval.id)}
                      className="px-4 py-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleReject(selectedApproval.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApproval.id)}
                      className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-xl font-medium flex items-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve & Execute
                    </button>
                  </div>
                )}

                {selectedApproval.status !== 'pending' && (
                  <div className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                    selectedApproval.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    selectedApproval.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    selectedApproval.status === 'requested_changes' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {selectedApproval.status === 'approved' && <CheckCircle className="w-5 h-5" />}
                    {selectedApproval.status === 'rejected' && <XCircle className="w-5 h-5" />}
                    {selectedApproval.status === 'modified' && <Edit className="w-5 h-5" />}
                    {selectedApproval.status === 'requested_changes' && <AlertTriangle className="w-5 h-5" />}
                    {selectedApproval.status.replace('_', ' ').charAt(0).toUpperCase() + selectedApproval.status.replace('_', ' ').slice(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Preview</h3>
                <div className="bg-white rounded-xl p-6 text-gray-900">
                  <p className="text-sm text-gray-600 mb-4">
                    This is a preview of the AI-generated content awaiting approval.
                  </p>
                  <div className="space-y-4">
                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      Document Preview
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-medium capitalize">{selectedApproval.type}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Requested</p>
                        <p className="font-medium">{formatTime(selectedApproval.requestedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit & Approve Option */}
                {selectedApproval.status === 'pending' && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Edit className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-medium text-yellow-500">Want to modify before approving?</h4>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      You can edit the content inline and then approve the modified version.
                    </p>
                    <button onClick={() => handleModify(selectedApproval.id)} className="px-4 py-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit & Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <div className="text-center">
              <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select an item to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalGatePage;
