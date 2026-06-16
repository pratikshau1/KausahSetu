import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';
import AppButton from './AppButton';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'primary' | 'danger';
  children?: React.ReactNode;
  maxWidthClass?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'primary',
  children,
  maxWidthClass = 'max-w-md'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className={`relative w-full ${maxWidthClass} bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-left z-10`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Icon */}
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
              }`}>
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1 w-full">
                <h3 className="font-extrabold text-[18px] text-slate-800 tracking-tight">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            {/* Custom Content Slot */}
            {children && (
              <div className="mt-4 pt-4 border-t border-slate-100 max-h-[420px] overflow-y-auto">
                {children}
              </div>
            )}

            {/* Actions Grid */}
            <div className="flex space-x-3 mt-6">
              <AppButton
                onClick={onClose}
                variant="secondary"
                className="flex-1"
              >
                {cancelText}
              </AppButton>
              <AppButton
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                variant={type === 'danger' ? 'secondary' : 'primary'}
                className={`flex-1 ${
                  type === 'danger' 
                    ? '!bg-rose-600 !border-rose-600 hover:!bg-rose-700 !text-white' 
                    : ''
                }`}
              >
                {confirmText}
              </AppButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AppModal;
