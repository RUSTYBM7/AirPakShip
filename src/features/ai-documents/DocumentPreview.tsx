import React from 'react';
import { DocumentType } from './DocumentGenerator';
import { ShippingLabel, BillOfLading, CustomsForm, PackingList, DocumentData } from './DocumentTemplates';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentPreviewProps {
  type: DocumentType;
  data: DocumentData;
  scale?: number;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ type, data, scale = 0.6 }) => {
  const renderTemplate = () => {
    switch (type) {
      case 'shipping_label':
        return <ShippingLabel data={data} />;
      case 'bill_of_lading':
        return <BillOfLading data={data} />;
      case 'customs_form':
        return <CustomsForm data={data} />;
      case 'packing_list':
        return <PackingList data={data} />;
      case 'delivery_report':
        return <BillOfLading data={data} />; // Fallback
      default:
        return <ShippingLabel data={data} />;
    }
  };

  return (
    <div className="w-full flex justify-center items-center overflow-auto p-4 bg-gray-900 rounded-xl relative shadow-inner">
      <div className="absolute top-4 left-4 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-700">
        Live Preview
      </div>

      {/* Wrapper to scale down the document so it fits the viewport but renders at full resolution for html2canvas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="origin-top my-8"
          style={{ transform: `scale(${scale})` }}
        >
          {/* We add a wrapper id that html2canvas will target */}
          <div id="document-preview-target" className="pointer-events-none select-none drop-shadow-2xl">
            {renderTemplate()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
