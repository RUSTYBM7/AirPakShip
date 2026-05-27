import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  LineChart,
  TrendingUp,
  AlertTriangle,
  Search,
  Lightbulb,
  MapPin,
  Package,
  Loader2,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Target,
  TrendingDown,
  Zap,
  Eye,
  Shield,
  Database,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock data for AI Analyst 2.0
const mockAnomalies = [
  { id: 1, type: 'critical', title: 'Unusual Volume Spike', description: 'London hub processing 45% more volume than historical average for Tuesday. Affects 234 shipments.', time: '2 hours ago' },
  { id: 2, type: 'warning', title: 'Route Delay Detected', description: 'LHR to CDG flights showing consistent 2hr delays over past 48hrs. 89 shipments affected.', time: '4 hours ago' },
  { id: 3, type: 'info', title: 'Cost Anomaly', description: 'European freight costs 12% above forecast for this quarter. Review pricing.', time: '1 day ago' },
];

const mockSuggestions = [
  'Compare Q1 vs Q2 European freight costs',
  'Identify top 5 clients by revenue growth',
  'Show carbon footprint reduction month-over-month',
  'Analyze customs clearance times by country',
  'Forecast Q3 capacity requirements',
  'Detect fraudulent shipment patterns',
];

const mockMetrics = [
  { label: 'Predicted Revenue (30D)', value: '$2.4M', change: '+12%', trend: 'up', icon: TrendingUp },
  { label: 'On-Time Probability', value: '96.8%', change: '+2.1%', trend: 'up', icon: Target },
  { label: 'Active Shipments', value: '12,847', change: '+847', trend: 'up', icon: Package },
  { label: 'Anomalies Detected', value: '23', change: '-5', trend: 'down', icon: AlertTriangle },
];

const mockChartData = [
  { label: 'Jan', value: 65 },
  { label: 'Feb', value: 78 },
  { label: 'Mar', value: 72 },
  { label: 'Apr', value: 85 },
  { label: 'May', value: 91 },
  { label: 'Jun', value: 88 },
  { label: 'Jul', value: 95 },
  { label: 'Aug', value: 100 },
];

const AIAnalystPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'forecast'>('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [showAnomalyModal, setShowAnomalyModal] = useState<typeof mockAnomalies[0] | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analyses = [
      "Based on the data, shipments to Germany have increased by 23% this week. Most delays are concentrated at Customs Clearance in Frankfurt hub. Recommendation: Increase staffing by 15% and pre-clear customs for high-value shipments.",
      "Revenue analysis shows a 12% growth in Q2 compared to Q1. The growth is primarily driven by express deliveries to APAC region (+34%). Consider expanding capacity on Singapore and Tokyo routes.",
      "Anomaly detection identified 47 unusual patterns in the last 24 hours. 89% are false positives due to system calibration. 3 suspicious shipments flagged for review.",
      "Carbon footprint analysis: Current month shows 12% reduction vs target. Primary contributor is optimized route planning saving 2,340 tons CO2. Continue monitoring for Q3 targets.",
      "Predictive analysis for next 30 days: Expect 15% increase in volume due to holiday season. Recommended action: Pre-book air cargo capacity and activate overflow partners.",
    ];

    setAnalysisResult(analyses[Math.floor(Math.random() * analyses.length)]);
    setIsAnalyzing(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleAnalyze();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              AI Analyst 2.0
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-medium">Advanced</span>
            </h1>
            <p className="text-slate-400">Natural language data exploration and predictive insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
            {['7d', '30d', '90d', 'YTD'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-slate-900 rounded-xl border border-emerald-500/30 p-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-emerald-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Ask anything... e.g., 'Why are shipments to Germany delayed?' or 'Forecast Q3 revenue'"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !query.trim()}
          className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Analyze
            </>
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'insights', label: 'Insights', icon: Lightbulb },
          { id: 'forecast', label: 'Forecast', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-600/20 text-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analysis Result */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/80 rounded-xl border border-emerald-500/30 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">AI Analysis Result</h3>
                <p className="text-slate-300 leading-relaxed">{analysisResult}</p>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alerts & Suggestions */}
        <div className="space-y-6">
          {/* Anomaly Detection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Anomaly Detection
            </h3>
            <div className="space-y-4">
              {mockAnomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  onClick={() => setShowAnomalyModal(anomaly)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${
                    anomaly.type === 'critical'
                      ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                      : anomaly.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                      : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-white mb-1">{anomaly.title}</p>
                    <span className={`text-xs ${
                      anomaly.type === 'critical' ? 'text-red-400' :
                      anomaly.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>{anomaly.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{anomaly.description}</p>
                  <button className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    Investigate <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-400" /> AI Suggestions
            </h3>
            <div className="space-y-3">
              {mockSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors border border-slate-700 hover:border-emerald-500/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle/Right: Charts & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockMetrics.map((metric, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-400 truncate">{metric.label}</p>
                  <metric.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                  metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Forecast Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-400">Predicted Revenue (30D)</p>
                  <h3 className="text-2xl font-bold text-white">$2.4M</h3>
                </div>
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1 text-sm font-bold">
                  <TrendingUp className="w-4 h-4" /> +12%
                </div>
              </div>
              <div className="h-32 flex items-end gap-2 pt-4">
                {mockChartData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all hover:from-emerald-500 hover:to-emerald-300"
                      style={{ height: `${item.value}%` }}
                    />
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* On-Time Delivery Probability */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-400">On-Time Delivery Probability</p>
                  <h3 className="text-2xl font-bold text-white">96.8%</h3>
                </div>
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-8">
                <div className="w-full bg-slate-800 rounded-full h-4 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-4 rounded-full transition-all" style={{ width: '96.8%' }} />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Based on 12,847 active shipments</span>
                  <span className="text-emerald-400">+2.1% vs last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Heatmap */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Global Volume Heatmap
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-400">High Volume</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-slate-400">Low</span>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
              {/* Simulated World Map Background */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M10,25 Q25,10 40,20 T70,15 T90,25" stroke="currentColor" fill="none" className="text-slate-600" strokeWidth="0.5" />
                  <path d="M5,30 Q20,25 35,35 T65,30 T95,35" stroke="currentColor" fill="none" className="text-slate-600" strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="3" fill="currentColor" className="text-emerald-500 opacity-50" />
                  <circle cx="45" cy="15" r="4" fill="currentColor" className="text-blue-500 opacity-50" />
                  <circle cx="70" cy="25" r="2" fill="currentColor" className="text-emerald-500 opacity-50" />
                </svg>
              </div>

              {/* Heat Spots */}
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-emerald-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-yellow-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-red-500 rounded-full blur-2xl opacity-10"></div>

              {/* Activity Points */}
              {[
                { x: '25%', y: '30%', label: 'LHR - 4,521' },
                { x: '50%', y: '25%', label: 'SIN - 3,847' },
                { x: '70%', y: '35%', label: 'LAX - 2,934' },
                { x: '45%', y: '45%', label: 'DXB - 3,210' },
                { x: '80%', y: '50%', label: 'NRT - 2,156' },
              ].map((point, i) => (
                <div
                  key={i}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: point.x, top: point.y }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute -inset-1 opacity-75"></div>
                    <div className="w-4 h-4 bg-emerald-500 rounded-full relative z-10"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-emerald-400 font-mono whitespace-nowrap">
                      {point.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> Data Sources & Sync Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Shipment DB', status: 'synced', records: '2.4M' },
                { name: 'Analytics', status: 'synced', records: '847K' },
                { name: 'Customer Data', status: 'synced', records: '124K' },
                { name: 'Financials', status: 'synced', records: '89K' },
              ].map((source, i) => (
                <div key={i} className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{source.name}</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                  <p className="text-xs text-slate-500">{source.records} records</p>
                  <p className="text-xs text-emerald-400 mt-1">Last sync: 2 min ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Anomaly Detail Modal */}
      <AnimatePresence>
        {showAnomalyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAnomalyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  showAnomalyModal.type === 'critical' ? 'bg-red-500/20' :
                  showAnomalyModal.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    showAnomalyModal.type === 'critical' ? 'text-red-400' :
                    showAnomalyModal.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{showAnomalyModal.title}</h3>
                  <p className="text-sm text-slate-400">Detected {showAnomalyModal.time}</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">{showAnomalyModal.description}</p>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                  Dismiss
                </button>
                <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                  Investigate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAnalystPage;