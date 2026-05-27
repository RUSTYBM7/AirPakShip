import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, ToggleRight, DatabaseBackup, Activity, HardDrive, RefreshCcw } from 'lucide-react';

export const SystemConfig: React.FC = () => {
  const [flags, setFlags] = useState([
    { id: 'new-ui', name: 'New Dashboard UI', enabled: true },
    { id: 'ai-routing', name: 'AI Route Optimization', enabled: true },
    { id: 'crypto-pay', name: 'Cryptocurrency Payments', enabled: false },
    { id: 'beta-features', name: 'Beta Features Opt-in', enabled: false },
  ]);

  const toggleFlag = (id: string) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Feature Flags
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {flags.map((flag) => (
              <div key={flag.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{flag.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">{flag.id}</div>
                </div>
                <button
                  onClick={() => toggleFlag(flag.id)}
                  className={`text-2xl ${flag.enabled ? 'text-green-500' : 'text-gray-600'}`}
                >
                  <ToggleRight className={`w-8 h-8 ${flag.enabled ? 'fill-current' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <DatabaseBackup className="w-5 h-5 text-purple-400" />
            Backup Controls
          </h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              <HardDrive className="w-4 h-4" /> Trigger Full Backup
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
              <RefreshCcw className="w-4 h-4" /> Restore from Snapshot
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Last successful backup: <strong>2026-05-25 00:00 UTC</strong> (Size: 4.2TB)
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Live Activity Feed
          </h2>
          <div className="flex-1 overflow-auto space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="relative pl-4 border-l-2 border-gray-700"
              >
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="text-sm text-gray-300">Order <span className="text-blue-400">#ORD-{8920 + i}</span> dispatched.</p>
                <span className="text-xs text-gray-500">{i * 2 + 1} min ago</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
