import React from 'react';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-4 w-full ${className}`}>
      {(title || description) && (
        <div className="border-b border-slate-100 pb-3 text-left">
          {title && (
            <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[12px] text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
