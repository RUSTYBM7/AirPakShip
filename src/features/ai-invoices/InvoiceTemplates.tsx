import React from 'react';
import { motion } from 'framer-motion';

interface InvoiceTemplatesProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

const templates = [
  {
    id: 'Standard',
    name: 'Standard Layout',
    description: 'Clean, professional design for standard billing',
    preview: 'bg-white border-slate-200'
  },
  {
    id: 'Modern',
    name: 'Modern Minimalist',
    description: 'Sleek edge-to-grid layout with minimalist typography',
    preview: 'bg-slate-50 border-slate-300'
  },
  {
    id: 'Branded',
    name: 'AirPak Pro',
    description: 'Full brand integration with AirPak navy styling',
    preview: 'bg-blue-50 border-blue-200'
  }
];

export function InvoiceTemplates({ selectedTemplate, onSelect }: InvoiceTemplatesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-100">Select Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={`
              flex flex-col items-start p-4 rounded-xl border text-left transition-all
              ${selectedTemplate === template.id
                ? 'border-blue-500 bg-slate-800 ring-1 ring-blue-500 shadow-lg shadow-blue-500/20'
                : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
              }
            `}
          >
            <div className={`w-full h-24 rounded-md mb-4 border ${template.preview} flex items-center justify-center`}>
              <span className="text-xs text-slate-500">Preview</span>
            </div>
            <h4 className="font-medium text-slate-100">{template.name}</h4>
            <p className="text-xs text-slate-400 mt-1">{template.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
