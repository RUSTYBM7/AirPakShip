import React, { Suspense, lazy, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';

// Lazy load all page components for code splitting - significantly reduces initial bundle size
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ShipmentsPage = lazy(() => import('./pages/ShipmentsPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const TrackingPage = lazy(() => import('./pages/TrackingPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const AIDocumentsPage = lazy(() => import('./pages/ai-features/AIDocumentsPage').then(m => ({ default: m.AIDocumentsPage })));
const AIInvoicesPage = lazy(() => import('./pages/ai-features/AIInvoicesPage'));
const AICreativePage = lazy(() => import('./pages/ai-features/AICreativePage'));
const AIAnalystPage = lazy(() => import('./pages/ai-features/AIAnalystPage'));
const AIWorkflowsPage = lazy(() => import('./pages/ai-features/AIWorkflowsPage'));
const DevSkillTesterPage = lazy(() => import('./pages/ai-features/DevSkillTesterPage'));
const AdminSimulationPage = lazy(() => import('./pages/ai-features/AdminSimulationPage'));
const CommandCenterPage = lazy(() => import('./pages/super-admin/CommandCenterPage'));
const ApprovalGatePage = lazy(() => import('./pages/approvals/ApprovalGatePage'));

// Lazy load new feature pages
const EmailSystemPage = lazy(() => import('./pages/features/EmailSystemPage'));
const AutoPilotPage = lazy(() => import('./pages/features/AutoPilotPage'));
const AutomationRulesPage = lazy(() => import('./pages/features/AutomationRulesPage'));
const DocumentParserPage = lazy(() => import('./pages/features/DocumentParserPage'));
const VoiceToolsPage = lazy(() => import('./pages/features/VoiceToolsPage'));
const APIPlaygroundPage = lazy(() => import('./pages/features/APIPlaygroundPage'));
const AuditLogsPage = lazy(() => import('./pages/features/AuditLogsPage'));
const UsersPage = lazy(() => import('./pages/features/UsersPage'));
const RolesPermissionsPage = lazy(() => import('./pages/features/RolesPermissionsPage'));
const BranchesPage = lazy(() => import('./pages/features/BranchesPage'));
const SettingsPage = lazy(() => import('./pages/features/SettingsPage'));
const SupportPage = lazy(() => import('./pages/features/SupportPage'));
const InvoicesPage = lazy(() => import('./pages/features/InvoicesPage'));
const BusinessesPage = lazy(() => import('./pages/features/BusinessesPage'));
const AdminTutorialPage = lazy(() => import('./pages/features/AdminTutorialPage'));

// Memoized loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400">Loading...</p>
    </div>
  </div>
);

// Protected Route wrapper - optimized to prevent unnecessary re-renders
const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Check auth status synchronously on mount
    const token = localStorage.getItem('airpak_auth_token');
    const user = localStorage.getItem('airpak_user');
    setIsAuthenticated(token && user ? true : false);
  }, []);

  // Memoize the loading state
  const content = useMemo(() => {
    if (isAuthenticated === null) {
      return <PageLoader />;
    }
    if (isAuthenticated === false) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  }, [isAuthenticated]);

  return content;
};

// Settings page also used for forgot-password - lazy loaded
const SettingsPageLoader = lazy(() => import('./pages/features/SettingsPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes - not lazy loaded as they need to be fast */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<SettingsPageLoader />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  {/* Main Features */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/shipments" element={<ShipmentsPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/businesses" element={<BusinessesPage />} />
                  <Route path="/tracking" element={<TrackingPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />

                  {/* AI Features */}
                  <Route path="/ai-documents" element={<AIDocumentsPage />} />
                  <Route path="/ai-invoices" element={<AIInvoicesPage />} />
                  <Route path="/ai-creative" element={<AICreativePage />} />
                  <Route path="/ai-analyst" element={<AIAnalystPage />} />

                  {/* Advanced Tools */}
                  <Route path="/email-system" element={<EmailSystemPage />} />
                  <Route path="/workflows" element={<AIWorkflowsPage />} />
                  <Route path="/autopilot" element={<AutoPilotPage />} />
                  <Route path="/automation-rules" element={<AutomationRulesPage />} />
                  <Route path="/document-parser" element={<DocumentParserPage />} />
                  <Route path="/voice-tools" element={<VoiceToolsPage />} />
                  <Route path="/api-playground" element={<APIPlaygroundPage />} />

                  {/* Developer Tools */}
                  <Route path="/developer/skills" element={<DevSkillTesterPage />} />
                  <Route path="/developer/simulation" element={<AdminSimulationPage />} />

                  {/* Super Admin */}
                  <Route path="/super-admin/command-center" element={<CommandCenterPage />} />

                  {/* Admin Management */}
                  <Route path="/approvals" element={<ApprovalGatePage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPermissionsPage />} />
                  <Route path="/branches" element={<BranchesPage />} />
                  <Route path="/settings" element={<SettingsPageLoader />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/tutorial" element={<AdminTutorialPage />} />
                </Route>
              </Route>

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;