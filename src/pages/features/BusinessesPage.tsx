import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, Edit, Trash2, MoreVertical, Eye, Mail, Phone, MapPin, Star, TrendingUp, Package, Users, DollarSign } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  totalShipments: number;
  totalRevenue: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
}

const BusinessesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Sample business data
  const [businesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'logistics@acme.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, New York, NY 10001',
      industry: 'Manufacturing',
      tier: 'platinum',
      totalShipments: 1250,
      totalRevenue: 125000,
      joinDate: '2022-03-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'shipping@techstart.io',
      phone: '+1 (555) 234-5678',
      address: '456 Innovation Blvd, San Francisco, CA 94102',
      industry: 'Technology',
      tier: 'gold',
      totalShipments: 890,
      totalRevenue: 89000,
      joinDate: '2022-06-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Global Logistics Ltd',
      email: 'ops@globallogistics.com',
      phone: '+1 (555) 345-6789',
      address: '789 Trade Center, Chicago, IL 60601',
      industry: 'Logistics',
      tier: 'platinum',
      totalShipments: 2100,
      totalRevenue: 210000,
      joinDate: '2021-11-10',
      status: 'active'
    },
    {
      id: '4',
      name: 'Fresh Foods Co',
      email: 'distribution@freshfoods.co',
      phone: '+1 (555) 456-7890',
      address: '321 Fresh Market, Miami, FL 33101',
      industry: 'Food & Beverage',
      tier: 'gold',
      totalShipments: 567,
      totalRevenue: 56700,
      joinDate: '2023-01-05',
      status: 'active'
    },
    {
      id: '5',
      name: 'MediCare Plus',
      email: 'supplies@medicareplus.com',
      phone: '+1 (555) 567-8901',
      address: '654 Health Plaza, Boston, MA 02101',
      industry: 'Healthcare',
      tier: 'silver',
      totalShipments: 234,
      totalRevenue: 23400,
      joinDate: '2023-04-18',
      status: 'active'
    },
    {
      id: '6',
      name: 'Home Electronics',
      email: 'fulfillment@home-electronics.net',
      phone: '+1 (555) 678-9012',
      address: '987 Tech District, Austin, TX 73301',
      industry: 'Retail',
      tier: 'bronze',
      totalShipments: 123,
      totalRevenue: 12300,
      joinDate: '2023-08-22',
      status: 'pending'
    },
    {
      id: '7',
      name: 'Fashion Forward',
      email: 'orders@fashionforward.com',
      phone: '+1 (555) 789-0123',
      address: '147 Fashion Row, Los Angeles, CA 90001',
      industry: 'Fashion',
      tier: 'silver',
      totalShipments: 456,
      totalRevenue: 45600,
      joinDate: '2022-09-30',
      status: 'active'
    },
    {
      id: '8',
      name: 'AutoParts Direct',
      email: 'shipping@autopartsdirect.com',
      phone: '+1 (555) 890-1234',
      address: '258 Auto Mall, Detroit, MI 48201',
      industry: 'Automotive',
      tier: 'gold',
      totalShipments: 789,
      totalRevenue: 78900,
      joinDate: '2022-12-14',
      status: 'inactive'
    }
  ]);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || business.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || business.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-r from-slate-600 to-slate-400 text-white border-slate-300';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black border-yellow-500';
      case 'silver':
        return 'bg-gradient-to-r from-slate-400 to-slate-300 text-slate-900 border-slate-400';
      case 'bronze':
        return 'bg-gradient-to-r from-amber-600 to-amber-400 text-white border-amber-500';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
    }
  };

  const totalRevenue = businesses.reduce((sum, b) => sum + b.totalRevenue, 0);
  const totalShipments = businesses.reduce((sum, b) => sum + b.totalShipments, 0);
  const activeBusinesses = businesses.filter(b => b.status === 'active').length;
  const avgRevenuePerBusiness = totalRevenue / businesses.length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Businesses</h1>
        <p className="text-slate-400">Manage business accounts and partnerships</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Businesses</p>
              <p className="text-xl font-bold text-white">{businesses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10- h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active</p>
              <p className="text-xl font-bold text-green-400">{activeBusinesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Shipments</p>
              <p className="text-xl font-bold text-white">{totalShipments.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
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
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-red-500/50"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-red-500/50"
            >
              <option value="all">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="bronze">Bronze</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-white focus:border-red-500/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
              <Plus size={16} />
              Add Business
            </button>
          </div>
        </div>
      </div>

      {/* Businesses Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredBusinesses.map((business) => (
          <div key={business.id} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{business.name}</h3>
                  <p className="text-sm text-slate-400">{business.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs border ${getTierBadge(business.tier)}`}>
                  {business.tier.charAt(0).toUpperCase() + business.tier.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(business.status)}`}>
                  {business.status.charAt(0).toUpperCase() + business.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail size={14} className="text-slate-500" />
                {business.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone size={14} className="text-slate-500" />
                {business.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin size={14} className="text-slate-500" />
                {business.address}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
              <div>
                <p className="text-xs text-slate-400 mb-1">Shipments</p>
                <p className="font-semibold text-white">{business.totalShipments.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Revenue</p>
                <p className="font-semibold text-green-400">${business.totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Member Since</p>
                <p className="font-semibold text-white">{new Date(business.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-700/50">
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="View Details">
                <Eye size={16} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Edit">
                <Edit size={16} className="text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" title="Delete">
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-12 text-center">
          <Building2 size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No businesses found</p>
        </div>
      )}
    </div>
  );
};

export default BusinessesPage;
