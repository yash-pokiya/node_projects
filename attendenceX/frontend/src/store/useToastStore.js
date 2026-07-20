import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],

  showToast: (message, type = 'info', title = '', duration = 4500) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Add new toast
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, title, duration }],
    }));

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, duration);
    }

    return id;
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
