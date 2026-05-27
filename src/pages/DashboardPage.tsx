import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for dashboard
const dashboardStats = {
  totalShipments: 1247,
  pendingPickups: 45,
  inTransit: 328,
  deliveredToday: 89,
  revenueToday: 45280,
  revenueMonth: 892450,
  activeCustomers: 156,
  newCustomersThisWeek: 12
};

const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const customerData = [
  { name: 'Week 1', customers: 40 },
  { name: 'Week 2', customers: 30 },
  { name: 'Week 3', customers: 20 },
  { name: 'Week 4', customers: 27 },
  { name: 'Week 5', customers: 18 },
  { name: 'Week 6', customers: 23 },
  { name: 'Week 7', customers: 34 },
];

const recentShipments = [
  { id: 'APK001234', customer: 'John Smith', origin: 'Singapore', destination: 'London', status: 'in_transit', time: '2 hours ago' },
  { id: 'APK001233', customer: 'Sarah Lee', origin: 'Malaysia', destination: 'Australia', status: 'delivered', time: '4 hours ago' },
  { id: 'APK001232', customer: 'Mike Chen', origin: 'UK', destination: 'USA', status: 'pending', time: '1 hour ago' },
  { id: 'APK001231', customer: 'Emma Wilson', origin: 'Singapore', destination: 'Japan', status: 'out_for_delivery', time: '30 min ago' },
  { id: 'APK001230', customer: 'David Brown', origin: 'Hong Kong', destination: 'Germany', status: 'in_transit', time: '5 hours ago' },
];

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
  picked_up: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Truck },
  in_transit: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: Truck },
  out_for_delivery: { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Truck },
  delivered: { color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
  returned: { color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
  cancelled: { color: 'text-slate-400', bg: 'bg-slate-500/10', icon: AlertCircle },
};

const StatCard: React.FC<{ title: string; value: string | number; icon: any; trend?: number; color: string; onClick?: () => void }> = ({ title, value, icon: Icon, trend, color, onClick }) => (
  <div onClick={onClick} className={`bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all ${onClick ? 'cursor-pointer hover:bg-slate-800' : ''}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-2">{value}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(trend)}% from last week</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('today');
  const navigate = useNavigate();

  // Dynamic stats based on filter
  const getFilteredStats = () => {
    switch(timeFilter) {
      case 'week':
        return { ...dashboardStats, revenueToday: 185000, newCustomersThisWeek: 45, totalShipments: 4520, pendingPickups: 120, inTransit: 850, deliveredToday: 3200 };
      case 'month':
        return { ...dashboardStats, revenueToday: 892450, newCustomersThisWeek: 156, totalShipments: 18500, pendingPickups: 350, inTransit: 2100, deliveredToday: 14500 };
      case 'year':
        return { ...dashboardStats, revenueToday: 9500000, newCustomersThisWeek: 850, totalShipments: 250000, pendingPickups: 450, inTransit: 5600, deliveredToday: 240000 };
      default:
        return dashboardStats;
    }
  };

  const currentStats = getFilteredStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Link
            to="/shipments/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Shipments"
          value={currentStats.totalShipments.toLocaleString()}
          icon={Package}
          trend={12.5}
          color="bg-blue-500"
          onClick={() => navigate('/shipments')}
        />
        <StatCard
          title="Pending Pickups"
          value={currentStats.pendingPickups}
          icon={Clock}
          trend={-5.2}
          color="bg-amber-500"
          onClick={() => navigate('/shipments?status=pending')}
        />
        <StatCard
          title="In Transit"
          value={currentStats.inTransit}
          icon={Truck}
          color="bg-cyan-500"
          onClick={() => navigate('/shipments?status=in_transit')}
        />
        <StatCard
          title={timeFilter === 'today' ? 'Delivered Today' : 'Delivered'}
          value={currentStats.deliveredToday.toLocaleString()}
          icon={CheckCircle}
          trend={8.3}
          color="bg-green-500"
          onClick={() => navigate('/shipments?status=delivered')}
        />
      </div>

      {/* Revenue & Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
            <Link to="/analytics" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View Details
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-sm">{timeFilter === 'today' ? "Today's Revenue" : 'Revenue'}</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${currentStats.revenueToday.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white mt-1">
                ${currentStats.revenueMonth.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 h-64 bg-slate-700/10 rounded-xl flex items-center justify-center p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                {/* @ts-ignore */}
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                {/* @ts-ignore */}
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `$${value}`} />
                {/* @ts-ignore */}
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                {/* @ts-ignore */}
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Customer Stats</h2>
            <Link to="/customers" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-white mt-1">
                {currentStats.activeCustomers}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">{timeFilter === 'week' ? 'New This Week' : 'New Customers'}</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                +{currentStats.newCustomersThisWeek}
              </p>
            </div>
          </div>
          <div className="mt-6 h-32 bg-slate-700/10 rounded-xl flex items-center justify-center p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                {/* @ts-ignore */}
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                {/* @ts-ignore */}
                <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">Recent Shipments</h2>
          <Link
            to="/shipments"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {recentShipments.map((shipment) => {
                const config = statusConfig[shipment.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <tr key={shipment.id} onClick={() => navigate(`/shipments`)} className="hover:bg-slate-700/30 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{shipment.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{shipment.customer}</td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 text-sm">{shipment.origin}</div>
                      <div className="text-slate-500 text-xs">→ {shipment.destination}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{shipment.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;