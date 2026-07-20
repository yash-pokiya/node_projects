import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StatsBar({ stats }) {
  const user = useAuthStore((state) => state.user);
  const minPercent = stats?.overall?.targetGoal || 75;

  if (!stats || !stats.overall) {
    return (
      <div className="h-16 flex items-center justify-center bg-card border border-border rounded-2xl animate-pulse">
        <span className="text-sm text-muted">Loading attendance summaries...</span>
      </div>
    );
  }

  const { attended, total, percent } = stats.overall;
  const isSafe = percent >= minPercent;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Percentage Box */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">Overall Attendance</span>
          <span className="text-3xl font-extrabold tracking-tight gradient-text">
            {percent}%
          </span>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isSafe ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
        }`}>
          {isSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
      </div>

      {/* Lecture Counts Box */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">Total Lectures</span>
          <span className="text-3xl font-extrabold tracking-tight text-foreground">
            {attended} <span className="text-sm font-medium text-muted">/ {total}</span>
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-hover text-muted flex items-center justify-center font-semibold text-xs uppercase tracking-wider">
          Slot
        </div>
      </div>

      {/* Target Status Box */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">Academic Status</span>
          <span className={`text-xl font-bold tracking-tight block ${
            isSafe ? 'text-success' : 'text-danger'
          }`}>
            {isSafe ? 'On Track' : 'Below Target'}
          </span>
          <span className="text-xs text-muted block mt-1">Goal is {minPercent}% minimum</span>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase ${
          isSafe ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
        }`}>
          {isSafe ? `Safe` : `Critical`}
        </div>
      </div>
    </div>
  );
}
