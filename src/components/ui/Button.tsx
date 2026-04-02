import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-sm focus-visible:ring-brand-500',
  secondary:
    'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700',
  danger:
    'bg-rose-500 hover:bg-rose-600 text-white shadow-sm focus-visible:ring-rose-500',
  ghost:
    'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 flex-shrink-0" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon className="w-4 h-4 flex-shrink-0" />}
    </button>
  );
}
