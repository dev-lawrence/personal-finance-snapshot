import React, { createContext, useContext } from 'react';
import { useFinance as useFinanceHook } from '@/hooks/useFinance';

const FinanceContext = createContext<ReturnType<typeof useFinanceHook> | null>(
  null,
);

export const FinanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = useFinanceHook();
  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};

// consumer hook
export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error('useFinance must be used within a <FinanceProvider>');
  }
  return ctx;
}
