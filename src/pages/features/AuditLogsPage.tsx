/**
 * AirPak Express - Audit Logs Page
 * Full activity tracking and logging system
 */

import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, User, Activity, Shield, AlertTriangle, Clock, ChevronDown } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  action: string;
  category: string;
  severity: 'info' | 'warning' | 'critical';
  ip: string;
  device: string;
  details: string;
}

const LOG_DATA: LogEntry[] = [
  { id: '1', timestamp: '2026-05-26 06:05:12', user: 'John Admin', userEmail: 'admin@airpak-express.site', action: 'User Login', category: 'auth', severity: 'info', ip: '192.168.1.100', device: 'Chrome/Windows', details: 'Successful login with 2FA' },
  { id: '2', timestamp: '2026-05-26 06:04:45', user: 'John Admin', userEmail: 'admin@airpak-express.site', action: 'Shipment Created', category: 'shipments', severity: 'info', ip: '192.168.1.100', device: 'Chrome/Windows', details: 'Tracking: APX123456789' },
  { id: '3', timestamp: '2026-05-26 06:03:22', user: 'System', userEmail: 'system@airpak-express.site', action: 'Auto Processing', category: 'automation', severity: 'info', ip: '127.0.0.1', device: 'Server', details: 'Email notification sent to customer' },
  { id: '4', timestamp: '2026-05-26 06:02:10', user: 'John Admin', userEmail: 'admin@airpak-express.site', action: 'Role Changed', category: 'admin', severity: 'warning', ip: '192.168.1.100', device: 'Chrome/Windows', details: 'Changed role for user@example.com' },
  { id: '5', timestamp: '2026-05-26 06:01:55', user: 'John Admin', userEmail: 'admin@airpak-express.site', action: 'API Access', category: 'api', severity: 'info', ip: '192.168.1.100', device: 'Chrome/Windows', details: 'API key generated for production' },
  { id: '6', timestamp: '2026-05-26 06:00:30', user: 'System', userEmail: 'system@airpak-express.site', action: 'Security Alert', category: 'security', severity: 'critical', ip: '10.0.0.50', device: 'Unknown', details: 'Failed login attempt detected' },
  { id: '7', timestamp: '2026-05-26 05:58:15', user: 'Jane Staff', userEmail: 'jane@airpak-express.site', action: 'Invoice Generated', category: 'finance', severity: 'info', ip: '192.168.1.105', device: 'Firefox/MacOS', details: 'Invoice #INV-2026-0042 created' },
  { id: '8', timestamp: '2026-05-26 05:55:40', user: 'Jane Staff', userEmail: 'jane@airpak-express.site', action: 'Customer Updated', category: 'customers', severity: 'info', ip: '192.168.1.105', device: 'Firefox/MacOS', details: 'Updated contact info for Acme Corp' },
];

const CATEGORIES = ['All', 'auth', 'shipments', 'automation', 'admin', 'api', 'security', 'finance', 'customers'];
const SEVERITIES = ['All', 'info', 'warning', 'critical'];

const AuditLogsPage: React.FC = () => {
  const [logs] = useState<LogEntry[]>(LOG_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Email', 'Action', 'Category', 'Severity', 'IP', 'Device', 'Details'],
      ...filteredLogs.map(log => [log.timestamp, log.user, log.userEmail, log.action, log.category, log.severity, log.ip, log.device, log.details])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-slate-400 text-sm mt-1">Track all system activities</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-blue-400" /></div>
            <div><p className="text-2xl font-bold text-white">{filteredLogs.length}</p><p className="text-xs text-slate-400">Total Events</p></div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
            <div><p className="text-2xl font-bold text-white">{filteredLogs.filter(l => l.severity === 'critical').length}</p><p className="text-xs text-slate-400">Critical</p></div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-yellow-400" /></div>
            <div><p className="text-2xl font-bold text-white">{filteredLogs.filter(l => l.severity === 'warning').length}</p><p className="text-xs text-slate-400">Warnings</p></div>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center"><User className="w-5 h-5 text-green-400" /></div>
            <div><p className="text-2xl font-bold text-white">{new Set(filteredLogs.map(l => l.user)).size}</p><p className="text-xs text-slate-400">Active Users</p></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input type="text" placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
          </select>
          <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white">
            {SEVERITIES.map(sev => <option key={sev} value={sev}>{sev === 'All' ? 'All Severity' : sev}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">IP</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.map((log) => (
              <React.Fragment key={log.id}>
                <tr className="hover:bg-slate-800/30 cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(log.severity)}`}>{log.severity}</span></td>
                  <td className="px-4 py-3 text-slate-300 text-sm">{log.timestamp}</td>
                  <td className="px-4 py-3"><p className="text-white text-sm font-medium">{log.user}</p><p className="text-slate-500 text-xs">{log.userEmail}</p></td>
                  <td className="px-4 py-3 text-white text-sm">{log.action}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">{log.category}</span></td>
                  <td className="px-4 py-3 text-slate-400 text-sm font-mono">{log.ip}</td>
                  <td className="px-4 py-3"><ChevronDown className={`w-5 h-5 text-slate-500 inline-block transition-transform ${expandedLog === log.id ? 'rotate-180' : ''}`} /></td>
                </tr>
                {expandedLog === log.id && (
                  <tr className="bg-slate-800/20"><td colSpan={7} className="px-4 py-4"><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-slate-400">Device</p><p className="text-white">{log.device}</p></div><div><p className="text-slate-400">Details</p><p className="text-white">{log.details}</p></div></div></td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogsPage;