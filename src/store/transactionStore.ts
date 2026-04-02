import { create } from 'zustand';
import type { Transaction } from '@/types';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  resetToMockData: () => void;
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactions: [...MOCK_TRANSACTIONS],

  addTransaction: (tx) =>
    set((state) => ({
      transactions: [
        { ...tx, id: `txn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
        ...state.transactions,
      ],
    })),

  updateTransaction: (id, patch) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...patch } : tx
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    })),

  resetToMockData: () => set({ transactions: [...MOCK_TRANSACTIONS] }),
}));
