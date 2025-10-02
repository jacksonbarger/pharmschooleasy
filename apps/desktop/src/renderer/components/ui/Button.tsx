import React from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'md', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/30 disabled:opacity-50 disabled:pointer-events-none transform hover:scale-105 active:scale-95 overflow-hidden group'
  
  const variantClasses = {
    default: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/25 border-0',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-900 dark:text-slate-100 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 shadow-xl hover:shadow-2xl border-0',
    outline: 'border-2 border-purple-300 dark:border-purple-600 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-900/90 hover:border-purple-400 dark:hover:border-purple-500 shadow-xl hover:shadow-2xl text-purple-700 dark:text-purple-300',
    ghost: 'hover:bg-purple-100/50 dark:hover:bg-purple-900/20 backdrop-blur-sm hover:shadow-lg text-purple-700 dark:text-purple-300'
  }
  
  const sizeClasses = {
    sm: 'h-10 px-6 text-sm',
    md: 'h-12 px-8 py-3 text-base',
    lg: 'h-14 px-10 text-lg'
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative z-10">{children}</span>
    </button>
  )
}