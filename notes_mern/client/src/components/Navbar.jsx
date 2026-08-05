import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { LogOut, Sun, Moon, Database, Cloud, PanelLeftClose, PanelLeftOpen, User, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ user, onLogout, todosCount, mobileOpen, setMobileOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebar_expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebar_expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 72 }
  };

  const SidebarContent = ({ showFull }) => (
    <div className="flex flex-col justify-between h-full">
      {/* Top Section: Branding & Toggle */}
      <div className="flex flex-col gap-6">
        <div className={`flex ${showFull ? "items-center justify-between" : "flex-col items-center gap-4"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-app-accent flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-lg flex-shrink-0 select-none">
              S
            </div>
            {showFull && (
              <div className="flex flex-col animate-fade-in">
                <span className="text-sm font-bold tracking-tight text-app-text">SyncNotes</span>
                <span className="text-[10px] text-app-text-secondary font-medium">SaaS dashboard</span>
              </div>
            )}
          </div>
          {/* Collapse button - only shown on desktop sidebar */}
          {!mobileOpen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:flex p-1.5 rounded-lg border border-app-border bg-app-bg text-app-text-secondary hover:text-app-text transition-colors cursor-pointer"
              aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isExpanded ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-2.5 mt-4">
          {/* Connection status */}
          <div className="relative group">
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl border border-app-border/40 bg-app-bg-secondary/20 transition-all ${
                showFull ? "px-3" : "justify-center"
              }`}
            >
              <div className="relative flex-shrink-0">
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-app-success glow-dot animate-pulse"></span>
                <Cloud size={16} className="text-app-success" />
              </div>
              {showFull && (
                <span className="text-xs font-bold text-app-text animate-fade-in">
                  Cloud Synced
                </span>
              )}
            </div>
            {!showFull && (
              <div className="absolute left-full ml-3 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 dark:bg-zinc-800 border border-app-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                Cloud Synced
              </div>
            )}
          </div>

          {/* Saved count */}
          <div className="relative group">
            <div
              className={`flex items-center gap-3 p-2.5 rounded-xl border border-app-border/40 bg-app-bg-secondary/20 transition-all ${
                showFull ? "px-3" : "justify-center"
              }`}
            >
              <Database size={16} className="text-app-accent flex-shrink-0" />
              {showFull && (
                <div className="flex flex-col min-w-0 animate-fade-in">
                  <span className="text-xs font-bold text-app-text truncate">
                    {todosCount} Notes saved
                  </span>
                </div>
              )}
            </div>
            {!showFull && (
              <div className="absolute left-full ml-3 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 dark:bg-zinc-800 border border-app-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                {todosCount} Notes saved
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-app-border my-2" />

          {/* Theme Toggle */}
          <div className="relative group">
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-app-text-secondary hover:text-app-text hover:bg-app-bg-secondary border border-transparent hover:border-app-border transition-all cursor-pointer ${
                showFull ? "px-3" : "justify-center"
              }`}
            >
              {theme === "light" ? (
                <Moon size={16} className="flex-shrink-0" />
              ) : (
                <Sun size={16} className="flex-shrink-0" />
              )}
              {showFull && (
                <span className="text-xs font-bold animate-fade-in">
                  {theme === "light" ? "Dark Theme" : "Light Theme"}
                </span>
              )}
            </button>
            {!showFull && (
              <div className="absolute left-full ml-3 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 dark:bg-zinc-800 border border-app-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                {theme === "light" ? "Dark Theme" : "Light Theme"}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Section: Profile & Logout */}
      <div className="flex flex-col gap-2.5">
        {/* Profile Info */}
        <div className="relative group">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl border border-app-border/40 bg-app-bg-secondary/10 transition-all ${
              showFull ? "px-3" : "justify-center"
            }`}
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-app-accent text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            {showFull && (
              <div className="flex flex-col min-w-0 animate-fade-in">
                <span className="text-xs font-bold text-app-text truncate">
                  {user?.username || "User"}
                </span>
                <span className="text-[9px] text-app-text-secondary truncate">
                  {user?.email || "active session"}
                </span>
              </div>
            )}
          </div>
          {!showFull && (
            <div className="absolute left-full ml-3 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 dark:bg-zinc-800 border border-app-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
              {user?.username || "Profile"}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="relative group">
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-app-danger/20 hover:bg-app-danger/5 text-app-text-secondary hover:text-app-danger transition-all cursor-pointer ${
              showFull ? "px-3" : "justify-center"
            }`}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {showFull && (
              <span className="text-xs font-bold animate-fade-in">
                Log Out
              </span>
            )}
          </button>
          {!showFull && (
            <div className="absolute left-full ml-3 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 dark:bg-zinc-800 border border-app-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
              Log Out
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col h-screen sticky top-0 bg-app-card border-r border-app-border py-6 px-4 z-30 transition-colors duration-300 select-none flex-shrink-0"
      >
        <SidebarContent showFull={isExpanded} />
      </motion.aside>

      {/* Mobile Drawer Off-Canvas Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 bottom-0 left-0 w-[240px] bg-app-card border-r border-app-border py-6 px-4 z-50 flex flex-col md:hidden transition-colors duration-300"
            >
              <SidebarContent showFull={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
