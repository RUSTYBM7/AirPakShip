import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

interface DesignExporterProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  width: number;
  height: number;
}

export const DesignExporter: React.FC<DesignExporterProps> = ({ canvasRef, width, height }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setIsOpen(false);

    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // higher res
        useCORS: true,
        backgroundColor: null,
      });

      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        // Orientation depends on width vs height
        const orientation = width > height ? 'l' : 'p';
        const pdf = new jsPDF(orientation, 'px', [width, height]);
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        pdf.save('airpak-design.pdf');
      } else {
        const imgData = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `airpak-design.${format}`;
        link.click();
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export design. Ensure all images have CORS enabled.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Export
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2 flex flex-col gap-1">
                <button onClick={() => handleExport('png')} className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">
                  Export as PNG
                </button>
                <button onClick={() => handleExport('jpg')} className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">
                  Export as JPG
                </button>
                <div className="h-px bg-slate-700 my-1" />
                <button onClick={() => handleExport('pdf')} className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">
                  Export as PDF
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
