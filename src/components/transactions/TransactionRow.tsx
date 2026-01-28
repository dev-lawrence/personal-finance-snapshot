import { Button } from '@/components/ui/button';
import { useFinance } from '@/context/FinanceContext';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export function TransactionRow({
  id,
  date,
  description,
  amount,
  category,
  type,
}: {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}) {
  const { deleteTransaction, addTransaction } = useFinance();

  const onDelete = () => {
    const snapshot = { id, date, description, amount, category, type };
    deleteTransaction(id);
    toast.success('Transaction deleted', {
      description: `${formatDate(date)} • ${description}`,
      action: {
        label: 'Undo',
        onClick: () => addTransaction(snapshot),
      },
      duration: 4000,
    });
  };

  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="py-2 text-sm whitespace-nowrap">{formatDate(date)}</td>
      <td className="py-2 text-sm">{description}</td>
      <td className="py-2 text-sm capitalize">{category}</td>
      <td
        className={cn(
          'py-2 text-sm text-right tabular-nums font-medium',
          type === 'income' ? 'text-emerald-600' : 'text-red-600',
        )}
      >
        {type === 'income' ? '+' : '-'}
        {formatCurrency(amount)}
      </td>
      <td className="py-2 text-right">
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
}
