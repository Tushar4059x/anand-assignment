import { DollarSign, ArrowUpCircle, ArrowDownCircle, PiggyBank } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { BalanceTrendChart } from '@/components/dashboard/BalanceTrendChart';
import { SpendingDonutChart } from '@/components/dashboard/SpendingDonutChart';
import { useChartData } from '@/hooks/useChartData';

export function DashboardPage() {
  const {
    summaryMetrics,
    balanceTrend,
    spendingByCategory,
  } = useChartData();

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          value={summaryMetrics.balance}
          delta={summaryMetrics.balanceDelta}
          icon={DollarSign}
          variant="balance"
          subtitle="All time"
        />
        <SummaryCard
          title="Monthly Income"
          value={summaryMetrics.income}
          delta={summaryMetrics.incomeDelta}
          icon={ArrowUpCircle}
          variant="income"
          subtitle="This month"
        />
        <SummaryCard
          title="Monthly Expenses"
          value={summaryMetrics.expenses}
          delta={summaryMetrics.expensesDelta}
          icon={ArrowDownCircle}
          variant="expense"
          subtitle="This month"
        />
        <SummaryCard
          title="Savings Rate"
          value={summaryMetrics.savingsRate}
          delta={summaryMetrics.savingsRateDelta}
          icon={PiggyBank}
          variant="savings"
          isCurrency={false}
          isPercentage={true}
          subtitle="This month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceTrendChart data={balanceTrend} />
        <SpendingDonutChart data={spendingByCategory} />
      </div>
    </div>
  );
}
