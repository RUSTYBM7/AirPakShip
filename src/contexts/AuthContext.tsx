import React, { createContext, useContext, useState, useEffect, useCallback, memo, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Role, hasPermission, getAccessibleResources, getResourceActions } from '../lib/rbac';
import { createAuditLog } from '../services/audit';
import toast from 'react-hot-toast';

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
  two_factor_enabled?: boolean;
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

// Memoize RBAC helper functions
const createRBACHelpers = (user: User | null) => ({
  canAccess: (resource: string, action: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, resource, action);
  },
  getActions: (resource: string): string[] => {
    if (!user) return [];
    return getResourceActions(user.role, resource);
  },
  getAllAccessibleResources: (): string[] => {
    if (!user) return [];
    return getAccessibleResources(user.role);
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize demo credentials
  const demoCredentials = useMemo(() => [
    { email: 'admin@airpak-express.site', password: 'Admin@2024', role: 'super_admin' as Role, name: 'Admin User' },
    { email: 'manager@airpak-express.site', password: 'Manager@2024', role: 'manager' as Role, name: 'Manager User' },
    { email: 'staff@airpak-express.site', password: 'Staff@2024', role: 'staff' as Role, name: 'Staff User' },
  ], []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for demo user first - this is critical for admin login
        const demoUserJson = localStorage.getItem('airpak_demo_user');
        if (demoUserJson) {
          try {
            const demoUser = JSON.parse(demoUserJson);
            setUser(demoUser);
            setLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse demo user:', e);
            localStorage.removeItem('airpak_demo_user');
          }
        }

        // Try Supabase auth
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError && !authError.message.includes('No session') && !authError.message.includes('Invalid')) {
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

    // Listen for auth changes - properly cleaned up
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Check demo credentials first
      const demoAccount = demoCredentials.find(
        acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (demoAccount) {
        const demoUser: User = {
          id: `demo-${Date.now()}`,
          email: demoAccount.email,
          full_name: demoAccount.name,
          role: demoAccount.role,
          created_at: new Date().toISOString(),
          two_factor_enabled: true,
        };
        localStorage.setItem('airpak_demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        toast.success(`Welcome, ${demoAccount.name}!`);
        return;
      }

      // Try Supabase auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Login failed');
        throw authError;
      }

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

        const loggedInUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: profile?.full_name || data.user.user_metadata?.full_name,
          phone: profile?.phone || data.user.user_metadata?.phone,
          role: profile?.role || data.user.user_metadata?.role || 'staff',
          created_at: data.user.created_at,
          avatar_url: profile?.avatar_url,
          branch_id: profile?.branch_id,
        };

        setUser(loggedInUser);
        toast.success(`Welcome, ${loggedInUser.full_name || 'User'}!`);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [demoCredentials]);

  const logout = useCallback(async () => {
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
      // Clear demo user
      localStorage.removeItem('airpak_demo_user');
      localStorage.removeItem('airpak_remember');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    }
  }, [user]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    }
  }, []);

  // Memoize RBAC helpers
  const rbacHelpers = useMemo(() => createRBACHelpers(user), [user]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    resetPassword,
    ...rbacHelpers,
  }), [user, loading, error, login, logout, resetPassword, rbacHelpers]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = 'AuthProvider';

export default AuthProvider;