import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

interface SimulatorToggleProps {
  isSimulationMode: boolean;
  onToggle: (mode: boolean) => void;
  isRecording: boolean;
}

export const SimulatorToggle: React.FC<SimulatorToggleProps> = ({
  isSimulationMode,
  onToggle,
  isRecording
}) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleToggleAttempt = () => {
    if (isSimulationMode) {
      // Switching back to Production
      setShowWarning(true);
    } else {
      // Switching to Sandbox
      onToggle(true);
    }
  };

  const confirmProductionMode = () => {
    setShowWarning(false);
    onToggle(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            Environment Mode
            {isRecording && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                RECORDING
              </span>
            )}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isSimulationMode
              ? 'Sandbox Mode: All actions are simulated and safe'
              : 'Production Mode: Changes affect real user data'}
          </p>
        </div>

        <button
          onClick={handleToggleAttempt}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSimulationMode ? 'bg-blue-500' : 'bg-red-500'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 flex items-center justify-center shadow-md ${
              isSimulationMode ? 'translate-x-9' : 'translate-x-1'
            }`}
          >
            {isSimulationMode ? (
              <ShieldCheck className="w-4 h-4 text-blue-500" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-500" />
            )}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">
                  Switching to Production Mode
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1 mb-3">
                  You are about to exit the Sandbox. Any actions taken from here will affect live production data and real shipments. Are you absolutely sure?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={confirmProductionMode}
                    className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Yes, enter Production
                  </button>
                  <button
                    onClick={() => setShowWarning(false)}
                    className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                  >
                    Cancel, stay in Sandbox
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
