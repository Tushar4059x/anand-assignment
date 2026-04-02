import { startOfMonth, endOfMonth, parseISO, isWithinInterval, subMonths, format } from 'date-fns';
import type { Transaction } from '@/types';

export function getTxInMonth(transactions: Transaction[], date: Date): Transaction[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return transactions.filter((tx) => {
    const d = parseISO(tx.date);
    return isWithinInterval(d, { start, end });
  });
}

export function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calcSavingsRate(income: number, expense: number): number {
  if (income === 0) return 0;
  return Math.max(0, ((income - expense) / income) * 100);
}

export interface MonthlySummary {
  month: string; // 'MMM yy'
  monthKey: string; // 'YYYY-MM'
  income: number;
  expenses: number;
  net: number;
  savingsRate: number;
}

export function buildMonthlySummaries(
  transactions: Transaction[],
  monthCount = 6
): MonthlySummary[] {
  const now = new Date();
  const summaries: MonthlySummary[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = subMonths(now, i);
    const txs = getTxInMonth(transactions, date);
    const income = sumByType(txs, 'income');
    const expenses = sumByType(txs, 'expense');
    summaries.push({
      month: format(date, 'MMM yy'),
      monthKey: format(date, 'yyyy-MM'),
      income,
      expenses,
      net: income - expenses,
      savingsRate: calcSavingsRate(income, expenses),
    });
  }

  return summaries;
}

export function buildBalanceTrend(
  transactions: Transaction[],
  monthCount = 6
): { month: string; balance: number }[] {
  const summaries = buildMonthlySummaries(transactions, monthCount);
  let runningBalance = 0;
  return summaries.map((s) => {
    runningBalance += s.net;
    return { month: s.month, balance: runningBalance };
  });
}

export interface CategorySpend {
  categoryId: string;
  name: string;
  value: number;
  hex: string;
}
