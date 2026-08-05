import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery, useTheme, Snackbar, Alert } from '@mui/material';

// Store & Services
import store from './store';
import { getTheme } from './theme/muiTheme';
import { setUser, logout } from './store/slices/authSlice';
import authService from './services/authService';

// Layout & UI Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/Dashboard';
import QuestionsList from './pages/admin/QuestionsList';
import CreateQuestion from './pages/admin/CreateQuestion';
import EditQuestion from './pages/admin/EditQuestion';
import ViewQuestion from './pages/admin/ViewQuestion';
import Lobby from './pages/quiz/Lobby';
import Attempt from './pages/quiz/Attempt';
import Result from './pages/quiz/Result';

// Light/Dark Theme Mode Context
export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'light' });
export const useColorMode = () => useContext(ColorModeContext);

// ── Protected Route Guard Component ──
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Verifying authentication credentials..." />;
  }

  if (!token || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/quiz'} replace />;
  }

  return <Outlet />;
};

// ── Main Page Layout Wrapper (Navbar + Sidebar + Footer) ──
const LayoutWrapper = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box className="flex flex-col min-h-screen">
      <Navbar onMenuClick={handleDrawerToggle} />
      <Box className="flex flex-1">
        <Sidebar open={mobileOpen} onClose={handleDrawerToggle} isMobile={isMobile} />
        <Box
          component="main"
          className="flex-1 flex flex-col p-4 md:p-6"
          sx={{
            width: { lg: 'calc(100% - 260px)' },
            mt: '64px',
            bgcolor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Box className="flex-1">
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

// ── Auth Restored Wrapper (Prevents blank screens on refresh) ──
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [initFinished, setInitFinished] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.data.success && res.data.user) {
            dispatch(setUser({ user: res.data.user, token }));
          } else {
            localStorage.removeItem('token');
            dispatch(logout());
          }
        } catch (err) {
          localStorage.removeItem('token');
          dispatch(logout());
        }
      }
      setInitFinished(true);
    };

    initializeAuth();
  }, [dispatch]);

  if (!initFinished) {
    return <LoadingSpinner message="Restoring active user profile session..." />;
  }

  return children;
};

// ── App Inner Router Content ──
function AppContent() {
  const [mode, setMode] = useState('light');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme-mode', newMode);
          return newMode;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const handleSnackbar = (e) => {
      setSnackbar({
        open: true,
        message: e.detail.message,
        severity: e.detail.severity || 'info',
      });
    };
    window.addEventListener('app-snackbar', handleSnackbar);
    return () => {
      window.removeEventListener('app-snackbar', handleSnackbar);
    };
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogoutEvent = () => {
      dispatch(logout());
      window.location.href = '/auth/login';
    };
    window.addEventListener('app-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('app-logout', handleLogoutEvent);
    };
  }, [dispatch]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div id="__next_root" className={mode === 'dark' ? 'dark' : ''}>
          <BrowserRouter>
            <AuthInitializer>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Guest-only routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />

                {/* Protected routes wrapped under layout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<LayoutWrapper />}>
                    {/* User Quizzes */}
                    <Route path="/quiz" element={<Lobby />} />
                    <Route path="/quiz/attempt" element={<Attempt />} />
                    <Route path="/quiz/result" element={<Result />} />

                    {/* Admin CRUD Management */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/admin" element={<Dashboard />} />
                      <Route path="/admin/questions" element={<QuestionsList />} />
                      <Route path="/admin/questions/create" element={<CreateQuestion />} />
                      <Route path="/admin/questions/:id/edit" element={<EditQuestion />} />
                      <Route path="/admin/questions/:id/view" element={<ViewQuestion />} />
                    </Route>
                  </Route>
                </Route>

                {/* Redirect mismatched paths home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AuthInitializer>
          </BrowserRouter>
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// ── Main Root Application ──
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
