import React from 'react';
import { useToastStore } from '../store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-success" />,
  error: <XCircle className="w-5 h-5 text-danger" />,
  warning: <AlertCircle className="w-5 h-5 text-warning" />,
  info: <Info className="w-5 h-5 text-info" />,
};

const bgColors = {
  success: 'bg-success-bg border-success/20',
  error: 'bg-danger-bg border-danger/20',
  warning: 'bg-warning-bg border-warning/20',
  info: 'bg-info-bg border-info/20',
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg ${bgColors[toast.type] || bgColors.info} bg-white dark:bg-slate-900/90`}
          >
            <div className="mt-0.5 shrink-0">
              {icons[toast.type] || icons.info}
            </div>
            
            <div className="flex-1 space-y-0.5">
              {toast.title && (
                <h4 className="text-xs font-bold text-foreground">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-muted hover:text-foreground p-0.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
