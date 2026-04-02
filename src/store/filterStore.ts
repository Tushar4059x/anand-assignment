import { create } from 'zustand';
import type { FilterState, TransactionType, CategoryId, SortField, SortDirection } from '@/types';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  type: 'all',
  categoryId: 'all',
  dateFrom: '',
  dateTo: '',
  sort: { field: 'date', direction: 'desc' },
};

interface FilterStoreState {
  filters: FilterState;
  setSearch: (value: string) => void;
  setTypeFilter: (value: TransactionType | 'all') => void;
  setCategoryFilter: (value: CategoryId | 'all') => void;
  setDateRange: (from: string, to: string) => void;
  setSort: (field: SortField, direction?: SortDirection) => void;
  toggleSortDirection: () => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>()((set) => ({
  filters: { ...DEFAULT_FILTERS },

  setSearch: (value) =>
    set((state) => ({ filters: { ...state.filters, search: value } })),

  setTypeFilter: (value) =>
    set((state) => ({ filters: { ...state.filters, type: value } })),

  setCategoryFilter: (value) =>
    set((state) => ({ filters: { ...state.filters, categoryId: value } })),

  setDateRange: (from, to) =>
    set((state) => ({ filters: { ...state.filters, dateFrom: from, dateTo: to } })),

  setSort: (field, direction) =>
    set((state) => ({
      filters: {
        ...state.filters,
        sort: {
          field,
          direction: direction ?? state.filters.sort.direction,
        },
      },
    })),

  toggleSortDirection: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        sort: {
          ...state.filters.sort,
          direction: state.filters.sort.direction === 'asc' ? 'desc' : 'asc',
        },
      },
    })),

  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
}));
