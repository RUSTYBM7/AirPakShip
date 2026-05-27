import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Activity,
  Mail,
  Bell,
  Zap,
  Users,
  Database,
  RefreshCw
} from 'lucide-react';
import { SimulatorToggle } from '../../features/admin-sim/SimulatorToggle';
import { ScenarioBuilder } from '../../features/admin-sim/ScenarioBuilder';
import { TrackingSimulator } from '../../features/admin-sim/TrackingSimulator';
import { SessionRecorder } from '../../features/admin-sim/SessionRecorder';

export default function AdminSimulationPage() {
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'injection' | 'stress'>('scenarios');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              AirPak Simulation Controller
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sandbox environment for testing tracking flows, edge cases, and user communications.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <SimulatorToggle
              isSimulationMode={isSimulationMode}
              onToggle={setIsSimulationMode}
              isRecording={isRecording}
            />
          </div>
        </div>

        {/* Dashboard Grid */}
        {!isSimulationMode ? (
          <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 rounded-lg shadow-sm flex items-center gap-4">
            <Activity className="w-8 h-8 text-red-500 shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-400">Production Mode Active</h2>
              <p className="text-red-700 dark:text-red-300">Simulation features are disabled to prevent accidental modifications to live data.</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >

            {/* Left Column: Controls & Tools */}
            <div className="lg:col-span-2 space-y-6">

              {/* Navigation Tabs */}
              <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
                {[
                  { id: 'scenarios', label: 'Scenario Builder', icon: Activity },
                  { id: 'injection', label: 'Data Injection & Comms', icon: Database },
                  { id: 'stress', label: 'Stress Testing', icon: Zap }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'scenarios' && (
                <ScenarioBuilder />
              )}

              {activeTab === 'injection' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock Data Injection */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                      <Database className="w-4 h-4 text-emerald-500" />
                      Mock Shipment Data
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex justify-center items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Inject Standard Flow
                      </button>
                      <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Inject Multi-Package Order
                      </button>
                      <button className="w-full py-2 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Inject Missing Data Case
                      </button>
                    </div>
                  </div>

                  {/* Comms Simulation */}
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                      <Mail className="w-4 h-4 text-blue-500" />
                      Communications Simulator
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Trigger Email</label>
                        <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
                          <option>Delivery Tomorrow Alert</option>
                          <option>Exception Notice</option>
                          <option>Action Required: Customs</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-700 flex justify-center items-center gap-2">
                          <Mail className="w-4 h-4" /> Send Email
                        </button>
                        <button className="flex-1 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded font-medium text-sm hover:bg-slate-900 dark:hover:bg-slate-600 flex justify-center items-center gap-2">
                          <Bell className="w-4 h-4" /> Push Notif
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stress' && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-amber-500" />
                    High Volume Stress Test
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">0</div>
                        <div className="text-xs text-slate-500">Active Mocks</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0/s</div>
                        <div className="text-xs text-slate-500">Event Rate</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">0ms</div>
                        <div className="text-xs text-slate-500">Avg Latency</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Concurrent Packages</label>
                      <input type="range" min="10" max="10000" defaultValue="100" className="w-full accent-amber-500" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>10</span>
                        <span>10,000</span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-colors shadow-sm">
                      Initialize Load Test
                    </button>
                  </div>
                </div>
              )}

              {/* User Session Simulator */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-purple-500" />
                  User Context Simulator
                </h3>
                <div className="flex gap-4">
                  <select className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none">
                    <option>Guest User (No Auth)</option>
                    <option>Registered Customer</option>
                    <option>B2B Business Account</option>
                    <option>VIP Member</option>
                  </select>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded font-medium text-sm hover:bg-purple-700 transition-colors">
                    Impersonate Role
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Preview & Monitoring */}
            <div className="space-y-6 h-full flex flex-col">

              <SessionRecorder
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />

              <div className="flex-1 min-h-[400px]">
                <TrackingSimulator />
              </div>

            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
