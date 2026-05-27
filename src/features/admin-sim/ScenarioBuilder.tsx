import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, AlertCircle, Clock, CheckCircle, PackageX, Truck, Play, Calendar } from 'lucide-react';

interface ScenarioEvent {
  id: string;
  type: string;
  description: string;
  delayHours: number;
}

interface PrebuiltScenario {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  events: ScenarioEvent[];
}

const PREBUILT_SCENARIOS: PrebuiltScenario[] = [
  {
    id: 'late-delivery',
    name: 'Weather Delay',
    icon: Clock,
    description: 'Simulate severe weather causing a 24h delay in transit.',
    events: [
      { id: '1', type: 'Delay', description: 'Severe weather alert in transit hub', delayHours: 0 },
      { id: '2', type: 'StatusUpdate', description: 'Package held at facility', delayHours: 2 },
      { id: '3', type: 'Rescheduled', description: 'Delivery rescheduled to next day', delayHours: 24 }
    ]
  },
  {
    id: 'damaged-package',
    name: 'Damaged Package',
    icon: PackageX,
    description: 'Simulate a package damaged during sorting.',
    events: [
      { id: '1', type: 'Exception', description: 'Exception: Package damaged in transit', delayHours: 0 },
      { id: '2', type: 'Inspection', description: 'Damage assessment initiated', delayHours: 4 },
      { id: '3', type: 'Return', description: 'Returning to sender', delayHours: 48 }
    ]
  },
  {
    id: 'customs-hold',
    name: 'Customs Hold',
    icon: AlertCircle,
    description: 'Simulate international shipment stuck in customs.',
    events: [
      { id: '1', type: 'Customs', description: 'Arrived at customs', delayHours: 0 },
      { id: '2', type: 'Hold', description: 'Clearance delay - Additional documentation required', delayHours: 12 },
      { id: '3', type: 'Notification', description: 'Action required email sent to customer', delayHours: 13 }
    ]
  }
];

export const ScenarioBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prebuilt' | 'custom'>('prebuilt');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<ScenarioEvent[]>([]);

  const addCustomEvent = () => {
    setCustomEvents([
      ...customEvents,
      {
        id: Math.random().toString(36).substr(2, 9),
        type: 'StatusUpdate',
        description: 'New tracking event',
        delayHours: 0
      }
    ]);
  };

  const removeCustomEvent = (id: string) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <List className="w-5 h-5 text-blue-500" />
          Scenario Builder
        </h2>
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('prebuilt')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'prebuilt'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Pre-built
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'custom'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Custom Chain
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'prebuilt' ? (
          <motion.div
            key="prebuilt"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {PREBUILT_SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = selectedScenario === scenario.id;
              return (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-white">{scenario.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{scenario.description}</p>

                  <div className="space-y-2">
                    {scenario.events.map((event, idx) => (
                      <div key={event.id} className="text-xs flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-medium shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{event.description}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4" />
                      Run Scenario
                    </motion.button>
                  )}
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="custom"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              {customEvents.map((event, index) => (
                <div key={event.id} className="flex gap-4 items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="font-medium text-slate-400">#{index + 1}</div>
                  <select
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={event.type}
                    onChange={(e) => {
                      const newEvents = [...customEvents];
                      newEvents[index].type = e.target.value;
                      setCustomEvents(newEvents);
                    }}
                  >
                    <option value="StatusUpdate">Status Update</option>
                    <option value="Delay">Delay</option>
                    <option value="Exception">Exception</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <input
                    type="text"
                    value={event.description}
                    onChange={(e) => {
                      const newEvents = [...customEvents];
                      newEvents[index].description = e.target.value;
                      setCustomEvents(newEvents);
                    }}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Event description..."
                  />
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={event.delayHours}
                      onChange={(e) => {
                        const newEvents = [...customEvents];
                        newEvents[index].delayHours = Number(e.target.value);
                        setCustomEvents(newEvents);
                      }}
                      className="w-16 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1.5 text-sm outline-none"
                    />
                    <span className="text-sm text-slate-500">hrs</span>
                  </div>
                  <button
                    onClick={() => removeCustomEvent(event.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={addCustomEvent}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>

              <button
                disabled={customEvents.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Execute Chain
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
