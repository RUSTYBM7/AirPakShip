import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Server, Activity, Database, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const mockCpuData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  usage: Math.floor(Math.random() * 40) + 20
}));

const mockMemoryData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  usage: Math.floor(Math.random() * 30) + 40
}));

export const SystemHealth: React.FC = () => {
  const [cpuData, setCpuData] = useState(mockCpuData);
  const [memoryData, setMemoryData] = useState(mockMemoryData);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: 'now',
          usage: Math.floor(Math.random() * 40) + 20
        });
        return newData;
      });
      setMemoryData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: 'now',
          usage: Math.floor(Math.random() * 30) + 40
        });
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthCard title="Server Status" value="Healthy" icon={<Server />} status="good" />
        <HealthCard title="Database" value="Connected" icon={<Database />} status="good" />
        <HealthCard title="API Latency" value="45ms" icon={<Activity />} status="good" />
        <HealthCard title="Uptime" value="99.99%" icon={<Clock />} status="good" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            CPU Usage
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 p-6 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-400" />
            Memory Usage
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memoryData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMemory)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HealthCard = ({ title, value, icon, status }: { title: string, value: string, icon: React.ReactNode, status: 'good' | 'warning' | 'error' }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between"
    >
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${
        status === 'good' ? 'bg-green-500/10 text-green-500' :
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
        'bg-red-500/10 text-red-500'
      }`}>
        {icon}
      </div>
    </motion.div>
  );
};
