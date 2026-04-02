import { useMemo } from 'react';
import { subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { useTransactionStore } from '@/store';
import { CATEGORY_MAP } from '@/constants/categories';
import type { CategorySpend } from '@/utils/calculations';
import { buildMonthlySummaries, getTxInMonth, sumByType, calcSavingsRate } from '@/utils/calculations';

export interface SummaryMetrics {
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  balanceDelta: number;
  incomeDelta: number;
  expensesDelta: number;
  savingsRateDelta: number;
}

export function useChartData() {
  const transactions = useTransactionStore((s) => s.transactions);

  return useMemo(() => {
    const now = new Date();
    const prevMonth = subMonths(now, 1);

    // Current & previous month transactions
    const currentTxs = getTxInMonth(transactions, now);
    const prevTxs = getTxInMonth(transactions, prevMonth);

    const currIncome = sumByType(currentTxs, 'income');
    const currExpenses = sumByType(currentTxs, 'expense');
    const prevIncome = sumByType(prevTxs, 'income');
    const prevExpenses = sumByType(prevTxs, 'expense');

    const currSavings = calcSavingsRate(currIncome, currExpenses);
    const prevSavings = calcSavingsRate(prevIncome, prevExpenses);

    // Running balance = sum of all net across all time
    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpenses;

    // Previous month balance (all transactions up to end of prev month)
    const prevMonthEnd = endOfMonth(prevMonth);
    const txsUpToPrevMonthEnd = transactions.filter((tx) => parseISO(tx.date) <= prevMonthEnd);
    const prevBalance =
      txsUpToPrevMonthEnd.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0) -
      txsUpToPrevMonthEnd.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const summaryMetrics: SummaryMetrics = {
      balance,
      income: currIncome,
      expenses: currExpenses,
      savingsRate: currSavings,
      balanceDelta: prevBalance !== 0 ? ((balance - prevBalance) / Math.abs(prevBalance)) * 100 : 0,
      incomeDelta: prevIncome !== 0 ? ((currIncome - prevIncome) / prevIncome) * 100 : 0,
      expensesDelta: prevExpenses !== 0 ? ((currExpenses - prevExpenses) / prevExpenses) * 100 : 0,
      savingsRateDelta: currSavings - prevSavings,
    };

    // 6-month balance trend
    const monthlySummaries = buildMonthlySummaries(transactions, 6);
    let runningBalance = 0;
    // Calculate running balance starting from 6 months ago
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));
    const txsBeforePeriod = transactions.filter((tx) => parseISO(tx.date) < sixMonthsAgo);
    runningBalance =
      txsBeforePeriod.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0) -
      txsBeforePeriod.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const balanceTrend = monthlySummaries.map((s) => {
      runningBalance += s.net;
      return { month: s.month, balance: Math.round(runningBalance) };
    });

    // Spending by category (current month)
    const categoryTotals: Record<string, number> = {};
    currentTxs
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] ?? 0) + tx.amount;
      });

    const spendingByCategory: CategorySpend[] = Object.entries(categoryTotals)
      .map(([id, value]) => ({
        categoryId: id,
        name: CATEGORY_MAP[id]?.label ?? id,
        value: Math.round(value * 100) / 100,
        hex: CATEGORY_MAP[id]?.hex ?? '#a1a1aa',
      }))
      .sort((a, b) => b.value - a.value);

    // Monthly comparison (income vs expenses for 6 months)
    const monthlyComparison = monthlySummaries.map((s) => ({
      month: s.month,
      income: Math.round(s.income),
      expenses: Math.round(s.expenses),
    }));

    // Savings trend
    const savingsTrend = monthlySummaries.map((s) => ({
      month: s.month,
      savingsRate: Math.round(s.savingsRate * 10) / 10,
      savedAmount: Math.round(Math.max(0, s.net)),
    }));

    // Top spending category (current month)
    const topCategory = spendingByCategory[0] ?? null;
    const prevCategoryTotals: Record<string, number> = {};
    prevTxs
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        prevCategoryTotals[tx.categoryId] = (prevCategoryTotals[tx.categoryId] ?? 0) + tx.amount;
      });
    const topCategoryPrevAmount = topCategory ? (prevCategoryTotals[topCategory.categoryId] ?? 0) : 0;

    return {
      summaryMetrics,
      balanceTrend,
      spendingByCategory,
      monthlyComparison,
      savingsTrend,
      topCategory,
      topCategoryPrevAmount,
    };
  }, [transactions]);
}
