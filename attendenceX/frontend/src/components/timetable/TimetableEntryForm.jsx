import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createTimetableEntry, updateTimetableEntry, deleteTimetableEntry } from '../../api/timetableApi';
import { X, Loader2, BookOpen, Clock, Trash2, AlertCircle, Settings, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS_MAP = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday',
};

export default function TimetableEntryForm({ isOpen, onClose, onSubmitSuccess, subjects, dayOfWeek, period, entry }) {
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subjectId: '',
      cycleType: 'weekly',
      weekNumber: 1,
      startTime: '',
      endTime: '',
      classroom: '',
    },
  });

  const selectedCycleType = watch('cycleType');

  useEffect(() => {
    if (entry) {
      reset({
        subjectId: entry.subjectId._id || entry.subjectId,
        cycleType: entry.cycleType || 'weekly',
        weekNumber: entry.weekNumber || 1,
        startTime: entry.startTime || '',
        endTime: entry.endTime || '',
        classroom: entry.classroom || '',
      });
    } else {
      reset({
        subjectId: subjects[0]?._id || '',
        cycleType: 'weekly',
        weekNumber: 1,
        startTime: '',
        endTime: '',
        classroom: '',
      });
    }
    setApiError('');
  }, [entry, subjects, reset, isOpen]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');

    const payload = {
      ...data,
      dayOfWeek: entry ? entry.dayOfWeek : dayOfWeek,
      period: entry ? entry.period : period,
    };

    try {
      let response;
      if (entry) {
        response = await updateTimetableEntry(entry._id, payload);
      } else {
        response = await createTimetableEntry(payload);
      }

      if (response.success) {
        onSubmitSuccess();
        onClose();
      } else {
        setApiError(response.message || 'Operation failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data?.errors?.[0] || 'Error saving timetable slot.';
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    setIsDeleting(true);
    setApiError('');

    try {
      const response = await deleteTimetableEntry(entry._id);
      if (response.success) {
        onSubmitSuccess();
        onClose();
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to remove schedule slot.';
      setApiError(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const currentDayLabel = DAYS_MAP[entry ? entry.dayOfWeek : dayOfWeek];
  const currentPeriodLabel = entry ? entry.period : period;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 animate-fade-in"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {entry ? 'Edit Timetable Slot' : 'Add Timetable Slot'}
              </h3>
              <p className="text-xs text-muted mt-0.5 font-semibold">
                {currentDayLabel} — Period {currentPeriodLabel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border hover:bg-hover transition-colors text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {apiError && (
              <div className="p-4 bg-danger-bg border border-danger/20 text-danger rounded-xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Subject Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Select Course
              </label>
              <select
                className="w-full glass-input text-sm bg-input-bg border-input-border text-foreground cursor-pointer"
                {...register('subjectId', { required: 'Please select a subject' })}
              >
                <option value="" disabled>Choose a subject...</option>
                {subjects.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} {sub.facultyName ? `(${sub.facultyName})` : ''}
                  </option>
                ))}
              </select>
              {errors.subjectId && (
                <span className="text-xs text-danger font-semibold">{errors.subjectId.message}</span>
              )}
            </div>

            {/* Cycle Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Cycle Rotation
                </label>
                <select
                  className="w-full glass-input text-xs font-semibold bg-input-bg border-input-border text-foreground cursor-pointer"
                  {...register('cycleType')}
                >
                  <option value="weekly">Weekly (Every week)</option>
                  <option value="biweekly">Bi-weekly (Alternate)</option>
                </select>
              </div>

              {selectedCycleType === 'biweekly' ? (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    Target Cycle Week
                  </label>
                  <select
                    className="w-full glass-input text-xs font-semibold bg-input-bg border-input-border text-foreground cursor-pointer"
                    {...register('weekNumber', { valueAsNumber: true })}
                  >
                    <option value={1}>Week A (Cycle 1)</option>
                    <option value={2}>Week B (Cycle 2)</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    Classroom
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 5B"
                    className="w-full glass-input text-sm"
                    {...register('classroom')}
                  />
                </div>
              )}
            </div>

            {selectedCycleType === 'biweekly' && (
              <div className="space-y-1.5 animate-fade-in">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  Classroom Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab 5B"
                  className="w-full glass-input text-sm"
                  {...register('classroom')}
                />
              </div>
            )}

            {/* Time Pickers */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Start Time
                </label>
                <input
                  type="time"
                  className="w-full glass-input text-sm cursor-pointer"
                  {...register('startTime', { required: 'Required' })}
                />
                {errors.startTime && (
                  <span className="text-xs text-danger font-semibold">{errors.startTime.message}</span>
                )}
              </div>

              {/* End Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  End Time
                </label>
                <input
                  type="time"
                  className="w-full glass-input text-sm cursor-pointer"
                  {...register('endTime', { required: 'Required' })}
                />
                {errors.endTime && (
                  <span className="text-xs text-danger font-semibold">{errors.endTime.message}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-5 mt-2 border-t border-border">
              {entry ? (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 text-xs font-bold text-danger hover:bg-danger-bg py-2 px-3 rounded-lg border border-transparent transition-all cursor-pointer"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </>
                  )}
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-4 rounded-xl border border-border bg-card hover:bg-hover text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-background font-semibold py-2 px-4 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : entry ? (
                    'Save Slot'
                  ) : (
                    'Add Slot'
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
