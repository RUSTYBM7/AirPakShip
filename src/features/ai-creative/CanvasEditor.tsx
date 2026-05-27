import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CanvasElement } from '../../pages/ai-features/AICreativePage';

interface CanvasEditorProps {
  elements: CanvasElement[];
  width: number;
  height: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, updates: Partial<CanvasElement>) => void;
  innerRef: React.RefObject<HTMLDivElement>;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ elements, width, height, selectedId, onSelect, onChange, innerRef }) => {
  // A ref for the canvas wrapper to calculate scale
  const wrapperRef = useRef<HTMLDivElement>(null);

  // We want the canvas to fit within the container
  // A simple way is to use CSS transform scale based on container size,
  // but for simplicity we'll just center it and let it scroll if too big,
  // or use a fixed scale. Let's do a hardcoded scale or scale to fit.

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-slate-950 p-8 overflow-auto"
      onClick={() => onSelect(null)}
      ref={wrapperRef}
    >
      <div
        ref={innerRef}
        className="relative bg-white shadow-2xl shrink-0 overflow-hidden ring-1 ring-slate-800"
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()} // prevent deselecting when clicking empty canvas space
      >
        {elements.sort((a, b) => a.zIndex - b.zIndex).map((el) => (
          <ElementRenderer
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            onSelect={() => onSelect(el.id)}
            onChange={(updates) => onChange(el.id, updates)}
          />
        ))}
      </div>
    </div>
  );
};

interface ElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<CanvasElement>) => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isSelected, onSelect, onChange }) => {
  const { type, x, y, width, height, content, src, color, fontSize, fontFamily, shapeType, zIndex } = element;

  let inner = null;

  if (type === 'text') {
    inner = (
      <div
        style={{ color, fontSize, fontFamily, width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
        className="break-words whitespace-pre-wrap"
      >
        {content}
      </div>
    );
  } else if (type === 'image') {
    inner = (
      <img src={src} alt="Canvas element" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
    );
  } else if (type === 'shape') {
    inner = (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color,
          borderRadius: shapeType === 'circle' ? '50%' : '0%'
        }}
      />
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        onChange({ x: x + info.offset.x, y: y + info.offset.y });
      }}
      initial={{ x, y }}
      animate={{ x, y }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        position: 'absolute',
        width,
        height,
        zIndex,
        outline: isSelected ? '2px solid #38bdf8' : 'none',
        outlineOffset: isSelected ? '2px' : '0px',
        cursor: 'grab'
      }}
      whileTap={{ cursor: 'grabbing' }}
    >
      {inner}

      {isSelected && (
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white cursor-pointer z-50 flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          {/* Resize handle could go here, for now it's just an indicator */}
        </div>
      )}
    </motion.div>
  );
};
