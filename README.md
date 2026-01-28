# Personal Finance Snapshot

A minimal, polished finance tracker to visualize monthly income and expenses,
with per-category budgets and local persistence. Built for the Frontend
Developer Evaluation Assessment.

Live Demo: <your-vercel-link>
Repository: <repo-link>

## Stack

- React + Vite (TypeScript)
- Tailwind CSS + shadcn/ui
- Zustand (state) + localStorage (persistence)
- Recharts (charts)
- Zod (validation)
- date-fns (dates)
- Lucide (icons)

## Why This Approach

- Simplicity first: local-only app with fast interactions.
- Clear information hierarchy: snapshot → composition → details.
- Subtle design: borders, spacing, color accents; avoids unnecessary gradients/shadows.
- Mobile-friendly: single-column flow; tables horizontally scroll on small screens.
- Maintainable code: modular components, typed models, simple store.

## Features

- Add transactions (date, type, category, amount, description)
- Monthly summary (income, expenses, net)
- Spending by category (pie) + budget health (progress bars)
- Set budgets per category; see over/under at a glance
- Filter transactions by category
- Data persists in localStorage

## Screens

- Dashboard: insights, category chart, budget health
- Transactions: list with filters, add/delete
- Budgets: set/edit category limits, see progress

## Architecture

State management:

- `store/finance.ts` holds transactions, budgets, selectors, and persistence.
- Derived selectors: monthly totals, category breakdowns, budget health.

Data model:

- Transaction: `{ id, date, description, amount, category, type }`
- Budget: `{ category, limit }`
- Categories: Food, Rent, Transport, Entertainment, Other (+ Income type)

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:5173
```
