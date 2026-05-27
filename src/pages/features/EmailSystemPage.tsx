/**
 * AirPak Express - Email System Page
 */

import React, { useState } from 'react';
import { Search, Send, Mail, Inbox, SendHorizontal, Clock, FileText, Plus, Trash2, Edit, Eye, Settings } from 'lucide-react';

interface Email {
  id: string;
  to: string;
  subject: string;
  preview: string;
  status: 'sent' | 'delivered' | 'failed' | 'scheduled';
  sentAt: string;
  category: string;
}

const EMAILS_DATA: Email[] = [
  { id: '1', to: 'customer@company.com', subject: 'Shipment Update - APX123456789', preview: 'Your shipment has been dispatched...', status: 'delivered', sentAt: '2026-05-26 06:00', category: 'shipment' },
  { id: '2', to: 'admin@airpak-express.site', subject: 'Invoice Generated - #INV-2026-0042', preview: 'Your invoice is now available...', status: 'sent', sentAt: '2026-05-26 05:30', category: 'invoice' },
  { id: '3', to: 'newuser@example.com', subject: 'Welcome to AirPak Express', preview: 'Thank you for joining...', status: 'delivered', sentAt: '2026-05-26 04:00', category: 'welcome' },
  { id: '4', to: 'batch@customers.com', subject: 'Holiday Shipping Notice', preview: 'Please note our holiday schedule...', status: 'scheduled', sentAt: '2026-05-28 09:00', category: 'notification' },
];

const TEMPLATES = [
  { id: 'shipment_created', name: 'Shipment Created', category: 'Shipment' },
  { id: 'shipment_delivered', name: 'Delivery Confirmation', category: 'Shipment' },
  { id: 'invoice_sent', name: 'Invoice Notification', category: 'Invoice' },
  { id: 'welcome', name: 'Welcome Email', category: 'Onboarding' },
];

const EmailSystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'scheduled' | 'drafts' | 'templates'>('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  const handleSend = () => {
    if (!composeData.to || !composeData.subject) return;
    alert('Email sent successfully!');
    setShowCompose(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col">
        <div className="p-4">
          <button onClick={() => setShowCompose(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium">
            <Plus className="w-5 h-5" />Compose
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox, count: 3 },
            { id: 'sent', label: 'Sent', icon: SendHorizontal, count: 2 },
            { id: 'scheduled', label: 'Scheduled', icon: Clock, count: 1 },
            { id: 'drafts', label: 'Drafts', icon: FileText, count: 0 },
            { id: 'templates', label: 'Templates', icon: Mail, count: 4 },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 ${activeTab === tab.id ? 'bg-red-600/20 text-red-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
              <tab.icon className="w-5 h-5" /><span className="flex-1 text-left">{tab.label}</span>
              {tab.count > 0 && <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">{tab.count}</span>}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg">
            <Settings className="w-4 h-4" />SMTP Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white capitalize">{activeTab}</h2>
          <Search className="w-5 h-5 text-slate-500" />
        </div>

        {activeTab === 'templates' ? (
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Email Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <button key={template.id} onClick={() => { setComposeData({ ...composeData, subject: template.name }); setActiveTab('drafts'); }} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-left hover:border-red-500/50">
                  <p className="text-white font-medium">{template.name}</p>
                  <p className="text-slate-400 text-sm">{template.category}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
            {EMAILS_DATA.filter(e => activeTab === 'sent' ? e.status === 'sent' || e.status === 'delivered' : activeTab === 'scheduled' ? e.status === 'scheduled' : true).map((email) => (
              <button key={email.id} className="w-full p-4 text-left hover:bg-slate-800/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">{email.to}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${email.status === 'delivered' ? 'bg-green-500/20 text-green-400' : email.status === 'failed' ? 'bg-red-500/20 text-red-400' : email.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>{email.status}</span>
                </div>
                <p className="text-white text-sm mb-1">{email.subject}</p>
                <p className="text-slate-400 text-sm truncate">{email.preview}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-700 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">New Email</h3>
              <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div><label className="block text-sm text-slate-400 mb-1">To</label><input type="email" value={composeData.to} onChange={(e) => setComposeData({ ...composeData, to: e.target.value })} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="recipient@example.com" /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Subject</label><input type="text" value={composeData.subject} onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Email subject" /></div>
              <div><label className="block text-sm text-slate-400 mb-1">Body</label><textarea value={composeData.body} onChange={(e) => setComposeData({ ...composeData, body: e.target.value })} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white min-h-[200px]" placeholder="Write your email..." /></div>
            </div>
            <div className="p-4 border-t border-slate-800 flex gap-3">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg">Cancel</button>
              <button onClick={handleSend} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"><Send className="w-4 h-4" />Send Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailSystemPage;