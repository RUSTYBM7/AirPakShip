import React, { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  BarChart3,
  Globe,
  Truck,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  File,
  Mail,
  Sparkles,
  Workflow,
  Zap,
  Bot,
  Code,
  Mic,
  Image,
  X,
  Building2,
  ShieldCheck,
} from 'lucide-react';

// AI & Advanced features
import {
  FileText as DocumentIcon,
  Receipt as InvoiceIcon,
  Image as CreativeIcon,
  Mail as EmailIcon,
  GitBranch as WorkflowIcon,
  Navigation as AutopilotIcon,
  Wand2 as AutomationIcon,
  LineChart as AnalystIcon,
  Scan as ParserIcon,
  Mic as VoiceIcon,
  Terminal as APIIcon,
  Scale as AuditIcon,
  LifeBuoy as SupportIcon,
  ShieldAlert as ApprovalIcon,
  Book,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  path: string;
  icon: any;
  label: string;
  badge?: string;
  submenu?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['ai-features', 'tools']));

  const mainNavItems: NavItem[] = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/shipments', icon: Package, label: 'Shipments' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/businesses', icon: Building2, label: 'Businesses' },
    { path: '/tracking', icon: Truck, label: 'Tracking' },
    { path: '/invoices', icon: InvoiceIcon, label: 'Invoices' },
  ];

  const aiNavItems: NavItem[] = [
    { path: '/ai-documents', icon: DocumentIcon, label: 'AI Documents', badge: 'NEW' },
    { path: '/ai-invoices', icon: InvoiceIcon, label: 'AI Invoices', badge: 'NEW' },
    { path: '/ai-creative', icon: CreativeIcon, label: 'AI Creative', badge: 'NEW' },
    { path: '/ai-analyst', icon: AnalystIcon, label: 'AI Analyst' },
  ];

  const toolsNavItems: NavItem[] = [
    { path: '/email-system', icon: EmailIcon, label: 'Email System' },
    { path: '/workflows', icon: WorkflowIcon, label: 'AI Workflows', badge: 'NEW' },
    { path: '/autopilot', icon: AutopilotIcon, label: 'AutoPilot' },
    { path: '/automation-rules', icon: AutomationIcon, label: 'Automation Rules' },
    { path: '/document-parser', icon: ParserIcon, label: 'Document Parser' },
    { path: '/voice-tools', icon: VoiceIcon, label: 'Voice Tools' },
    { path: '/api-playground', icon: APIIcon, label: 'API Playground' },
  ];

  const developerNavItems: NavItem[] = [
    { path: '/developer/skills', icon: Code, label: 'Dev Skill Tester', badge: 'BETA' },
    { path: '/developer/simulation', icon: Bot, label: 'Admin Simulation', badge: 'BETA' },
  ];

  const superAdminNavItems: NavItem[] = [
    { path: '/super-admin/command-center', icon: APIIcon, label: 'Command Center', badge: 'ROOT' },
  ];

  const adminNavItems: NavItem[] = [
    { path: '/approvals', icon: ApprovalIcon, label: 'AI Approvals', badge: '5' },
    { path: '/audit-logs', icon: AuditIcon, label: 'Audit Logs' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/roles', icon: ShieldCheck, label: 'Roles & Permissions' },
    { path: '/branches', icon: Building2, label: 'Branches' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/support', icon: SupportIcon, label: 'Support' },
    { path: '/tutorial', icon: Book, label: 'Tutorial', badge: 'NEW' },
  ];

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menuKey)) {
        next.delete(menuKey);
      } else {
        next.add(menuKey);
      }
      return next;
    });
  };

  const renderNavItem = (item: NavItem, isSubmenu = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    // No disabled state - all routes are active since pages exist
    const isDisabled = false;

    if (isDisabled) {
      return (
        <div
          key={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group opacity-50 cursor-not-allowed ${
            isSubmenu ? 'py-2 text-sm' : ''
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
          title={`${item.label} (Coming soon)`}
        >
          <Icon className="w-5 h-5 text-slate-500 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 font-medium text-slate-500 truncate">{item.label}</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-400 rounded-full shrink-0">
                SOON
              </span>
            </>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onClose}
        title={isCollapsed ? item.label : undefined}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
          isActive
            ? 'bg-gradient-to-r from-red-600/20 to-red-700/10 text-red-400 border border-red-500/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
        } ${isSubmenu ? 'py-2 text-sm' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}
      >
        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-red-400' : ''}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1 font-medium truncate">{item.label}</span>
            {item.badge && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${
                item.badge === 'NEW' 
                  ? 'bg-[#DC143C] text-white' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {item.badge}
              </span>
            )}
            {isActive && <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />}
          </>
        )}
      </NavLink>
    );
  };

  const renderMenuSection = (title: string, icon: any, items: NavItem[], menuKey: string) => {
    const Icon = icon;
    const isExpanded = expandedMenus.has(menuKey);

    return (
      <div className="space-y-1">
        <button
          onClick={() => {
            if (isCollapsed) {
              onToggleCollapse();
            }
            toggleMenu(menuKey);
          }}
          className={`flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-xl transition-all ${isCollapsed ? 'justify-center px-2' : ''}`}
          title={isCollapsed ? title : undefined}
        >
          <Icon className="w-5 h-5 text-red-400 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 font-semibold text-sm uppercase tracking-wider text-left truncate">{title}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
        {isExpanded && !isCollapsed && (
          <div className="pl-4 space-y-1 border-l border-slate-700/50 ml-4">
            {items.map((item) => renderNavItem(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full  bg-[#0f172a] border-r border-slate-800/50 transform transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-72'} overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 flex flex-col`}>
        <div className="sticky top-0 z-10  bg-[#0f172a] pb-4">
          <div className="h-16 flex items-center px-4 border-b border-slate-800/50">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'mx-auto' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="whitespace-nowrap">
                  <h1 className="text-white font-bold text-lg tracking-tight">AirPak Express</h1>
                  <p className="text-xs text-slate-500">GETOnline Admin</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button onClick={onToggleCollapse} className="ml-auto p-2 hover:bg-slate-800 rounded-lg hidden lg:block text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button onClick={onClose} className="ml-auto p-2 hover:bg-slate-800 rounded-lg lg:hidden">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {isCollapsed && (
            <div className="flex justify-center mt-4 hidden lg:flex">
              <button onClick={onToggleCollapse} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <nav className="px-3 pb-6 space-y-6 flex-1">
          <div className="space-y-1">
            {!isCollapsed && <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</h3>}
            {mainNavItems.map((item) => renderNavItem(item))}
          </div>
          {renderMenuSection('AI Features', Sparkles, aiNavItems, 'ai-features')}
          {renderMenuSection('Advanced Tools', Bot, toolsNavItems, 'tools')}
          {renderMenuSection('Developer Tools', Code, developerNavItems, 'developer')}
          {renderMenuSection('Administration', ShieldCheck, adminNavItems, 'admin')}
          {renderMenuSection('Super Admin', Zap, superAdminNavItems, 'super-admin')}
        </nav>

        <div className="sticky bottom-0  from-slate-950 to-slate-900/50 p-4 border-t border-slate-800/50">
          <button
            onClick={() => navigate('/logout')}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`flex items-center gap-3 w-full py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
          {!isCollapsed && <p className="text-center text-xs text-slate-600 mt-3">© 2024 Airpak Express</p>}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;