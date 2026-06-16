import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  dark?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  delay = 0,
  onClick,
  dark = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
      onClick={onClick}
      className={`rounded-2xl p-6 ${onClick ? 'cursor-pointer' : ''} ${
        dark ? 'glass-card-dark text-white' : 'glass-card text-slate-800'
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default GlassCard;
