import { formatCurrency } from '@/lib/utils';

export function BudgetBar({
  label,
  spent,
  limit,
  color,
}: {
  label: string;
  spent: number;
  limit: number | null;
  color: string;
}) {
  const pct = limit ? Math.min(1, spent / limit) : 0;
  const barColor = pct < 0.75 ? color : pct < 1 ? color : '#ef4444';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {formatCurrency(spent)} {limit ? `of ${formatCurrency(limit)}` : ''}
        </span>
      </div>
      <div className="h-2 w-full rounded bg-muted overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${pct * 100}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
