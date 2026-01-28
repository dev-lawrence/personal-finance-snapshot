import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (n: number, currency = 'USD') =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
  }).format(new Date(iso));

export const monthKeyFromDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export function calcSummary(
  items: { amount: number; type: 'income' | 'expense' }[],
) {
  const income = items
    .filter((i) => i.type === 'income')
    .reduce((s, i) => s + i.amount, 0);
  const expense = items
    .filter((i) => i.type === 'expense')
    .reduce((s, i) => s + i.amount, 0);
  const net = income - expense;
  return { income, expense, net };
}
