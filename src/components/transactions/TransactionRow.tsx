import { Pencil, Trash2 } from 'lucide-react';
import { CategoryBadge, TypeBadge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TransactionRow({ transaction, isAdmin, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';

  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {formatDate(transaction.date, 'MMM d, yyyy')}
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {transaction.description}
          </p>
          {transaction.note && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[180px]">
              {transaction.note}
            </p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <CategoryBadge categoryId={transaction.categoryId} />
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <TypeBadge type={transaction.type} />
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <span
          className={cn(
            'text-sm font-semibold tabular-nums',
            isIncome
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          )}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>
      </td>
      {isAdmin && (
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(transaction.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
