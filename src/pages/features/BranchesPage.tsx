import React, { useState } from 'react';
import {
  Search, Plus, MapPin, Phone, Mail, Clock,
  Edit2, Trash2, Building, Users, Activity,
  Map as MapIcon, ChevronRight, UserCircle
} from 'lucide-react';

// --- Types & Mock Data ---

interface Branch {
  id: string;
  name: string;
  region: string;
  status: 'Active' | 'Maintenance' | 'Closed';
  address: string;
  manager: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: string;
  employeeCount: number;
}

const mockStats = [
  { label: 'Total Branches', value: '42', icon: Building, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Active Personnel', value: '1,240', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Avg Daily Volume', value: '85k', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Regions Covered', value: '12', icon: MapIcon, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const mockBranches: Branch[] = [
  {
    id: 'BR-001',
    name: 'Central Hub',
    region: 'North America',
    status: 'Active',
    address: '123 Commerce St, Metropolis, NY 10001',
    manager: 'Sarah Jenkins',
    phone: '+1 (555) 019-2831',
    email: 'central@airpak.express',
    hours: '24/7',
    coordinates: '40.7128° N, 74.0060° W',
    employeeCount: 145,
  },
  {
    id: 'BR-002',
    name: 'West Coast Gateway',
    region: 'North America',
    status: 'Active',
    address: '88 Pacific Blvd, San Francisco, CA 94107',
    manager: 'Michael Chang',
    phone: '+1 (555) 928-1120',
    email: 'westcoast@airpak.express',
    hours: 'Mon-Sun: 06:00 - 22:00',
    coordinates: '37.7749° N, 122.4194° W',
    employeeCount: 82,
  },
  {
    id: 'BR-003',
    name: 'Euro Node Alpha',
    region: 'Europe',
    status: 'Maintenance',
    address: 'Logistikpark 4, 60549 Frankfurt, Germany',
    manager: 'Elena Rostova',
    phone: '+49 69 1234 5678',
    email: 'eur.alpha@airpak.express',
    hours: 'Mon-Fri: 08:00 - 20:00',
    coordinates: '50.1109° N, 8.6821° E',
    employeeCount: 110,
  },
  {
    id: 'BR-004',
    name: 'APAC Distribution',
    region: 'Asia Pacific',
    status: 'Active',
    address: 'Level 8, Logistics Tower, Changi, Singapore',
    manager: 'David Chen',
    phone: '+65 6789 0123',
    email: 'apac.dist@airpak.express',
    hours: '24/7',
    coordinates: '1.3521° N, 103.8198° E',
    employeeCount: 230,
  }
];

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<Branch>(mockBranches[0]);

  // Filter branches based on search query
  const filteredBranches = mockBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    branch.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Branches Management</h1>
          <p className="text-slate-400 mt-1">Manage AirPak Express network locations and facilities</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          <span>Create Branch</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockStats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: List & Search */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[700px]">

          {/* Search Bar */}
          <div className="p-4 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Branch List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedBranch.id === branch.id
                      ? 'bg-blue-600/10 border border-blue-500/30'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-slate-200">{branch.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                      <span>{branch.id}</span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      <span>{branch.region}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${selectedBranch.id === branch.id ? 'text-blue-500' : 'text-slate-600'}`} />
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p>No branches found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[700px] overflow-hidden">
          {selectedBranch ? (
            <>
              {/* Details Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">{selectedBranch.name}</h2>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      selectedBranch.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                      selectedBranch.status === 'Maintenance' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {selectedBranch.status}
                    </span>
                  </div>
                  <p className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {selectedBranch.region}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors tooltip-trigger" title="Edit Branch">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors tooltip-trigger" title="Delete Branch">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Details Content */}
              <div className="flex-1 overflow-y-auto p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Contact & Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <UserCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-slate-300">{selectedBranch.manager}</p>
                            <p className="text-sm text-slate-500">Branch Manager</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <p className="text-slate-300">{selectedBranch.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <p className="text-blue-400 hover:underline cursor-pointer">{selectedBranch.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-slate-800 w-full my-6"></div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Location Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-slate-300">{selectedBranch.address}</p>
                            <p className="text-sm text-slate-500 mt-1">Coord: {selectedBranch.coordinates}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-slate-400" />
                          <p className="text-slate-300">{selectedBranch.hours}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-slate-400" />
                          <p className="text-slate-300">{selectedBranch.employeeCount} Employees</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="h-full min-h-[300px]">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Map Overview</h3>
                    <div className="w-full h-[calc(100%-2rem)] bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 group-hover:text-slate-400 transition-colors">
                        <MapIcon className="w-12 h-12 mb-3 opacity-50" />
                        <p className="font-medium text-sm">Interactive Map Unavailable</p>
                        <p className="text-xs mt-1 opacity-70">Showing generic location data</p>
                      </div>
                      {/* Fake map pin */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                          <MapPin className="w-8 h-8 text-blue-500 drop-shadow-lg" fill="currentColor" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/50 blur-[2px] rounded-[100%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Building className="w-16 h-16 mb-4 opacity-20" />
              <h2 className="text-xl font-semibold mb-2">No Branch Selected</h2>
              <p>Select a branch from the list to view its details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}