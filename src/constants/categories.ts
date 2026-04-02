import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'salary', label: 'Salary', color: 'bg-emerald-500', hex: '#10b981', type: 'income' },
  { id: 'freelance', label: 'Freelance', color: 'bg-teal-500', hex: '#14b8a6', type: 'income' },
  { id: 'investment', label: 'Investment', color: 'bg-cyan-500', hex: '#06b6d4', type: 'income' },
  { id: 'food', label: 'Food & Dining', color: 'bg-amber-500', hex: '#f59e0b', type: 'expense' },
  { id: 'housing', label: 'Housing', color: 'bg-orange-500', hex: '#f97316', type: 'expense' },
  { id: 'transport', label: 'Transport', color: 'bg-blue-500', hex: '#3b82f6', type: 'expense' },
  { id: 'healthcare', label: 'Healthcare', color: 'bg-rose-400', hex: '#fb7185', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment', color: 'bg-purple-500', hex: '#a855f7', type: 'expense' },
  { id: 'shopping', label: 'Shopping', color: 'bg-pink-500', hex: '#ec4899', type: 'expense' },
  { id: 'utilities', label: 'Utilities', color: 'bg-slate-500', hex: '#64748b', type: 'expense' },
  { id: 'education', label: 'Education', color: 'bg-indigo-500', hex: '#6366f1', type: 'expense' },
  { id: 'travel', label: 'Travel', color: 'bg-sky-500', hex: '#0ea5e9', type: 'expense' },
  { id: 'other', label: 'Other', color: 'bg-zinc-400', hex: '#a1a1aa', type: 'both' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<string, Category>;

export const INCOME_CATEGORIES = CATEGORIES.filter(
  (c) => c.type === 'income' || c.type === 'both'
);

export const EXPENSE_CATEGORIES = CATEGORIES.filter(
  (c) => c.type === 'expense' || c.type === 'both'
);
