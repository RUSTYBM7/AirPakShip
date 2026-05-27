import React, { useState, useRef } from 'react';
import { Palette, Layers, Settings, Wand2, Type, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { TemplateLibrary, Template } from '../../features/ai-creative/TemplateLibrary';
import { CanvasEditor } from '../../features/ai-creative/CanvasEditor';
import { DesignExporter } from '../../features/ai-creative/DesignExporter';

export type ElementType = 'text' | 'image' | 'shape';
export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  shapeType?: 'rectangle' | 'circle' | 'line';
  zIndex: number;
}

export default function AICreativePage() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedElement = elements.find(e => e.id === selectedId);

  const handleSelectTemplate = (template: Template) => {
    setCanvasSize({ width: template.width, height: template.height });
    // deep clone elements to prevent reference issues
    setElements(JSON.parse(JSON.stringify(template.elements)));
    setSelectedId(null);
  };

  const handleAddElement = (partial: Partial<CanvasElement>) => {
    const newEl: CanvasElement = {
      id: `el_${Date.now()}`,
      type: 'shape',
      x: canvasSize.width / 2 - (partial.width || 100) / 2,
      y: canvasSize.height / 2 - (partial.height || 100) / 2,
      width: 200,
      height: 200,
      zIndex: elements.length,
      ...partial,
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(els => els.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleDelete = () => {
    if (selectedId) {
      setElements(els => els.filter(e => e.id !== selectedId));
      setSelectedId(null);
    }
  };

  const bringToFront = () => {
    if (!selectedElement) return;
    const maxZ = Math.max(...elements.map(e => e.zIndex), 0);
    updateElement(selectedElement.id, { zIndex: maxZ + 1 });
  };

  const sendToBack = () => {
    if (!selectedElement) return;
    const minZ = Math.min(...elements.map(e => e.zIndex), 0);
    updateElement(selectedElement.id, { zIndex: minZ - 1 });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 shrink-0 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Wand2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">AI Creative Studio</h1>
            <p className="text-xs text-slate-400 mt-1">Design marketing materials with AI assistance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            {canvasSize.width} × {canvasSize.height} px
          </div>
          <DesignExporter canvasRef={canvasRef} width={canvasSize.width} height={canvasSize.height} />
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Templates & Tools */}
        <aside className="w-80 shrink-0 border-r border-slate-800 z-10 flex flex-col relative bg-slate-900">
          <TemplateLibrary
            onSelectTemplate={handleSelectTemplate}
            onAddElement={handleAddElement}
          />
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-slate-800/80 backdrop-blur px-6 py-4 rounded-2xl border border-slate-700 text-center">
                <Wand2 className="w-8 h-8 text-blue-400 mx-auto mb-3 opacity-50" />
                <p className="text-slate-300 font-medium">Select a template to start</p>
                <p className="text-slate-500 text-sm mt-1">or add elements from the left panel</p>
              </div>
            </div>
          )}

          <CanvasEditor
            innerRef={canvasRef}
            elements={elements}
            width={canvasSize.width}
            height={canvasSize.height}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={updateElement}
          />
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 shrink-0 border-l border-slate-800 bg-slate-900 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400" /> Properties
            </h3>
          </div>

          {selectedElement ? (
            <div className="p-4 flex flex-col gap-6">

              {/* Type specific properties */}
              {selectedElement.type === 'text' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                      <Type className="w-3 h-3" /> Text Content
                    </label>
                    <textarea
                      value={selectedElement.content || ''}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">Font Size</label>
                    <input
                      type="number"
                      value={selectedElement.fontSize || 16}
                      onChange={(e) => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(selectedElement.type === 'text' || selectedElement.type === 'shape') && (
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <Palette className="w-3 h-3" /> Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <input
                      type="text"
                      value={selectedElement.color || '#000000'}
                      onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <Layers className="w-3 h-3" /> Dimensions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-500 mb-1 block">Width</span>
                    <input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 mb-1 block">Height</span>
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Layer Actions */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-xs font-semibold text-slate-400 mb-3 block uppercase tracking-wider">Actions</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={bringToFront} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-lg transition-colors border border-slate-700">
                    Bring to Front
                  </button>
                  <button onClick={sendToBack} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-lg transition-colors border border-slate-700">
                    Send to Back
                  </button>
                </div>
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm py-2.5 rounded-lg transition-colors border border-red-500/20 mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Element
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <Layers className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">Select an element on the canvas to edit its properties.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
