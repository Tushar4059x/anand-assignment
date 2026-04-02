import { useEffect, useRef, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useFilterStore } from '@/store';
import { CATEGORIES } from '@/constants/categories';
import type { TransactionType, CategoryId } from '@/types';

export function TransactionFilters() {
  const filters = useFilterStore((s) => s.filters);
  const setSearch = useFilterStore((s) => s.setSearch);
  const setTypeFilter = useFilterStore((s) => s.setTypeFilter);
  const setCategoryFilter = useFilterStore((s) => s.setCategoryFilter);
  const setDateRange = useFilterStore((s) => s.setDateRange);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showMore, setShowMore] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFiltered =
    filters.search ||
    filters.type !== 'all' ||
    filters.categoryId !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(localSearch), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localSearch, setSearch]);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            leftIcon={Search}
            placeholder="Search transactions..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          leftIcon={SlidersHorizontal}
          onClick={() => setShowMore(!showMore)}
          className={showMore ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-400' : ''}
        >
          <span className="hidden sm:inline">Filters</span>
        </Button>
        {isFiltered && (
          <Button
            variant="ghost"
            size="md"
            leftIcon={X}
            onClick={() => {
              resetFilters();
              setLocalSearch('');
            }}
          >
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>

      {showMore && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700 animate-slide-up">
          <Select
            value={filters.type}
            options={typeOptions}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')}
          />
          <Select
            value={filters.categoryId}
            options={categoryOptions}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryId | 'all')}
          />
          <Input
            type="date"
            value={filters.dateFrom}
            placeholder="From"
            onChange={(e) => setDateRange(e.target.value, filters.dateTo)}
          />
          <Input
            type="date"
            value={filters.dateTo}
            placeholder="To"
            onChange={(e) => setDateRange(filters.dateFrom, e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
