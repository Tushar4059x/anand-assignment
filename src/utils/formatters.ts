import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number, options?: { compact?: boolean }): string {
  if (options?.compact && Math.abs(amount) >= 1000) {
    const sign = amount < 0 ? '-' : '';
    const abs = Math.abs(amount);
    if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`;
    if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatMonthYear(dateStr: string): string {
  return formatDate(dateStr, 'MMM yyyy');
}

export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, 'MMM d');
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
