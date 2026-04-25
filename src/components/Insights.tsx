import { AlertTriangle, TrendingDown, Lightbulb, Star, Activity } from 'lucide-react';
import { Expense, BudgetConfig, Category, convertToBase, formatCurrency, CATEGORIES } from '../types';

interface Props {
  expenses: Expense[];
  config: BudgetConfig;
}

interface Insight {
  icon: React.ReactNode;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success' | 'critical';
}

export default function Insights({ expenses, config }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Smart Insights</h2>
        </div>
        <p className="text-gray-500 text-sm">Add expenses to see AI-powered insights.</p>
      </div>
    );
  }

  const totalSpent = expenses.reduce(
    (sum, e) => sum + convertToBase(e.amount, e.currency, config.currency), 0
  );
  const pct = config.total > 0 ? (totalSpent / config.total) * 100 : 0;

  // Category totals
  const catTotals = CATEGORIES.map(cat => ({
    cat,
    total: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + convertToBase(e.amount, e.currency, config.currency), 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  // Member totals
  const memberMap = new Map<string, number>();
  for (const exp of expenses) {
    const converted = convertToBase(exp.amount, exp.currency, config.currency);
    memberMap.set(exp.member, (memberMap.get(exp.member) ?? 0) + converted);
  }

  // Average expense
  const avg = totalSpent / expenses.length;
  const unusualExpenses = expenses.filter(e => {
    const converted = convertToBase(e.amount, e.currency, config.currency);
    return converted > avg * 2.5 && converted > 100;
  });

  const insights: Insight[] = [];

  // Budget usage
  if (pct >= 100) {
    insights.push({
      type: 'critical',
      icon: <AlertTriangle className="w-4 h-4" />,
      title: 'Budget Exceeded!',
      description: `You've spent ${formatCurrency(totalSpent, config.currency)}, which is ${(pct - 100).toFixed(1)}% over your budget.`,
    });
  } else if (pct >= 80) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="w-4 h-4" />,
      title: `Warning: ${pct.toFixed(1)}% Budget Used`,
      description: `Only ${formatCurrency(config.total - totalSpent, config.currency)} remaining. Consider cutting back on discretionary spending.`,
    });
  } else {
    insights.push({
      type: 'success',
      icon: <Activity className="w-4 h-4" />,
      title: `Budget On Track — ${pct.toFixed(1)}% Used`,
      description: `You have ${formatCurrency(config.total - totalSpent, config.currency)} left. Keep it up!`,
    });
  }

  // Top spending category
  if (catTotals.length > 0) {
    const top = catTotals[0];
    const catPct = ((top.total / totalSpent) * 100).toFixed(1);
    insights.push({
      type: 'info',
      icon: <Star className="w-4 h-4" />,
      title: `Top Category: ${top.cat}`,
      description: `${top.cat} accounts for ${catPct}% of total spend (${formatCurrency(top.total, config.currency)}).`,
    });
  }

  // Save money suggestion
  if (catTotals.length > 1) {
    const saveCat = catTotals[0];
    insights.push({
      type: 'info',
      icon: <TrendingDown className="w-4 h-4" />,
      title: `Save on ${saveCat.cat}`,
      description: `Consider reducing ${saveCat.cat} expenses — cutting 20% would save ${formatCurrency(saveCat.total * 0.2, config.currency)}.`,
    });
  }

  // Unusual expenses
  if (unusualExpenses.length > 0) {
    insights.push({
      type: 'warning',
      icon: <Lightbulb className="w-4 h-4" />,
      title: `${unusualExpenses.length} Unusually High Expense${unusualExpenses.length > 1 ? 's' : ''}`,
      description: `"${unusualExpenses[0].title}" is significantly above your average expense of ${formatCurrency(avg, config.currency)}.`,
    });
  }

  const typeStyles: Record<string, string> = {
    critical: 'border-red-500/30 bg-red-500/10 text-red-400',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
    success: 'border-green-500/30 bg-green-500/10 text-green-400',
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Smart Insights</h2>
      </div>
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <div key={i} className={`flex gap-3 rounded-xl border px-4 py-3 ${typeStyles[ins.type]}`}>
            <div className="mt-0.5 shrink-0">{ins.icon}</div>
            <div>
              <p className="text-sm font-semibold">{ins.title}</p>
              <p className="text-xs mt-0.5 opacity-80">{ins.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
