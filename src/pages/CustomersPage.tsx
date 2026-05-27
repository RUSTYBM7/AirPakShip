import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign
} from 'lucide-react';

import { supabase } from '../lib/supabase';

// Mock data
const mockCustomers = [
  { id: 'C001', name: 'John Smith', email: 'john.smith@example.com', phone: '+65 9123 4567', company: 'Smith Enterprises', address: '123 Orchard Road', city: 'Singapore', country: 'Singapore', postal: '238895', totalShipments: 45, totalSpent: 8950.00, lastShipment: '2024-05-25', status: 'active' },
  { id: 'C002', name: 'Sarah Lee', email: 'sarah.lee@example.com', phone: '+60 1234 5678', company: 'Lee Trading Co', address: '456 Bukit Bintang', city: 'Kuala Lumpur', country: 'Malaysia', postal: '55100', totalShipments: 32, totalSpent: 6240.00, lastShipment: '2024-05-24', status: 'active' },
  { id: 'C003', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '+1 555 123 4567', company: 'Chen Logistics', address: '789 Broadway', city: 'New York', country: 'USA', postal: '10012', totalShipments: 28, totalSpent: 11200.00, lastShipment: '2024-05-24', status: 'active' },
  { id: 'C004', name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+44 20 1234 5678', company: 'Wilson & Co', address: '10 Downing Street', city: 'London', country: 'UK', postal: 'SW1A 2AA', totalShipments: 51, totalSpent: 18750.00, lastShipment: '2024-05-23', status: 'active' },
  { id: 'C005', name: 'David Brown', email: 'david.brown@example.com', phone: '+49 30 1234 5678', company: 'Brown Industries', address: '55 Friedrichstrasse', city: 'Berlin', country: 'Germany', postal: '10117', totalShipments: 19, totalSpent: 4200.00, lastShipment: '2024-05-23', status: 'inactive' },
  { id: 'C006', name: 'Lisa Wang', email: 'lisa.wang@example.com', phone: '+852 9876 5432', company: 'Wang Holdings', address: '88 Queensway', city: 'Hong Kong', country: 'Hong Kong', postal: '100010', totalShipments: 67, totalSpent: 24500.00, lastShipment: '2024-05-22', status: 'active' },
];

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>(mockCustomers);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching customers:', error);
          setCustomers(mockCustomers);
          return;
        }

        if (data && data.length > 0) {
          setCustomers(data);
        } else {
          setCustomers(mockCustomers);
        }
      } catch (err) {
        console.error('Error:', err);
        setCustomers(mockCustomers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    try {
      await supabase.from('customers').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: customers.length, active: 0, inactive: 0 };
    customers.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">Manage your customer database</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/customers/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            statusFilter === 'all'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent'
          }`}
        >
          All Customers
          <span className="ml-2 text-xs opacity-70">({statusCounts.all})</span>
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            statusFilter === 'active'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent'
          }`}
        >
          Active
          <span className="ml-2 text-xs opacity-70">({statusCounts.active})</span>
        </button>
        <button
          onClick={() => setStatusFilter('inactive')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            statusFilter === 'inactive'
              ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent'
          }`}
        >
          Inactive
          <span className="ml-2 text-xs opacity-70">({statusCounts.inactive})</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer"
            onClick={() => navigate(`/customers/${customer.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{customer.name}</h3>
                  <p className="text-slate-500 text-sm">{customer.company}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(showActions === customer.id ? null : customer.id);
                  }}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
                {showActions === customer.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowActions(null)} />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customers/${customer.id}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/customers/${customer.id}/edit`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(customer.id)} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm truncate">{customer.city}, {customer.country}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
              <div>
                <p className="text-slate-500 text-xs">Total Shipments</p>
                <div className="flex items-center gap-1 mt-1">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">{customer.totalShipments}</span>
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Total Spent</p>
                <div className="flex items-center gap-1 mt-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-semibold">${customer.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
              <span className={`text-xs px-2 py-1 rounded-full ${
                customer.status === 'active'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-slate-500/10 text-slate-400'
              }`}>
                {customer.status}
              </span>
              <span className="text-slate-500 text-xs">Last: {customer.lastShipment}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <p className="text-slate-400 text-sm">
          Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">6</span> of{' '}
          <span className="text-white font-medium">{customers.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">1</button>
          <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">2</button>
          <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;