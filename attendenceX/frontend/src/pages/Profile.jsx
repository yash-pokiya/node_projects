import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import * as profileApi from '../api/profileApi';
import { motion } from 'framer-motion';
import {
  User,
  School,
  Percent,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Sun,
  Moon,
  LogOut,
  Sliders,
  Award,
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const updateUserInStore = useAuthStore((state) => state.updateUserInStore);
  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme || ((t) => {
    if (theme !== t) {
      const toggle = useThemeStore.getState().toggleTheme;
      if (toggle) toggle();
    }
  }));

  const [saveStatus, setSaveStatus] = useState({ success: null, message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'schedule', 'preferences'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startingTotalLectures: 0,
      startingAttendedLectures: 0,
      minimumAttendancePercent: 75,
      averageLecturesPerDay: 4,
      mon: 4,
      tue: 4,
      wed: 4,
      thu: 4,
      fri: 4,
      sat: 0,
      sun: 0,
    },
  });

  // Pre-fill form when user details load
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const res = await profileApi.getProfile();
        if (res.success && res.data.settings) {
          const s = res.data.settings;
          const pattern = s.weeklyPattern || [4, 4, 4, 4, 4, 0, 0];
          reset({
            startingTotalLectures: s.startingTotalLectures || 0,
            startingAttendedLectures: s.startingAttendedLectures || 0,
            minimumAttendancePercent: s.minimumAttendancePercent || 75,
            averageLecturesPerDay: s.averageLecturesPerDay || 4,
            mon: pattern[0] !== undefined ? pattern[0] : 4,
            tue: pattern[1] !== undefined ? pattern[1] : 4,
            wed: pattern[2] !== undefined ? pattern[2] : 4,
            thu: pattern[3] !== undefined ? pattern[3] : 4,
            fri: pattern[4] !== undefined ? pattern[4] : 4,
            sat: pattern[5] !== undefined ? pattern[5] : 0,
            sun: pattern[6] !== undefined ? pattern[6] : 0,
          });
        }
      } catch (err) {
        console.error('Failed to load user profile settings:', err);
      }
    };
    loadUserSettings();
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    setSaveStatus({ success: null, message: '' });

    if (Number(data.startingAttendedLectures) > Number(data.startingTotalLectures)) {
      setSaveStatus({ success: false, message: 'Starting attended count cannot exceed total lectures held.' });
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        startingTotalLectures: Number(data.startingTotalLectures),
        startingAttendedLectures: Number(data.startingAttendedLectures),
        minimumAttendancePercent: Number(data.minimumAttendancePercent),
        averageLecturesPerDay: Number(data.averageLecturesPerDay),
        weeklyPattern: [
          Number(data.mon),
          Number(data.tue),
          Number(data.wed),
          Number(data.thu),
          Number(data.fri),
          Number(data.sat),
          Number(data.sun),
        ]
      };

      const response = await profileApi.updateProfile(payload);
      if (response.success) {
        updateUserInStore(response.data.user);
        setSaveStatus({ success: true, message: 'Workspace configurations updated successfully.' });
        setTimeout(() => setSaveStatus({ success: null, message: '' }), 3000);
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Error occurred while saving configurations.';
      setSaveStatus({ success: false, message: errMsg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      {/* Background glow elements */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 w-72 h-72 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight gradient-text">
              Workspace Settings
            </h1>
            <p className="text-sm text-muted mt-1">
              Configure initial cumulative stats, targets, daily loads, and preferences.
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 bg-danger-bg text-danger hover:bg-danger/25 border border-danger/10 text-xs font-bold rounded-xl cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Settings layout with tabs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Tab selectors */}
          <div className="flex flex-row md:flex-col overflow-x-auto gap-1 bg-card border border-border p-2 rounded-2xl md:w-full no-scrollbar">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4.5 py-3 text-left text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'profile' ? 'bg-primary text-background shadow-md' : 'text-muted hover:text-foreground hover:bg-hover'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Starting Tallies
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4.5 py-3 text-left text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'schedule' ? 'bg-primary text-background shadow-md' : 'text-muted hover:text-foreground hover:bg-hover'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Weekly schedule
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4.5 py-3 text-left text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer flex-shrink-0 ${
                activeTab === 'preferences' ? 'bg-primary text-background shadow-md' : 'text-muted hover:text-foreground hover:bg-hover'
              }`}
            >
              <Settings className="w-4 h-4" />
              Theme Mode
            </button>
          </div>

          {/* Form Card Content */}
          <div className="md:col-span-3 glass-card rounded-3xl p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {saveStatus.message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-3 ${
                    saveStatus.success
                      ? 'bg-success-bg border-success/20 text-success'
                      : 'bg-danger-bg border-danger/20 text-danger'
                  }`}
                >
                  {saveStatus.success ? <CheckCircle className="w-4.5 h-4.5" /> : <AlertCircle className="w-4.5 h-4.5" />}
                  {saveStatus.message}
                </motion.div>
              )}

              {/* Tab 1: Starting Tallies */}
              {activeTab === 'profile' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Starting Tallies</h3>
                    <p className="text-xs text-muted font-semibold mt-0.5">Define your starting semester points and compliance targets.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Initial Total Lectures
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full glass-input text-sm" 
                        {...register('startingTotalLectures', { valueAsNumber: true })} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Initial Attended Lectures
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full glass-input text-sm" 
                        {...register('startingAttendedLectures', { valueAsNumber: true })} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5" /> Compliance target goal (%)
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        className="w-full glass-input text-sm" 
                        {...register('minimumAttendancePercent', { valueAsNumber: true })} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Average lectures per day
                      </label>
                      <input 
                        type="number" 
                        min="1"
                        max="20"
                        className="w-full glass-input text-sm" 
                        {...register('averageLecturesPerDay', { valueAsNumber: true })} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Weekly Schedule */}
              {activeTab === 'schedule' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Weekly distribution Pattern</h3>
                    <p className="text-xs text-muted font-semibold mt-0.5">Control the standard lecture counts held on each weekday to improve projections.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { label: 'Mon', reg: 'mon' },
                      { label: 'Tue', reg: 'tue' },
                      { label: 'Wed', reg: 'wed' },
                      { label: 'Thu', reg: 'thu' },
                      { label: 'Fri', reg: 'fri' },
                    ].map((day) => (
                      <div key={day.label} className="space-y-1.5 text-center">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">{day.label}</label>
                        <input 
                          type="number" 
                          min="0"
                          max="12"
                          className="w-full glass-input text-center text-xs" 
                          {...register(day.reg, { valueAsNumber: true })} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Theme Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Theme Preference</h3>
                    <p className="text-xs text-muted font-semibold mt-0.5">Choose the visual styling language of your app.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Light Option */}
                    <div 
                      onClick={() => setTheme('light')}
                      className={`p-5 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                        theme === 'light' 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border bg-card hover:bg-hover'
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <span className="text-xs font-extrabold text-foreground block">Light Theme</span>
                      <span className="text-[10px] text-muted block mt-0.5">Minimal Light style</span>
                    </div>

                    {/* Dark Option */}
                    <div 
                      onClick={() => setTheme('dark')}
                      className={`p-5 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                        theme === 'dark' 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border bg-card hover:bg-hover'
                      }`}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <span className="text-xs font-extrabold text-foreground block">Dark Theme</span>
                      <span className="text-[10px] text-muted block mt-0.5">Sleek Dark style</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Save Action */}
              {activeTab !== 'preferences' && (
                <div className="flex justify-end pt-5 border-t border-border">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-semibold py-2.5 px-6 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving configurations...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </motion.button>
                </div>
              )}

            </form>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
