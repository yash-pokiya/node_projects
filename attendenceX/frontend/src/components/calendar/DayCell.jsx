import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DayCell({ date, isCurrentMonth, isToday, timetable, records, onClick }) {
  const dayOfWeek = date.getDay();

  // Helper to resolve ISO Week of Year
  const getISOWeek = (d) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
  };

  const getCycleWeek = (d) => {
    const weekNum = getISOWeek(d);
    return weekNum % 2 === 0 ? 2 : 1;
  };

  const cycleWeek = getCycleWeek(date);

  // Filter slots for this weekday and cycle
  const daySlots = timetable.filter((slot) => {
    if (slot.dayOfWeek !== dayOfWeek) return false;
    const cycle = slot.cycleType || 'weekly';
    if (cycle === 'weekly') return true;
    const slotWeek = slot.weekNumber || 1;
    return slotWeek === cycleWeek;
  });

  const dateStr = date.toISOString().split('T')[0];

  // Match records for this date
  const dayRecords = records.filter(
    (r) => new Date(r.date).toISOString().split('T')[0] === dateStr
  );

  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
  const hasUnmarkedClasses = isPast && daySlots.length > 0 && dayRecords.length < daySlots.length;

  const statusColors = {
    present: 'bg-success',
    extra: 'bg-success',
    absent: 'bg-danger',
    half: 'bg-warning',
    medical: 'bg-medical',
    sports: 'bg-primary',
    industrial_visit: 'bg-info',
    cancelled: 'bg-warning',
    holiday: 'bg-info',
  };

  return (
    <button
      onClick={() => onClick(date, dayRecords)}
      disabled={date > new Date(new Date().setHours(23, 59, 59, 999))} // Disable future days
      className={`min-h-[90px] border border-border p-2 text-left flex flex-col justify-between transition-all hover:bg-hover ${
        isCurrentMonth ? 'text-foreground' : 'text-muted opacity-40'
      } ${isToday ? 'bg-primary/5 border-primary/30 font-black' : 'bg-surface'} ${
        date > new Date() ? 'cursor-not-allowed bg-background/50' : 'cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className={`text-xs font-extrabold ${isToday ? 'w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center' : ''}`}>
          {date.getDate()}
        </span>
        {hasUnmarkedClasses && (
          <AlertCircle className="w-3.5 h-3.5 text-muted animate-pulse" title="Needs marking" />
        )}
      </div>

      {/* Dots/Badges Grid */}
      <div className="flex flex-wrap gap-1 mt-2 max-w-full">
        {daySlots.map((slot, index) => {
          // Check if marked
          const match = dayRecords.find((r) => r.period === slot.period);
          const color = match ? statusColors[match.status] : 'border border-dashed border-border';

          return (
            <div
              key={index}
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`}
              style={{
                backgroundColor: match ? undefined : 'transparent',
                borderColor: match ? undefined : slot.subjectId.color,
              }}
              title={`${slot.subjectId.name} (Period ${slot.period})`}
            />
          );
        })}
      </div>
    </button>
  );
}
