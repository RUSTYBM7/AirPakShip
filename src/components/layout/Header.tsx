import React, { useState } from 'react';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, title: 'AI Document Generated', description: 'Invoice #INV-2024-0156 created', time: '2 min ago', type: 'ai', read: false },
    { id: 2, title: 'Shipment Delayed', description: 'APK001234 delayed due to weather', time: '15 min ago', type: 'alert', read: false },
    { id: 3, title: 'New Business Registration', description: 'ABC Logistics pending KYC review', time: '1 hour ago', type: 'info', read: true },
    { id: 4, title: 'AutoPilot Alert', description: 'Route change suggested for APK001240', time: '2 hours ago', type: 'ai', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ai': return '🤖';
      case 'alert': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('airpak_user');
    localStorage.removeItem('airpak_auth_token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 to-slate-900/90 backdrop-blur-sm border-b border-slate-800/50 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-400" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/50 rounded-xl px-4 py-2 w-80 border border-slate-700/50 focus-within:border-red-500/50 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search shipments, customers, documents..."
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          />
          <kbd className="hidden lg:inline-block px-2 py-1 text-xs text-slate-500 bg-slate-700 rounded">⌘K</kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Quick Actions */}
        <Link
          to="/ai-documents"
          className="hidden md:flex items-center gap-2 px-3 py-2 bg-red-600/10 text-red-400 hover:bg-red-600/20 rounded-lg transition-colors text-sm"
        >
          <span className="text-base">🤖</span>
          AI Generate
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative group"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          ) : (
            <Sun className="w-5 h-5 text-slate-400 group-hover:text-yellow-400 transition-colors" />
          )}
          {/* Tooltip */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </div>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-96 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <button className="text-xs text-red-400 hover:text-red-300">Mark all read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-slate-700/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{notif.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-700 bg-slate-800/50">
                  <Link
                    to="/notifications"
                    className="w-full text-center text-sm text-red-400 hover:text-red-300 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white leading-tight">
                {user?.full_name || 'Admin User'}
              </p>
              <p className="text-xs text-slate-500 capitalize leading-tight">{user?.role || 'staff'}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {showProfile && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">{user?.full_name || 'Admin User'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded-full capitalize">
                    {user?.role || 'staff'}
                  </span>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <div className="my-2 border-t border-slate-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
