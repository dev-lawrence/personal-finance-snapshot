import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { transactionSchema } from '@/hooks/useFinance';
import { useFinance } from '@/context/FinanceContext';
import { toast } from 'sonner';

const formSchema = transactionSchema.omit({ id: true });

export function AddTransactionDialog() {
  const { addTransaction } = useFinance();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: '',
    category: 'food',
    type: 'expense' as 'income' | 'expense',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const amountRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => amountRef.current?.focus(), 50);
    }
  }, [open]);

  const validate = () => {
    const parsed = formSchema.safeParse({
      date: new Date(form.date).toISOString(),
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
    });
    if (parsed.success) return { ok: true as const, data: parsed.data };
    const err: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0])
        err[String(issue.path[0])] = issue.message || 'Invalid field';
    }
    return { ok: false as const, err };
  };

  const onSubmit = () => {
    const res = validate();
    if (!res.ok) {
      setErrors(res.err);
      toast.error('Please check your inputs');
      return;
    }
    addTransaction({ id: crypto.randomUUID(), ...res.data });
    toast.success('Transaction added', {
      description: `${form.description || 'No description'}`,
    });
    setOpen(false);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      description: '',
      amount: '',
      category: 'food',
      type: 'expense',
    });
    setErrors({});
  };

  const onAmountChange = (v: string) => {
    const trimmed = v.replace(/[^\d\.\-\+]/g, '');
    if (trimmed.startsWith('+')) {
      setForm((f) => ({ ...f, amount: trimmed.slice(1), type: 'income' }));
    } else if (trimmed.startsWith('-')) {
      setForm((f) => ({ ...f, amount: trimmed.slice(1), type: 'expense' }));
    } else {
      setForm((f) => ({ ...f, amount: trimmed }));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent onKeyDown={onKeyDown}>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            {errors.date && <FieldError>{errors.date}</FieldError>}
          </div>

          <div className="grid gap-1.5">
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v as any })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <FieldError>{errors.type}</FieldError>}
          </div>

          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && <FieldError>{errors.category}</FieldError>}
          </div>

          <div className="grid gap-1.5">
            <Label>Amount</Label>
            <Input
              ref={amountRef}
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="e.g. +1200 or -45.50"
            />
            {errors.amount && <FieldError>{errors.amount}</FieldError>}
          </div>

          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Groceries at Market"
              rows={3}
            />
            {errors.description && (
              <FieldError>{errors.description}</FieldError>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs text-red-600" role="alert">
      {children}
    </div>
  );
}
