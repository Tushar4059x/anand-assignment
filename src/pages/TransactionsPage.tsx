import { Plus } from 'lucide-react';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { DeleteConfirmModal } from '@/components/transactions/DeleteConfirmModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store';

export function TransactionsPage() {
  const role = useUIStore((s) => s.role);
  const activeModal = useUIStore((s) => s.activeModal);
  const openModal = useUIStore((s) => s.openModal);
  const closeModal = useUIStore((s) => s.closeModal);
  const isAdmin = role === 'admin';

  return (
    <div className="p-4 sm:p-6 space-y-4 animate-fade-in">
      {/* Page actions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View, search and manage your financial transactions
          </p>
        </div>
        {isAdmin && (
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => openModal('add')}
          >
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>

      <TransactionTable />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={activeModal === 'add' || activeModal === 'edit'}
        onClose={closeModal}
        title={activeModal === 'edit' ? 'Edit Transaction' : 'Add Transaction'}
        size="md"
      >
        <TransactionForm onClose={closeModal} />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={closeModal}
        title="Delete Transaction"
        size="sm"
      >
        <DeleteConfirmModal onClose={closeModal} />
      </Modal>
    </div>
  );
}
