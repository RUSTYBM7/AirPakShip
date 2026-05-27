import React, { useState } from 'react';
import { FileText, Download, Send, Search, Filter, RefreshCw, Check, Clock, AlertCircle, DollarSign, Truck, Calendar } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: string;
  dueDate: string;
  shipmentId?: string;
}

const InvoicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample invoice data
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      amount: 1250.00,
      status: 'paid',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      shipmentId: 'SHP-12345'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'TechStart Inc',
      customerEmail: 'accounts@techstart.io',
      amount: 3400.00,
      status: 'pending',
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      shipmentId: 'SHP-12346'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerName: 'Global Logistics Ltd',
      customerEmail: 'finance@globallogistics.com',
      amount: 890.00,
      status: 'overdue',
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      shipmentId: 'SHP-12347'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      customerName: 'Fresh Foods Co',
      customerEmail: 'ap@freshfoods.co',
      amount: 2100.00,
      status: 'paid',
      issueDate: '2024-01-25',
      dueDate: '2024-02-25',
      shipmentId: 'SHP-12348'
    },
    {
      id: '5',
      invoiceNumber: 'INV-2024-005',
      customerName: 'MediCare Plus',
      customerEmail: 'billing@medicareplus.com',
      amount: 4750.00,
      status: 'pending',
      issueDate: '2024-01-28',
      dueDate: '2024-02-28',
    },
    {
      id: '6',
      invoiceNumber: 'INV-2024-006',
      customerName: 'Home Electronics',
      customerEmail: 'invoices@home-electronics.net',
      amount: 1675.50,
      status: 'overdue',
      issueDate: '2024-01-08',
      dueDate: '2024-02-08',
      shipmentId: 'SHP-12350'
    }
  ]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleInvoiceSelection = (id: string) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAllInvoices = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <Check size={14} className="text-green-400" />;
      case 'pending':
        return <Clock size={14} className="text-yellow-400" />;
      case 'overdue':
        return <AlertCircle size={14} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Invoices</h1>
        <p className="text-slate-400">Manage billing and payment records</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <Check size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Paid</p>
              <p className="text-xl font-bold text-green-400">${paidAmount.toLocaleString()}</p>
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
              <p className="text-xl font-bold text-yellow-400">${pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Overdue</p>
              <p className="text-xl font-bold text-red-400">${overdueAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {selectedInvoices.length > 0 && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <Send size={16} />
                  Send Reminder ({selectedInvoices.length})
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors">
                  <Check size={16} />
                  Mark as Paid
                </button>
              </>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
              <FileText size={16} />
              Create Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onChange={selectAllInvoices}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600 focus:ring-red-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Invoice #</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Issue Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Shipment</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={() => toggleInvoiceSelection(invoice.id)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-600 focus:ring-red-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{invoice.invoiceNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{invoice.customerName}</p>
                    <p className="text-sm text-slate-400">{invoice.customerEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-white">${invoice.amount.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusBadge(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{invoice.issueDate}</td>
                <td className="px-4 py-3 text-slate-400">{invoice.dueDate}</td>
                <td className="px-4 py-3">
                  {invoice.shipmentId ? (
                    <span className="text-blue-400">{invoice.shipmentId}</span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:bg-slate-600 rounded transition-colors" title="View">
                      <FileText size={16} className="text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded transition-colors" title="Download">
                      <Download size={16} className="text-slate-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-600 rounded transition-colors" title="Send">
                      <Send size={16} className="text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
