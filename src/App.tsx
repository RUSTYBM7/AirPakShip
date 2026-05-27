import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';

// Lazy load pages
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import CustomersPage from './pages/CustomersPage';
import TrackingPage from './pages/TrackingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { AIDocumentsPage } from './pages/ai-features/AIDocumentsPage';
import AIInvoicesPage from './pages/ai-features/AIInvoicesPage';
import AICreativePage from './pages/ai-features/AICreativePage';
import AIAnalystPage from './pages/ai-features/AIAnalystPage';
import AIWorkflowsPage from './pages/ai-features/AIWorkflowsPage';
import DevSkillTesterPage from './pages/ai-features/DevSkillTesterPage';
import AdminSimulationPage from './pages/ai-features/AdminSimulationPage';
import CommandCenterPage from './pages/super-admin/CommandCenterPage';
import ApprovalGatePage from './pages/approvals/ApprovalGatePage';

// New Active Feature Pages
import EmailSystemPage from './pages/features/EmailSystemPage';
import AutoPilotPage from './pages/features/AutoPilotPage';
import AutomationRulesPage from './pages/features/AutomationRulesPage';
import DocumentParserPage from './pages/features/DocumentParserPage';
import VoiceToolsPage from './pages/features/VoiceToolsPage';
import APIPlaygroundPage from './pages/features/APIPlaygroundPage';
import AuditLogsPage from './pages/features/AuditLogsPage';
import UsersPage from './pages/features/UsersPage';
import RolesPermissionsPage from './pages/features/RolesPermissionsPage';
import BranchesPage from './pages/features/BranchesPage';
import SettingsPage from './pages/features/SettingsPage';
import SupportPage from './pages/features/SupportPage';
import InvoicesPage from './pages/features/InvoicesPage';
import BusinessesPage from './pages/features/BusinessesPage';
import AdminTutorialPage from './pages/features/AdminTutorialPage';

// Protected Route wrapper with enhanced security
const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('airpak_auth_token');
    const user = localStorage.getItem('airpak_user');
    if (token && user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Initializing secure session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<SettingsPage />} />

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

                {/* Advanced Tools - NOW ACTIVE */}
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

                {/* Admin Management - NOW ACTIVE */}
                <Route path="/approvals" element={<ApprovalGatePage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/roles" element={<RolesPermissionsPage />} />
                <Route path="/branches" element={<BranchesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/tutorial" element={<AdminTutorialPage />} />
              </Route>
            </Route>

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
