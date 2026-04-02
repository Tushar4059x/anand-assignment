export type TransactionType = 'income' | 'expense';

export type CategoryId =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'food'
  | 'housing'
  | 'transport'
  | 'healthcare'
  | 'entertainment'
  | 'shopping'
  | 'utilities'
  | 'education'
  | 'travel'
  | 'other';

export interface Category {
  id: CategoryId;
  label: string;
  color: string; // Tailwind bg class
  hex: string; // Raw hex for Recharts
  type: TransactionType | 'both';
}

export interface Transaction {
  id: string;
  date: string; // ISO 'YYYY-MM-DD'
  description: string;
  amount: number; // Always positive
  type: TransactionType;
  categoryId: CategoryId;
  note?: string;
}

export interface TransactionFormValues {
  date: string;
  description: string;
  amount: string;
  type: TransactionType;
  categoryId: CategoryId;
  note: string;
}
