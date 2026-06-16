import React from 'react';

interface ToggleOption<T> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T> {
  options: readonly ToggleOption<T>[] | ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
}

export function SegmentedToggle<T extends string | number>({
  options,
  value,
  onChange,
  label,
  className = '',
}: SegmentedToggleProps<T>) {
  return (
    <div className={`w-full flex flex-col items-start ${className}`}>
      {label && (
        <span className="text-[14px] font-semibold text-[#475569] mb-[8px] block select-none">
          {label}
        </span>
      )}
      <div className="relative bg-[#EEF2F7] p-[6px] rounded-[16px] h-[48px] flex w-full items-center justify-between overflow-hidden">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative z-10 flex-1 h-full rounded-[12px] flex items-center justify-center font-bold text-[14px] transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SegmentedToggle;
