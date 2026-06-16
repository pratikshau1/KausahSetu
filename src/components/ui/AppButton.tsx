import React from 'react';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'h-[48px] px-6 font-bold text-[15px] rounded-[14px] flex items-center justify-center transition-all duration-200 focus:outline-none select-none cursor-pointer disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-[#4F46E5] to-[#0891B2] text-white shadow-[0_4px_12px_rgba(79,70,229,0.15)] hover:scale-[1.02] hover:shadow-[0_6px_16px_rgba(79,70,229,0.25)]',
    secondary: 'bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] hover:scale-[1.02]',
    outline: 'bg-transparent border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50/50 hover:scale-[1.02]',
    ghost: 'bg-transparent text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
};

export default AppButton;
