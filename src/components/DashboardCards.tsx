import { TrendingUp, DollarSign, PiggyBank, BarChart2 } from 'lucide-react';
import { BudgetConfig, formatCurrency } from '../types';

interface Props {
  config: BudgetConfig;
  totalSpent: number;
}

export default function DashboardCards({ config, totalSpent }: Props) {
  const remaining = config.total - totalSpent;
  const pct = config.total > 0 ? Math.min((totalSpent / config.total) * 100, 100) : 0;

  const cards = [
    {
      label: 'Total Budget',
      value: formatCurrency(config.total, config.currency),
      icon: <DollarSign className="w-5 h-5" />,
      color: 'cyan',
      sub: config.currency,
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent, config.currency),
      icon: <TrendingUp className="w-5 h-5" />,
      color: pct >= 80 ? 'red' : 'amber',
      sub: `${pct.toFixed(1)}% used`,
    },
    {
      label: 'Remaining',
      value: formatCurrency(Math.max(remaining, 0), config.currency),
      icon: <PiggyBank className="w-5 h-5" />,
      color: remaining < 0 ? 'red' : 'green',
      sub: remaining < 0 ? 'Over budget!' : 'Available',
    },
    {
      label: 'Budget Used',
      value: `${pct.toFixed(1)}%`,
      icon: <BarChart2 className="w-5 h-5" />,
      color: pct >= 80 ? 'red' : pct >= 50 ? 'amber' : 'cyan',
      sub: pct >= 100 ? 'Exceeded' : pct >= 80 ? 'Critical' : 'On track',
    },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/20',
    green: 'text-green-400 bg-green-500/20',
    amber: 'text-amber-400 bg-amber-500/20',
    red: 'text-red-400 bg-red-500/20',
  };

  const borderMap: Record<string, string> = {
    cyan: 'border-cyan-500/20',
    green: 'border-green-500/20',
    amber: 'border-amber-500/20',
    red: 'border-red-500/20',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className={`glass-card rounded-2xl p-5 border ${borderMap[card.color]} hover:scale-[1.02] transition-transform duration-200`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{card.label}</span>
            <div className={`p-1.5 rounded-lg ${colorMap[card.color]}`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-2xl font-bold ${colorMap[card.color].split(' ')[0]}`}>{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
