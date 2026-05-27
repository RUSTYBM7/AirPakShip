import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Download, Send, Bot, FileText, Save, Wand2, Calendar as CalendarIcon, User } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { InvoiceTemplates } from '../../features/ai-invoices/InvoiceTemplates';
import { InvoiceCalculator } from '../../features/ai-invoices/InvoiceCalculator';
import { generateInvoicePdf, Client, LineItem, InvoiceData } from '../../features/ai-invoices/InvoiceGenerator';

const INVOICE_TYPES = ['Standard Invoice', 'Proforma Invoice', 'Commercial Invoice', 'Credit Note', 'Debit Note'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY'];

// Mock saved clients
const SAVED_CLIENTS: Client[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', address: '123 Tech Park, Silicon Valley, CA', company: 'TechCorp' },
  { id: '2', name: 'Jane Smith', email: 'jane@logistics.com', address: '456 Freight St, Berlin, DE', company: 'Global Logistics' },
];

export default function AIInvoicesPage() {
  const [invoice, setInvoice] = useState<Partial<InvoiceData>>({
    id: uuidv4(),
    type: 'Standard Invoice',
    number: `INV-${Math.floor(Math.random() * 10000)}`,
    date: new Date(),
    dueDate: addDays(new Date(), 30),
    client: null,
    items: [],
    currency: 'USD',
    discount: 0,
    notes: 'Thank you for your business.',
    terms: 'Payment is due within 30 days.',
    template: 'Standard'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Totals Calculation
  const totals = useMemo(() => {
    const subtotal = (invoice.items || []).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = (invoice.items || []).reduce((sum, item) => sum + ((item.quantity * item.unitPrice) * (item.taxRate / 100)), 0);
    return {
      subtotal,
      taxTotal,
      discountTotal: invoice.discount || 0,
      total: subtotal + taxTotal
    };
  }, [invoice.items, invoice.discount]);

  // Update invoice total when items change
  useEffect(() => {
    setInvoice(prev => ({
      ...prev,
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      total: totals.total
    }));
  }, [totals]);

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      total: 0
    };
    setInvoice(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: (prev.items || []).map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.total = updated.quantity * updated.unitPrice;
          return updated;
        }
        return item;
      })
    }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: (prev.items || []).filter(item => item.id !== id)
    }));
  };

  const generateAILineItem = async () => {
    setIsGenerating(true);
    // Simulate AI delay
    await new Promise(r => setTimeout(r, 1000));

    const aiItem: LineItem = {
      id: uuidv4(),
      description: 'AI Suggested: Express International Freight (Zone A)',
      quantity: 1,
      unitPrice: 450.00,
      taxRate: 10,
      total: 450.00
    };

    setInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), aiItem]
    }));
    setIsGenerating(false);
  };

  const downloadPDF = () => {
    const doc = generateInvoicePdf(invoice as InvoiceData);
    doc.save(`${invoice.number}.pdf`);
  };

  const sendEmail = () => {
    // Mock email sending
    alert(`Invoice ${invoice.number} sent to ${invoice.client?.email || 'client'}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bot className="text-blue-400 w-8 h-8" />
              AI Invoice Creator
            </h1>
            <p className="text-slate-400 mt-2">Create, manage, and automate your AirPak Express invoices.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={sendEmail} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20">
              <Send className="w-4 h-4" /> Send Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-xl space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Invoice Type</label>
                  <select
                    value={invoice.type}
                    onChange={e => setInvoice({ ...invoice, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {INVOICE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Invoice Number</label>
                  <div className="flex">
                    <span className="bg-slate-700 border-y border-l border-slate-600 rounded-l-lg px-3 py-2 text-slate-300">#</span>
                    <input
                      type="text"
                      value={invoice.number}
                      onChange={e => setInvoice({ ...invoice, number: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-r-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Currency</label>
                  <select
                    value={invoice.currency}
                    onChange={e => setInvoice({ ...invoice, currency: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Client</label>
                  <select
                    value={invoice.client?.id || ''}
                    onChange={e => {
                      const client = SAVED_CLIENTS.find(c => c.id === e.target.value);
                      setInvoice({ ...invoice, client: client || null });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select a client...</option>
                    {SAVED_CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Line Items Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" /> Line Items
                </h3>
                <button
                  onClick={generateAILineItem}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 rounded-lg border border-blue-800/50 transition-colors text-sm"
                >
                  <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Suggesting...' : 'AI Suggest'}
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {(invoice.items || []).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-12 gap-4 items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700/50"
                    >
                      <div className="col-span-12 md:col-span-5 space-y-1">
                        <label className="text-xs text-slate-500 md:hidden">Description</label>
                        <input
                          type="text" placeholder="Description" value={item.description}
                          onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <label className="text-xs text-slate-500 md:hidden">Qty</label>
                        <input
                          type="number" min="1" value={item.quantity}
                          onChange={e => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="col-span-4 md:col-span-2 space-y-1">
                        <label className="text-xs text-slate-500 md:hidden">Price</label>
                        <input
                          type="number" value={item.unitPrice}
                          onChange={e => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="col-span-3 md:col-span-2 space-y-1">
                        <label className="text-xs text-slate-500 md:hidden">Tax %</label>
                        <input
                          type="number" value={item.taxRate}
                          onChange={e => handleUpdateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <button
                onClick={handleAddItem}
                className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-300 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" /> Add Line Item
              </button>
            </motion.div>

            {/* Templates Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-xl"
            >
              <InvoiceTemplates
                selectedTemplate={invoice.template || 'Standard'}
                onSelect={(t) => setInvoice({ ...invoice, template: t })}
              />
            </motion.div>

          </div>

          {/* Sidebar / Preview / Totals */}
          <div className="space-y-6">
            <InvoiceCalculator
              totals={totals}
              currency={invoice.currency || 'USD'}
              discount={invoice.discount}
              onDiscountChange={(val) => setInvoice({ ...invoice, discount: val })}
            />

            {/* Live Preview Minimap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-xl space-y-4 sticky top-24"
            >
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Live Preview</h3>

              <div className={`
                w-full aspect-[1/1.4] bg-white rounded-lg p-4 shadow-xl overflow-hidden relative text-slate-800 text-[8px] leading-tight
                ${invoice.template === 'Branded' ? 'border-t-4 border-blue-800' : ''}
              `}>
                {/* Simulated PDF Preview */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-[10px] text-blue-900">AirPak Express</div>
                    <div>123 Logistics Way</div>
                    <div>Global Hub, NY</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[12px] uppercase">{invoice.type}</div>
                    <div>#{invoice.number}</div>
                    <div>{invoice.date ? format(invoice.date, 'MM/dd/yyyy') : ''}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-bold">Bill To:</div>
                  <div>{invoice.client?.company || invoice.client?.name || 'No Client Selected'}</div>
                  <div className="w-1/2">{invoice.client?.address}</div>
                </div>

                <div className="w-full border-t border-b border-slate-300 py-1 flex mb-2 font-bold">
                  <div className="flex-1">Description</div>
                  <div className="w-8 text-right">Qty</div>
                  <div className="w-12 text-right">Price</div>
                  <div className="w-12 text-right">Total</div>
                </div>

                {(invoice.items || []).slice(0, 3).map((item, i) => (
                  <div key={i} className="flex mb-1">
                    <div className="flex-1 truncate pr-2">{item.description || 'Item'}</div>
                    <div className="w-8 text-right">{item.quantity}</div>
                    <div className="w-12 text-right">{item.unitPrice}</div>
                    <div className="w-12 text-right">{item.total}</div>
                  </div>
                ))}
                {(invoice.items?.length || 0) > 3 && (
                  <div className="text-slate-400 italic mt-1">...and {(invoice.items?.length || 0) - 3} more items</div>
                )}

                <div className="absolute bottom-4 right-4 text-right">
                  <div className="flex gap-4 justify-end">
                    <span>Subtotal:</span>
                    <span>{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <span>Tax:</span>
                    <span>{totals.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4 justify-end font-bold text-[10px] mt-1 pt-1 border-t border-slate-300">
                    <span>Total:</span>
                    <span>{(totals.total - (invoice.discount || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
