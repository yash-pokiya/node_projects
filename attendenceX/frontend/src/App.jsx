import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './layouts/AppLayout';
import { registerLogoutCallback } from './api/axiosInstance';
import { Loader2 } from 'lucide-react';
import ToastContainer from './components/ToastContainer';

// Guard wrapper for private authenticated areas
function ProtectedRoute({ children, requireOnboard = true }) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        <span className="mt-4 text-sm font-medium text-slate-500">Securing environment connection...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const needsOnboarding = !user?.isOnboarded;
  if (requireOnboard && needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOnboard && !needsOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Guard wrapper for login/signup pages
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const logout = useAuthStore((state) => state.logout);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    checkAuth();
    initTheme();

    registerLogoutCallback(() => {
      logout();
    });
  }, [checkAuth, initTheme, logout]);

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public auth pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Onboarding Wizard Setup */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboard={false}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Private application shell layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-all root redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
