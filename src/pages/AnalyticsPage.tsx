import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Package, Users, DollarSign, Activity, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock analytics data
const metrics = [
  {
    label: 'Total Shipments',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Package,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Active Customers',
    value: '3,291',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Revenue',
    value: '$847K',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-500'
  },
  {
    label: 'Delivery Rate',
    value: '98.7%',
    change: '-0.2%',
    trend: 'down',
    icon: Activity,
    color: 'from-orange-500 to-red-500'
  },
];

const weeklyData = [
  { day: 'Mon', shipments: 245, revenue: 42000 },
  { day: 'Tue', shipments: 312, revenue: 51000 },
  { day: 'Wed', shipments: 278, revenue: 48000 },
  { day: 'Thu', shipments: 356, revenue: 62000 },
  { day: 'Fri', shipments: 423, revenue: 71000 },
  { day: 'Sat', shipments: 189, revenue: 35000 },
  { day: 'Sun', shipments: 156, revenue: 28000 },
];

const statusBreakdown = [
  { status: 'Delivered', count: 8924, percentage: 69.5, color: 'bg-green-500' },
  { status: 'In Transit', count: 2134, percentage: 16.6, color: 'bg-cyan-500' },
  { status: 'Pending', count: 1024, percentage: 8.0, color: 'bg-yellow-500' },
  { status: 'Exception', count: 765, percentage: 5.9, color: 'bg-red-500' },
];

const topRoutes = [
  { route: 'SIN → LHR', count: 1245, growth: '+18%' },
  { route: 'KUL → SYD', count: 987, growth: '+12%' },
  { route: 'HKG → FRA', count: 876, growth: '+8%' },
  { route: 'SIN → JFK', count: 754, growth: '+22%' },
  { route: 'HKG → LAX', count: 698, growth: '+5%' },
];

const AnalyticsPage: React.FC = () => {
  const { user, canAccess } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  if (user && !canAccess('analytics', 'read')) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access Analytics.</p>
        </div>
      </div>
    );
  }

  const maxShipments = Math.max(...weeklyData.map(d => d.shipments));
  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-slate-400 mt-1">Performance insights and business metrics</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-slate-900/50 rounded-xl p-1">
          {['24h', '7d', '30d', '90d'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-purple-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <p className="text-slate-400 text-sm">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Shipments Chart */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Weekly Performance
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyData.map((data) => (
              <div key={data.day} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500">${(data.revenue / 1000).toFixed(0)}K</span>
                  <div
                    className="w-full max-w-8 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md transition-all"
                    style={{ height: `${(data.shipments / maxShipments) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Shipment Status</h3>
          <div className="space-y-4">
            {statusBreakdown.map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{item.status}</span>
                  <span className="text-sm font-medium text-white">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Routes */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Top Routes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topRoutes.map((route, index) => (
            <div key={route.route} className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-slate-400">
                  {index + 1}
                </span>
                <span className="text-white font-medium">{route.route}</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{route.count.toLocaleString()}</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {route.growth} vs last period
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;