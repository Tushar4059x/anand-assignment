import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { useUIStore } from '@/store';

interface DataPoint {
  month: string;
  balance: number;
}

interface BalanceTrendChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-card-hover">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Balance Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Running balance over 6 months</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-3 h-0.5 bg-brand-500 rounded-full inline-block" />
          Balance
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
            tickFormatter={(v) => formatCurrency(v, { compact: true })}
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
