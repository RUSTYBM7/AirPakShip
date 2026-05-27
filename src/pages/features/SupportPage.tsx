import React, { useState } from 'react';
import { Headphones, MessageCircle, Mail, Phone, Clock, Send, Search, Filter, RefreshCw, CheckCircle, AlertCircle, FileText, Video, Headset, Star } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: 'technical' | 'billing' | 'general' | 'feature-request';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  requesterName: string;
  requesterEmail: string;
  assignedTo?: string;
  createdAt: string;
  lastUpdate: string;
  messages: number;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  lastUpdated: string;
  views: number;
}

const SupportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'knowledge' | 'canned-responses'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Sample ticket data
  const [tickets] = useState<Ticket[]>([
    {
      id: 'TKT-001',
      subject: 'Unable to track shipment SHP-12345',
      category: 'technical',
      status: 'open',
      priority: 'urgent',
      requesterName: 'John Smith',
      requesterEmail: 'john@acme.com',
      assignedTo: 'Support Team',
      createdAt: '2024-01-28 14:30',
      lastUpdate: '2024-01-28 15:45',
      messages: 3
    },
    {
      id: 'TKT-002',
      subject: 'Billing discrepancy for December invoice',
      category: 'billing',
      status: 'pending',
      priority: 'high',
      requesterName: 'Sarah Johnson',
      requesterEmail: 'sarah@techstart.io',
      assignedTo: 'Billing Team',
      createdAt: '2024-01-27 10:15',
      lastUpdate: '2024-01-28 09:00',
      messages: 5
    },
    {
      id: 'TKT-003',
      subject: 'Feature request: Dark mode for dashboard',
      category: 'feature-request',
      status: 'open',
      priority: 'low',
      requesterName: 'Mike Chen',
      requesterEmail: 'mike@freshfoods.co',
      createdAt: '2024-01-26 16:20',
      lastUpdate: '2024-01-26 16:20',
      messages: 1
    },
    {
      id: 'TKT-004',
      subject: 'API integration help needed',
      category: 'technical',
      status: 'resolved',
      priority: 'normal',
      requesterName: 'Lisa Park',
      requesterEmail: 'lisa@home-electronics.net',
      assignedTo: 'Tech Support',
      createdAt: '2024-01-25 11:00',
      lastUpdate: '2024-01-27 14:30',
      messages: 8
    },
    {
      id: 'TKT-005',
      subject: 'Account upgrade request',
      category: 'general',
      status: 'closed',
      priority: 'normal',
      requesterName: 'David Lee',
      requesterEmail: 'david@globallogistics.com',
      assignedTo: 'Sales Team',
      createdAt: '2024-01-24 09:45',
      lastUpdate: '2024-01-26 10:00',
      messages: 4
    },
    {
      id: 'TKT-006',
      subject: 'Missing delivery confirmation',
      category: 'technical',
      status: 'open',
      priority: 'high',
      requesterName: 'Emily Davis',
      requesterEmail: 'emily@medicareplus.com',
      assignedTo: 'Support Team',
      createdAt: '2024-01-28 08:00',
      lastUpdate: '2024-01-28 11:30',
      messages: 2
    }
  ]);

  // Knowledge base articles
  const [articles] = useState<KnowledgeArticle[]>([
    { id: '1', title: 'Getting Started with AirPak', category: 'Onboarding', lastUpdated: '2024-01-20', views: 1250 },
    { id: '2', title: 'API Documentation Guide', category: 'Developers', lastUpdated: '2024-01-22', views: 890 },
    { id: '3', title: 'Understanding Shipping Rates', category: 'Billing', lastUpdated: '2024-01-18', views: 654 },
    { id: '4', title: 'Troubleshooting Delivery Issues', category: 'Technical', lastUpdated: '2024-01-25', views: 432 },
    { id: '5', title: 'Account Security Best Practices', category: 'Security', lastUpdated: '2024-01-15', views: 356 },
    { id: '6', title: 'Integration with E-commerce Platforms', category: 'Developers', lastUpdated: '2024-01-24', views: 289 }
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      case 'normal':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'low':
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'closed':
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <Headset size={14} className="text-blue-400" />;
      case 'billing':
        return <FileText size={14} className="text-green-400" />;
      case 'general':
        return <MessageCircle size={14} className="text-purple-400" />;
      case 'feature-request':
        return <Star size={14} className="text-yellow-400" />;
      default:
        return <MessageCircle size={14} className="text-slate-400" />;
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const resolvedToday = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Support Center</h1>
        <p className="text-slate-400">Manage tickets, knowledge base, and customer communications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Open Tickets</p>
              <p className="text-xl font-bold text-red-400">{openTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Pending</p>
              <p className="text-xl font-bold text-yellow-400">{pendingTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Resolved Today / All Time</p>
              <p className="text-xl font-bold text-green-400">{resolvedToday} / {tickets.filter(t => t.status === 'resolved').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Headphones size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Response Time</p>
              <p className="text-xl font-bold text-white">2.5h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tickets'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <Headphones size={18} />
          Support Tickets
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'knowledge'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <FileText size={18} />
          Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab('canned-responses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'canned-responses'
              ? 'bg-red-600 text-white'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <MessageCircle size={18} />
          Canned Responses
        </button>
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <>
          {/* Actions Bar */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-red-500/50"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-red-500/50"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-red-500/50"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                  <Phone size={16} />
                  New Ticket
                </button>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="divide-y divide-slate-700/50">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-slate-700/20 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(ticket.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 font-mono">{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityBadge(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h3 className="font-medium text-white mb-1">{ticket.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{ticket.requesterName}</span>
                        <span>{ticket.requesterEmail}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {ticket.lastUpdate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">{ticket.messages} messages</p>
                        {ticket.assignedTo && (
                          <p className="text-xs text-slate-500">Assigned: {ticket.assignedTo}</p>
                        )}
                      </div>
                      <button className="p-2 hover:bg-slate-600 rounded-lg transition-colors">
                        <MessageCircle size={18} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <div className="p-12 text-center">
                <Headphones size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No tickets found</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search knowledge base..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-red-500/50"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                <FileText size={16} />
                New Article
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{article.title}</h3>
                    <span className="text-xs text-blue-400 bg-blue-600/20 px-2 py-0.5 rounded mt-1 inline-block">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{article.views} views</span>
                  <span>Updated {article.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Canned Responses Tab */}
      {activeTab === 'canned-responses' && (
        <>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-slate-400">Create reusable response templates for faster ticket resolution</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                <MessageCircle size={16} />
                New Response
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Initial Acknowledgment</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <FileText size={16} className="text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Headset size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Thank you for contacting AirPak Support. We have received your ticket and are working to resolve your issue. You can expect a response within 24 hours.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Issue Escalated</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <FileText size={16} className="text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Headset size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Your issue has been escalated to our specialized team. They will review your case and contact you with a solution within 4-6 business hours.</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Issue Resolved</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <FileText size={16} className="text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Headset size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Great news! Your issue has been resolved. If you have any further questions or concerns, please don't hesitate to reach out. Thank you for choosing AirPak!</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Tracking Information Update</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <FileText size={16} className="text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Headset size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm">Your shipment status has been updated in our system. You can track your package in real-time using your tracking number at our tracking page or through our mobile app.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SupportPage;
