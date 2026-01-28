import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { FinanceProvider } from './context/FinanceContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </StrictMode>,
);
