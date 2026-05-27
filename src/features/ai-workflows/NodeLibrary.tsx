import React from 'react';
import { GripVertical } from 'lucide-react';
import { NodeType, NODE_TYPES_CONFIG, nodeTypesList } from './workflow.config';
import { cn } from '@/lib/utils';

export function NodeLibrary() {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType, label: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-72 bg-gray-50/50 border-r border-gray-200 h-full flex flex-col p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">Node Library</h2>
        <p className="text-xs text-gray-500">Drag nodes to build workflow</p>
      </div>

      <div className="space-y-3">
        {nodeTypesList.map((node) => {
          const config = NODE_TYPES_CONFIG[node.type];
          const Icon = node.icon;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type, node.label)}
              className={cn(
                "p-3 rounded-xl border border-gray-200 cursor-grab hover:shadow-sm transition-all group flex items-start gap-3 bg-white",
                "hover:border-primary/50"
              )}
            >
              <div className={cn("p-2 rounded-lg border", config.bgColor, config.borderColor, config.iconColor)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                <div className="text-sm font-medium text-gray-900 truncate flex items-center justify-between">
                  {node.label}
                  <GripVertical className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{node.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
