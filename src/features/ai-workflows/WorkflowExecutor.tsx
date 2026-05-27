import React, { useState } from 'react';
import { Edge } from '@xyflow/react';
import { AppNode } from './workflow.config';
import { Play, RotateCcw, CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WorkflowExecutorProps {
  nodes: AppNode[];
  edges: Edge[];
}

export function WorkflowExecutor({ nodes, edges }: WorkflowExecutorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<{ id: string; nodeId: string; status: 'pending' | 'success' | 'error'; message: string; time: string }[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runWorkflow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);

    // Find trigger node
    const triggers = nodes.filter(n => n.data.type === 'trigger');
    if (triggers.length === 0) {
      setLogs([{ id: 'err-1', nodeId: 'system', status: 'error', message: 'No trigger node found. Please add a Trigger node to start the workflow.', time: new Date().toLocaleTimeString() }]);
      setIsRunning(false);
      return;
    }

    const currentLogs: any[] = [];
    const addLog = (nodeId: string, status: 'pending' | 'success' | 'error', message: string) => {
      const log = { id: Math.random().toString(), nodeId, status, message, time: new Date().toLocaleTimeString() };
      currentLogs.push(log);
      setLogs([...currentLogs]);
    };

    try {
      let currentNode: AppNode | undefined = triggers[0];

      while (currentNode) {
        addLog(currentNode.id, 'pending', `Executing [${currentNode.data.label}]...`);

        // Simulate execution time
        await sleep(1000);

        // Randomly fail sometimes (10% chance) for realism unless it's a trigger
        if (currentNode.data.type !== 'trigger' && Math.random() > 0.9) {
          throw new Error(`Failed to execute [${currentNode.data.label}] due to simulated error.`);
        }

        addLog(currentNode.id, 'success', `Completed [${currentNode.data.label}] successfully.`);

        // Find next node
        const outgoingEdges = edges.filter(e => e.source === currentNode?.id);
        if (outgoingEdges.length === 0) {
          break; // end of workflow
        }

        // Just take the first one for simulation
        const nextNodeId = outgoingEdges[0].target;
        currentNode = nodes.find(n => n.id === nextNodeId) as AppNode;
      }

      addLog('system', 'success', 'Workflow execution completed successfully.');
    } catch (err: any) {
      addLog('system', 'error', err.message || 'Workflow failed.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 w-80">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2 text-gray-900">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Execution Engine</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLogs([])}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Clear Logs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={runWorkflow}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white transition-all shadow-sm",
              isRunning ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
            )}
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Run Test'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-12 h-12 mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No execution logs</p>
            <p className="text-xs text-gray-400 mt-1 text-center max-w-[200px]">Run the workflow to monitor execution details here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={log.id} className="relative flex gap-3 text-sm">
                {/* Connecting line */}
                {index !== logs.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-gray-100 rounded-full" />
                )}

                <div className="mt-0.5 relative z-10 bg-white rounded-full">
                  {log.status === 'pending' && <Clock className="w-5 h-5 text-blue-500 animate-pulse bg-white" />}
                  {log.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500 bg-white" />}
                  {log.status === 'error' && <XCircle className="w-5 h-5 text-red-500 bg-white" />}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "font-medium text-xs px-2 py-0.5 rounded-full",
                      log.nodeId === 'system' ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {log.nodeId === 'system' ? 'System' : log.nodeId.split('-')[0].toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{log.time}</span>
                  </div>
                  <p className={cn(
                    "text-xs leading-relaxed break-words",
                    log.status === 'error' ? "text-red-600 font-medium" : "text-gray-600"
                  )}>
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
