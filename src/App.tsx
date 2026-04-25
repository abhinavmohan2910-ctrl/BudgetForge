import { useMemo } from 'react';
import { Zap } from 'lucide-react';
import BudgetSetup from './components/BudgetSetup';
import AddExpenseForm from './components/AddExpenseForm';
import DashboardCards from './components/DashboardCards';
import ExpenseTable from './components/ExpenseTable';
import Charts from './components/Charts';
import Insights from './components/Insights';
import ExportButton from './components/ExportButton';
import { useLocalStorage } from './hooks/useStorage';
import { Expense, BudgetConfig, convertToBase } from './types';

const DEFAULT_CONFIG: BudgetConfig = { total: 10000, currency: 'USD' };

function App() {
  const [config, setConfig] = useLocalStorage<BudgetConfig>('tb-config', DEFAULT_CONFIG);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('tb-expenses', []);

  const totalSpent = useMemo(
    () => expenses.reduce((sum, e) => sum + convertToBase(e.amount, e.currency, config.currency), 0),
    [expenses, config.currency]
  );

  const addExpense = (exp: Expense) => setExpenses([...expenses, exp]);
  const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-green-500/[0.08] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-20 bg-[#070d1a]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">
                  TeamBudget <span className="text-cyan-400">AI</span>
                </h1>
                <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                  Smart collaborative budget tracker for teams
                </p>
              </div>
            </div>
            <ExportButton expenses={expenses} config={config} />
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          <DashboardCards config={config} totalSpent={totalSpent} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetSetup config={config} onSave={setConfig} />
            <AddExpenseForm onAdd={addExpense} />
          </div>

          <Charts expenses={expenses} config={config} />

          <Insights expenses={expenses} config={config} />

          <ExpenseTable expenses={expenses} config={config} onDelete={deleteExpense} />
        </main>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-white/5 mt-4">
          <p className="text-xs text-gray-600 text-center">
            TeamBudget AI &mdash; Static conversion rates for demo purposes
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
