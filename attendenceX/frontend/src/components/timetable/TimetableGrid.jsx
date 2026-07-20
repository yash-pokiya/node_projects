import React from 'react';
import { Plus, Edit3, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 0 },
];

export default function TimetableGrid({ timetable, lecturesPerDay, onAddCell, onEditCell }) {
  const periods = Array.from({ length: lecturesPerDay || 6 }, (_, i) => i + 1);

  const findEntry = (dayValue, periodNum) => {
    const dayEntries = timetable[dayValue] || [];
    return dayEntries.find((entry) => entry.period === periodNum);
  };

  const getLightBgColor = (hex) => {
    if (!hex) return 'rgba(100, 116, 139, 0.08)';
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  };

  return (
    <div className="w-full overflow-x-auto select-none rounded-3xl border border-border bg-card shadow-xl">
      <div className="min-w-[840px] grid grid-cols-[100px_repeat(7,_1fr)] border-b border-border">
        {/* Top-left corner cell */}
        <div className="h-14 flex items-center justify-center border-r border-border text-xs font-bold uppercase tracking-wider text-muted">
          Period
        </div>
        
        {/* Day column headers */}
        {DAYS.map((day) => (
          <div
            key={day.value}
            className="h-14 flex flex-col justify-center items-center text-center text-xs md:text-sm font-bold tracking-tight text-foreground border-r border-border last:border-0"
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="min-w-[840px] divide-y divide-border">
        {periods.map((periodNum) => (
          <div key={periodNum} className="grid grid-cols-[100px_repeat(7,_1fr)] group">
            {/* Period row label */}
            <div className="h-24 flex flex-col items-center justify-center border-r border-border text-center bg-hover">
              <span className="text-xs font-bold text-muted">Slot {periodNum}</span>
            </div>

            {/* Timetable cells */}
            {DAYS.map((day) => {
              const entry = findEntry(day.value, periodNum);
              const transparentBg = entry ? getLightBgColor(entry.subjectId?.color) : '';
              const isLab = entry?.classroom?.toLowerCase().includes('lab') || entry?.subjectId?.name?.toLowerCase().includes('lab');

              return (
                <div
                  key={day.value}
                  className="h-24 p-2 flex items-center justify-center border-r border-border last:border-0 relative bg-background"
                >
                  {entry ? (
                    /* Populated slot card */
                    <motion.button
                      whileHover={{ y: -1, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onEditCell(entry)}
                      style={{
                        backgroundColor: transparentBg,
                        borderColor: entry.subjectId?.color || 'var(--border)',
                      }}
                      className={`w-full h-full text-left rounded-xl p-2.5 border flex flex-col justify-between hover:shadow-md transition-all group/card relative overflow-hidden cursor-pointer ${
                        isLab ? 'ring-1 ring-offset-1 ring-primary/20' : ''
                      }`}
                    >
                      {/* Accent color badge or Lab badge */}
                      {isLab ? (
                        <span className="absolute right-2 top-2 bg-primary/20 text-primary px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest leading-none">
                          Lab
                        </span>
                      ) : (
                        <span
                          style={{ backgroundColor: entry.subjectId?.color }}
                          className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full shadow"
                        />
                      )}
                      
                      <div className="space-y-0.5">
                        <span className="block text-xs font-extrabold text-foreground truncate pr-6 leading-tight">
                          {entry.subjectId?.name || 'Subject'}
                        </span>
                        {entry.classroom && (
                          <span className="text-[9px] font-semibold text-muted flex items-center gap-0.5 leading-none mt-0.5">
                            <Home className="w-2.5 h-2.5" /> {entry.classroom}
                          </span>
                        )}
                      </div>

                      <div className="flex items-end justify-between mt-1">
                        <span className="text-[9px] font-mono font-semibold text-muted leading-none">
                          {entry.startTime} - {entry.endTime}
                        </span>
                        <Edit3 className="w-3 h-3 text-muted opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      </div>
                    </motion.button>
                  ) : (
                    /* Empty slot cell */
                    <button
                      onClick={() => onAddCell(day.value, periodNum)}
                      className="w-full h-full rounded-xl border border-dashed border-border hover:bg-hover transition-all flex items-center justify-center group/btn text-muted hover:text-foreground cursor-pointer"
                    >
                      <Plus className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all scale-75 group-hover/btn:scale-100" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
