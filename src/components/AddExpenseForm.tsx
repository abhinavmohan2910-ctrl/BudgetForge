import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Expense, Currency, Category, CURRENCIES, CATEGORIES } from '../types';

interface Props {
  onAdd: (expense: Expense) => void;
}

const EMPTY = {
  title: '',
  amount: '',
  currency: 'USD' as Currency,
  category: 'Misc' as Category,
  member: '',
  date: new Date().toISOString().split('T')[0],
};

export default function AddExpenseForm({ onAdd }: Props) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.title.trim()) return setError('Title is required.');
    if (isNaN(amount) || amount <= 0) return setError('Enter a valid amount.');
    if (!form.member.trim()) return setError('Team member name is required.');
    setError('');
    onAdd({
      id: crypto.randomUUID(),
      title: form.title.trim(),
      amount,
      currency: form.currency,
      category: form.category,
      member: form.member.trim(),
      date: form.date,
    });
    setForm(EMPTY);
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-green-500/20">
          <PlusCircle className="w-5 h-5 text-green-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">Add Expense</h2>
      </div>
      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Expense Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="input-field w-full"
              placeholder="e.g. Team lunch"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Team Member</label>
            <input
              type="text"
              value={form.member}
              onChange={e => set('member', e.target.value)}
              className="input-field w-full"
              placeholder="e.g. Alice"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              className="input-field w-full"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <select
              value={form.currency}
              onChange={e => set('currency', e.target.value)}
              className="input-field w-full"
            >
              {(Object.keys(CURRENCIES) as Currency[]).map(c => (
                <option key={c} value={c}>{CURRENCIES[c].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="input-field w-full"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          Add Expense
        </button>
      </form>
    </div>
  );
}
