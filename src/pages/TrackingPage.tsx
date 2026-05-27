import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

// Mock tracking data
const mockTrackings = [
  {
    id: 'APK20240525001234',
    status: 'in_transit',
    origin: 'Singapore (SIN)',
    destination: 'London (LHR)',
    customer: 'John Smith',
    estimatedDelivery: '2024-05-28',
    lastUpdate: 'Arrived at London Heathrow customs'
  },
  {
    id: 'APK20240524001233',
    status: 'delivered',
    origin: 'Kuala Lumpur (KUL)',
    destination: 'Sydney (SYD)',
    customer: 'Sarah Lee',
    estimatedDelivery: '2024-05-25',
    lastUpdate: 'Delivered to recipient'
  },
  {
    id: 'APK20240524001232',
    status: 'pending',
    origin: 'London (LHR)',
    destination: 'New York (JFK)',
    customer: 'Mike Chen',
    estimatedDelivery: '2024-05-30',
    lastUpdate: 'Awaiting pickup from sender'
  },
];

const statusConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', icon: Clock, label: 'Pending' },
  picked_up: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Package, label: 'Picked Up' },
  in_transit: { color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: Truck, label: 'In Transit' },
  out_for_delivery: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Truck, label: 'Out for Delivery' },
  delivered: { color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: CheckCircle, label: 'Delivered' },
  returned: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', icon: AlertCircle, label: 'Returned' },
  cancelled: { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30', icon: AlertCircle, label: 'Cancelled' },
  exception: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', icon: AlertCircle, label: 'Exception' },
};

const TrackingPage: React.FC = () => {
  const { user, canAccess } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracking, setSelectedTracking] = useState<any>(null);
  const [trackings, setTrackings] = useState<any[]>(mockTrackings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrackings = async () => {
      try {
        const { data, error } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching trackings:', error);
          setTrackings(mockTrackings);
          return;
        }

        if (data && data.length > 0) {
          // Map shipments data to tracking format if needed, or just use it directly
          const mappedData = data.map(s => ({
            id: s.tracking || s.id,
            status: s.status,
            origin: s.origin,
            destination: s.destination,
            customer: s.customer,
            estimatedDelivery: s.date,
            lastUpdate: s.status === 'pending' ? 'Awaiting pickup' : 'Updated'
          }));
          setTrackings(mappedData);
        } else {
          setTrackings(mockTrackings);
        }
      } catch (err) {
        console.error('Error:', err);
        setTrackings(mockTrackings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackings();
  }, []);

  if (user && !canAccess('tracking', 'read')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access Tracking.</p>
        </div>
      </div>
    );
  }

  const filteredTrackings = trackings.filter(t =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Shipment Tracking</h1>
            <p className="text-slate-400 mt-1">Track and monitor all shipments in real-time</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by tracking number or customer name..."
          className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </form>

      {/* Trackings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrackings.map((tracking) => {
          const status = statusConfig[tracking.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div
              key={tracking.id}
              onClick={() => setSelectedTracking(tracking)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all hover:border-slate-600 ${status.bg}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white font-bold text-lg">{tracking.id}</p>
                  <p className="text-slate-400 text-sm">{tracking.customer}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{status.label}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-slate-400">{tracking.origin}</span>
                <span className="text-slate-600">→</span>
                <span className="text-slate-400">{tracking.destination}</span>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400">Last Update</p>
                <p className="text-white">{tracking.lastUpdate}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTrackings.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No shipments found</h3>
          <p className="text-slate-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;