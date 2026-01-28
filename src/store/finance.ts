import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const categories = [
  { id: 'income', name: 'Income', color: '#16a34a', icon: 'banknote' },
  { id: 'food', name: 'Food', color: '#ef4444', icon: 'utensils' },
  { id: 'rent', name: 'Rent', color: '#3b82f6', icon: 'home' },
  { id: 'transport', name: 'Transport', color: '#f59e0b', icon: 'car' },
  {
    id: 'entertainment',
    name: 'Entertainment',
    color: '#a855f7',
    icon: 'sparkles',
  },
  { id: 'other', name: 'Other', color: '#6b7280', icon: 'circle' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export const transactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string().max(120),
  amount: z.number().positive(),
  category: z.custom<CategoryId>(),
  type: z.enum(['income', 'expense']),
});

export type Transaction = z.infer<typeof transactionSchema>;

export type Budget = {
  category: Exclude<CategoryId, 'income'>;
  limit: number;
};

type Totals = {
  income: number;
  expenses: number;
  byCategory: Record<string, number>;
};

type Health = Record<
  string,
  { spent: number; limit: number | null; pct: number }
>;

type FinanceState = {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, patch: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: Budget['category'], limit: number) => void;

  // selectors
  getMonthSlice: (isoMonth: string) => Transaction[];
  totalsForMonth: (isoMonth: string) => Totals;
  budgetHealthForMonth: (isoMonth: string) => Health;

  // internal caches
  _cacheTotals: Map<string, Totals>;
  _cacheHealth: Map<string, Health>;
  _cacheSlices: Map<string, Transaction[]>;
};

export const useFinance = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      budgets: [
        { category: 'food', limit: 300 },
        { category: 'rent', limit: 800 },
        { category: 'transport', limit: 120 },
        { category: 'entertainment', limit: 150 },
        { category: 'other', limit: 100 },
      ],

      _cacheTotals: new Map(),
      _cacheHealth: new Map(),
      _cacheSlices: new Map(),

      // cache invalidation whenever transactions or budgets change
      addTransaction: (t) =>
        set((s) => {
          const next = { transactions: [t, ...s.transactions] };
          s._cacheTotals.clear();
          s._cacheHealth.clear();
          s._cacheSlices.clear();
          return next;
        }),
      updateTransaction: (id, patch) =>
        set((s) => {
          const next = {
            transactions: s.transactions.map((t) =>
              t.id === id ? { ...t, ...patch } : t,
            ),
          };
          s._cacheTotals.clear();
          s._cacheHealth.clear();
          s._cacheSlices.clear();
          return next;
        }),
      deleteTransaction: (id) =>
        set((s) => {
          const next = {
            transactions: s.transactions.filter((t) => t.id !== id),
          };
          s._cacheTotals.clear();
          s._cacheHealth.clear();
          s._cacheSlices.clear();
          return next;
        }),
      setBudget: (category, limit) =>
        set((s) => {
          const exists = s.budgets.find((b) => b.category === category);
          const nextBudgets = exists
            ? s.budgets.map((b) =>
                b.category === category ? { ...b, limit } : b,
              )
            : [...s.budgets, { category, limit }];
          s._cacheHealth.clear(); // health depends on budgets
          return { budgets: nextBudgets };
        }),

      getMonthSlice: (isoMonth) => {
        const cache = get()._cacheSlices;
        const cached = cache.get(isoMonth);
        if (cached) return cached;

        const year = Number(isoMonth.slice(0, 4));
        const monthIndex = Number(isoMonth.slice(5, 7)) - 1;
        const start = startOfMonth(new Date(year, monthIndex));
        const end = endOfMonth(start);
        const slice = get().transactions.filter((t) =>
          isWithinInterval(new Date(t.date), { start, end }),
        );
        cache.set(isoMonth, slice);
        return slice;
      },

      totalsForMonth: (isoMonth) => {
        const cache = get()._cacheTotals;
        const cached = cache.get(isoMonth);
        if (cached) return cached;

        const slice = get().getMonthSlice(isoMonth);
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
        const computed: Totals = { income, expenses, byCategory };
        cache.set(isoMonth, computed);
        return computed;
      },

      budgetHealthForMonth: (isoMonth) => {
        const cache = get()._cacheHealth;
        const cached = cache.get(isoMonth);
        if (cached) return cached;

        const { byCategory } = get().totalsForMonth(isoMonth);
        const map: Health = {};
        for (const c of categories) {
          if (c.id === 'income') continue;
          const budget = get().budgets.find((b) => b.category === c.id);
          const spent = byCategory[c.id] || 0;
          const limit = budget?.limit ?? null;
          const pct =
            limit && limit > 0 ? Math.min(1, spent / limit) : spent > 0 ? 1 : 0;
          map[c.id] = { spent, limit, pct };
        }
        cache.set(isoMonth, map);
        return map;
      },
    }),
    { name: 'finance-snapshot' },
  ),
);
