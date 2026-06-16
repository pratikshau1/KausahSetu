import React, { forwardRef } from 'react';
import AppLabel from './AppLabel';

interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const AppSelect = forwardRef<HTMLSelectElement, AppSelectProps>(({
  label,
  error,
  children,
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
      <div className="relative w-full flex items-center">
        <select
          ref={ref}
          id={id}
          required={required}
          className={`w-full h-[48px] rounded-[12px] border border-[#CBD5E1] bg-white px-[16px] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] disabled:opacity-60 transition-all appearance-none cursor-pointer ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-[16px] pointer-events-none text-slate-500 flex items-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-[12px] text-rose-500 mt-[6px] font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

AppSelect.displayName = 'AppSelect';
export default AppSelect;
