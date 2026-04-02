import { AppShell } from '@/components/layout/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { InsightsPage } from '@/pages/InsightsPage';
import { useUIStore } from '@/store';

export function App() {
  const activePage = useUIStore((s) => s.activePage);

  return (
    <AppShell>
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'transactions' && <TransactionsPage />}
      {activePage === 'insights' && <InsightsPage />}
    </AppShell>
  );
}
