import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, LayoutTemplate, Type, Square, Circle, Wand2 } from 'lucide-react';
import { CanvasElement } from '../../pages/ai-features/AICreativePage';

export interface Template {
  id: string;
  name: string;
  type: 'Poster' | 'Social' | 'Banner' | 'Email';
  width: number;
  height: number;
  elements: CanvasElement[];
  thumbnail?: string;
}

const TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Instagram Promo',
    type: 'Social',
    width: 1080,
    height: 1080,
    elements: [
      { id: 'e1', type: 'shape', shapeType: 'rectangle', x: 0, y: 0, width: 1080, height: 1080, color: '#1e293b', zIndex: 0 },
      { id: 'e2', type: 'text', x: 100, y: 200, width: 800, height: 200, content: 'BIG SALE', color: '#38bdf8', fontSize: 120, fontFamily: 'sans-serif', zIndex: 1 },
      { id: 'e3', type: 'text', x: 100, y: 400, width: 800, height: 100, content: '50% OFF on all shipping', color: '#ffffff', fontSize: 60, fontFamily: 'sans-serif', zIndex: 1 },
      { id: 'e4', type: 'text', x: 100, y: 800, width: 800, height: 50, content: 'AirPak Express', color: '#94a3b8', fontSize: 40, fontFamily: 'sans-serif', zIndex: 1 },
    ],
  },
  {
    id: 't2',
    name: 'Logistics Banner',
    type: 'Banner',
    width: 1200,
    height: 400,
    elements: [
      { id: 'e1', type: 'shape', shapeType: 'rectangle', x: 0, y: 0, width: 1200, height: 400, color: '#0f172a', zIndex: 0 },
      { id: 'e2', type: 'text', x: 50, y: 100, width: 600, height: 100, content: 'Fast & Reliable', color: '#ffffff', fontSize: 80, fontFamily: 'sans-serif', zIndex: 1 },
      { id: 'e3', type: 'text', x: 50, y: 250, width: 600, height: 50, content: 'Global coverage with local expertise.', color: '#cbd5e1', fontSize: 30, fontFamily: 'sans-serif', zIndex: 1 },
    ],
  },
  {
    id: 't3',
    name: 'A4 Marketing Poster',
    type: 'Poster',
    width: 794, // A4 approx
    height: 1123,
    elements: [
      { id: 'e1', type: 'shape', shapeType: 'rectangle', x: 0, y: 0, width: 794, height: 1123, color: '#ffffff', zIndex: 0 },
      { id: 'e2', type: 'shape', shapeType: 'circle', x: 594, y: -100, width: 400, height: 400, color: '#bfdbfe', zIndex: 1 },
      { id: 'e3', type: 'text', x: 50, y: 150, width: 600, height: 150, content: 'Join AirPak', color: '#0369a1', fontSize: 80, fontFamily: 'sans-serif', zIndex: 2 },
      { id: 'e4', type: 'text', x: 50, y: 350, width: 600, height: 200, content: 'Next generation logistics tailored for your business needs.', color: '#334155', fontSize: 30, fontFamily: 'sans-serif', zIndex: 2 },
    ]
  }
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onAddElement: (element: Partial<CanvasElement>) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate, onAddElement }) => {
  const handleAutoBrand = () => {
    onAddElement({
      type: 'text',
      content: 'AirPak Express',
      color: '#0ea5e9',
      fontSize: 24,
      fontFamily: 'sans-serif',
      width: 250,
      height: 40
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
      <h3 className="text-xl font-bold text-white mb-6">Tools & Templates</h3>

      <div className="mb-6">
        <button
          onClick={handleAutoBrand}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Wand2 className="w-4 h-4" />
          Auto-Inject Brand
        </button>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Add Elements</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddElement({ type: 'text', content: 'Double click to edit', fontSize: 40, color: '#ffffff' })}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-slate-300"
          >
            <Type className="w-5 h-5 mb-2" />
            <span className="text-xs">Text</span>
          </button>
          <button
            onClick={() => {
              // Add a generic shape
              onAddElement({ type: 'shape', shapeType: 'rectangle', color: '#38bdf8', width: 200, height: 200 });
            }}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-slate-300"
          >
            <Square className="w-5 h-5 mb-2" />
            <span className="text-xs">Rectangle</span>
          </button>
          <button
            onClick={() => {
              onAddElement({ type: 'shape', shapeType: 'circle', color: '#f472b6', width: 200, height: 200 });
            }}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-slate-300"
          >
            <Circle className="w-5 h-5 mb-2" />
            <span className="text-xs">Circle</span>
          </button>
          <button
            onClick={() => {
              // In a real app, this would open a file picker. For now we just add a placeholder.
              onAddElement({ type: 'image', src: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=600&auto=format&fit=crop', width: 400, height: 300 });
            }}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors text-slate-300"
          >
            <ImageIcon className="w-5 h-5 mb-2" />
            <span className="text-xs">Image</span>
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Templates</h4>
        <div className="flex flex-col gap-3">
          {TEMPLATES.map((tpl) => (
            <motion.div
              key={tpl.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTemplate(tpl)}
              className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-200">{tpl.name}</h5>
                  <p className="text-xs text-slate-500">{tpl.type} • {tpl.width}x{tpl.height}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
