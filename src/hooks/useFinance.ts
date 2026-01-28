import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { categories } from '@/data/categories';
import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string().max(120),
  amount: z.number().positive(),
  category: z.string(),
  type: z.enum(['income', 'expense']),
});

export type Transaction = z.infer<typeof transactionSchema>;

type Budget = {
  category: string;
  limit: number;
};

type FinanceData = {
  transactions: Transaction[];
  budgets: Budget[];
};

const STORAGE_KEY = 'finance-local-storage';

export function useFinance() {
  const [data, setData] = useState<FinanceData>(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) return JSON.parse(fromStorage);
    return {
      transactions: [],
      budgets: [
        { category: 'food', limit: 300 },
        { category: 'rent', limit: 800 },
        { category: 'transport', limit: 120 },
        { category: 'entertainment', limit: 150 },
        { category: 'other', limit: 100 },
      ],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTransaction = useCallback((t: Transaction) => {
    setData((prev) => ({
      ...prev,
      transactions: [t, ...prev.transactions],
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const setBudget = useCallback((category: string, limit: number) => {
    setData((prev) => {
      const exists = prev.budgets.find((b) => b.category === category);
      const budgets = exists
        ? prev.budgets.map((b) =>
            b.category === category ? { ...b, limit } : b,
          )
        : [...prev.budgets, { category, limit }];
      return { ...prev, budgets };
    });
  }, []);

  const getMonthSlice = useCallback(
    (isoMonth: string) => {
      const year = Number(isoMonth.slice(0, 4));
      const monthIndex = Number(isoMonth.slice(5, 7)) - 1;
      const start = startOfMonth(new Date(year, monthIndex));
      const end = endOfMonth(start);
      return data.transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start, end }),
      );
    },
    [data.transactions],
  );

  const totalsForMonth = useCallback(
    (isoMonth: string) => {
      const slice = getMonthSlice(isoMonth);
      let income = 0;
      let expenses = 0;
      const byCategory: Record<string, number> = {};
      for (const c of categories) {
        if (c.id !== 'income') byCategory[c.id] = 0;
      }
      for (const t of slice) {
        if (t.type === 'income') income += t.amount;
        else {
          expenses += t.amount;
          byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
        }
      }
      return { income, expenses, byCategory };
    },
    [getMonthSlice],
  );

  const budgetHealthForMonth = useCallback(
    (isoMonth: string) => {
      const { byCategory } = totalsForMonth(isoMonth);
      const map: Record<
        string,
        { spent: number; limit: number | null; pct: number }
      > = {};
      for (const c of categories) {
        if (c.id === 'income') continue;
        const budget = data.budgets.find((b) => b.category === c.id);
        const spent = byCategory[c.id] || 0;
        const limit = budget?.limit ?? null;
        const pct =
          limit && limit > 0 ? Math.min(1, spent / limit) : spent > 0 ? 1 : 0;
        map[c.id] = { spent, limit, pct };
      }
      return map;
    },
    [totalsForMonth, data.budgets],
  );

  return {
    transactions: data.transactions,
    budgets: data.budgets,
    addTransaction,
    deleteTransaction,
    setBudget,
    getMonthSlice,
    totalsForMonth,
    budgetHealthForMonth,
  };
}
