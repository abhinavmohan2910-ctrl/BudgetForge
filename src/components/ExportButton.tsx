import { Download } from 'lucide-react';
import { Expense, BudgetConfig, convertToBase, CURRENCIES } from '../types';

interface Props {
  expenses: Expense[];
  config: BudgetConfig;
}

export default function ExportButton({ expenses, config }: Props) {
  const handleExport = () => {
    const headers = ['Title', 'Original Amount', 'Currency', `Amount (${config.currency})`, 'Category', 'Member', 'Date'];
    const rows = expenses.map(e => [
      `"${e.title}"`,
      e.amount,
      e.currency,
      convertToBase(e.amount, e.currency, config.currency).toFixed(2),
      e.category,
      `"${e.member}"`,
      e.date,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teambudget-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={expenses.length === 0}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
