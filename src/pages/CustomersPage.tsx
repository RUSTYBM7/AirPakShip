import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, Download, MoreVertical, Eye, Edit, Trash2,
  Users, Mail, Phone, MapPin, Package, DollarSign, Route, Pause,
  Clock, AlertTriangle, CheckCircle, X, Truck, FileText, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

import { supabase } from '../lib/supabase';

// Extended customer interface with delivery and order management
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  country: string;
  postal: string;
  totalShipments: number;
  totalSpent: number;
  lastShipment: string;
  status: 'active' | 'inactive' | 'pending' | 'held' | 'suspended';
  currentRoute?: {
    origin: string;
    destination: string;
    trackingNumber: string;
    status: string;
    eta: string;
  };
  deliveryStatus?: 'pending' | 'in_transit' | 'held' | 'delivered' | 'returned';
  holdReason?: string;
  notes?: string;
}

// Mock data with extended features
const mockCustomers: Customer[] = [
  { id: 'C001', name: 'John Smith', email: 'john.smith@example.com', phone: '+65 9123 4567', company: 'Smith Enterprises', address: '123 Orchard Road', city: 'Singapore', country: 'Singapore', postal: '238895', totalShipments: 45, totalSpent: 8950.00, lastShipment: '2024-05-25', status: 'active', currentRoute: { origin: 'Singapore (SIN)', destination: 'London (LHR)', trackingNumber: 'APK20240525001234', status: 'in_transit', eta: 'May 28, 2024' }, deliveryStatus: 'in_transit' },
  { id: 'C002', name: 'Sarah Lee', email: 'sarah.lee@example.com', phone: '+60 1234 5678', company: 'Lee Trading Co', address: '456 Bukit Bintang', city: 'Kuala Lumpur', country: 'Malaysia', postal: '55100', totalShipments: 32, totalSpent: 6240.00, lastShipment: '2024-05-24', status: 'pending', deliveryStatus: 'pending', currentRoute: { origin: 'Kuala Lumpur', destination: 'Singapore', trackingNumber: 'APK20240524001233', status: 'pending', eta: 'May 29, 2024' } },
  { id: 'C003', name: 'Mike Chen', email: 'mike.chen@example.com', phone: '+1 555 123 4567', company: 'Chen Logistics', address: '789 Broadway', city: 'New York', country: 'USA', postal: '10012', totalShipments: 28, totalSpent: 11200.00, lastShipment: '2024-05-24', status: 'held', deliveryStatus: 'held', holdReason: 'Customs inspection required', currentRoute: { origin: 'New York', destination: 'Tokyo', trackingNumber: 'APK20240524001232', status: 'held', eta: 'May 30, 2024' } },
  { id: 'C004', name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+44 20 1234 5678', company: 'Wilson & Co', address: '10 Downing Street', city: 'London', country: 'UK', postal: 'SW1A 2AA', totalShipments: 51, totalSpent: 18750.00, lastShipment: '2024-05-23', status: 'active', deliveryStatus: 'delivered' },
  { id: 'C005', name: 'David Brown', email: 'david.brown@example.com', phone: '+49 30 1234 5678', company: 'Brown Industries', address: '55 Friedrichstrasse', city: 'Berlin', country: 'Germany', postal: '10117', totalShipments: 19, totalSpent: 4200.00, lastShipment: '2024-05-23', status: 'inactive', deliveryStatus: 'returned' },
  { id: 'C006', name: 'Lisa Wang', email: 'lisa.wang@example.com', phone: '+852 9876 5432', company: 'Wang Holdings', address: '88 Queensway', city: 'Hong Kong', country: 'Hong Kong', postal: '100010', totalShipments: 67, totalSpent: 24500.00, lastShipment: '2024-05-22', status: 'suspended', deliveryStatus: 'held', holdReason: 'Payment dispute pending' },
];

// Status badge colors
const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-500/10', text: 'text-green-400' },
  inactive: { bg: 'bg-slate-500/10', text: 'text-slate-400' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  held: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  suspended: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

// Delivery status colors
const deliveryColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  in_transit: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  held: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-400' },
  returned: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [holdReason, setHoldReason] = useState('');

  // Mock order form state
  const [mockOrder, setMockOrder] = useState({
    origin: '',
    destination: '',
    weight: '',
    service: 'express',
    notes: ''
  });

  // Route edit form state
  const [routeEdit, setRouteEdit] = useState({
    origin: '',
    destination: '',
    eta: ''
  });

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

  // Update customer status
  const updateCustomerStatus = (customerId: string, newStatus: Customer['status']) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, status: newStatus } : c
    ));
    toast.success(`Customer status updated to ${newStatus}`);
  };

  // Update delivery status
  const updateDeliveryStatus = (customerId: string, status: Customer['deliveryStatus'], reason?: string) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, deliveryStatus: status, holdReason: reason } : c
    ));
    toast.success(`Delivery status updated to ${status}`);
  };

  // Place delivery on hold
  const placeOnHold = (customerId: string, reason: string) => {
    updateDeliveryStatus(customerId, 'held', reason);
    setShowHoldModal(false);
    setHoldReason('');
  };

  // Resume delivery
  const resumeDelivery = (customerId: string) => {
    updateDeliveryStatus(customerId, 'pending');
    toast.success('Delivery resumed');
  };

  // Create mock order
  const createMockOrder = (customerId: string) => {
    const order = {
      trackingNumber: `APK${Date.now()}`,
      origin: mockOrder.origin,
      destination: mockOrder.destination,
      weight: mockOrder.weight,
      service: mockOrder.service,
      status: 'pending',
      createdAt: new Date().toISOString(),
      eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          currentRoute: {
            origin: order.origin,
            destination: order.destination,
            trackingNumber: order.trackingNumber,
            status: order.status,
            eta: order.eta
          },
          deliveryStatus: 'pending',
          totalShipments: c.totalShipments + 1
        };
      }
      return c;
    }));

    toast.success(`Mock order created: ${order.trackingNumber}`);
    setShowOrderModal(false);
    setMockOrder({ origin: '', destination: '', weight: '', service: 'express', notes: '' });
  };

  // Update route
  const updateRoute = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId && c.currentRoute) {
        return {
          ...c,
          currentRoute: {
            ...c.currentRoute,
            origin: routeEdit.origin || c.currentRoute.origin,
            destination: routeEdit.destination || c.currentRoute.destination,
            eta: routeEdit.eta || c.currentRoute.eta
          }
        };
      }
      return c;
    }));
    toast.success('Route updated successfully');
    setShowRouteModal(false);
  };

  const handleDelete = async (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    try {
      await supabase.from('customers').delete().eq('id', id);
      toast.success('Customer deleted');
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.currentRoute?.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesDelivery = deliveryFilter === 'all' || customer.deliveryStatus === deliveryFilter;
      return matchesSearch && matchesStatus && matchesDelivery;
    });
  }, [customers, searchTerm, statusFilter, deliveryFilter]);

  // Get status counts
  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: customers.length,
      active: 0,
      inactive: 0,
      pending: 0,
      held: 0,
      suspended: 0
    };
    customers.forEach(c => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  };

  // Get delivery counts
  const getDeliveryCounts = () => {
    const counts: Record<string, number> = {
      all: customers.length,
      pending: 0,
      in_transit: 0,
      held: 0,
      delivered: 0,
      returned: 0
    };
    customers.forEach(c => {
      counts[c.deliveryStatus || 'pending'] = (counts[c.deliveryStatus || 'pending'] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();
  const deliveryCounts = getDeliveryCounts();

  // Open edit modal
  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // Open route modal
  const openRouteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    if (customer.currentRoute) {
      setRouteEdit({
        origin: customer.currentRoute.origin,
        destination: customer.currentRoute.destination,
        eta: customer.currentRoute.eta
      });
    }
    setShowRouteModal(true);
  };

  // Open hold modal
  const openHoldModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowHoldModal(true);
  };

  // Open order modal
  const openOrderModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setMockOrder({
      origin: customer.currentRoute?.origin || '',
      destination: customer.currentRoute?.destination || '',
      weight: '',
      service: 'express',
      notes: ''
    });
    setShowOrderModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">Manage customers, routes, and deliveries</p>
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
        {['all', 'active', 'pending', 'held', 'inactive', 'suspended'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === status
                ? `bg-blue-500/10 text-blue-400 border border-blue-500/20`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs opacity-70">({statusCounts[status] || 0})</span>
          </button>
        ))}
      </div>

      {/* Delivery Status Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-slate-500 text-sm py-2">Delivery:</span>
        {['all', 'pending', 'in_transit', 'held', 'delivered', 'returned'].map((status) => (
          <button
            key={status}
            onClick={() => setDeliveryFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              deliveryFilter === status
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 border border-transparent'
            }`}
          >
            {status.replace('_', ' ').toUpperCase()}
            <span className="ml-1 opacity-70">({deliveryCounts[status] || 0})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name, email, company, or tracking number..."
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
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 py-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(customer); setShowActions(null); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Customer
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openRouteModal(customer); setShowActions(null); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Route className="w-4 h-4" />
                        Edit Route
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); openOrderModal(customer); setShowActions(null); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Mock Order
                      </button>
                      {customer.deliveryStatus !== 'held' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); openHoldModal(customer); setShowActions(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-orange-400 hover:bg-orange-500/10 transition-colors"
                        >
                          <Pause className="w-4 h-4" />
                          Place on Hold
                        </button>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); resumeDelivery(customer.id); setShowActions(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-green-400 hover:bg-green-500/10 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Resume Delivery
                        </button>
                      )}
                      <div className="border-t border-slate-700 my-1" />
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/customers/${customer.id}`); setShowActions(null); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
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

            {/* Current Route */}
            {customer.currentRoute && (
              <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-400">Current Route</span>
                </div>
                <p className="text-xs text-slate-300 mb-1">
                  {customer.currentRoute.origin} → {customer.currentRoute.destination}
                </p>
                <p className="text-xs text-slate-500">
                  Tracking: {customer.currentRoute.trackingNumber}
                </p>
                <p className="text-xs text-slate-500">
                  ETA: {customer.currentRoute.eta}
                </p>
              </div>
            )}

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

            {/* Status Badges */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[customer.status].bg} ${statusColors[customer.status].text}`}>
                  {customer.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${deliveryColors[customer.deliveryStatus || 'pending'].bg} ${deliveryColors[customer.deliveryStatus || 'pending'].text}`}>
                  {customer.deliveryStatus?.replace('_', ' ')}
                </span>
              </div>
              {customer.holdReason && (
                <div className="flex items-center gap-1 text-orange-400" title={customer.holdReason}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <p className="text-slate-400 text-sm">
          Showing <span className="text-white font-medium">{filteredCustomers.length}</span> of{' '}
          <span className="text-white font-medium">{customers.length}</span> results
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">1</button>
          <button className="px-3 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Edit Customer</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={selectedCustomer.name}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={selectedCustomer.email}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select
                  defaultValue={selectedCustomer.status}
                  onChange={(e) => updateCustomerStatus(selectedCustomer.id, e.target.value as Customer['status'])}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="held">Held</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Route Modal */}
      {showRouteModal && selectedCustomer && selectedCustomer.currentRoute && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Edit Route</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Origin</label>
                <input
                  type="text"
                  value={routeEdit.origin}
                  onChange={(e) => setRouteEdit(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder={selectedCustomer.currentRoute.origin}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Destination</label>
                <input
                  type="text"
                  value={routeEdit.destination}
                  onChange={(e) => setRouteEdit(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder={selectedCustomer.currentRoute.destination}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">ETA</label>
                <input
                  type="text"
                  value={routeEdit.eta}
                  onChange={(e) => setRouteEdit(prev => ({ ...prev, eta: e.target.value }))}
                  placeholder={selectedCustomer.currentRoute.eta}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRouteModal(false)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => updateRoute(selectedCustomer.id)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  Update Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Place on Hold Modal */}
      {showHoldModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Place Delivery on Hold</h3>
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-1">Hold Reason</label>
              <select
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
              >
                <option value="">Select a reason...</option>
                <option value="Customs inspection">Customs inspection required</option>
                <option value="Address verification">Address verification needed</option>
                <option value="Payment issue">Payment issue</option>
                <option value="Customer request">Customer request</option>
                <option value="Weather delay">Weather delay</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowHoldModal(false); setHoldReason(''); }}
                className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => placeOnHold(selectedCustomer.id, holdReason || 'Delivery on hold')}
                disabled={!holdReason}
                className="flex-1 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
              >
                Place on Hold
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mock Order Modal */}
      {showOrderModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Create Mock Order</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Origin</label>
                <input
                  type="text"
                  value={mockOrder.origin}
                  onChange={(e) => setMockOrder(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder="Enter origin location"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Destination</label>
                <input
                  type="text"
                  value={mockOrder.destination}
                  onChange={(e) => setMockOrder(prev => ({ ...prev, destination: e.target.value }))}
                  placeholder="Enter destination location"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Weight (kg)</label>
                <input
                  type="text"
                  value={mockOrder.weight}
                  onChange={(e) => setMockOrder(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter package weight"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Service Type</label>
                <select
                  value={mockOrder.service}
                  onChange={(e) => setMockOrder(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
                >
                  <option value="express">Express (1-2 days)</option>
                  <option value="standard">Standard (3-5 days)</option>
                  <option value="economy">Economy (7-14 days)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Notes</label>
                <textarea
                  value={mockOrder.notes}
                  onChange={(e) => setMockOrder(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => createMockOrder(selectedCustomer.id)}
                  className="flex-1 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
