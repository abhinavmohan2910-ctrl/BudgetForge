export type Currency = 'INR' | 'USD' | 'EUR' | 'JPY' | 'GBP';
export type Category = 'Food' | 'Travel' | 'Software' | 'Marketing' | 'Misc';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  category: Category;
  member: string;
  date: string;
}

export interface BudgetConfig {
  total: number;
  currency: Currency;
}

export const CURRENCIES: Record<Currency, { symbol: string; label: string }> = {
  INR: { symbol: '₹', label: 'INR - Indian Rupee' },
  USD: { symbol: '$', label: 'USD - US Dollar' },
  EUR: { symbol: '€', label: 'EUR - Euro' },
  JPY: { symbol: '¥', label: 'JPY - Japanese Yen' },
  GBP: { symbol: '£', label: 'GBP - British Pound' },
};

export const CATEGORIES: Category[] = ['Food', 'Travel', 'Software', 'Marketing', 'Misc'];

// Static conversion rates to USD
export const TO_USD: Record<Currency, number> = {
  USD: 1,
  INR: 0.012,
  EUR: 1.08,
  JPY: 0.0067,
  GBP: 1.27,
};

export function convertToBase(amount: number, from: Currency, to: Currency): number {
  const inUSD = amount * TO_USD[from];
  return inUSD / TO_USD[to];
}

export function formatCurrency(amount: number, currency: Currency): string {
  const sym = CURRENCIES[currency].symbol;
  return `${sym}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
