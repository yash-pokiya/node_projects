import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { createSubject, updateSubject } from '../../api/subjectApi';
import { X, Loader2, BookOpen, User, CreditCard, Percent } from 'lucide-react';

const PRESET_COLORS = [
  '#2563eb', // Indigo Blue
  '#10b981', // Emerald Green
  '#8b5cf6', // Violet Purple
  '#f59e0b', // Amber Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#f43f5e', // Rose Red
];

export default function SubjectFormModal({ isOpen, onClose, onSubmitSuccess, subject }) {
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      facultyName: '',
      credits: 0,
      minimumAttendancePercent: '',
    },
  });

  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name || '',
        facultyName: subject.facultyName || '',
        credits: subject.credits || 0,
        minimumAttendancePercent: subject.minimumAttendancePercent !== null ? subject.minimumAttendancePercent : '',
      });
      setSelectedColor(subject.color || PRESET_COLORS[0]);
    } else {
      reset({
        name: '',
        facultyName: '',
        credits: 0,
        minimumAttendancePercent: '',
      });
      setSelectedColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    }
    setApiError('');
  }, [subject, reset, isOpen]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    setApiError('');

    const payload = {
      ...data,
      color: selectedColor,
      minimumAttendancePercent: data.minimumAttendancePercent === '' ? null : Number(data.minimumAttendancePercent),
    };

    try {
      let response;
      if (subject) {
        response = await updateSubject(subject._id, payload);
      } else {
        response = await createSubject(payload);
      }

      if (response.success) {
        onSubmitSuccess();
        onClose();
      } else {
        setApiError(response.message || 'Operation failed');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Something went wrong. Please check your details.';
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 animate-fade-in"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {subject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border hover:bg-hover transition-colors text-muted hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {apiError && (
              <div className="p-4 bg-danger-bg border border-danger/20 text-danger rounded-xl text-sm font-medium">
                {apiError}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Subject Name
              </label>
              <input
                type="text"
                placeholder="e.g. Data Structures"
                className="w-full glass-input text-sm"
                {...register('name', { required: 'Subject name is required' })}
              />
              {errors.name && (
                <span className="text-xs text-danger font-medium">{errors.name.message}</span>
              )}
            </div>

            {/* Faculty Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Faculty Name
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Arthur Dent"
                className="w-full glass-input text-sm"
                {...register('facultyName')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Credits Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Credits
                </label>
                <input
                  type="number"
                  placeholder="3"
                  className="w-full glass-input text-sm"
                  {...register('credits', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Must be 0 or higher' },
                  })}
                />
                {errors.credits && (
                  <span className="text-xs text-danger font-medium">{errors.credits.message}</span>
                )}
              </div>

              {/* Min Attendance Override */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" />
                  Min Attendance %
                </label>
                <input
                  type="number"
                  placeholder="Use default user target"
                  className="w-full glass-input text-sm"
                  {...register('minimumAttendancePercent', {
                    validate: (val) =>
                      val === '' ||
                      (Number(val) >= 0 && Number(val) <= 100) ||
                      'Must be between 0 and 100',
                  })}
                />
                {errors.minimumAttendancePercent && (
                  <span className="text-xs text-danger font-medium">
                    {errors.minimumAttendancePercent.message}
                  </span>
                )}
              </div>
            </div>

            {/* Color Swatches Preset */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Course Tag Color
              </label>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer ${
                      selectedColor === color
                        ? 'border-foreground ring-2 ring-border'
                        : 'border-transparent'
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl border border-border bg-card hover:bg-hover text-sm font-semibold transition-colors text-muted hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-semibold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : subject ? (
                  'Update Subject'
                ) : (
                  'Add Subject'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
