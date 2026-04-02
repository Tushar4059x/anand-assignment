import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useTransactionStore, useUIStore } from '@/store';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories';
import type { TransactionFormValues, TransactionType, CategoryId } from '@/types';

interface TransactionFormProps {
  onClose: () => void;
}

const DEFAULT_VALUES: TransactionFormValues = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  type: 'expense',
  categoryId: 'food',
  note: '',
};

export function TransactionForm({ onClose }: TransactionFormProps) {
  const editingId = useUIStore((s) => s.editingTransactionId);
  const transactions = useTransactionStore((s) => s.transactions);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);

  const existingTx = editingId ? transactions.find((t) => t.id === editingId) : null;
  const isEdit = Boolean(existingTx);

  const [values, setValues] = useState<TransactionFormValues>(() =>
    existingTx
      ? {
          date: existingTx.date,
          description: existingTx.description,
          amount: String(existingTx.amount),
          type: existingTx.type,
          categoryId: existingTx.categoryId,
          note: existingTx.note ?? '',
        }
      : { ...DEFAULT_VALUES }
  );
  const [errors, setErrors] = useState<Partial<TransactionFormValues>>({});

  const categories = values.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  // Reset categoryId when type changes if it doesn't fit
  useEffect(() => {
    const validIds = categories.map((c) => c.id);
    if (!validIds.includes(values.categoryId as never)) {
      setValues((v) => ({ ...v, categoryId: categories[0].id }));
    }
  }, [values.type, categories, values.categoryId]);

  function validate(): boolean {
    const e: Partial<TransactionFormValues> = {};
    if (!values.description.trim()) e.description = 'Required';
    if (!values.amount || isNaN(Number(values.amount)) || Number(values.amount) <= 0)
      e.amount = 'Must be a positive number';
    if (!values.date) e.date = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    const payload = {
      date: values.date,
      description: values.description.trim(),
      amount: Number(values.amount),
      type: values.type,
      categoryId: values.categoryId as CategoryId,
      note: values.note.trim() || undefined,
    };

    if (isEdit && editingId) {
      updateTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.label }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setValues((v) => ({ ...v, type: t }))}
            className={
              values.type === t
                ? 'flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all bg-white dark:bg-slate-800 shadow-sm ' +
                  (t === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400')
                : 'flex-1 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 transition-all'
            }
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="tx-date"
          label="Date"
          type="date"
          value={values.date}
          onChange={(e) => setValues((v) => ({ ...v, date: e.target.value }))}
          error={errors.date}
        />
        <Input
          id="tx-amount"
          label="Amount ($)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={values.amount}
          onChange={(e) => setValues((v) => ({ ...v, amount: e.target.value }))}
          error={errors.amount}
        />
      </div>

      <Input
        id="tx-description"
        label="Description"
        placeholder="e.g. Grocery Shopping"
        value={values.description}
        onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        error={errors.description}
      />

      <Select
        id="tx-category"
        label="Category"
        value={values.categoryId}
        options={categoryOptions}
        onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value as CategoryId }))}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="tx-note" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Note <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="tx-note"
          rows={2}
          placeholder="Any additional notes..."
          value={values.note}
          onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-colors"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="flex-1">
          {isEdit ? 'Save Changes' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
}
