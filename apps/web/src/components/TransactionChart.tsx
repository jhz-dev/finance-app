import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Transaction } from '@/domain/transaction/transaction';

interface TransactionChartProps {
  data: Transaction[];
}

export function TransactionChart({ data }: TransactionChartProps) {
  const chartData = useMemo(() => {
    const income = data
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = data
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    return [
      {
        name: 'Income vs. Expense',
        income: income,
        expense: expense,
      },
    ];
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255, 255, 255, 0.2)' }}
        />
        <Legend />
        <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
