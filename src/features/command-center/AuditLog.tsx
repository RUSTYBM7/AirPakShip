import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Download, Calendar, Filter, Search } from 'lucide-react';

const mockLogs = [
  { id: 'log-1', timestamp: '2026-05-25 11:42:05', level: 'INFO', user: 'system', action: 'SYSTEM_BACKUP', details: 'Automated database backup completed successfully.' },
  { id: 'log-2', timestamp: '2026-05-25 11:38:12', level: 'WARN', user: 'api-gateway', action: 'RATE_LIMIT', details: 'IP 192.168.1.105 exceeded rate limit on /api/v1/orders' },
  { id: 'log-3', timestamp: '2026-05-25 11:15:00', level: 'INFO', user: 'admin@airpak.com', action: 'USER_ROLE_UPDATE', details: 'Changed role of bob@example.com from user to moderator' },
  { id: 'log-4', timestamp: '2026-05-25 10:05:22', level: 'ERROR', user: 'agent-4', action: 'AGENT_CRASH', details: 'OOM Error: Pricing Predictor exceeded memory allocation.' },
  { id: 'log-5', timestamp: '2026-05-25 09:30:01', level: 'INFO', user: 'system', action: 'SERVICE_START', details: 'Service airpak-core-api started successfully.' },
  { id: 'log-6', timestamp: '2026-05-25 09:29:55', level: 'WARN', user: 'system', action: 'HIGH_CPU', details: 'CPU usage spiked to 95% on node worker-3' },
  { id: 'log-7', timestamp: '2026-05-25 08:15:44', level: 'INFO', user: 'alice@airpak.com', action: 'LOGIN_SUCCESS', details: 'Successful login from 10.0.0.5' },
];

export const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/50">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-gray-400" />
          System Audit Log
        </h2>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded text-sm pl-8 pr-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded text-sm px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors" title="Export Logs">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-sm">
        {filteredLogs.map((log, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            key={log.id}
            className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2 hover:bg-white/5 p-1 rounded"
          >
            <span className="text-gray-500 whitespace-nowrap">[{log.timestamp}]</span>
            <span className={`font-bold w-12 ${
              log.level === 'INFO' ? 'text-blue-400' :
              log.level === 'WARN' ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {log.level}
            </span>
            <span className="text-purple-400 w-32 truncate" title={log.user}>{log.user}</span>
            <span className="text-green-400 w-40 truncate" title={log.action}>{log.action}</span>
            <span className="text-gray-300 break-words flex-1">{log.details}</span>
          </motion.div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500 font-sans">
            No logs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
