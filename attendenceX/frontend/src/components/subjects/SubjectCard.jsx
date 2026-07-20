import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, User, Award, Percent, AlertTriangle } from 'lucide-react';
import { deleteSubject } from '../../api/subjectApi';

export default function SubjectCard({ subject, defaultMinPercent, onEdit, onDeleteSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteSubject(subject._id);
      if (response.success) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Delete subject error:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const activeMinPercent = subject.minimumAttendancePercent !== null
    ? subject.minimumAttendancePercent
    : defaultMinPercent;

  return (
    <motion.div
      layout
      className="glass-card relative overflow-hidden flex flex-col justify-between min-h-[160px] pl-6"
    >
      {/* Subject Accent Left Color Bar */}
      <div
        style={{ backgroundColor: subject.color }}
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
      />

      {/* Confirmation Dialog Overlay */}
      {showConfirm ? (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm z-10 p-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-danger flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Archive Subject?
            </h4>
            <p className="text-xs text-muted leading-normal">
              This will hide "{subject.name}" from your active dashboard and timetable.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              className="py-1 px-3 border border-border bg-card hover:bg-hover rounded-lg text-xs font-semibold text-muted hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="py-1 px-3 bg-danger hover:opacity-90 text-background rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? 'Archiving...' : 'Confirm'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className="space-y-2 py-4 pr-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-foreground leading-snug select-none text-base md:text-lg">
            {subject.name}
          </h3>
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(subject)}
              className="p-1 rounded-lg border border-border hover:bg-hover text-muted hover:text-foreground transition-colors cursor-pointer"
              title="Edit Subject"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 rounded-lg border border-border hover:bg-danger-bg text-muted hover:text-danger transition-colors cursor-pointer"
              title="Delete Subject"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Faculty/Instructor */}
        {subject.facultyName && (
          <p className="text-xs text-muted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {subject.facultyName}
          </p>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="flex items-center gap-4 py-3 border-t border-border text-xs mr-4 select-none text-muted">
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5" />
          {subject.credits} Credits
        </span>
        <span className="flex items-center gap-1">
          <Percent className="w-3.5 h-3.5" />
          Goal: {activeMinPercent}%
          {subject.minimumAttendancePercent !== null && (
            <span className="text-[10px] bg-hover px-1.5 py-0.5 rounded-full font-medium ml-1">
              override
            </span>
          )}
        </span>
      </div>
    </motion.div>
  );
}
