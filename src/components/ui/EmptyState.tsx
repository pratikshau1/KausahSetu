import React from 'react';
import { LucideIcon } from 'lucide-react';
import AppButton from './AppButton';
import AppCard from './AppCard';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <AppCard className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-200 bg-white shadow-none max-w-lg mx-auto w-full">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-extrabold text-slate-800 text-[18px] tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <AppButton
          onClick={onAction}
          variant="primary"
          className="mt-6 h-10 px-5 text-xs rounded-xl"
        >
          {actionText}
        </AppButton>
      )}
    </AppCard>
  );
};

export default EmptyState;
