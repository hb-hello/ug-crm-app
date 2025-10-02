import React, { useEffect } from 'react';
import { toast, ToastContainer, ToastOptions, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToastStore } from '../../store/useToastStore';

const ToastManager: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    toasts.forEach(({ id, type, message }) => {
      const options: ToastOptions = {
        onClose: () => removeToast(id),
        autoClose: 3000,
        pauseOnHover: true,
      };

      // Map our toast types to react-toastify types
      const toastType = type as TypeOptions;

      toast(message, { ...options, type: toastType });
    });
  }, [toasts, removeToast]);

  return <ToastContainer position="top-center" />;
};

export default ToastManager;
