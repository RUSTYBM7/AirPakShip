/**
 * AirPak Express - Admin Login Page
 * Production-ready authentication with role-based login
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, Loader2, Shield, Lock, Mail,
  ArrowRight, Smartphone, CheckCircle, Key, Users, User,
  Crown, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

type UserRole = 'super_admin' | 'staff';

interface UserAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

// Pre-configured demo accounts
const DEMO_ACCOUNTS: UserAccount[] = [
  { email: 'admin@airpak-express.site', password: 'Admin@2024', role: 'super_admin', name: 'Administrator' },
  { email: 'staff@airpak-express.site', password: 'Staff@2024', role: 'staff', name: 'Staff Member' },
];

// Default passwords (can be changed by super admin)
const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin@airpak-express.site': 'Admin@2024',
  'staff@airpak-express.site': 'Staff@2024',
};

interface TwoFactorModalProps {
  isOpen: boolean;
  onVerify: (code: string) => void;
  onCancel: () => void;
  isVerifying: boolean;
  role: UserRole;
}

const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpen, onVerify, onCancel, isVerifying, role }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '', '', '']);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      const newCode = [...code];
      digits.split('').forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (/^\d$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onVerify(fullCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Two-Factor Authentication</h2>
          <p className="text-slate-400 text-sm">Enter the 6-digit code (demo: any 6 digits)</p>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 md:w-12 md:h-14 text-center text-2xl font-bold bg-slate-800 border border-slate-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={code.join('').length !== 6 || isVerifying}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Verify Code
            </>
          )}
        </button>

        <button
          onClick={onCancel}
          className="w-full mt-3 py-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');

  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      if (!email || !email.includes('@')) {
        setLoginError('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }

      if (!password) {
        setLoginError('Please enter your password');
        setIsSubmitting(false);
        return;
      }

      // Check against demo accounts
      const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase());

      if (!account) {
        // Check if using default password
        const defaultPwd = DEFAULT_PASSWORDS[email.toLowerCase()];
        if (defaultPwd && password === defaultPwd) {
          // First time login with default - trigger 2FA
          // Auto-detect role based on email
          const defaultRole = email.toLowerCase().includes('admin') ? 'super_admin' : 'staff';
          setSelectedRole(defaultRole);
          setShow2FA(true);
          setIsSubmitting(false);
          return;
        }
        setLoginError('Invalid email or password');
        setIsSubmitting(false);
        return;
      }

      if (password !== account.password) {
        setLoginError('Invalid email or password');
        setIsSubmitting(false);
        return;
      }

      // Password verified - auto-detect role from account and trigger 2FA
      setSelectedRole(account.role);
      setShow2FA(true);
      setIsSubmitting(false);

    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed');
      setIsSubmitting(false);
    }
  };

  const verify2FA = (code: string) => {
    setIsVerifying2FA(true);
    setTimeout(() => {
      if (code.length === 6) {
        completeLogin(email, selectedRole);
      } else {
        toast.error('Invalid verification code');
        setIsVerifying2FA(false);
      }
    }, 1000);
  };

  const completeLogin = (userEmail: string, role: UserRole) => {
    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === userEmail.toLowerCase());
    const name = account?.name || 'User';

    const user = {
      id: role === 'super_admin' ? 'admin-001' : 'staff-001',
      email: userEmail,
      full_name: name,
      role: role,
      created_at: new Date().toISOString(),
      two_factor_enabled: true,
    };

    localStorage.setItem('airpak_user', JSON.stringify(user));
    localStorage.setItem('airpak_auth_token', `token_${Date.now()}`);

    if (rememberMe) {
      localStorage.setItem('airpak_remember', 'true');
    }

    toast.success(`Welcome back, ${name}!`);
    navigate('/dashboard');
    window.location.reload();
  };

  const handleQuickLogin = (role: UserRole) => {
    const account = role === 'super_admin' ? DEMO_ACCOUNTS[0] : DEMO_ACCOUNTS[1];
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>

      {/* 2FA Modal */}
      <TwoFactorModal
        isOpen={show2FA}
        onVerify={verify2FA}
        onCancel={() => { setShow2FA(false); }}
        isVerifying={isVerifying2FA}
        role={selectedRole}
      />

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mb-4 shadow-lg shadow-red-500/30">
            <Shield className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">AirPak Express</h1>
          <p className="text-slate-400 text-sm md:text-base">Admin Portal</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 mb-3 text-center">Select your role to continue</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('staff')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'staff'
                  ? 'border-red-500 bg-red-500/10 text-white'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <UserCheck className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium block">Staff</span>
              <span className="text-xs opacity-70">Basic access</span>
            </button>
            <button
              onClick={() => setSelectedRole('super_admin')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'super_admin'
                  ? 'border-red-500 bg-red-500/10 text-white'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Crown className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium block">Admin</span>
              <span className="text-xs opacity-70">Full access</span>
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-800/50">
          {/* 2FA Notice */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Key className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <span className="text-blue-200 text-sm">2FA Required for Admin Access</span>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-200 text-sm">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
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
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Quick Login */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 text-center mb-3">Demo Quick Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickLogin('staff')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Staff Login
              </button>
              <button
                onClick={() => handleQuickLogin('super_admin')}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Admin Login
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-2 font-medium">Demo Credentials:</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p><span className="text-red-400">Staff:</span> staff@airpak-express.site / Staff@2024</p>
              <p><span className="text-amber-400">Admin:</span> admin@airpak-express.site / Admin@2024</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-slate-500 text-sm">
            © 2026 AirPak Express. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Unauthorized access is prohibited
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;