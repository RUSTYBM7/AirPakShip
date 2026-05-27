import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Send, RefreshCw, ScanText, Sparkles, CheckCircle2, ChevronRight, LayoutTemplate } from 'lucide-react';
import { DocumentPreview } from '../../features/ai-documents/DocumentPreview';
import { DocumentType, DocumentGenerator } from '../../features/ai-documents/DocumentGenerator';
import { DocumentData } from '../../features/ai-documents/DocumentTemplates';
import { brandColors } from '../../lib/brand';

const MOCK_AI_RESPONSES = [
  "Extracted from email thread with John Doe",
  "Analyzed from uploaded invoice #INV-492",
  "Generated via historical shipment patterns",
  "Smart-filled based on recipient address validation"
];

export const AIDocumentsPage = () => {
  const [docType, setDocType] = useState<DocumentType>('shipping_label');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiContext, setAiContext] = useState<string>('');
  const [formData, setFormData] = useState<DocumentData>({
    trackingNumber: 'APX-99882211',
    sender: {
      name: 'AirPak Logistics Hub',
      company: 'AirPak Express',
      address: '123 Cargo Way\nLogistics City, CA 90210\nUSA',
      phone: '+1 (800) 555-0199'
    },
    recipient: {
      name: 'Jane Smith',
      company: 'Tech Solutions Inc',
      address: '456 Innovation Blvd\nSuite 100\nSeattle, WA 90001\nUSA',
      phone: '+1 (206) 555-0144'
    },
    weight: '2.5 kg',
    dimensions: '30x20x15 cm',
    serviceLevel: 'EXPRESS WORLDWIDE',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAiAutoFill = () => {
    setIsAiProcessing(true);
    setAiContext('Scanning context and analyzing intent...');

    setTimeout(() => {
      setAiContext('Extracting entities...');
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          trackingNumber: `APX-${Math.floor(Math.random() * 100000000)}`,
          weight: `${(Math.random() * 10 + 1).toFixed(1)} kg`,
          items: [
            { description: 'Tech Gadgets (Assorted)', quantity: 2, weight: '1.2 kg', value: '$450.00' },
            { description: 'Marketing Materials', quantity: 1, weight: '0.8 kg', value: '$50.00' }
          ],
          totalValue: '$500.00',
          instructions: 'Leave at front desk if no answer. Fragile contents.'
        }));
        setAiContext(MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)]);
        setIsAiProcessing(false);
      }, 1500);
    }, 1000);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await DocumentGenerator.downloadPDF({
        elementId: 'document-preview-target',
        filename: `${docType}_${formData.trackingNumber}.pdf`,
        format: docType === 'shipping_label' ? [105, 148] : 'a4', // A6 for label
        orientation: 'portrait'
      });
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEmail = async () => {
    setIsGenerating(true);
    try {
      // Just simulate email sending
      await new Promise(r => setTimeout(r, 1000));
      alert(`Document emailed successfully to ${formData.recipient?.name}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const docTypes: { id: DocumentType; label: string; icon: any }[] = [
    { id: 'shipping_label', label: 'Shipping Label', icon: LayoutTemplate },
    { id: 'bill_of_lading', label: 'Bill of Lading', icon: FileText },
    { id: 'customs_form', label: 'Customs Form', icon: FileText },
    { id: 'packing_list', label: 'Packing List', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-[#1e293b]/80 backdrop-blur-xl border-r border-slate-700/50 p-6 flex flex-col h-full"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            AI Docs
          </h1>
        </div>

        <div className="space-y-2 flex-grow">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Templates</p>
          {docTypes.map(t => {
            const Icon = t.icon;
            const isActive = docType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setDocType(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(220,20,60,0.1)]'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-400' : 'text-slate-500'}`} />
                <span className="font-medium text-sm">{t.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <ScanText className="w-4 h-4 text-blue-400" />
              AirPak AI Engine
            </h3>
            <p className="text-xs text-slate-500">
              {aiContext || "Ready to assist with document generation."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-[#0F172A] to-[#1e293b]">
        {/* Topbar */}
        <header className="h-20 border-b border-slate-700/50 bg-[#0F172A]/50 backdrop-blur-md flex items-center justify-between px-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{docType.replace(/_/g, ' ')}</h2>
            <p className="text-sm text-slate-400">Configure and preview your document</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAiAutoFill}
              disabled={isAiProcessing}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isAiProcessing ? 'AI Processing...' : 'AI Auto-Fill'}
            </button>
            <button
              onClick={handleEmail}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-medium border border-slate-600 transition-all"
            >
              <Send className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_rgba(220,20,60,0.3)] transition-all"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download PDF
            </button>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Form Editor */}
          <div className="w-[400px] border-r border-slate-700/50 bg-[#1e293b]/30 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-600">
            <div className="space-y-6">

              <motion.div layout className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 shadow-lg">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Shipment Core Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Tracking Number</label>
                    <input
                      type="text"
                      value={formData.trackingNumber}
                      onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Weight</label>
                      <input
                        type="text"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Value</label>
                      <input
                        type="text"
                        value={formData.totalValue || ''}
                        onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div layout className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 shadow-lg">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Sender Details
                </h3>
                <div className="space-y-3">
                  <input
                    type="text" placeholder="Name"
                    value={formData.sender?.name}
                    onChange={(e) => setFormData({...formData, sender: { ...formData.sender!, name: e.target.value }})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text" placeholder="Company"
                    value={formData.sender?.company}
                    onChange={(e) => setFormData({...formData, sender: { ...formData.sender!, company: e.target.value }})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Address" rows={3}
                    value={formData.sender?.address}
                    onChange={(e) => setFormData({...formData, sender: { ...formData.sender!, address: e.target.value }})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </motion.div>

              <motion.div layout className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 shadow-lg">
                <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Recipient Details
                </h3>
                <div className="space-y-3">
                  <input
                    type="text" placeholder="Name"
                    value={formData.recipient?.name}
                    onChange={(e) => setFormData({...formData, recipient: { ...formData.recipient!, name: e.target.value }})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="text" placeholder="Company"
                    value={formData.recipient?.company}
                    onChange={(e) => setFormData({...formData, recipient: { ...formData.recipient!, company: e.target.value }})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-green-500"
                  />
                  <textarea
                    placeholder="Address" rows={3}
                    value={formData.recipient?.address}
                    onChange={(e) => setFormData({...formData, recipient: { ...formData.recipient!, address: e.target.value }})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-green-500 resize-none"
                  />
                </div>
              </motion.div>

            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjMWUyOTNiIj48L2NpcmNsZT4KPC9zdmc+')]">
            <div className="h-full flex items-center justify-center p-8">
               <DocumentPreview type={docType} data={formData} scale={0.7} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
