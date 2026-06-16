import React from 'react';

interface AppLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export const AppLabel: React.FC<AppLabelProps> = ({ children, className = '', required, ...props }) => {
  return (
    <label
      className={`text-[14px] font-semibold text-[#475569] mb-[8px] block select-none ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );
};

export default AppLabel;
