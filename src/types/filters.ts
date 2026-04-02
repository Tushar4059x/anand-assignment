import type { TransactionType, CategoryId } from './transaction';

export type SortField = 'date' | 'amount' | 'description';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  search: string;
  type: TransactionType | 'all';
  categoryId: CategoryId | 'all';
  dateFrom: string;
  dateTo: string;
  sort: SortConfig;
}
