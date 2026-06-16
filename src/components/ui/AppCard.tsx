import React from 'react';
import { motion } from 'framer-motion';

interface AppCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  variant?: 'solid' | 'glass';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  className = '',
  delay = 0,
  onClick,
  variant = 'solid',
}) => {
  const baseCardStyles = 'rounded-[16px] transition-all duration-300 overflow-hidden';
  const hoverStyles = onClick ? 'cursor-pointer hover:scale-[1.01] hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)]' : '';
  
  const variantStyles = {
    solid: 'bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-slate-800',
    glass: 'glass-card text-slate-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
      onClick={onClick}
      className={`p-6 sm:p-8 ${baseCardStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AppCard;
