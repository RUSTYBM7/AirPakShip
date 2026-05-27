import React, { useCallback, useState } from 'react';
import { useNodesState, useEdgesState, addEdge, Connection, Edge, ReactFlowProvider } from '@xyflow/react';
import { NodeLibrary } from '@/features/ai-workflows/NodeLibrary';
import { WorkflowCanvas } from '@/features/ai-workflows/WorkflowCanvas';
import { WorkflowExecutor } from '@/features/ai-workflows/WorkflowExecutor';
import { INITIAL_NODES, INITIAL_EDGES, AppNode } from '@/features/ai-workflows/workflow.config';
import { Save, FolderOpen, Settings2, Trash2, SlidersHorizontal, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


const TEMPLATES = {
  'auto-reply': {
    nodes: [
      { id: 't1', type: 'customNode', position: { x: 400, y: 100 }, data: { label: 'New Email Received', type: 'trigger', description: 'Triggers on incoming support email' } },
      { id: 'a1', type: 'customNode', position: { x: 400, y: 250 }, data: { label: 'AI Sentiment Analysis', type: 'aiTask', description: 'Analyze customer sentiment and extract intent' } },
      { id: 'c1', type: 'customNode', position: { x: 400, y: 400 }, data: { label: 'Is Routine Query?', type: 'condition', description: 'Check if standard auto-reply applies' } },
      { id: 'a2', type: 'customNode', position: { x: 200, y: 550 }, data: { label: 'Send AI Auto-Reply', type: 'action', description: 'Generate and send response' } },
      { id: 'a3', type: 'customNode', position: { x: 600, y: 550 }, data: { label: 'Route to Human', type: 'action', description: 'Assign to support queue' } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'a1', target: 'c1', type: 'smoothstep', animated: true },
      { id: 'e3', source: 'c1', target: 'a2', type: 'smoothstep', animated: true, label: 'Yes' },
      { id: 'e4', source: 'c1', target: 'a3', type: 'smoothstep', animated: true, label: 'No' }
    ]
  },
  'escalation': {
    nodes: [
      { id: 't1', type: 'customNode', position: { x: 400, y: 100 }, data: { label: 'Ticket SLA Breached', type: 'trigger', description: 'Triggers when a ticket passes SLA' } },
      { id: 'a1', type: 'customNode', position: { x: 400, y: 250 }, data: { label: 'Notify Manager', type: 'notification', description: 'Send alert to team lead' } },
      { id: 'a2', type: 'customNode', position: { x: 400, y: 400 }, data: { label: 'Update Priority', type: 'action', description: 'Set priority to P1/Urgent' } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'a1', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'a1', target: 'a2', type: 'smoothstep', animated: true }
    ]
  },
  'notification': {
    nodes: [
      { id: 't1', type: 'customNode', position: { x: 400, y: 100 }, data: { label: 'Shipment Status Changed', type: 'trigger', description: 'When tracking updates' } },
      { id: 'c1', type: 'customNode', position: { x: 400, y: 250 }, data: { label: 'Is Delivered?', type: 'condition', description: 'Check status equals delivered' } },
      { id: 'a1', type: 'customNode', position: { x: 200, y: 400 }, data: { label: 'Send SMS', type: 'notification', description: 'Send SMS to customer' } },
      { id: 'a2', type: 'customNode', position: { x: 600, y: 400 }, data: { label: 'Send Email', type: 'notification', description: 'Send summary email' } }
    ],
    edges: [
      { id: 'e1', source: 't1', target: 'c1', type: 'smoothstep', animated: true },
      { id: 'e2', source: 'c1', target: 'a1', type: 'smoothstep', animated: true, label: 'Yes' },
      { id: 'e3', source: 'c1', target: 'a2', type: 'smoothstep', animated: true, label: 'Yes' }
    ]
  }
};

export default function AIWorkflowsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'config' | 'execute'>('execute');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { strokeWidth: 2, stroke: '#94a3b8' } } as any, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setSelectedNode(node);
    setRightPanelTab('config');
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleNodeDelete = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    toast.success('Node deleted');
  }, [selectedNode, setNodes, setEdges]);

  const handleNodeUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!selectedNode) return;
    const { name, value } = e.target;

    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            data: { ...n.data, [name]: value },
          };
        }
        return n;
      })
    );

    setSelectedNode(prev => prev ? {
      ...prev,
      data: { ...prev.data, [name]: value }
    } : null);
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem('workflow-draft', JSON.stringify({ nodes, edges }));
    toast.success('Workflow saved successfully');
  };

  
  const handleLoadTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey];
    setNodes(template.nodes as any[]);
    setEdges(template.edges as any[]);
    toast.success('Template loaded: ' + templateKey);
  };

  const handleLoad = () => {
    try {
      const saved = localStorage.getItem('workflow-draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNodes(parsed.nodes || []);
        setEdges(parsed.edges || []);
        toast.success('Workflow loaded');
      } else {
        toast.info('No saved workflow found');
      }
    } catch (e) {
      toast.error('Failed to load workflow');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">AI Workflow Builder</h1>
          <p className="text-xs text-gray-500">Design and automate AI-powered operations</p>
        </div>
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2 mr-4 border-r border-gray-200 pr-4">
            <span className="text-xs text-gray-500 font-medium mr-2">Templates:</span>
            <button onClick={() => handleLoadTemplate('auto-reply')} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded">Auto-Reply</button>
            <button onClick={() => handleLoadTemplate('escalation')} className="px-2 py-1 text-xs bg-orange-50 text-orange-600 hover:bg-orange-100 rounded">Escalation</button>
            <button onClick={() => handleLoadTemplate('notification')} className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded">Notification</button>
          </div>

          <button
            onClick={handleLoad}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FolderOpen className="w-4 h-4" />
            Load
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <NodeLibrary />

        <ReactFlowProvider>
          <div className="flex-1 h-full relative">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              setNodes={setNodes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
            />
          </div>
        </ReactFlowProvider>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shrink-0">
          <div className="flex items-center border-b border-gray-200">
            <button
              onClick={() => setRightPanelTab('config')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 transition-colors",
                rightPanelTab === 'config'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Configuration
            </button>
            <button
              onClick={() => setRightPanelTab('execute')}
              className={cn(
                "flex-1 py-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 transition-colors",
                rightPanelTab === 'execute'
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Activity className="w-4 h-4" />
              Execute
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {rightPanelTab === 'config' ? (
              <div className="h-full overflow-y-auto p-4">
                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-gray-500" />
                        Node Settings
                      </h3>
                      <button
                        onClick={handleNodeDelete}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Node"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Node Type</label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 capitalize">
                          {selectedNode.data.type as string}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          name="label"
                          value={selectedNode.data.label as string}
                          onChange={handleNodeUpdate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={(selectedNode.data.description as string) || ''}
                          onChange={handleNodeUpdate}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                        />
                      </div>

                      {/* Add more config fields based on node type */}
                      {(selectedNode.data.type === 'aiTask' || selectedNode.data.type === 'condition') && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Prompt / Logic</label>
                          <textarea
                            placeholder="Enter instructions..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Settings2 className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">No node selected</p>
                    <p className="text-xs text-gray-400 mt-1">Select a node to configure it</p>
                  </div>
                )}
              </div>
            ) : (
              <WorkflowExecutor nodes={nodes} edges={edges} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
