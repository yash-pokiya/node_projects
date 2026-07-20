import React from 'react';
import DayCell from './DayCell';

export default function MonthGrid({ currentDate, timetable, records, onDayClick }) {
  const getDaysInMonthGrid = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of current month
    const firstDayOfMonth = new Date(year, month, 1);
    
    // Find weekday index (0=Sunday, 1=Monday, ..., 6=Saturday)
    // We adjust so Monday is index 0. If Sunday, make it 6.
    let startOffset = firstDayOfMonth.getDay() - 1;
    if (startOffset === -1) startOffset = 6; // Sunday

    const gridDays = [];

    // Buffer days from previous month
    for (let i = startOffset; i > 0; i--) {
      gridDays.push(new Date(year, month, 1 - i));
    }

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      gridDays.push(new Date(year, month, i));
    }

    // Buffer days for next month to complete the grid (multiples of 7, total 35 or 42 cells)
    const totalCellsNeeded = gridDays.length <= 35 ? 35 : 42;
    const nextMonthDaysToAdd = totalCellsNeeded - gridDays.length;
    for (let i = 1; i <= nextMonthDaysToAdd; i++) {
      gridDays.push(new Date(year, month + 1, i));
    }

    return gridDays;
  };

  const daysGrid = getDaysInMonthGrid(currentDate);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="w-full glass-panel rounded-2xl overflow-hidden">
      {/* Weekday Titles */}
      <div className="grid grid-cols-7 border-b border-border bg-hover text-center py-3">
        {weekdays.map((day) => (
          <span
            key={day}
            className="text-xs font-bold tracking-wider uppercase text-muted"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid Cells */}
      <div className="grid grid-cols-7">
        {daysGrid.map((date, idx) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isToday = date.toISOString().split('T')[0] === todayStr;

          return (
            <DayCell
              key={idx}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              timetable={timetable}
              records={records}
              onClick={onDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
