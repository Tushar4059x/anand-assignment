import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { useUIStore } from '@/store';

interface DataPoint {
  month: string;
  savingsRate: number;
  savedAmount: number;
}

interface SavingsTrendChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const rate = payload.find((p) => p.dataKey === 'savingsRate');
  const amount = payload.find((p) => p.dataKey === 'savedAmount');
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-card-hover">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</p>
      {rate && (
        <p className="text-sm font-bold text-amber-500">
          {formatPercentage(rate.value)} saved
        </p>
      )}
      {amount && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatCurrency(amount.value)} saved
        </p>
      )}
    </div>
  );
}

export function SavingsTrendChart({ data }: SavingsTrendChartProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

  return (
    <Card padding="md">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Savings Rate Trend</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly savings rate over 6 months</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="savingsRate"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="url(#savingsGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
