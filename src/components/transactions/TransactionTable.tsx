import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TransactionRow } from './TransactionRow';
import { TransactionFilters } from './TransactionFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useFilteredTransactions } from '@/hooks/useTransactions';
import { useUIStore, useFilterStore } from '@/store';
import type { SortField } from '@/types';
import { cn } from '@/utils/cn';

const PAGE_SIZE = 20;

interface SortHeaderProps {
  field: SortField;
  label: string;
  currentField: SortField;
  direction: 'asc' | 'desc';
  onSort: (field: SortField) => void;
  className?: string;
}

function SortHeader({ field, label, currentField, direction, onSort, className }: SortHeaderProps) {
  const isActive = currentField === field;
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-300 transition-colors whitespace-nowrap',
        className
      )}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          direction === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-brand-500" />
          ) : (
            <ArrowDown className="w-3 h-3 text-brand-500" />
          )
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  );
}

export function TransactionTable() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const role = useUIStore((s) => s.role);
  const openModal = useUIStore((s) => s.openModal);
  const filters = useFilterStore((s) => s.filters);
  const setSort = useFilterStore((s) => s.setSort);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const isAdmin = role === 'admin';

  const allFiltered = useFilteredTransactions();
  const visible = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  const handleSort = (field: SortField) => {
    if (filters.sort.field === field) {
      setSort(field, filters.sort.direction === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'desc');
    }
  };

  return (
    <div className="space-y-4">
      <TransactionFilters />

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden">
        {allFiltered.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your search or filters."
            action={{ label: 'Clear filters', onClick: resetFilters }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                    <SortHeader
                      field="date"
                      label="Date"
                      currentField={filters.sort.field}
                      direction={filters.sort.direction}
                      onSort={handleSort}
                    />
                    <SortHeader
                      field="description"
                      label="Description"
                      currentField={filters.sort.field}
                      direction={filters.sort.direction}
                      onSort={handleSort}
                    />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                      Type
                    </th>
                    <SortHeader
                      field="amount"
                      label="Amount"
                      currentField={filters.sort.field}
                      direction={filters.sort.direction}
                      onSort={handleSort}
                      className="text-right"
                    />
                    {isAdmin && (
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {visible.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                      isAdmin={isAdmin}
                      onEdit={(id) => openModal('edit', id)}
                      onDelete={(id) => openModal('delete', id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Showing {Math.min(visibleCount, allFiltered.length)} of {allFiltered.length} transactions
              </p>
              {hasMore && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                >
                  Load more
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
