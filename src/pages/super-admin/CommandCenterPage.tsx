import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Key, Power, AlertOctagon, Settings, Layers, RefreshCw } from 'lucide-react';
import { SystemHealth } from '../../features/command-center/SystemHealth';
import { UserManagement } from '../../features/command-center/UserManagement';
import { DatabaseConsole } from '../../features/command-center/DatabaseConsole';
import { AIAgentMonitor } from '../../features/command-center/AIAgentMonitor';
import { AuditLog } from '../../features/command-center/AuditLog';
import { SystemConfig } from '../../features/command-center/SystemConfig';

export const CommandCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const tabs = [
    { id: 'health', label: 'System Health', icon: <Zap className="w-4 h-4" /> },
    { id: 'users', label: 'User Control', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'database', label: 'DB Console', icon: <Layers className="w-4 h-4" /> },
    { id: 'agents', label: 'AI Swarm', icon: <Settings className="w-4 h-4" /> },
    { id: 'logs', label: 'Audit Logs', icon: <AlertOctagon className="w-4 h-4" /> },
    { id: 'config', label: 'System Config', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-800 p-6 rounded-2xl border border-red-900/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none"></div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 tracking-tight flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              SUPER ADMIN COMMAND CENTER
            </h1>
            <p className="text-gray-400 mt-1 text-sm">AirPak Express Core Infrastructure Control</p>
          </div>

          <div className="flex gap-3 relative z-10">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors border border-gray-600">
              <RefreshCw className="w-4 h-4 text-blue-400" /> Clear Cache
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors border border-gray-600">
              <Key className="w-4 h-4 text-yellow-400" /> API Keys
            </button>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500"
            >
              <Power className="w-4 h-4" /> EMERGENCY STOP
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'health' && <SystemHealth />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'database' && <DatabaseConsole />}
              {activeTab === 'agents' && <AIAgentMonitor />}
              {activeTab === 'logs' && <AuditLog />}
              {activeTab === 'config' && <SystemConfig />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isEmergencyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-red-500 p-8 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)] max-w-md w-full"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertOctagon className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">INITIATE SYSTEM LOCKDOWN?</h2>
                <p className="text-gray-400 mb-6">
                  This will immediately terminate all active user sessions, halt all AI agents, and restrict API access to super-admins only. This action is logged and cannot be easily undone.
                </p>
                <div className="w-full space-y-3">
                  <button
                    onClick={() => setIsEmergencyModalOpen(false)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                  >
                    CONFIRM LOCKDOWN
                  </button>
                  <button
                    onClick={() => setIsEmergencyModalOpen(false)}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
                  >
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

export default CommandCenterPage;
