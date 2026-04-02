import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types';

interface UIState {
  role: UserRole;
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  activePage: 'dashboard' | 'transactions' | 'insights';
  activeModal: 'add' | 'edit' | 'delete' | null;
  editingTransactionId: string | null;

  toggleRole: () => void;
  setRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActivePage: (page: 'dashboard' | 'transactions' | 'insights') => void;
  openModal: (modal: 'add' | 'edit' | 'delete', txId?: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      role: 'admin',
      isDarkMode: false,
      isSidebarOpen: false,
      activePage: 'dashboard',
      activeModal: null,
      editingTransactionId: null,

      toggleRole: () =>
        set((state) => ({ role: state.role === 'admin' ? 'viewer' : 'admin' })),

      setRole: (role) => set({ role }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      setActivePage: (page) =>
        set({ activePage: page, isSidebarOpen: false }),

      openModal: (modal, txId) =>
        set({ activeModal: modal, editingTransactionId: txId ?? null }),

      closeModal: () =>
        set({ activeModal: null, editingTransactionId: null }),
    }),
    {
      name: 'finance-ui',
      partialize: (state) => ({ role: state.role, isDarkMode: state.isDarkMode }),
    }
  )
);
