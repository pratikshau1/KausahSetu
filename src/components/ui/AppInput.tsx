import React, { forwardRef } from 'react';
import AppLabel from './AppLabel';

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  prefixText?: string;
  containerClassName?: string;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(({
  label,
  error,
  icon,
  prefixText,
  className = '',
  containerClassName = '',
  id,
  required,
  ...props
}, ref) => {
  // Determine left padding depending on whether we have icon and/or prefixText
  let leftPaddingClass = 'pl-[16px]';
  if (icon && prefixText) {
    leftPaddingClass = 'pl-[80px]';
  } else if (icon) {
    leftPaddingClass = 'pl-[44px]';
  } else if (prefixText) {
    leftPaddingClass = 'pl-[60px]';
  }

  return (
    <div className={`w-full flex flex-col items-start ${containerClassName}`}>
      {label && (
        <AppLabel htmlFor={id} required={required}>
          {label}
        </AppLabel>
      )}
      <div className="relative w-full flex items-center">
        {icon && (
          <div className="absolute left-[16px] text-slate-400 flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        {prefixText && (
          <span className={`text-[14px] text-slate-400 absolute font-bold border-r border-slate-200 pr-2 pointer-events-none ${icon ? 'left-[42px]' : 'left-[16px]'}`}>
            {prefixText}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          required={required}
          className={`w-full h-[48px] rounded-[12px] border border-[#CBD5E1] bg-white pr-[16px] ${leftPaddingClass} text-[15px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] disabled:opacity-60 transition-all ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[12px] text-rose-500 mt-[6px] font-semibold">
          {error}
        </p>
      )}
    </div>
  );
});

AppInput.displayName = 'AppInput';
export default AppInput;
