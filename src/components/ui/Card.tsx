import React from 'react';
import { cn } from '../../lib/utils';
import { motion, type HTMLMotionProps } from 'motion/react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  hover?: boolean;
}

export const Card = ({ children, className, onClick, hover = true, ...props }: CardProps) => {
  return (
    <motion.div
      whileHover={hover && onClick ? { y: -4, boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.05)' } : undefined}
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none overflow-hidden transition-all',
        onClick && 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
