import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  toasts: { id: number; type: ToastType; message: string }[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (type, message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: ++toastId, type, message }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
