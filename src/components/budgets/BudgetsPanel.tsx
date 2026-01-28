import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { categories } from '@/data/categories';
import { BudgetBar } from './BudgetBar';
import { monthKeyFromDate } from '@/lib/utils';
import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';

export function BudgetsPanel({
  month = monthKeyFromDate(),
}: {
  month?: string;
}) {
  const { budgetHealthForMonth, setBudget } = useFinance();
  const health = budgetHealthForMonth(month);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  return (
    <section className="container pt-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Budgets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {categories
              .filter((c) => c.id !== 'income')
              .map((c) => {
                const state = health[c.id];
                const displayValue =
                  localValues[c.id] ?? (state.limit || '').toString();

                const usedPct =
                  state.limit && state.limit > 0
                    ? Math.min(1, state.spent / state.limit)
                    : 0;
                const showStats = state.spent > 0 || state.limit! > 0;
                const intent =
                  usedPct < 0.6 ? 'ok' : usedPct < 0.9 ? 'warn' : 'over';
                const intentText =
                  intent === 'ok'
                    ? 'On track'
                    : intent === 'warn'
                      ? 'Approaching limit'
                      : 'Limit exceeded';

                return (
                  <div
                    key={c.id}
                    className="rounded-lg border border-border/60 p-3.5 sm:p-4 bg-background/60 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        {c.name}
                      </h3>
                      {showStats && (
                        <span
                          className="text-xs text-muted-foreground tabular-nums"
                          title={intentText}
                        >
                          {Math.round(usedPct * 100)}%
                        </span>
                      )}
                    </div>

                    <BudgetBar
                      label={c.name}
                      spent={state.spent}
                      limit={state.limit}
                      color={c.color}
                    />

                    {showStats && (
                      <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                        {state.limit
                          ? `${state.spent.toLocaleString()} / ${state.limit.toLocaleString()}`
                          : `${state.spent.toLocaleString()} spent (no limit)`}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <Input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        placeholder="Set monthly limit"
                        value={displayValue}
                        className="flex-1 text-sm"
                        onChange={(e) =>
                          setLocalValues((prev) => ({
                            ...prev,
                            [c.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary active:bg-primary cursor-pointer"
                        onClick={() => {
                          const newValue = Number(localValues[c.id] || 0);
                          setBudget(c.id as any, newValue);

                          const input = document.querySelector(
                            `input[name="${c.id}"]`,
                          ) as HTMLInputElement | null;
                          input?.classList.add('ring', 'ring-emerald-400');
                          setTimeout(
                            () =>
                              input?.classList.remove(
                                'ring',
                                'ring-emerald-400',
                              ),
                            400,
                          );

                          setLocalValues((prev) => {
                            const next = { ...prev };
                            delete next[c.id];
                            return next;
                          });
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        <Card className="border shadow-none h-fit">
          <CardHeader className="pb-2">
            <CardTitle className=" font-semibold tracking-tight">
              Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>• Keep housing costs under roughly 30% of your income.</p>
            <p>• Track recurring subscriptions—they quietly drain balance.</p>
            <p>• Adjust limits after reviewing a couple of months’ history.</p>
            <p>• Build a small “buffer” category for unexpected spending.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
