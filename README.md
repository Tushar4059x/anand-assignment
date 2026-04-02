# FinanceIQ — Personal Finance Dashboard

A clean, interactive finance dashboard built with React + TypeScript. Track income and expenses, explore transactions, understand spending patterns, and switch between Admin and Viewer roles — all with a polished dark mode UI.

---

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

**Requirements:** Node.js ≥ 18, npm ≥ 9

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 (class-based dark mode) |
| Charts | Recharts 2 |
| State | Zustand 5 with `persist` middleware |
| Icons | Lucide React |
| Dates | date-fns v4 |

---

## Features

### Dashboard
- **4 summary cards** — Total Balance, Monthly Income, Monthly Expenses, Savings Rate — each with a month-over-month delta indicator
- **Balance Trend** — 6-month running balance as a smooth line chart
- **Spending Donut** — Current month expense breakdown by category with an interactive donut and legend

### Transactions
- Full transaction table with Date, Description, Category, Type, and Amount columns
- **Search** (debounced 300ms), **type filter**, **category filter**, **date range** — all composable
- **Sortable columns** — click Date, Description, or Amount headers to toggle asc/desc
- Paginated: 20 rows shown with a "Load more" button
- Empty state with a clear-filters action when results are 0

### Role-Based UI
- **Admin** — full CRUD: Add Transaction button, inline Edit/Delete per row (revealed on hover)
- **Viewer** — read-only: no mutation controls anywhere in the UI
- Toggle via the pill button in the header. Role is persisted to `localStorage`

### Insights
- **Best Savings Month**, **Average Savings Rate**, **Current Month Net** — quick stat cards
- **Top Spending Category** — highlights the highest-spend category with a progress bar and month-over-month delta
- **Income vs Expenses** — grouped bar chart for 6 months
- **Savings Rate Trend** — area chart showing savings rate % over 6 months
- **Category Breakdown** — ranked list with mini progress bars

### Dark Mode
- Full dark/light theme toggle (Moon/Sun icon in header)
- Preference persisted to `localStorage` via Zustand `persist`
- All surfaces, charts, and text follow the theme

---

## Architecture

```
src/
  types/          TypeScript interfaces (Transaction, FilterState, UserRole)
  constants/      Category definitions + 103 mock transactions (Oct 2025–Mar 2026)
  utils/          cn(), formatters, financial calculations
  store/          Three Zustand stores (transactions, filters, ui)
  hooks/          useTransactions (filter pipeline), useChartData (5 derivations), useTheme
  components/
    layout/       AppShell, Sidebar, Header, MobileNav
    ui/           Card, Badge, Button, Input, Select, Modal, EmptyState, AnimatedNumber
    dashboard/    SummaryCard, BalanceTrendChart, SpendingDonutChart
    transactions/ TransactionTable, TransactionFilters, TransactionRow, TransactionForm, DeleteConfirmModal
    insights/     TopCategoryCard, MonthlyBarChart, SavingsTrendChart
  pages/          DashboardPage, TransactionsPage, InsightsPage
```

**State flow:** All data lives in Zustand. `useChartData` and `useFilteredTransactions` are pure hooks that derive chart-ready data from the store — no props drilling, no Context.

**Navigation** is managed by `activePage` in the UI store (no router needed — keeps the demo self-contained on any static host).

---

## Mock Data

103 transactions across 6 months (October 2025 – March 2026) covering all 13 categories. Income includes monthly salary, quarterly freelance projects, and investment dividends. Savings rate varies from ~35% to ~60% across months to make trend charts meaningful.
