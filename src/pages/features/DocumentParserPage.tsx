import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Settings,
  Download,
  Clock,
  FileJson,
  FileSpreadsheet,
  Trash2,
  RefreshCw,
  Search,
  ScanLine,
  AlignLeft
} from 'lucide-react';

interface ParsedField {
  id: string;
  name: string;
  value: string;
  confidence: number;
}

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  type: string;
}

export default function DocumentParserPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock parsed fields
  const [parsedFields, setParsedFields] = useState<ParsedField[]>([
    { id: '1', name: 'Invoice Number', value: 'INV-2026-0892', confidence: 0.98 },
    { id: '2', name: 'Date', value: '2026-05-25', confidence: 0.95 },
    { id: '3', name: 'Vendor', value: 'Global Logistics Corp', confidence: 0.92 },
    { id: '4', name: 'Total Amount', value: '$4,520.00', confidence: 0.99 },
    { id: '5', name: 'Tax ID', value: 'TX-9938210', confidence: 0.88 },
  ]);

  // Mock history
  const [history] = useState<HistoryItem[]>([
    { id: 'h1', fileName: 'customs_declaration_cn.pdf', date: '2026-05-25 04:30 PM', status: 'Completed', type: 'Customs Form' },
    { id: 'h2', fileName: 'invoice_global_logistics.pdf', date: '2026-05-25 02:15 PM', status: 'Completed', type: 'Invoice' },
    { id: 'h3', fileName: 'waybill_express_eu.jpg', date: '2026-05-24 11:20 AM', status: 'Processing', type: 'Waybill' },
    { id: 'h4', fileName: 'blurred_receipt.png', date: '2026-05-24 09:10 AM', status: 'Failed', type: 'Receipt' },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    simulateParsing();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const simulateParsing = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Failed': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-indigo-400" />
              Document Parser (OCR)
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Extract data from invoices, waybills, and customs declarations using AI
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-sm font-medium transition-colors">
              <Settings className="w-4 h-4 text-slate-400" />
              Parser Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium text-white transition-colors">
              <UploadCloud className="w-4 h-4" />
              Batch Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Upload & Mapping */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upload Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Upload Document
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-slate-700 bg-slate-950 hover:border-slate-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.png,.jpg,.jpeg"
                />

                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-base font-medium text-slate-300 mb-1">
                  Drag & drop your file here
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Supports PDF, PNG, JPG up to 10MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Browse Files
                </button>
              </div>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Extracted Data & Field Mapping */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlignLeft className="w-5 h-5 text-indigo-400" />
                  Data Field Mapping
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors tooltip-trigger group relative">
                    <FileJson className="w-4 h-4" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-slate-200 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Export JSON</span>
                  </button>
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors group relative">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-slate-200 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Export CSV</span>
                  </button>
                </div>
              </div>

              {isParsing ? (
                <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                  <p className="text-indigo-400 font-medium">Extracting data via AI...</p>
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 uppercase pb-2 border-b border-slate-800">
                  <div className="col-span-4">Field Name</div>
                  <div className="col-span-5">Extracted Value</div>
                  <div className="col-span-3 text-right">Confidence</div>
                </div>

                <div className="space-y-3">
                  {parsedFields.map((field) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-center group">
                      <div className="col-span-4">
                        <input
                          type="text"
                          defaultValue={field.name}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          defaultValue={field.value}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${field.confidence > 0.9 ? 'bg-emerald-500' : field.confidence > 0.8 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${field.confidence * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium w-9 text-right ${field.confidence > 0.9 ? 'text-emerald-400' : field.confidence > 0.8 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 w-full py-2 border border-dashed border-slate-700 hover:border-slate-500 rounded-lg text-sm text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center gap-2">
                  <span className="text-lg leading-none">+</span> Add Custom Field
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Discard
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                  Save Record
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Parse History
                </h2>
              </div>

              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-slate-200 truncate pr-2" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{item.type}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View All History →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
