import React, { useState, useEffect } from 'react';
import * as attendanceApi from '../../api/attendanceApi';
import { X, Loader2, Save } from 'lucide-react';

export default function MarkAttendanceModal({ isOpen, onClose, date, timetable, existingRecords, onSaveSuccess }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'medical', label: 'Medical' },
    { value: 'sports', label: 'Sports' },
    { value: 'industrial_visit', label: 'IV' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'half', label: 'Half' },
  ];

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

  useEffect(() => {
    if (!isOpen || !date) return;

    setError('');
    const dayOfWeek = date.getDay();
    const cycleWeek = getCycleWeek(date);

    // Filter slots for this weekday and cycle
    const daySlots = timetable.filter((slot) => {
      if (slot.dayOfWeek !== dayOfWeek) return false;
      const cycle = slot.cycleType || 'weekly';
      if (cycle === 'weekly') return true;
      const slotWeek = slot.weekNumber || 1;
      return slotWeek === cycleWeek;
    });

    // Map to entries, matching existing records from database
    const mappedEntries = daySlots.map((slot) => {
      const match = existingRecords.find(
        (r) => r.period === slot.period && r.subjectId._id === slot.subjectId._id
      );

      return {
        lectureSessionId: match ? match._id : null,
        subjectId: slot.subjectId._id,
        subjectName: slot.subjectId.name,
        subjectColor: slot.subjectId.color,
        period: slot.period,
        startTime: slot.startTime,
        endTime: slot.endTime,
        classroom: slot.classroom,
        status: match && match.status ? match.status : 'present', // Default to present
        remarks: match ? match.remarks : '',
      };
    });

    setEntries(mappedEntries);
  }, [isOpen, date, timetable, existingRecords]);

  const handleStatusChange = (index, val) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[index].status = val;
      return copy;
    });
  };

  const handleRemarksChange = (index, val) => {
    setEntries((prev) => {
      const copy = [...prev];
      copy[index].remarks = val;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payloadEntries = entries.map((item) => ({
        lectureSessionId: item.lectureSessionId,
        status: item.status,
        remarks: item.remarks,
      }));

      await attendanceApi.bulkMarkAttendance(payloadEntries);
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update attendance markings');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-hover">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Mark Attendance
            </h3>
            <span className="text-xs text-muted font-semibold block mt-0.5">
              {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:bg-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-danger-bg border border-danger/20 text-danger text-xs font-semibold">
              {error}
            </div>
          )}

          {entries.length === 0 ? (
            <div className="py-8 text-center text-muted">
              <span className="text-sm font-semibold">No lectures scheduled in your timetable for this weekday.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border bg-background flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: item.subjectColor }}
                      />
                      <div>
                        <span className="text-sm font-bold text-foreground block">
                          {item.subjectName}
                        </span>
                        <span className="text-xs text-muted font-semibold block mt-0.5">
                          Period {item.period} • {item.startTime} - {item.endTime} {item.classroom && `• ${item.classroom}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Segmented Button Group */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-2 pt-3 border-t border-border/40">
                    <div className="flex flex-wrap gap-1.5">
                      {statusOptions.map((opt) => {
                        const isActive = item.status === opt.value;
                        const statusPills = {
                          present: 'bg-success text-background border-success font-black',
                          absent: 'bg-danger text-background border-danger font-black',
                          medical: 'bg-medical text-background border-medical font-black',
                          sports: 'bg-primary text-background border-primary font-black',
                          industrial_visit: 'bg-info text-background border-info font-black',
                          cancelled: 'bg-warning text-background border-warning font-black',
                          holiday: 'bg-info text-background border-info font-black',
                          half: 'bg-warning text-background border-warning font-black',
                        };

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleStatusChange(idx, opt.value)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black cursor-pointer transition-all border ${
                              isActive
                                ? statusPills[opt.value]
                                : 'bg-card border-border text-muted hover:text-foreground hover:bg-hover'
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="text"
                      placeholder="Add remarks..."
                      value={item.remarks}
                      onChange={(e) => handleRemarksChange(idx, e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-input-bg border border-input-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-44"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-border bg-hover flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-muted hover:text-foreground transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {entries.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-primary text-background hover:bg-primary-hover text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Attendance
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
