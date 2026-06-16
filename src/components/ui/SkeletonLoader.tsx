import React from 'react';

interface SkeletonLoaderProps {
  type?: 'stats' | 'list' | 'table';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'list',
  count = 3
}) => {
  const renderItem = () => {
    switch (type) {
      case 'stats':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
                <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        );
      case 'table':
        return (
          <div className="space-y-3 w-full animate-pulse">
            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            {Array.from({ length: count }).map((_, idx) => (
              <div key={idx} className="h-12 bg-slate-100 rounded-xl w-full"></div>
            ))}
          </div>
        );
      case 'list':
      default:
        return (
          <div className="space-y-4 w-full animate-pulse">
            {Array.from({ length: count }).map((_, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        );
    }
  };

  return <div className="w-full">{renderItem()}</div>;
};

export default SkeletonLoader;
