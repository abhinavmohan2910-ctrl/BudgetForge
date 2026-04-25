import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { BudgetConfig, Currency, CURRENCIES } from '../types';

interface Props {
  config: BudgetConfig;
  onSave: (cfg: BudgetConfig) => void;
}

export default function BudgetSetup({ config, onSave }: Props) {
  const [total, setTotal] = useState(config.total.toString());
  const [currency, setCurrency] = useState<Currency>(config.currency);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(total);
    if (!isNaN(parsed) && parsed > 0) {
      onSave({ total: parsed, currency });
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-cyan-500/20">
          <Wallet className="w-5 h-5 text-cyan-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Budget Setup</h2>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Total Budget</label>
          <input
            type="number"
            min="1"
            step="any"
            value={total}
            onChange={e => setTotal(e.target.value)}
            className="input-field w-full"
            placeholder="e.g. 50000"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Base Currency</label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value as Currency)}
            className="input-field w-full"
          >
            {(Object.keys(CURRENCIES) as Currency[]).map(c => (
              <option key={c} value={c}>{CURRENCIES[c].label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary w-full">
          Save Budget
        </button>
      </form>
    </div>
  );
}
