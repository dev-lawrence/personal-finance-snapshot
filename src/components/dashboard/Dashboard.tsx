import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryPie } from '../charts/CategoryPie';
import { Insight } from './Insight';
import { categories } from '@/data/categories';
import { formatCurrency, monthKeyFromDate } from '@/lib/utils';
import { useMemo } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { cn } from '@/lib/utils';

export function Dashboard({ month = monthKeyFromDate() }: { month?: string }) {
  const { totalsForMonth, budgetHealthForMonth } = useFinance();
  const totals = totalsForMonth(month);
  const health = budgetHealthForMonth(month);
  const net = totals.income - totals.expenses;

  const pieData = useMemo(
    () =>
      Object.entries(totals.byCategory).map(([category, value]) => ({
        category,
        value,
      })),
    [totals.byCategory],
  );

  const metaById = useMemo(() => {
    const map = new Map<string, (typeof categories)[number]>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  return (
    <section className="container pt-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <section
            aria-labelledby="monthly-summary"
            className="space-y-3 sm:space-y-4"
          >
            <h2
              id="monthly-summary"
              className="text-2xl font-semibold sticky top-(--sticky-offset,0px) bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 py-1 -mx-4 px-4 sm:static sm:bg-transparent sm:py-0"
            >
              This month
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              <Insight label="Income" value={formatCurrency(totals.income)} />
              <Insight
                label="Expenses"
                value={formatCurrency(totals.expenses)}
              />
              <Insight
                label="Net"
                value={formatCurrency(net)}
                hint={net >= 0 ? 'Saving' : 'Over spending'}
                data-pos={net >= 0}
              />
            </div>
          </section>

          {/* Spending by Category */}
          <section aria-labelledby="spending-by-category">
            <Card className="border shadow-none">
              <CardHeader className="pb-2">
                <CardTitle id="spending-by-category" className="font-semibold">
                  Spending by category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-full">
                  <CategoryPie data={pieData} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm">
                  {Object.entries(health).map(([catId, h]) => {
                    const meta = metaById.get(catId);
                    if (!meta) return null;
                    const hasLimit = h.limit && h.limit > 0;
                    return (
                      <button
                        key={catId}
                        type="button"
                        className="flex items-center justify-between rounded-md border px-2 py-2 text-left hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label={`${meta.name}: ${formatCurrency(
                          h.spent,
                        )}${hasLimit ? ` of ${formatCurrency(h.limit!)}` : ''}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full flex-none"
                            style={{ backgroundColor: meta.color }}
                            aria-hidden
                          />
                          <span className="truncate">{meta.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(h.spent)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {hasLimit
                              ? `of ${formatCurrency(h.limit!)}`
                              : 'No budget'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section aria-labelledby="budget-health">
          <Card className="border shadow-none">
            <CardHeader className="pb-2">
              <CardTitle id="budget-health" className="font-semibold">
                Budget health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(health).map(([catId, h]) => {
                const meta = metaById.get(catId);
                if (!meta) return null;
                const pct =
                  h.limit && h.limit > 0 ? Math.min(1, h.spent / h.limit) : 0;

                const fillClass =
                  pct < 0.6
                    ? 'bg-emerald-600'
                    : pct < 0.9
                      ? 'bg-amber-600'
                      : 'bg-red-600';

                return (
                  <div key={catId} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="inline-block h-2 w-2 rounded-full flex-none"
                          style={{ backgroundColor: meta.color }}
                          aria-hidden
                        />
                        <span className="truncate">{meta.name}</span>
                      </div>
                      <div className="text-muted-foreground tabular-nums">
                        {h.limit ? `${Math.round(pct * 100)}%` : '—'}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-md bg-muted overflow-hidden">
                      <div
                        className={cn('h-full transition-[width]', fillClass)}
                        style={{ width: `${pct * 100}%` }}
                        aria-hidden
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="tabular-nums">
                        {formatCurrency(h.spent)}
                      </span>
                      <span className="tabular-nums">
                        {h.limit ? formatCurrency(h.limit) : 'No limit'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </div>
    </section>
  );
}
