import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

interface ToastItemProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ message, type, onClose }) => {
  const styles = {
    success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    error: 'bg-rose-50 border-rose-100 text-rose-800',
    warning: 'bg-amber-50 border-amber-100 text-amber-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`flex items-start space-x-3.5 p-4 rounded-2xl border shadow-lg max-w-sm w-full backdrop-blur-md ${styles[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 text-left text-xs font-semibold leading-relaxed">
        {message}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-lg cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

interface AppToastContainerProps {
  toasts: { id: string; message: string; type: 'success' | 'error' | 'warning' }[];
  onClose: (id: string) => void;
}

export const AppToastContainer: React.FC<AppToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              message={toast.message}
              type={toast.type}
              onClose={() => onClose(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AppToastContainer;
