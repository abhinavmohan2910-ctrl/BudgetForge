import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { Expense, BudgetConfig, Category, convertToBase, formatCurrency, CATEGORIES } from '../types';

interface Props {
  expenses: Expense[];
  config: BudgetConfig;
}

const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Travel: '#3b82f6',
  Software: '#06b6d4',
  Marketing: '#ec4899',
  Misc: '#6b7280',
};

export default function Charts({ expenses, config }: Props) {
  const categoryData = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + convertToBase(e.amount, e.currency, config.currency), 0);
    return { name: cat, value: parseFloat(total.toFixed(2)) };
  }).filter(d => d.value > 0);

  const memberMap = new Map<string, number>();
  for (const exp of expenses) {
    const converted = convertToBase(exp.amount, exp.currency, config.currency);
    memberMap.set(exp.member, (memberMap.get(exp.member) ?? 0) + converted);
  }
  const memberData = Array.from(memberMap.entries())
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  const tooltipStyle = {
    backgroundColor: '#0f1729',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#fff',
  };

  if (expenses.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['Category Breakdown', 'Member Spending'].map(title => (
          <div key={title} className="glass-card rounded-2xl p-6 h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm">{title}: no data yet</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map(entry => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as Category]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(val: number) => [formatCurrency(val, config.currency), 'Spent']}
            />
            <Legend
              formatter={(value) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">Member Spending</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={memberData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={50}
              tickFormatter={(v: number) => {
                if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
                return v.toString();
              }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(val: number) => [formatCurrency(val, config.currency), 'Spent']}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
