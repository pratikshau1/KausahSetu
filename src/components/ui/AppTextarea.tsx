import React, { forwardRef } from 'react';
import AppLabel from './AppLabel';

interface AppTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(({
  label,
  error,
  className = '',
  containerClassName = '',
  id,
  required,
  ...props
}, ref) => {
  return (
    <div className={`w-full flex flex-col items-start ${containerClassName}`}>
      {label && (
        <AppLabel htmlFor={id} required={required}>
          {label}
        </AppLabel>
      )}
      <textarea
        ref={ref}
        id={id}
        required={required}
        className={`w-full rounded-[12px] border border-[#CBD5E1] bg-white p-[16px] text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] disabled:opacity-60 transition-all ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[12px] text-rose-500 mt-[6px] font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

AppTextarea.displayName = 'AppTextarea';
export default AppTextarea;
