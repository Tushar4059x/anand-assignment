import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import type { CategorySpend } from '@/utils/calculations';

interface SpendingDonutChartProps {
  data: CategorySpend[];
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: CategorySpend }>;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-card-hover">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{item.name}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {formatCurrency(item.value)}
      </p>
    </div>
  );
}

export function SpendingDonutChart({ data }: SpendingDonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const top5 = data.slice(0, 5);

  return (
    <Card padding="md">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Spending by Category</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Current month breakdown</p>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No expenses this month" description="Spending data will appear here." />
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut */}
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.categoryId} fill={entry.hex} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formatCurrency(total, { compact: true })}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2.5 w-full">
            {top5.map((item) => {
              const pct = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div key={item.categoryId} className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
                    {formatPercentage(pct, 0)}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex-shrink-0 w-16 text-right">
                    {formatCurrency(item.value, { compact: true })}
                  </span>
                </div>
              );
            })}
            {data.length > 5 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 pl-5">
                +{data.length - 5} more categories
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
