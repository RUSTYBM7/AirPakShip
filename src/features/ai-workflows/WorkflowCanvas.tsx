import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  MiniMap,
  Background,
  Connection,
  Edge,
  Node,
  NodeTypes,
  Handle,
  Position,
  NodeProps,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ReactFlowInstance
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { NODE_TYPES_CONFIG, NodeType, WorkflowNodeData, AppNode, nodeTypesList } from './workflow.config';
import { cn } from '@/lib/utils';
import { Settings2 } from 'lucide-react';

const CustomNode = ({ data, selected }: NodeProps<AppNode>) => {
  const config = NODE_TYPES_CONFIG[data.type] || NODE_TYPES_CONFIG.action;
  const nodeDef = nodeTypesList.find(n => n.type === data.type);
  const Icon = nodeDef?.icon || Settings2;

  return (
    <div className={cn(
      "relative bg-white rounded-xl border-2 min-w-[220px] shadow-sm transition-all",
      config.borderColor,
      selected ? "ring-2 ring-primary ring-offset-2 shadow-md" : "hover:shadow-md"
    )}>
      {data.type !== 'trigger' && (
        <Handle type="target" position={Position.Top} className={cn("w-3 h-3 border-2 bg-white", config.borderColor)} />
      )}

      <div className="p-4 flex items-start gap-3">
        <div className={cn("p-2.5 rounded-lg border", config.bgColor, config.borderColor, config.iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">{data.label}</div>
          <div className="text-xs text-gray-500 mt-1 max-w-[160px] truncate">
            {data.description || nodeDef?.description}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={cn("w-3 h-3 border-2 bg-white", config.borderColor)} />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

interface WorkflowCanvasProps {
  nodes: AppNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: React.Dispatch<React.SetStateAction<AppNode[]>>;
  onNodeClick?: (event: React.MouseEvent, node: AppNode) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setNodes,
  onNodeClick,
  onPaneClick
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<AppNode, Edge> | null>(null);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow/type') as NodeType;
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (!type || !label) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: AppNode = {
        id: `${type}-${uuidv4()}`,
        type: 'customNode',
        position,
        data: { label, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="flex-1 h-full w-full relative bg-gray-50/30" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-dot-pattern"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 2, stroke: '#94a3b8' }
        }}
      >
        <Background color="#cbd5e1" gap={20} size={2} />
        <Controls className="bg-white border border-gray-200 shadow-sm rounded-lg" />
        <MiniMap
          className="border border-gray-200 shadow-sm rounded-lg overflow-hidden"
          nodeColor={(node) => {
            const type = (node.data as any)?.type as NodeType;
            if (type === 'trigger') return '#3b82f6';
            if (type === 'action') return '#22c55e';
            if (type === 'aiTask') return '#a855f7';
            if (type === 'condition') return '#eab308';
            return '#94a3b8';
          }}
          maskColor="rgba(248, 250, 252, 0.7)"
        />
      </ReactFlow>
    </div>
  );
}
