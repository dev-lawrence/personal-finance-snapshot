import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddTransactionDialog } from './AddTransactionDialog';
import { TransactionRow } from './TransactionRow';
import { useMemo, useState } from 'react';
import { Filters } from './Filters';
import { calcSummary, cn, formatCurrency, monthKeyFromDate } from '@/lib/utils';
import { useFinance } from '@/context/FinanceContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SortKey = 'date' | 'amount' | 'category' | 'description';
type SortDir = 'asc' | 'desc';

export function TransactionList({
  month = monthKeyFromDate(),
}: {
  month?: string;
}) {
  const { getMonthSlice } = useFinance();
  const slice = getMonthSlice(month);

  const [category, setCategory] = useState('all');
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    const base = slice.filter((t) =>
      category === 'all'
        ? true
        : t.category === category || t.type === category,
    );
    const searched = q.trim()
      ? base.filter((t) => {
          const hay = `${t.description} ${t.category} ${t.type}`.toLowerCase();
          return hay.includes(q.toLowerCase());
        })
      : base;
    const sorted = [...searched].sort((a, b) => {
      let va: number | string = '';
      let vb: number | string = '';
      if (sortKey === 'date') {
        va = new Date(a.date).getTime();
        vb = new Date(b.date).getTime();
      } else if (sortKey === 'amount') {
        va = a.amount;
        vb = b.amount;
      } else if (sortKey === 'category') {
        va = a.category;
        vb = b.category;
      } else {
        va = a.description;
        vb = b.description;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [slice, category, q, sortKey, sortDir]);

  const summary = useMemo(() => calcSummary(filtered), [filtered]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <section className="container pt-8">
      <Card className="shadow-none">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-2xl">Transactions</CardTitle>

          <div className="flex w-full flex-wrap items-stretch gap-2 sm:w-auto sm:flex-nowrap">
            <div className="min-w-0 flex-1 basis-full sm:basis-auto">
              <Input
                placeholder="Search description, category…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full text-base h-11 sm:h-10 sm:text-sm"
              />
            </div>

            <div className="shrink-0">
              <Filters category={category} onCategory={setCategory} />
            </div>
            <div className="shrink-0">
              <AddTransactionDialog />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Income"
              value={formatCurrency(summary.income)}
              tone="positive"
            />
            <SummaryCard
              label="Expenses"
              value={formatCurrency(summary.expense)}
              tone="negative"
            />
            <SummaryCard
              label="Net"
              value={formatCurrency(summary.net)}
              tone={summary.net >= 0 ? 'positive' : 'negative'}
            />
          </div>

          <div className="space-y-2 sm:hidden">
            {filtered.length === 0 ? (
              <div className="rounded-md border p-4 text-center text-sm text-muted-foreground">
                No transactions match. Try another filter, or
                <Button
                  className="ml-2 mt-2 inline-flex"
                  variant="secondary"
                  onClick={() => setCategory('all')}
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              filtered.map((t) => (
                <div key={t.id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {t.description}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(t.date).toLocaleDateString()} • {t.category}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'shrink-0 tabular-nums text-sm font-semibold',
                        t.amount >= 0 ? 'text-emerald-700' : 'text-rose-700',
                      )}
                    >
                      {formatCurrency(t.amount)}
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end">
                    {'Actions' in TransactionRow ? (
                      // @ts-expect-error
                      <TransactionRow.Actions id={t.id} transaction={t} />
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table (sm+) */}
          <div className="hidden overflow-x-auto rounded-md border px-2 sm:block sm:px-4">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b text-sm text-muted-foreground">
                  <Th
                    label="Date"
                    onClick={() => onSort('date')}
                    active={sortKey === 'date'}
                    dir={sortDir}
                  />
                  <Th
                    label="Description"
                    onClick={() => onSort('description')}
                    active={sortKey === 'description'}
                    dir={sortDir}
                  />
                  <Th
                    label="Category"
                    onClick={() => onSort('category')}
                    active={sortKey === 'category'}
                    dir={sortDir}
                  />
                  <Th
                    label="Amount"
                    onClick={() => onSort('amount')}
                    active={sortKey === 'amount'}
                    dir={sortDir}
                    className="text-right"
                  />
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No transactions match. Try another filter, or
                      <Button
                        className="ml-2"
                        variant="secondary"
                        onClick={() => setCategory('all')}
                      >
                        Reset filters
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => <TransactionRow key={t.id} {...t} />)
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Th({
  label,
  onClick,
  active,
  dir,
  className,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  dir: 'asc' | 'desc';
  className?: string;
}) {
  const Icon = active ? (dir === 'asc' ? ChevronUp : ChevronDown) : null;
  return (
    <th
      role="columnheader"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
      className={cn(
        'cursor-pointer select-none py-2 outline-none focus-visible:underline',
        className,
      )}
      onClick={onClick}
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {Icon && <Icon className="h-4 w-4" />}
      </span>
    </th>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'positive' | 'negative';
}) {
  return (
    <div
      className={cn(
        'rounded-md border p-3',
        tone === 'positive' ? 'bg-emerald-50/40' : 'bg-rose-50/40',
      )}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          'text-xl font-semibold tabular-nums',
          tone === 'positive' ? 'text-emerald-700' : 'text-rose-700',
        )}
      >
        {value}
      </div>
    </div>
  );
}
