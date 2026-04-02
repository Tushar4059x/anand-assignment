import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: LucideIcon;
  error?: string;
  label?: string;
}

export function Input({ leftIcon: LeftIcon, error, label, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          id={id}
          className={cn(
            'w-full h-9 rounded-xl border bg-white dark:bg-slate-800',
            'text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
            'border-slate-300 dark:border-slate-600',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'transition-colors duration-150',
            LeftIcon ? 'pl-9 pr-3' : 'px-3',
            error && 'border-rose-400 focus:ring-rose-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
