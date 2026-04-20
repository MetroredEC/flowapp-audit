import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initApiClient } from './utils/api';
import { useAppStore } from './store';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AuditsPage from './pages/AuditsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import AuditDetailPage from './pages/AuditDetailPage';
import FeedbackPage from './pages/FeedbackPage';
import OrdersPage from './pages/OrdersPage';
import AlertsPage from './pages/AlertsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAppStore();
  return session ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize API client
    const baseURL = import.meta.env.VITE_API_URL || (
      import.meta.env.DEV ? 'http://localhost:8787/api' : '/api'
    );
    initApiClient(baseURL);
    setInitialized(true);
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.VITE_BASE_URL || '/flowapp'}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<LoginPage />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/audits" element={<AuditsPage />} />
                  <Route path="/audits/:id" element={<AuditDetailPage />} />
                  <Route path="/assignments" element={<AssignmentsPage />} />
                  <Route path="/feedback" element={<FeedbackPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
