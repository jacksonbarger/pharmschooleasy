import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 group relative overflow-hidden',
        className
      )}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500'></div>
      <div className='relative z-10'>{children}</div>
    </div>
  );
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn('flex flex-col space-y-3 p-8 pb-4', className)}>{children}</div>;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-8 pt-0', className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-3xl font-black leading-tight tracking-tight text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors duration-300',
        className
      )}
    >
      {children}
    </h3>
  );
}
