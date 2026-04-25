import { Trash2 } from 'lucide-react';
import { Expense, BudgetConfig, convertToBase, formatCurrency, CURRENCIES } from '../types';

interface Props {
  expenses: Expense[];
  config: BudgetConfig;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-500/20 text-orange-300',
  Travel: 'bg-blue-500/20 text-blue-300',
  Software: 'bg-cyan-500/20 text-cyan-300',
  Marketing: 'bg-pink-500/20 text-pink-300',
  Misc: 'bg-gray-500/20 text-gray-300',
};

export default function ExpenseTable({ expenses, config, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-sm">No expenses yet. Add your first expense above.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Expense Log</h2>
        <p className="text-xs text-gray-500 mt-0.5">{expenses.length} entries</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Title', 'Original', `In ${config.currency}`, 'Category', 'Member', 'Date', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {expenses.map(exp => {
              const converted = convertToBase(exp.amount, exp.currency, config.currency);
              return (
                <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3 text-sm text-white font-medium">{exp.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                    {CURRENCIES[exp.currency].symbol}{exp.amount.toLocaleString()}
                    <span className="ml-1 text-xs text-gray-500">{exp.currency}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-cyan-400 font-medium whitespace-nowrap">
                    {formatCurrency(converted, config.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${CATEGORY_COLORS[exp.category]}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{exp.member}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{exp.date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onDelete(exp.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
