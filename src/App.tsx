import { useState } from 'react';
import { Dashboard } from './components/dashboard/Dashboard';
import { TransactionList } from './components/transactions/TransactionList';
import { BudgetsPanel } from './components/budgets/BudgetsPanel';
import { monthKeyFromDate } from './lib/utils';
import { AppShell } from './AppShell';
import { Toaster } from './components/ui/sonner';

type View = 'dashboard' | 'transactions' | 'budgets';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [month] = useState(monthKeyFromDate());

  return (
    <AppShell view={view} onViewChange={setView}>
      <div className="grid gap-4">
        {view === 'dashboard' && <Dashboard month={month} />}
        {view === 'transactions' && <TransactionList month={month} />}
        {view === 'budgets' && <BudgetsPanel month={month} />}
      </div>

      <Toaster
        richColors
        position="top-right"
        className="font-sans"
        closeButton
      />
    </AppShell>
  );
}

export default App;
