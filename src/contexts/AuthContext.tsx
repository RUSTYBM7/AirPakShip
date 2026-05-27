import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Role, hasPermission, getAccessibleResources, getResourceActions } from '../lib/rbac';
import { createAuditLog } from '../services/audit';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: Role;
  created_at: string;
  last_login?: string;
  avatar_url?: string;
  branch_id?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // RBAC helpers
  canAccess: (resource: string, action: string) => boolean;
  getActions: (resource: string) => string[];
  getAllAccessibleResources: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo credentials for testing
  const demoCredentials = [
    { email: 'admin@airpak-express.com', password: 'Admin@2024', role: 'super_admin', name: 'Admin User' },
    { email: 'manager@airpak-express.com', password: 'Manager@2024', role: 'manager', name: 'Manager User' },
    { email: 'staff@airpak-express.com', password: 'Staff@2024', role: 'staff', name: 'Staff User' },
  ];

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for demo user first
        const demoUserJson = localStorage.getItem('airpak_demo_user');
        if (demoUserJson) {
          const demoUser = JSON.parse(demoUserJson);
          setUser(demoUser);
          setLoading(false);
          return;
        }

        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError && !authError.message.includes('No session')) {
          throw authError;
        }

        if (currentUser) {
          // Fetch user profile from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: profile?.full_name || currentUser.user_metadata?.full_name,
            phone: profile?.phone || currentUser.user_metadata?.phone,
            role: profile?.role || currentUser.user_metadata?.role || 'staff',
            created_at: currentUser.created_at,
            last_login: profile?.last_login,
            avatar_url: profile?.avatar_url,
            branch_id: profile?.branch_id,
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: profile?.full_name || session.user.user_metadata?.full_name,
          phone: profile?.phone || session.user.user_metadata?.phone,
          role: profile?.role || session.user.user_metadata?.role || 'staff',
          created_at: session.user.created_at,
          avatar_url: profile?.avatar_url,
          branch_id: profile?.branch_id,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Log the login action
        await createAuditLog({
          user_id: data.user.id,
          user_email: data.user.email || '',
          action: 'LOGIN',
          resource_type: 'auth',
        });

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: profile?.full_name || data.user.user_metadata?.full_name,
          phone: profile?.phone || data.user.user_metadata?.phone,
          role: profile?.role || data.user.user_metadata?.role || 'staff',
          created_at: data.user.created_at,
          avatar_url: profile?.avatar_url,
          branch_id: profile?.branch_id,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await createAuditLog({
          user_id: user.id,
          user_email: user.email,
          action: 'LOGOUT',
          resource_type: 'auth',
        });
      }
      await supabase.auth.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    }
  };

  // RBAC helpers
  const canAccess = (resource: string, action: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, resource, action);
  };

  const getActions = (resource: string): string[] => {
    if (!user) return [];
    return getResourceActions(user.role, resource);
  };

  const getAllAccessibleResources = (): string[] => {
    if (!user) return [];
    return getAccessibleResources(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, resetPassword, canAccess, getActions, getAllAccessibleResources }}>
      {children}
    </AuthContext.Provider>
  );
};