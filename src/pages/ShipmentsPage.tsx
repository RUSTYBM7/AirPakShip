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
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { supabase } from '../lib/supabase';

// Mock data
const mockShipments = [
  { id: 'APK001234', tracking: 'APK20240525001234', customer: 'John Smith', email: 'john@example.com', origin: 'Singapore', destination: 'London, UK', weight: '2.5 kg', service: 'Express', status: 'in_transit', cost: 185.00, date: '2024-05-25' },
  { id: 'APK001233', tracking: 'APK20240524001233', customer: 'Sarah Lee', email: 'sarah@example.com', origin: 'Kuala Lumpur', destination: 'Sydney, AU', weight: '5.0 kg', service: 'Standard', status: 'delivered', cost: 245.00, date: '2024-05-24' },
  { id: 'APK001232', tracking: 'APK20240524001232', customer: 'Mike Chen', email: 'mike@example.com', origin: 'London, UK', destination: 'New York, US', weight: '1.2 kg', service: 'Express', status: 'pending', cost: 320.00, date: '2024-05-24' },
  { id: 'APK001231', tracking: 'APK20240523001231', customer: 'Emma Wilson', email: 'emma@example.com', origin: 'Singapore', destination: 'Tokyo, JP', weight: '3.8 kg', service: 'Economy', status: 'out_for_delivery', cost: 95.00, date: '2024-05-23' },
  { id: 'APK001230', tracking: 'APK20240523001230', customer: 'David Brown', email: 'david@example.com', origin: 'Hong Kong', destination: 'Berlin, DE', weight: '4.2 kg', service: 'Standard', status: 'in_transit', cost: 275.00, date: '2024-05-23' },
  { id: 'APK001229', tracking: 'APK20240522001229', customer: 'Lisa Wang', email: 'lisa@example.com', origin: 'Singapore', destination: 'Dubai, UAE', weight: '8.5 kg', service: 'Economy', status: 'delivered', cost: 145.00, date: '2024-05-22' },
  { id: 'APK001228', tracking: 'APK20240522001228', customer: 'Tom Harris', email: 'tom@example.com', origin: 'Melbourne', destination: 'Singapore', weight: '12.0 kg', service: 'Express', status: 'cancelled', cost: 0, date: '2024-05-22' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
  picked_up: { label: 'Picked Up', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Truck },
  in_transit: { label: 'In Transit', color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
  returned: { label: 'Returned', color: 'text-orange-400', bg: 'bg-orange-500/10', icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

const ShipmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [shipments, setShipments] = useState<any[]>(mockShipments);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchShipments = async () => {
      try {
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching shipments:', error);
          setShipments(mockShipments);
          return;
        }

        if (data && data.length > 0) {
          setShipments(data);
        } else {
          setShipments(mockShipments);
        }
      } catch (err) {
        console.error('Error:', err);
        setShipments(mockShipments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const handleDelete = async (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    try {
      await supabase.from('shipments').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting shipment:', err);
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: shipments.length };
    shipments.forEach(s => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Shipments</h1>
          <p className="text-slate-400 mt-1">Manage and track all shipments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => navigate('/shipments/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === key
                ? `${config.bg} ${config.color} border border-current/20`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent'
            }`}
          >
            {config.label}
            <span className="ml-2 text-xs opacity-70">({statusCounts[key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by tracking number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Shipments Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredShipments.map((shipment) => {
                const config = statusConfig[shipment.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <tr key={shipment.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{shipment.tracking}</p>
                          <p className="text-slate-500 text-xs">{shipment.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{shipment.customer}</p>
                      <p className="text-slate-500 text-sm">{shipment.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-300">{shipment.origin}</p>
                      <p className="text-slate-500 text-sm">→ {shipment.destination}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{shipment.service}</span>
                      <p className="text-slate-500 text-xs">{shipment.weight}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">${shipment.cost.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-sm">{shipment.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === shipment.id ? null : shipment.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                        {showActions === shipment.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowActions(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-2">
                              <button
                                onClick={() => navigate(`/shipments/${shipment.id}`)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button
                                onClick={() => navigate(`/shipments/${shipment.id}/edit`)}
                                className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button onClick={() => handleDelete(shipment.id)} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
          <p className="text-slate-400 text-sm">
            Showing <span className="text-white font-medium">1</span> to <span className="text-white font-medium">7</span> of{' '}
            <span className="text-white font-medium">{shipments.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">1</button>
            <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">2</button>
            <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">3</button>
            <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsPage;