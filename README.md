# Personal Finance Snapshot

A minimal, polished finance tracker to visualize monthly income and expenses,
with per-category budgets and local persistence. Built for the Frontend
Developer Evaluation Assessment.

Live Demo: https://personal-finance-snapshot.netlify.app/
Repository: https://github.com/dev-lawrence/personal-finance-snapshot

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

## What I’d Improve With More Time

- Add multi-month navigation (view spending trends over time)
- Transaction editing and inline updates
- CSV import/export for transactions
- Currency selection and formatting preferences
- Dark mode + theme toggle
- Unit tests for selectors and components

## Challenges Faced

- Designing an interface that feels _simple yet insightful_ without visual clutter.
- Balancing analytical data (charts) and personal clarity (text summaries).
- Building a maintainable data layer without over-engineering (no backend).
- Handling responsive table layout gracefully across screen sizes.

## Time Spent

| Task                                             | Hours                           |
| ------------------------------------------------ | ------------------------------- |
| Project setup + architecture                     | 1h                              |
| Core features (Transactions, Dashboard, Budgets) | 5h                              |
| Styling + Responsive tweaks                      | 5h                              |
| UX polishing and animations                      | 30mins                          |
| Testing + deployment + README                    | 1h                              |
| **Total**                                        | **≈14h (spread across 2 days)** |

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```
