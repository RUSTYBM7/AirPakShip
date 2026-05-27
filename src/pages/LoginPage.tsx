import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, error, loading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Demo credentials (for testing without Supabase)
  const demoCredentials = [
    { email: 'admin@airpak-express.com', password: 'Admin@2024', role: 'super_admin', name: 'Admin User' },
    { email: 'manager@airpak-express.com', password: 'Manager@2024', role: 'manager', name: 'Manager User' },
    { email: 'staff@airpak-express.com', password: 'Staff@2024', role: 'staff', name: 'Staff User' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    // Check demo credentials first
    const demoUser = demoCredentials.find(
      (d) => d.email === email && d.password === password
    );

    if (demoUser) {
      // Demo mode - set mock user
      const mockUser = {
        id: 'demo-' + demoUser.role,
        email: demoUser.email,
        full_name: demoUser.name,
        role: demoUser.role as any,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('airpak_demo_user', JSON.stringify(mockUser));
      localStorage.setItem('supabase.auth.token', 'demo-token');
      navigate('/dashboard');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials. Try demo credentials below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg shadow-red-500/30">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Airpak Express</h1>
          <p className="text-slate-400">GETOnline Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-800/50">
          <h2 className="text-xl font-semibold text-white mb-6">Sign In</h2>

          {(loginError || error) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-200 text-sm">{loginError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@airpak-express.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-red-400 text-center mb-3 font-semibold">DEMO CREDENTIALS (Click to auto-fill)</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@airpak-express.com');
                  setPassword('Admin@2024');
                }}
                className="w-full p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-white text-sm font-medium">Super Admin</p>
                <p className="text-slate-400 text-xs">admin@airpak-express.com / Admin@2024</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('manager@airpak-express.com');
                  setPassword('Manager@2024');
                }}
                className="w-full p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-white text-sm font-medium">Manager</p>
                <p className="text-slate-400 text-xs">manager@airpak-express.com / Manager@2024</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('staff@airpak-express.com');
                  setPassword('Staff@2024');
                }}
                className="w-full p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors text-left"
              >
                <p className="text-white text-sm font-medium">Staff</p>
                <p className="text-slate-400 text-xs">staff@airpak-express.com / Staff@2024</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          © 2024 Airpak Express. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;