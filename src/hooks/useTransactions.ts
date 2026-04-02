import { useMemo } from 'react';
import { useTransactionStore, useFilterStore } from '@/store';
import type { Transaction } from '@/types';

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

export function useFilteredTransactions(): Transaction[] {
  const transactions = useTransactionStore((s) => s.transactions);
  const filters = useFilterStore((s) => s.filters);

  return useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.categoryId.toLowerCase().includes(q) ||
          tx.note?.toLowerCase().includes(q)
      );
    }

    // Type
    if (filters.type !== 'all') {
      result = result.filter((tx) => tx.type === filters.type);
    }

    // Category
    if (filters.categoryId !== 'all') {
      result = result.filter((tx) => tx.categoryId === filters.categoryId);
    }

    // Date from
    if (filters.dateFrom) {
      result = result.filter((tx) => tx.date >= filters.dateFrom);
    }

    // Date to
    if (filters.dateTo) {
      result = result.filter((tx) => tx.date <= filters.dateTo);
    }

    // Sort
    const { field, direction } = filters.sort;
    result.sort((a, b) => {
      const valA = a[field as keyof Transaction] as string | number;
      const valB = b[field as keyof Transaction] as string | number;
      const cmp = compareValues(valA, valB);
      return direction === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [transactions, filters]);
}
