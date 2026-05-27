import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, StopCircle, PlayCircle, Download, Share2, Clock } from 'lucide-react';

interface SessionRecorderProps {
  isRecording: boolean;
  setIsRecording: (val: boolean) => void;
}

export const SessionRecorder: React.FC<SessionRecorderProps> = ({ isRecording, setIsRecording }) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      setHasRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-500" />
          Session Capture
        </h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-500 font-mono text-sm bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {formatTime(recordingTime)}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={toggleRecording}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            isRecording
              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800/50'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="w-4 h-4" /> Stop Recording
            </>
          ) : (
            <>
              <Video className="w-4 h-4" /> Start Capture
            </>
          )}
        </button>

        {hasRecording && !isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-700"
          >
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last session: {formatTime(recordingTime)}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                <PlayCircle className="w-4 h-4" />
                <span className="text-[10px] font-medium">Replay</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                <Download className="w-4 h-4" />
                <span className="text-[10px] font-medium">Logs</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                <Share2 className="w-4 h-4" />
                <span className="text-[10px] font-medium">Share</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
