import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { useUIStore } from '@/store';

interface DataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface MonthlyBarChartProps {
  data: DataPoint[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-card-hover space-y-1">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.fill }} />
          <span className="text-slate-600 dark:text-slate-300 capitalize">{p.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';

  return (
    <Card padding="md">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Income vs Expenses</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly comparison over 6 months</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc', radius: 4 }} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: textColor }}
            formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
          />
          <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
