import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import * as attendanceApi from '../api/attendanceApi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Clock,
  Calendar as CalendarIcon, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Command,
  GraduationCap,
  Sparkles,
  SearchCode,
  CheckCircle2,
  CalendarRange
} from 'lucide-react';

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const searchInputRef = useRef(null);

  // Fetch stats periodically for top navbar indicators
  const loadStats = async () => {
    try {
      const response = await attendanceApi.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load top navbar stats', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, location.pathname]);

  // Command palette listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus search input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearchQuery('');
      setSelectedIdx(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isCommandPaletteOpen]);

  const navGroups = [
    {
      title: 'Workspace',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, desc: 'View summary of academic health' },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { name: 'Profile Configuration', href: '/profile', icon: User, desc: 'Manage overrides and targets' },
      ]
    }
  ];

  const allCommands = [
    { name: 'Go to Dashboard', action: () => navigate('/dashboard'), icon: LayoutDashboard, category: 'Navigation' },
    { name: 'Go to Profile Settings', action: () => navigate('/profile'), icon: User, category: 'Navigation' },
    { name: 'Toggle Theme Mode', action: () => toggleTheme(), icon: theme === 'dark' ? Sun : Moon, category: 'Preferences' },
    { name: 'Sign Out Session', action: () => logout(), icon: LogOut, category: 'System' },
  ];

  const filteredCommands = allCommands.filter(cmd => 
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommandPaletteKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIdx]) {
        filteredCommands[selectedIdx].action();
        setIsCommandPaletteOpen(false);
      }
    }
  };

  const overallPercent = stats?.overall?.percent || 0.0;
  const isTargetAchieved = overallPercent >= (stats?.overall?.targetGoal || 75);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col md:flex-row relative">
      
      {/* Sidebar - Desktop Layout (Notion / Linear inspired) */}
      <aside 
        className={`hidden md:flex flex-col bg-sidebar border-r border-border sticky top-0 h-screen z-40 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-5'
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between mb-6 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-2'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-background flex items-center justify-center font-extrabold shadow-md">
              A
            </div>
            {!isSidebarCollapsed && (
              <span className="font-extrabold tracking-tight text-base gradient-text">AttendX</span>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button 
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1 rounded-lg hover:bg-hover text-muted transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="flex items-center justify-center p-1.5 rounded-lg hover:bg-hover text-muted mx-auto mb-6 transition-all cursor-pointer border border-border"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        )}

        {/* Grouped Navigation menu */}
        <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider px-3 select-none">
                  {group.title}
                </span>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center rounded-xl text-xs font-semibold transition-all relative ${
                        isSidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4.5 py-2.5'
                      } ${
                        isActive
                          ? 'text-foreground bg-active shadow-sm border border-border'
                          : 'text-muted hover:text-foreground hover:bg-hover'
                      }`}
                      title={isSidebarCollapsed ? item.name : undefined}
                    >
                      {isActive && !isSidebarCollapsed && (
                        <motion.div
                          layoutId="activeSideNav"
                          className="absolute left-0 w-1 h-5 bg-primary rounded-r"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted'}`} />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Modern Profile Card & Stats at Bottom */}
        {!isSidebarCollapsed ? (
          <div className="p-3 bg-hover border border-border/80 rounded-2xl space-y-3 mt-4 animate-fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-black text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="text-xs font-bold text-foreground block leading-tight truncate">{user?.name}</span>
                <span className="text-[10px] text-muted block leading-none truncate mt-0.5">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-2.5 text-[10px] font-bold text-muted">
              <span className="px-2 py-0.5 rounded bg-background border border-border flex items-center gap-1">
                Target: {stats?.overall?.targetGoal || 75}%
              </span>
              <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${isTargetAchieved ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                {overallPercent}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-border mt-4">
            <Link to="/profile" title="View Profile">
              <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-black text-xs cursor-pointer">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Header - Mobile View */}
      <header className="md:hidden h-16 px-4 flex items-center justify-between border-b border-border sticky top-0 z-50 bg-navbar backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-background flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-extrabold tracking-tight text-lg">AttendX</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg border border-border hover:bg-hover transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs mt-16"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-border p-5 z-45 flex flex-col justify-between"
            >
              <nav className="space-y-6">
                {navGroups.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider px-2 select-none">
                      {group.title}
                    </span>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                              isActive
                                ? 'text-foreground bg-active border border-border shadow-sm'
                                : 'text-muted hover:bg-hover'
                            }`}
                          >
                            <Icon className="w-5 h-5 text-primary" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="pt-4 border-t border-border space-y-2">
                <button
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-muted hover:bg-hover cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-muted" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-danger hover:bg-danger-bg cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Desktop Premium Top Navbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 border-b border-border bg-navbar backdrop-blur-md sticky top-0 z-35">
          {/* Global Search Bar Triggering Command Palette */}
          <div 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative w-72 cursor-pointer group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
            <div className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-hover/60 text-xs text-muted font-medium hover:bg-hover hover:text-foreground transition-all flex items-center justify-between">
              <span>Quick Command search...</span>
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-card text-[9px] font-bold">
                <Command className="w-2.5 h-2.5" /> K
              </div>
            </div>
          </div>

          {/* Quick Metrics & Profiles */}
          <div className="flex items-center gap-6">
            
            {/* Semester Indicator */}
            {stats?.overall && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-hover border border-border text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span>Goal Target: {stats.overall.targetGoal}%</span>
              </div>
            )}

            {/* Attendance % Ring Indicator */}
            {stats && (
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted block leading-none">Attendance</span>
                  <span className={`text-xs font-black ${isTargetAchieved ? 'text-success' : 'text-danger'}`}>
                    {overallPercent}%
                  </span>
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.5" className="text-border" fill="transparent" />
                    <circle 
                      cx="16" cy="16" r="13" 
                      stroke="currentColor" strokeWidth="2.5" 
                      className={isTargetAchieved ? 'text-success' : 'text-danger'}
                      strokeDasharray={2 * Math.PI * 13}
                      strokeDashoffset={2 * Math.PI * 13 * (1 - Math.min(overallPercent, 100) / 100)}
                      fill="transparent" 
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Quick Actions (Command palette indicator) */}
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-1.5 rounded-lg text-muted hover:bg-hover transition-colors relative cursor-pointer"
              title="Open Command Palette"
            >
              <SearchCode className="w-4.5 h-4.5" />
            </button>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-muted hover:bg-hover transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-warning" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-border select-none">
              <div className="w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-black text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-foreground block leading-tight">{user?.name || 'Student'}</span>
                <span className="text-[9px] text-muted font-semibold block leading-none mt-0.5">{user?.email}</span>
              </div>
            </div>

          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 relative">
          <Outlet />
        </main>
      </div>

      {/* Ctrl+K Command Palette Modal Overlay */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommandPaletteOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[50vh]"
            >
              {/* Input Area */}
              <div className="flex items-center gap-2.5 px-4.5 border-b border-border">
                <Search className="w-4 h-4 text-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type a command or category to filter..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIdx(0);
                  }}
                  onKeyDown={handleCommandPaletteKey}
                  className="w-full py-4 text-sm bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder:text-muted"
                />
                <span className="text-[9px] font-black uppercase text-muted tracking-widest bg-hover border border-border px-1.5 py-0.5 rounded flex items-center gap-1 select-none">
                  ESC
                </span>
              </div>

              {/* Commands List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredCommands.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted font-semibold">
                    No commands matched your query.
                  </div>
                ) : (
                  filteredCommands.map((cmd, idx) => {
                    const CmdIcon = cmd.icon;
                    const isSelected = idx === selectedIdx;

                    return (
                      <button
                        key={cmd.name}
                        onClick={() => {
                          cmd.action();
                          setIsCommandPaletteOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIdx(idx)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                          isSelected ? 'bg-primary text-background shadow-md' : 'text-foreground hover:bg-hover'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <CmdIcon className={`w-4 h-4 ${isSelected ? 'text-background animate-pulse' : 'text-muted'}`} />
                          <span>{cmd.name}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-background/20 text-background' : 'bg-hover text-muted'
                        }`}>
                          {cmd.category}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Palette Footer */}
              <div className="p-3 border-t border-border bg-hover flex items-center justify-between text-[9px] font-bold text-muted uppercase tracking-wider select-none px-4">
                <span className="flex items-center gap-1.5">
                  Use ↑↓ to navigate • ↵ to select
                </span>
                <span>Command Palette</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
