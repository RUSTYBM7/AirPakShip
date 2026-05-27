import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Play, Square, Settings, Activity, Cpu, Network } from 'lucide-react';

const mockAgents = [
  { id: 'agent-1', name: 'Customer Support Bot', type: 'NLP', status: 'running', tasks: 12, cpu: 45, memory: 1.2 },
  { id: 'agent-2', name: 'Fraud Detection Engine', type: 'Analysis', status: 'running', tasks: 156, cpu: 78, memory: 4.5 },
  { id: 'agent-3', name: 'Route Optimizer AI', type: 'Logistics', status: 'stopped', tasks: 0, cpu: 0, memory: 0 },
  { id: 'agent-4', name: 'Pricing Predictor', type: 'ML Model', status: 'error', tasks: 3, cpu: 95, memory: 8.1 },
];

export const AIAgentMonitor: React.FC = () => {
  const [agents, setAgents] = useState(mockAgents);

  const toggleStatus = (id: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        return {
          ...agent,
          status: agent.status === 'running' ? 'stopped' : 'running',
          cpu: agent.status === 'running' ? 0 : Math.floor(Math.random() * 50) + 10,
          tasks: agent.status === 'running' ? 0 : Math.floor(Math.random() * 20),
        };
      }
      return agent;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-purple-400" />
          AI Agent Swarm Control
        </h2>
        <div className="flex gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Running (2)</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Stopped (1)</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Error (1)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={agent.id}
            className={`bg-gray-800 rounded-xl border ${
              agent.status === 'error' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-700'
            } p-5 overflow-hidden relative group`}
          >
            {/* Background glow effect based on status */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000 ${
              agent.status === 'running' ? 'bg-green-500' :
              agent.status === 'error' ? 'bg-red-500' : 'bg-transparent'
            }`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 border border-gray-600">
                    {agent.type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  ID: {agent.id}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(agent.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    agent.status === 'running'
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                  title={agent.status === 'running' ? 'Stop Agent' : 'Start Agent'}
                >
                  {agent.status === 'running' ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 relative z-10">
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                <div className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3" /> Queue
                </div>
                <div className="text-xl font-semibold text-white">{agent.tasks}</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                <div className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                  <Cpu className="w-3 h-3" /> CPU
                </div>
                <div className="text-xl font-semibold text-white">{agent.cpu}%</div>
                <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${agent.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${agent.cpu}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                <div className="text-gray-400 text-xs flex items-center gap-1 mb-1">
                  <Network className="w-3 h-3" /> RAM
                </div>
                <div className="text-xl font-semibold text-white">{agent.memory}GB</div>
              </div>
            </div>

            {agent.status === 'error' && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 relative z-10">
                CRITICAL: Memory leak detected. Process auto-suspended.
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
