import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import * as attendanceApi from '../api/attendanceApi';
import { simulateWhatIf, calculateSafeBunks, getAttendanceStatus } from '../utils/attendanceEngine';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Loader2,
  Clock,
  Sparkles,
  Award,
  Calendar,
  Undo2,
  Plus,
  Minus,
  CalendarRange,
  RefreshCw,
  Compass
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const [stats, setStats] = useState(null);
  const [calendarRecords, setCalendarRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Daily log inputs
  const [todayTotal, setTodayTotal] = useState(4);
  const [todayAttended, setTodayAttended] = useState(4);

  // Undo support state
  const [lastLoggedPayload, setLastLoggedPayload] = useState(null);
  const [showUndo, setShowUndo] = useState(false);

  // What-If local simulation slider
  const [simulateLectures, setSimulateLectures] = useState(0); // number of upcoming lectures
  const [simulateAttended, setSimulateAttended] = useState(0); // number of them attended

  // Load stats and calendar entries
  const fetchDashboardData = useCallback(async () => {
    try {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const end = new Date();

      const [statsRes, calendarRes] = await Promise.all([
        attendanceApi.getStats(),
        attendanceApi.getCalendar(start.toISOString(), end.toISOString()),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
        
        // Auto-detect daily lecture defaults based on weeklyPattern
        const dayIdx = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6
        const pattern = statsRes.data.overall?.weeklyPattern || [4, 4, 4, 4, 4, 0, 0];
        const defaultTotal = pattern[dayIdx] !== undefined ? pattern[dayIdx] : 4;
        
        setTodayTotal(defaultTotal);
        setTodayAttended(defaultTotal);
      }

      if (calendarRes.success) {
        setCalendarRecords(calendarRes.data.records || []);
      }
    } catch (err) {
      console.error('Failed to retrieve dashboard summaries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle logging today's attendance counts
  const handleLogAttendance = async (e) => {
    if (e) e.preventDefault();
    if (todayAttended > todayTotal) {
      setErrorMessage('Attended count cannot exceed total lectures held.');
      return;
    }

    setLogLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        totalLectures: Number(todayTotal),
        attendedLectures: Number(todayAttended),
        date: new Date().toISOString()
      };

      const res = await attendanceApi.markAttendance(payload);
      if (res.success) {
        setLastLoggedPayload(payload);
        setSuccessMessage('Today’s attendance has been logged successfully!');
        setShowUndo(true);
        // Dismiss undo banner after 10s
        setTimeout(() => setShowUndo(false), 10000);
        await fetchDashboardData();
      }
    } catch (err) {
      const detailsMsg = Array.isArray(err.response?.data?.details) 
        ? err.response.data.details.join(', ') 
        : null;
      setErrorMessage(detailsMsg || err.response?.data?.message || 'Failed to submit daily log.');
    } finally {
      setLogLoading(false);
    }
  };

  // Undo last logged tally via backend revert endpoint
  const handleUndo = async () => {
    setLogLoading(true);
    try {
      const res = await attendanceApi.undoLastLog();
      if (res.success) {
        setSuccessMessage('Previous entry successfully undone.');
        setShowUndo(false);
        await fetchDashboardData();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to revert log entry.');
    } finally {
      setLogLoading(false);
    }
  };

  // Compute what-if simulation results using the client-side engine
  // NOTE: This hook MUST be above the early loading return (Rules of Hooks)
  const simulationResult = useMemo(() => {
    const a = stats?.overall?.attended || 0;
    const t = stats?.overall?.total || 0;
    const g = stats?.overall?.targetGoal || 75;
    const bunkCount = Math.max(0, Number(simulateLectures) - Number(simulateAttended));
    const events = [];
    if (Number(simulateAttended) > 0) events.push({ status: 'present', count: Number(simulateAttended) });
    if (bunkCount > 0) events.push({ status: 'absent', count: bunkCount });
    return simulateWhatIf({ attended: a, total: t, minPercent: g }, events);
  }, [stats, simulateLectures, simulateAttended]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const overall = stats?.overall || {
    total: 0,
    attended: 0,
    percent: 0,
    safeBunks: 0,
    recovery: { mustAttend: 0, canMiss: 0, isAchievable: true },
    targetGoal: 75,
    averageDaily: 4,
    weeklyPattern: [4, 4, 4, 4, 4, 0, 0],
    status: 'safe',
    forecast: { expectedLectures: 0, bestCasePercent: 0, trendCasePercent: 0, worstCasePercent: 0, dailyBreakdown: [] },
    safeBunkPlan: { rightNow: 0, thisWeek: 0, thisMonth: 0 },
    recoveryPlan: [],
    recommendations: [],
  };

  const isTargetAchieved = overall.percent >= overall.targetGoal;
  const simulatedPercent = simulationResult.percent;

  // Use server-computed recommendations from the Prediction Engine
  const insights = (overall.recommendations || []).map(rec => ({
    type: rec.type === 'safe' ? 'success'
      : rec.type === 'danger' ? 'danger'
      : rec.type === 'caution' ? 'warning'
      : rec.type === 'success' ? 'success'
      : rec.type === 'warning' ? 'warning'
      : 'info',
    text: rec.message,
  }));

  // Use forecast dailyBreakdown from the Prediction Engine for chart data
  const forecastBreakdown = overall.forecast?.dailyBreakdown || [];
  const projectionData = [
    {
      day: 'Today',
      '100% Attendance': Math.round(overall.percent),
      'Maintain Rate': Math.round(overall.percent),
      Target: overall.targetGoal,
    },
    ...forecastBreakdown
      .filter((_, idx) => idx % 6 === 5) // Sample every ~6 days for 5 chart points
      .slice(0, 5)
      .map((d, i) => ({
        day: `Day ${(i + 1) * 6}`,
        '100% Attendance': Math.round(d.bestPercent),
        'Maintain Rate': Math.round(d.trendPercent),
        Target: overall.targetGoal,
      })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Background glow element */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 animate-fade-in"
      >
        {/* Greetings & Streak Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight gradient-text">
              Dashboard Calculator
            </h1>
            <p className="text-sm text-muted mt-1">
              Minimum typing, maximum calculator intelligence. Log daily and plan ahead.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-warning-bg border border-warning/20 rounded-xl text-warning font-bold text-xs select-none">
              <Flame className="w-4 h-4 fill-warning text-warning animate-bounce" />
              <span>{user?.streakStats?.currentStreak || 0} Day Streak</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="p-2 border border-border hover:bg-hover rounded-xl text-muted hover:text-foreground cursor-pointer transition-colors"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-danger-bg border border-danger/25 text-danger rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-success-bg border border-success/25 text-success rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Calculator Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT & CENTER COLS (Daily Logger & Simulation) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Daily Entry logger with large modifiers */}
            <div className="glass-card rounded-3xl p-6 select-none relative overflow-hidden">
              <h3 className="text-base font-black tracking-tight text-foreground flex items-center gap-2 mb-1.5">
                <Clock className="w-4.5 h-4.5 text-primary" /> Log Today's Lecture Tallies
              </h3>
              <p className="text-xs text-muted font-semibold mb-5 leading-relaxed">
                Log the held and attended counts for today. Defaults prefilled based on weekly schedule pattern capacity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Total held lectures */}
                <div className="flex flex-col items-center gap-1.5 p-3 bg-hover/40 border border-border/80 rounded-2xl">
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest block">Lectures Held</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        const v = Math.max(0, todayTotal - 1);
                        setTodayTotal(v);
                        if (todayAttended > v) setTodayAttended(v);
                      }}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-card text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-black text-foreground w-6 text-center">{todayTotal}</span>
                    <button
                      type="button"
                      onClick={() => setTodayTotal(todayTotal + 1)}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-card text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Attended lectures */}
                <div className="flex flex-col items-center gap-1.5 p-3 bg-hover/40 border border-border/80 rounded-2xl">
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest block">Lectures Attended</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTodayAttended(Math.max(0, todayAttended - 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-card text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-black text-foreground w-6 text-center">{todayAttended}</span>
                    <button
                      type="button"
                      onClick={() => setTodayAttended(Math.min(todayTotal, todayAttended + 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-card text-foreground hover:bg-hover transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Log Tallies Trigger */}
                <button
                  onClick={handleLogAttendance}
                  disabled={logLoading}
                  className="w-full h-full py-4.5 px-4 rounded-2xl bg-primary text-background font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {logLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Log Lectures'
                  )}
                </button>
              </div>
            </div>

            {/* Smart insights feed */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-base font-black tracking-tight text-foreground flex items-center gap-2 mb-1.5">
                <Compass className="w-4.5 h-4.5 text-primary" /> Smart calculator recommendations
              </h3>
              <p className="text-xs text-muted font-semibold mb-4">
                Real-time recommendations generated from compliance targets.
              </p>

              <div className="space-y-3">
                {insights.map((ins, idx) => {
                  const typeStyles = {
                    success: 'bg-success/5 border-success/15 text-success',
                    info: 'bg-primary/5 border-primary/15 text-primary',
                    warning: 'bg-warning/5 border-warning/15 text-warning',
                    danger: 'bg-danger/5 border-danger/15 text-danger'
                  };

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 border rounded-2xl text-xs font-semibold flex items-start gap-2.5 ${typeStyles[ins.type] || typeStyles.info}`}
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{ins.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What-If Slider Projections */}
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-base font-black tracking-tight text-foreground flex items-center gap-2 mb-1.5">
                <Sliders className="w-4.5 h-4.5 text-primary" /> What-if interactive simulator
              </h3>
              <p className="text-xs text-muted font-semibold mb-6">
                Preview how hypothetical upcoming attendance decisions affect your total compliance percentage.
              </p>

              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-foreground">
                    <span>Evaluate next lectures count</span>
                    <span className="text-primary font-black">{simulateLectures} Lectures</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    className="w-full accent-primary bg-hover cursor-pointer rounded-lg h-2"
                    value={simulateLectures}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setSimulateLectures(v);
                      if (simulateAttended > v) setSimulateAttended(v);
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-foreground">
                    <span>Attend count</span>
                    <span className="text-primary font-black">{simulateAttended} / {simulateLectures}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={simulateLectures}
                    className="w-full accent-primary bg-hover cursor-pointer rounded-lg h-2"
                    value={simulateAttended}
                    disabled={simulateLectures === 0}
                    onChange={(e) => setSimulateAttended(Number(e.target.value))}
                  />
                </div>

                <div className="p-4 bg-hover border border-border rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">Simulated Compliance Output:</span>
                  <span className={`text-base font-black ${simulatedPercent >= overall.targetGoal ? 'text-success' : 'text-danger'}`}>
                    {simulatedPercent}%
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (Visual stats rings, cushion counters, recovery routes) */}
          <div className="space-y-6">

            {/* Attendance % Ring */}
            <div className="glass-card rounded-3xl p-6 text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Compliance percentage</span>
              
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="6" className="text-border" fill="transparent" />
                  <circle 
                    cx="72" cy="72" r="62" 
                    stroke="currentColor" strokeWidth="6" 
                    className={isTargetAchieved ? 'text-success' : 'text-danger'}
                    strokeDasharray={2 * Math.PI * 62}
                    strokeDashoffset={2 * Math.PI * 62 * (1 - Math.min(overall.percent, 100) / 100)}
                    fill="transparent" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-foreground">{overall.percent}%</span>
                  <span className="text-[9px] font-semibold text-muted uppercase mt-0.5">Overall</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-bold text-muted">
                <span>Total Held: {overall.total}</span>
                <span>Attended: {overall.attended}</span>
              </div>
            </div>

            {/* Cushion of Safe Bunks */}
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between min-h-[140px]">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Safe bunks cushion</span>
                <span className="text-4xl font-black text-foreground block">{overall.safeBunks}</span>
              </div>
              <p className="text-[10px] text-muted font-semibold mt-3">
                {overall.safeBunks > 0 
                  ? 'You have extra cushion lectures you can skip without falling below target.' 
                  : 'No cushion left. Bunking any lecture now will drop you below target.'}
              </p>
            </div>

            {/* Recovery route */}
            <div className="glass-card rounded-3xl p-6 min-h-[140px] flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Recovery Route</span>
                <h4 className="text-sm font-bold text-foreground mt-1">
                  {overall.percent >= overall.targetGoal 
                    ? 'Compliance targets achieved' 
                    : `Must attend next consecutive classes`}
                </h4>
                <span className="text-4xl font-black text-foreground block">
                  {overall.percent >= overall.targetGoal ? '✓' : overall.recovery.mustAttend}
                </span>
              </div>
              <p className="text-[10px] text-muted font-semibold mt-3">
                {overall.percent >= overall.targetGoal
                  ? 'Great job! Maintain your current attendance rate to safeguard compliance.'
                  : `Attend the next ${overall.recovery.mustAttend} lectures consecutively to return to ${overall.targetGoal}%.`}
              </p>
            </div>

            {/* Forecast Projection Chart */}
            <div className="glass-card rounded-3xl p-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3">Forecast Projections</span>
              
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis dataKey="day" stroke="var(--muted)" fontSize={9} tickLine={false} />
                    <YAxis stroke="var(--muted)" fontSize={9} domain={[50, 100]} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="100% Attendance" stroke="var(--primary)" fillOpacity={1} fill="url(#colorBest)" strokeWidth={2} />
                    <Area type="monotone" dataKey="Maintain Rate" stroke="var(--muted)" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[8px] font-bold text-muted uppercase tracking-wider mt-2 border-t border-border/40 pt-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> Best case</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-muted rounded-full" /> Keep trend</span>
              </div>
            </div>

            {/* Heatmap logs grid */}
            <div className="glass-card rounded-3xl p-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3">Logs activity calendar</span>
              <div className="grid grid-cols-6 gap-1 border border-border p-2 bg-hover/40 rounded-xl">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (29 - idx));
                  const dateStr = date.toISOString().split('T')[0];
                  
                  const record = calendarRecords.find(
                    (r) => new Date(r.date).toISOString().split('T')[0] === dateStr
                  );

                  let colorClass = 'bg-border/60';
                  if (record && record.totalLectures > 0) {
                    const ratio = record.attendedLectures / record.totalLectures;
                    if (ratio >= 0.9) colorClass = 'bg-success text-background';
                    else if (ratio >= 0.5) colorClass = 'bg-primary text-background';
                    else colorClass = 'bg-danger text-background';
                  }

                  return (
                    <div
                      key={idx}
                      className={`h-4.5 rounded-sm flex items-center justify-center text-[7px] font-bold ${colorClass}`}
                      title={record ? `Logged ${record.attendedLectures}/${record.totalLectures}` : 'No Log'}
                    >
                      {record && record.totalLectures > 0 ? record.attendedLectures : ''}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* Floating Undo toast container */}
      <AnimatePresence>
        {showUndo && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border shadow-2xl p-4 rounded-2xl flex items-center justify-between gap-6 max-w-sm w-[90vw]"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted block">Change Recorded</span>
              <span className="text-xs font-semibold text-foreground block">
                Logged {lastLoggedPayload?.attendedLectures}/{lastLoggedPayload?.totalLectures} lectures.
              </span>
            </div>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-hover border border-border text-xs font-bold text-primary hover:bg-primary hover:text-background transition-all cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
