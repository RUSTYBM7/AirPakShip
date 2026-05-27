import { Edge, Node } from '@xyflow/react';
import React from 'react';
import {
  Play,
  Settings,
  GitBranch,
  BrainCircuit,
  Globe,
  Bell,
  Database,
} from 'lucide-react';

export type NodeType = 'trigger' | 'action' | 'condition' | 'aiTask' | 'webhook' | 'notification' | 'database';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  description?: string;
  config?: Record<string, any>;
  icon?: string;
}

export type AppNode = Node<WorkflowNodeData, 'customNode'>;

export const NODE_TYPES_CONFIG: Record<NodeType, { bgColor: string; borderColor: string; iconColor: string }> = {
  trigger: { bgColor: 'bg-blue-50', borderColor: 'border-blue-500', iconColor: 'text-blue-600' },
  action: { bgColor: 'bg-green-50', borderColor: 'border-green-500', iconColor: 'text-green-600' },
  condition: { bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', iconColor: 'text-yellow-600' },
  aiTask: { bgColor: 'bg-purple-50', borderColor: 'border-purple-500', iconColor: 'text-purple-600' },
  webhook: { bgColor: 'bg-orange-50', borderColor: 'border-orange-500', iconColor: 'text-orange-600' },
  notification: { bgColor: 'bg-pink-50', borderColor: 'border-pink-500', iconColor: 'text-pink-600' },
  database: { bgColor: 'bg-teal-50', borderColor: 'border-teal-500', iconColor: 'text-teal-600' },
};

export const nodeTypesList: { type: NodeType; label: string; description: string; icon: React.ElementType }[] = [
  { type: 'trigger', label: 'Trigger', description: 'Start workflow on event', icon: Play },
  { type: 'action', label: 'Action', description: 'Perform an action', icon: Settings },
  { type: 'condition', label: 'Condition', description: 'If/Else logic', icon: GitBranch },
  { type: 'aiTask', label: 'AI Task', description: 'AI processing task', icon: BrainCircuit },
  { type: 'webhook', label: 'Webhook', description: 'Call external API', icon: Globe },
  { type: 'notification', label: 'Notification', description: 'Send alert/email', icon: Bell },
  { type: 'database', label: 'Database', description: 'Read/Write to DB', icon: Database },
];

export const INITIAL_NODES: AppNode[] = [
  {
    id: 'trigger-1',
    type: 'customNode',
    position: { x: 400, y: 100 },
    data: {
      label: 'On Data Received',
      type: 'trigger',
      description: 'Triggers when a new payload is received.'
    },
  },
];

export const INITIAL_EDGES: Edge[] = [];
