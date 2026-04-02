import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTransactionStore, useUIStore } from '@/store';

interface DeleteConfirmModalProps {
  onClose: () => void;
}

export function DeleteConfirmModal({ onClose }: DeleteConfirmModalProps) {
  const editingId = useUIStore((s) => s.editingTransactionId);
  const transactions = useTransactionStore((s) => s.transactions);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

  const tx = editingId ? transactions.find((t) => t.id === editingId) : null;

  function handleDelete() {
    if (editingId) {
      deleteTransaction(editingId);
      onClose();
    }
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-rose-500" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
        Are you sure you want to delete:
      </p>
      {tx && (
        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-5">
          "{tx.description}"
        </p>
      )}
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
        This action cannot be undone.
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" className="flex-1" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
