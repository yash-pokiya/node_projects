import React from "react";
import { X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TodoDetailsModal = ({ isOpen, onClose, todo }) => {
  if (!isOpen || !todo) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs"
        />

        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="relative w-full max-w-2xl bg-app-card border border-app-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-app-border bg-app-bg-secondary/20">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-lg font-bold text-app-text break-words">
                {todo.title || "Untitled Note"}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-app-text-secondary">
                <Calendar size={12} />
                <span>{formatDate(todo.createdAt || todo.updatedAt)}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-app-border text-app-text-secondary hover:text-app-text hover:bg-app-bg-secondary transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-1 break-words">
            <div className="text-sm sm:text-base text-app-text leading-relaxed whitespace-pre-wrap font-normal">
              {todo.content || <em className="text-app-text-secondary">No content provided.</em>}
            </div>
          </div>

          {/* Footer Action */}
          <div className="px-6 py-4 border-t border-app-border bg-app-bg-secondary/10 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-app-accent hover:opacity-90 text-white rounded-xl shadow-md active:scale-98 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TodoDetailsModal;
