import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Plus, Play, Pause, Settings, Clock, Activity,
  Mail, Bell, RefreshCw, Search, Filter, CheckCircle,
  XCircle, ChevronRight, Zap, List, Shield, Cpu,
  Brain, Eye, Radio, AlertTriangle, TrendingUp,
  Workflow, GitBranch, ArrowRight, Timer, Gauge,
  Target, Zap as ZapIcon, Layers, ShieldCheck
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused' | 'learning';
  lastRun: string;
  runsToday: number;
  health: number;
  category: string;
}

interface AutoImmuneFeature {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'learning';
  icon: React.ReactNode;
}

const mockAutomations: Automation[] = [
  {
    id: 'auto-1',
    name: 'New Shipment Notification',
    trigger: 'Shipment Created',
    action: 'Send Email',
    status: 'active',
    lastRun: '2 mins ago',
    runsToday: 142,
    health: 98,
    category: 'notifications'
  },
  {
    id: 'auto-2',
    name: 'Delivery Delay Alert',
    trigger: 'Status Change',
    action: 'Notify User',
    status: 'active',
    lastRun: '15 mins ago',
    runsToday: 38,
    health: 95,
    category: 'alerts'
  },
  {
    id: 'auto-3',
    name: 'Payment Received Receipt',
    trigger: 'Payment',
    action: 'Send Email',
    status: 'learning',
    lastRun: 'Yesterday',
    runsToday: 0,
    health: 82,
    category: 'finance'
  },
  {
    id: 'auto-4',
    name: 'Auto-Update to In Transit',
    trigger: 'Status Change',
    action: 'Update Status',
    status: 'active',
    lastRun: '1 hour ago',
    runsToday: 89,
    health: 99,
    category: 'operations'
  },
  {
    id: 'auto-5',
    name: 'VIP Route Optimization',
    trigger: 'High Value Shipment',
    action: 'Priority Routing',
    status: 'active',
    lastRun: '30 mins ago',
    runsToday: 12,
    health: 97,
    category: 'ai-optimized'
  },
  {
    id: 'auto-6',
    name: 'Customs Pre-Clearance',
    trigger: 'International Shipment',
    action: 'Auto Documentation',
    status: 'active',
    lastRun: '5 mins ago',
    runsToday: 47,
    health: 94,
    category: 'compliance'
  }
];

const autoImmuneFeatures: AutoImmuneFeature[] = [
  { id: 'ai-1', name: 'Self-Healing Engine', description: 'Automatically detects and fixes automation failures', status: 'active', icon: <Shield className="w-5 h-5" /> },
  { id: 'ai-2', name: 'Predictive Scaling', description: 'Pre-loads resources before demand spikes', status: 'active', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'ai-3', name: 'Anomaly Detection', description: 'AI monitors patterns and flags unusual behavior', status: 'active', icon: <Eye className="w-5 h-5" /> },
  { id: 'ai-4', name: 'Smart Optimization', description: 'Continuously learns and improves automation performance', status: 'learning', icon: <Brain className="w-5 h-5" /> },
  { id: 'ai-5', name: 'Failure Prevention', description: 'Prevents known failure patterns before they occur', status: 'active', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'ai-6', name: 'Auto Recovery', description: 'Automatically recovers from system failures', status: 'active', icon: <Radio className="w-5 h-5" /> },
];

const mockLogs = [
  { id: 'log-1', automationName: 'New Shipment Notification', status: 'success', time: '2 mins ago', details: 'Email sent to customer@example.com', duration: '234ms' },
  { id: 'log-2', automationName: 'Delivery Delay Alert', status: 'failed', time: '15 mins ago', details: 'User missing device token for push notification', duration: '1.2s' },
  { id: 'log-3', automationName: 'Auto-Update to In Transit', status: 'success', time: '1 hour ago', details: 'Status updated to In Transit for Tracking #AWB123456789', duration: '89ms' },
  { id: 'log-4', automationName: 'New Shipment Notification', status: 'success', time: '1 hour ago', details: 'Email sent to hello@company.com', duration: '198ms' },
  { id: 'log-5', automationName: 'VIP Route Optimization', status: 'success', time: '30 mins ago', details: 'Rerouted shipment via priority通道 for 12kg package', duration: '456ms' },
  { id: 'log-6', automationName: 'Customs Pre-Clearance', status: 'success', time: '5 mins ago', details: 'Auto-generated customs docs for EXP-2024-8834', duration: '1.1s' },
];

const aiSuggestions = [
  { title: 'High Volume Alert', description: 'Detected 23% increase in shipments. Consider scaling up notification automations.', icon: <Zap className="w-4 h-4" /> },
  { title: 'Failure Pattern Detected', description: 'Email notifications to Gmail have 12% lower delivery rate. Suggest switching to SMTP relay.', icon: <AlertTriangle className="w-4 h-4" /> },
  { title: 'Optimization Opportunity', description: 'Combine "Status Change" and "Notify User" into single workflow for 40% performance boost.', icon: <Target className="w-4 h-4" /> },
];

export default function AutoPilotPage() {
  const [automations, setAutomations] = useState<Automation[]>(mockAutomations);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'logs' | 'auto-immune'>('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthPulse, setHealthPulse] = useState(0);

  // Simulate health monitoring pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthPulse(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = (id: string) => {
    setAutomations(automations.map(auto => {
      if (auto.id === id) {
        return { ...auto, status: auto.status === 'active' ? 'paused' : 'active' };
      }
      return auto;
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-400/10';
      case 'paused': return 'text-slate-400 bg-slate-800/50';
      case 'learning': return 'text-amber-400 bg-amber-400/10';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'paused': return <Pause className="w-3.5 h-3.5" />;
      case 'learning': return <Brain className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-emerald-400';
    if (health >= 80) return 'text-amber-400';
    return 'text-rose-400';
  };

  const filteredAutomations = automations.filter(auto =>
    auto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    auto.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="relative">
                <Bot className="w-8 h-8 text-indigo-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              AutoPilot
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Shield className="w-3 h-3" /> Auto Immune
              </span>
            </h1>
            <p className="text-slate-400 mt-1">AI-powered automation with self-healing capabilities</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400 font-medium">System Healthy</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Automation
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2 relative z-10">
              <span className="font-medium text-sm">Active</span>
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white relative z-10">
              {automations.filter(a => a.status === 'active').length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2 relative z-10">
              <span className="font-medium text-sm">Learning</span>
              <Brain className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white relative z-10">
              {automations.filter(a => a.status === 'learning').length}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2 relative z-10">
              <span className="font-medium text-sm">Executions Today</span>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white relative z-10">328</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2 relative z-10">
              <span className="font-medium text-sm">Success Rate</span>
              <Gauge className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 relative z-10">99.2%</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex items-center justify-between text-slate-400 mb-2 relative z-10">
              <span className="font-medium text-sm">Avg Response</span>
              <Timer className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-3xl font-bold text-white relative z-10">142ms</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 border-b border-slate-800">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Bot className="w-4 h-4" /> },
            { id: 'auto-immune', label: 'Auto Immune', icon: <Shield className="w-4 h-4" /> },
            { id: 'logs', label: 'Execution Logs', icon: <List className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-2 font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-md"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* AI Suggestions */}
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-indigo-400" />
                <span className="font-semibold text-white">AI Suggestions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {aiSuggestions.map((suggestion, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                        {suggestion.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{suggestion.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Filter className="w-4 h-4" />
                <span>Filter by status</span>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search automations..."
                  className="bg-slate-950 border border-slate-800 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 w-64"
                />
              </div>
            </div>

            {/* Automation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAutomations.map((automation) => (
                <motion.div
                  key={automation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${automation.status === 'active' ? 'bg-indigo-500/10 text-indigo-400' : automation.status === 'learning' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{automation.name}</h3>
                          <div className={`flex items-center gap-1.5 text-xs mt-1 px-2 py-0.5 rounded-full w-fit ${getStatusColor(automation.status)}`}>
                            {getStatusIcon(automation.status)}
                            <span className="capitalize">{automation.status}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleStatus(automation.id)}
                        className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-800 transition-colors"
                      >
                        {automation.status === 'active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Health Indicator */}
                    <div className="mb-4 bg-slate-950 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">Health Score</span>
                        <span className={`text-sm font-bold ${getHealthColor(automation.health)}`}>{automation.health}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${automation.health}%`,
                            background: automation.health >= 95 ? '#10b981' : automation.health >= 80 ? '#f59e0b' : '#ef4444'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${automation.health}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm">
                        <div className="w-20 text-slate-500">Trigger:</div>
                        <div className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 text-xs">{automation.trigger}</div>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-20 text-slate-500">Action:</div>
                        <div className="flex items-center gap-1 text-slate-300">
                          {automation.action === 'Send Email' && <Mail className="w-3.5 h-3.5" />}
                          {automation.action === 'Notify User' && <Bell className="w-3.5 h-3.5" />}
                          {automation.action === 'Update Status' && <RefreshCw className="w-3.5 h-3.5" />}
                          {automation.action === 'Priority Routing' && <GitBranch className="w-3.5 h-3.5" />}
                          {automation.action === 'Auto Documentation' && <Layers className="w-3.5 h-3.5" />}
                          <span className="text-xs">{automation.action}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {automation.lastRun}
                      </div>
                      <div>
                        {automation.runsToday} runs today
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-between items-center">
                    <button className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                      View Logs
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'auto-immune' && (
          <div className="space-y-6">
            {/* Auto Immune Header */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Auto Immune System</h2>
                  <p className="text-slate-400">AI-powered self-healing and anomaly detection for your automations</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">6</div>
                  <div className="text-sm text-slate-400">Active Protections</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">47</div>
                  <div className="text-sm text-slate-400">Issues Prevented</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">99.7%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">0.3s</div>
                  <div className="text-sm text-slate-400">Avg Recovery Time</div>
                </div>
              </div>
            </div>

            {/* Auto Immune Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {autoImmuneFeatures.map((feature, i) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-slate-900 border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                    feature.status === 'active' ? 'border-emerald-500/30' : feature.status === 'learning' ? 'border-amber-500/30' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      feature.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      feature.status === 'learning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {feature.icon}
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                      feature.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      feature.status === 'learning' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        feature.status === 'active' ? 'bg-emerald-500' : feature.status === 'learning' ? 'bg-amber-500' : 'bg-slate-500'
                      } ${feature.status === 'learning' ? 'animate-pulse' : ''}`}></div>
                      {feature.status === 'learning' ? 'Learning...' : feature.status}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Last active: 2 min ago</span>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                      Configure <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System Monitor */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Real-Time System Monitor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">CPU Usage</span>
                    <span className="text-sm font-medium text-white">23%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Memory</span>
                    <span className="text-sm font-medium text-white">45%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Automation Queue</span>
                    <span className="text-sm font-medium text-white">12 items</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <List className="w-5 h-5 text-indigo-400" />
                Recent Executions
              </h2>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Clear Logs</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Automation</th>
                    <th className="px-6 py-3 font-medium">Duration</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        {log.status === 'success' ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded w-fit text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Success
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-400 bg-rose-400/10 px-2 py-1 rounded w-fit text-xs font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {log.automationName}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {log.duration}
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {log.time}
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-md truncate">
                        {log.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-800 text-center">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Load more logs</button>
            </div>
          </div>
        )}
      </div>

      {/* Create Automation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  Create New Automation
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">Automation Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g., VIP Customer Alert"
                  />
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <label className="block text-sm font-medium text-slate-400 mb-3">IF THIS HAPPENS (Trigger)</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500">
                    <option>Shipment Created</option>
                    <option>Status Change</option>
                    <option>Payment Received</option>
                    <option>Delivery Exception</option>
                    <option>High Value Shipment</option>
                    <option>International Shipment</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 relative">
                  <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-800 rounded-full p-1 z-10">
                    <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                  </div>
                  <label className="block text-sm font-medium text-slate-400 mb-3">THEN DO THIS (Action)</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500">
                    <option>Send Email</option>
                    <option>Update Status</option>
                    <option>Notify User (Push/SMS)</option>
                    <option>Assign to Agent</option>
                    <option>Priority Routing</option>
                    <option>Auto Documentation</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-slate-200 border-4 border-slate-700 appearance-none cursor-pointer checked:right-0 checked:border-indigo-500 transition-all right-5" defaultChecked/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-700 cursor-pointer"></label>
                  </div>
                  <label htmlFor="toggle" className="text-sm text-slate-300 font-medium">Enable immediately</label>
                </div>
              </div>
              <div className="p-5 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                  Save & Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}