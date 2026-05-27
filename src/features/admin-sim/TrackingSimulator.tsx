import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, Truck, Home, CheckCircle2, Navigation, Upload, Camera } from 'lucide-react';

const STATUS_POINTS = [
  { id: 'created', label: 'Label Created', icon: Package },
  { id: 'transit', label: 'In Transit', icon: Truck },
  { id: 'out', label: 'Out for Delivery', icon: Navigation },
  { id: 'delivered', label: 'Delivered', icon: Home }
];

export const TrackingSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showProofGenerator, setShowProofGenerator] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Live Tracking Preview
        </h2>
        <span className="text-xs font-medium px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
          SIMULATED VIEW
        </span>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-6 flex-1 flex flex-col justify-center border border-slate-100 dark:border-slate-800">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0 rounded-full"></div>

          {/* Active Progress */}
          <motion.div
            className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (STATUS_POINTS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          ></motion.div>

          <div className="relative z-10 flex justify-between">
            {STATUS_POINTS.map((point, index) => {
              const Icon = point.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={point.id} className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                      isActive
                        ? 'bg-blue-600 border-white dark:border-slate-900 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setCurrentStep(index)}
                    role="button"
                  >
                    {isActive && !isCurrent ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </motion.div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center"
          >
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Delivery Proof Simulator</h4>
            {showProofGenerator ? (
              <div className="space-y-3">
                <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Camera className="w-8 h-8 text-slate-400" />
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
                    Capture Fake Photo
                  </button>
                  <button className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded hover:bg-slate-300 dark:hover:bg-slate-600">
                    Generate Signature
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowProofGenerator(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Inject Mock Proof
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
        >
          Previous State
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(STATUS_POINTS.length - 1, currentStep + 1))}
          disabled={currentStep === STATUS_POINTS.length - 1}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Next State
        </button>
      </div>
    </div>
  );
};
