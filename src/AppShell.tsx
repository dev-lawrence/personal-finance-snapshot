import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

type View = 'dashboard' | 'transactions' | 'budgets';

export function AppShell({
  children,
  onViewChange,
  view,
}: {
  children: React.ReactNode;
  view: View;
  onViewChange: (v: View) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70 border-b">
        <div className="container flex flex-wrap items-center justify-between h-auto py-2 sm:h-14 sm:py-0 gap-2">
          <div className="font-semibold tracking-tight text-lg">
            Finance <span className="text-primary">Snapshot</span>
          </div>

          <Tabs
            value={view}
            onValueChange={(v) => onViewChange(v as View)}
            className="w-full sm:w-auto"
          >
            <TabsList className="flex w-full sm:w-auto overflow-x-auto no-scrollbar sm:overflow-visible">
              <TabsTrigger value="dashboard" className="flex-1 sm:flex-none">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex-1 sm:flex-none">
                Transactions
              </TabsTrigger>
              <TabsTrigger value="budgets" className="flex-1 sm:flex-none">
                Budgets
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="flex-1 py-4">{children}</main>

      <Separator className="my-4" />

      <footer className="container max-w-7xl mx-auto py-6 px-4 text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} Finance Snapshot. All rights reserved.
      </footer>
    </div>
  );
}
