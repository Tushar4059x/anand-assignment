import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export function Select({ options, label, error, className, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={cn(
            'w-full h-9 pl-3 pr-8 rounded-xl border appearance-none',
            'bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100',
            'border-slate-300 dark:border-slate-600',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'transition-colors duration-150',
            error && 'border-rose-400',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
