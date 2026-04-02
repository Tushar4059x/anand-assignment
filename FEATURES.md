# FinanceIQ — Feature & Codebase Reference

This document explains every feature in the application, where the logic lives, and how the pieces connect.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Data Layer — Types, Constants & Utilities](#2-data-layer)
3. [State Management](#3-state-management)
4. [Derived Data Hooks](#4-derived-data-hooks)
5. [Layout & Shell](#5-layout--shell)
6. [Dashboard Overview](#6-dashboard-overview)
7. [Transactions Section](#7-transactions-section)
8. [Role-Based UI](#8-role-based-ui)
9. [Insights Section](#9-insights-section)
10. [Dark Mode](#10-dark-mode)
11. [UI Primitives](#11-ui-primitives)
12. [Data Flow Diagram](#12-data-flow-diagram)

---

## 1. Project Structure

```
src/
├── types/            TypeScript interfaces shared across the app
├── constants/        Static data — category definitions & mock transactions
├── utils/            Pure functions — formatting, calculations, class merging
├── store/            Zustand state stores
├── hooks/            Derived-data and side-effect hooks
├── components/
│   ├── layout/       App shell, sidebar, header, mobile nav
│   ├── ui/           Reusable primitives (Card, Button, Modal, etc.)
│   ├── dashboard/    Dashboard-specific chart and card components
│   ├── transactions/ Transaction table, filters, form, row
│   └── insights/     Insights charts and stat cards
└── pages/            Top-level page assemblers
```

**Entry point:** [`src/main.tsx`](src/main.tsx) mounts `<App />` into `#root`.  
**App shell:** [`src/App.tsx`](src/App.tsx) reads `activePage` from the UI store and renders the correct page component.

---

## 2. Data Layer

### TypeScript Types

| File | Purpose |
|---|---|
| [`src/types/transaction.ts`](src/types/transaction.ts) | `Transaction`, `Category`, `CategoryId`, `TransactionType`, `TransactionFormValues` |
| [`src/types/filters.ts`](src/types/filters.ts) | `FilterState`, `SortConfig`, `SortField`, `SortDirection` |
| [`src/types/role.ts`](src/types/role.ts) | `UserRole` (`'admin' \| 'viewer'`) |
| [`src/types/index.ts`](src/types/index.ts) | Re-exports all types from a single import path |

**Key shape — `Transaction`** (defined in [`src/types/transaction.ts:14`](src/types/transaction.ts#L14)):
```ts
interface Transaction {
  id: string;          // unique identifier
  date: string;        // ISO 'YYYY-MM-DD'
  description: string;
  amount: number;      // always positive; type field carries sign semantics
  type: 'income' | 'expense';
  categoryId: CategoryId;
  note?: string;
}
```

### Category Definitions

**File:** [`src/constants/categories.ts`](src/constants/categories.ts)

Defines all 13 categories. Each entry has a `hex` color (used by Recharts) and a Tailwind `color` class (used by badges).

```
Income categories:  salary, freelance, investment
Expense categories: food, housing, transport, healthcare,
                    entertainment, shopping, utilities,
                    education, travel, other
```

Exported helpers:
- `CATEGORY_MAP` — object keyed by `CategoryId` for O(1) lookup
- `INCOME_CATEGORIES` / `EXPENSE_CATEGORIES` — filtered arrays used by `TransactionForm`

### Mock Data

**File:** [`src/constants/mockData.ts`](src/constants/mockData.ts)

103 hand-crafted transactions spanning **October 2025 – March 2026** across all 13 categories. Data is designed so:
- Savings rate varies meaningfully month-to-month (35%–60%) making trend charts interesting
- Each expense category has multiple entries so the donut chart has depth
- Income mixes salary, quarterly freelance projects, and investment dividends

The array is imported by `transactionStore` as its initial state.

### Utility Functions

| File | Exports | Purpose |
|---|---|---|
| [`src/utils/cn.ts`](src/utils/cn.ts) | `cn(...classes)` | Merges Tailwind classes safely via `clsx` + `tailwind-merge` |
| [`src/utils/formatters.ts`](src/utils/formatters.ts) | `formatCurrency`, `formatDate`, `formatPercentage`, etc. | Display-layer formatting; never stored |
| [`src/utils/calculations.ts`](src/utils/calculations.ts) | `buildMonthlySummaries`, `getTxInMonth`, `sumByType`, `calcSavingsRate`, `buildBalanceTrend` | Pure financial math used by `useChartData` |

`buildMonthlySummaries` ([`src/utils/calculations.ts:36`](src/utils/calculations.ts#L36)) is the core: it groups transactions by month and returns income, expenses, net, and savings rate for each.

---

## 3. State Management

Three Zustand stores, all created with `create<T>()`. Imports are re-exported from [`src/store/index.ts`](src/store/index.ts).

### `transactionStore`
**File:** [`src/store/transactionStore.ts`](src/store/transactionStore.ts)

Holds the master list of transactions. Only store that owns mutable financial data.

| Action | What it does |
|---|---|
| `addTransaction(tx)` | Prepends a new transaction with a generated ID |
| `updateTransaction(id, patch)` | Patches a single transaction by ID |
| `deleteTransaction(id)` | Removes a transaction by ID |
| `resetToMockData()` | Restores the original 103 mock transactions |

ID generation ([`src/store/transactionStore.ts:13`](src/store/transactionStore.ts#L13)) uses `Date.now()` + a random suffix — no external UUID library needed.

### `filterStore`
**File:** [`src/store/filterStore.ts`](src/store/filterStore.ts)

Holds all active filter and sort state for the Transactions page. Intentionally separate from `transactionStore` so filter changes don't re-render chart components.

| State | Type | Default |
|---|---|---|
| `search` | `string` | `''` |
| `type` | `'all' \| 'income' \| 'expense'` | `'all'` |
| `categoryId` | `CategoryId \| 'all'` | `'all'` |
| `dateFrom` | `string` (ISO date) | `''` |
| `dateTo` | `string` (ISO date) | `''` |
| `sort` | `{ field, direction }` | `{ field: 'date', direction: 'desc' }` |

`resetFilters()` ([`src/store/filterStore.ts:48`](src/store/filterStore.ts#L48)) restores all defaults in one call — wired to the "Clear" button in `TransactionFilters`.

### `uiStore`
**File:** [`src/store/uiStore.ts`](src/store/uiStore.ts)

Manages all UI-level state: current page, active role, dark mode, sidebar open/close, and which modal is open.

Uses Zustand's `persist` middleware ([`src/store/uiStore.ts:54`](src/store/uiStore.ts#L54)) to save `role` and `isDarkMode` to `localStorage`. Other UI state (sidebar, modal) is ephemeral and not persisted.

| State | Persisted | Purpose |
|---|---|---|
| `role` | ✅ | `'admin'` or `'viewer'` |
| `isDarkMode` | ✅ | Theme preference |
| `activePage` | ❌ | Which page is shown |
| `isSidebarOpen` | ❌ | Mobile sidebar overlay |
| `activeModal` | ❌ | `'add' \| 'edit' \| 'delete' \| null` |
| `editingTransactionId` | ❌ | ID of the transaction being edited/deleted |

---

## 4. Derived Data Hooks

### `useFilteredTransactions`
**File:** [`src/hooks/useTransactions.ts`](src/hooks/useTransactions.ts)

Subscribes to both `transactionStore` and `filterStore`. Returns the transaction list after applying all active filters, then sorting. Memoized with `useMemo` so it only recomputes when transactions or filters change.

**Filter pipeline** ([`src/hooks/useTransactions.ts:14`](src/hooks/useTransactions.ts#L14)):
1. Search — `description`, `categoryId`, and `note` fields, case-insensitive
2. Type filter — skipped if `'all'`
3. Category filter — skipped if `'all'`
4. Date from — `tx.date >= dateFrom` (skipped if empty)
5. Date to — `tx.date <= dateTo` (skipped if empty)
6. Sort — by `date`, `amount`, or `description`, ascending or descending

### `useChartData`
**File:** [`src/hooks/useChartData.ts`](src/hooks/useChartData.ts)

Single hook that derives **all five** chart datasets from the raw transaction list. Returns nothing from `filterStore` — charts always show the full (unfiltered) dataset.

| Return value | Used by | Description |
|---|---|---|
| `summaryMetrics` | `DashboardPage` → `SummaryCard` | Balance, income, expenses, savings rate + MoM deltas |
| `balanceTrend` | `BalanceTrendChart` | `[{ month, balance }]` × 6 |
| `spendingByCategory` | `SpendingDonutChart`, `InsightsPage` | `[{ categoryId, name, value, hex }]` sorted by value |
| `monthlyComparison` | `MonthlyBarChart` | `[{ month, income, expenses }]` × 6 |
| `savingsTrend` | `SavingsTrendChart` | `[{ month, savingsRate, savedAmount }]` × 6 |
| `topCategory` | `TopCategoryCard` | Highest-spend category object for current month |
| `topCategoryPrevAmount` | `TopCategoryCard` | Same category's spend in previous month for delta |

Month-over-month deltas ([`src/hooks/useChartData.ts:28`](src/hooks/useChartData.ts#L28)) are computed by comparing current month totals against previous month totals from the same unfiltered dataset.

### `useTheme`
**File:** [`src/hooks/useTheme.ts`](src/hooks/useTheme.ts)

Reads `isDarkMode` from `uiStore` and syncs it to `document.documentElement.classList` on every change. This is what causes Tailwind's `dark:` classes to activate globally.

---

## 5. Layout & Shell

### `AppShell`
**File:** [`src/components/layout/AppShell.tsx`](src/components/layout/AppShell.tsx)

Root layout component. Renders a CSS flex row:
- **Desktop (≥ lg):** Fixed 240px sidebar + scrollable main area
- **Mobile (< lg):** Full-width main area + sidebar as an overlay behind a backdrop

Manages sidebar close-on-Escape ([`src/components/layout/AppShell.tsx:17`](src/components/layout/AppShell.tsx#L17)) and locks `document.body.overflow` when sidebar is open.

### `Sidebar`
**File:** [`src/components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx)

Contains the FinanceIQ logo, three navigation buttons (Dashboard, Transactions, Insights), and a role badge at the bottom. Each nav button calls `setActivePage()` from `uiStore`. The active page is highlighted with an indigo background + dot indicator.

### `Header`
**File:** [`src/components/layout/Header.tsx`](src/components/layout/Header.tsx)

Sticky top bar with:
- Hamburger button (mobile only) — calls `toggleSidebar()`
- Page title + subtitle derived from `activePage`
- **Role toggle pill** — switches between Admin/Viewer with a shield or eye icon
- **Dark mode toggle** — sun/moon icon, calls `toggleDarkMode()`

### `MobileNav`
**File:** [`src/components/layout/MobileNav.tsx`](src/components/layout/MobileNav.tsx)

Fixed bottom tab bar visible only on `< lg` screens. Mirrors the sidebar navigation with icon + label for each page.

---

## 6. Dashboard Overview

**Page assembler:** [`src/pages/DashboardPage.tsx`](src/pages/DashboardPage.tsx)

Calls `useChartData()` once and passes derived data down to components.

### Summary Cards
**Component:** [`src/components/dashboard/SummaryCard.tsx`](src/components/dashboard/SummaryCard.tsx)

Four cards in a `2×2 → 4×1` responsive grid:

| Card | Variant | Delta logic |
|---|---|---|
| Total Balance | `balance` | vs. balance at end of previous month |
| Monthly Income | `income` | vs. same metric previous month |
| Monthly Expenses | `expense` | delta is "good" when negative (spent less) |
| Savings Rate | `savings` | percentage point difference vs. previous month |

**`AnimatedNumber`** ([`src/components/ui/AnimatedNumber.tsx`](src/components/ui/AnimatedNumber.tsx)) runs a `requestAnimationFrame` count-up with cubic ease-out when the value changes — making cards feel alive on first render.

### Balance Trend Chart
**Component:** [`src/components/dashboard/BalanceTrendChart.tsx`](src/components/dashboard/BalanceTrendChart.tsx)

Recharts `LineChart` showing the **running balance** at the end of each month for the past 6 months. Uses `ResponsiveContainer` with a fixed pixel height (220px) to avoid Recharts' zero-height bug. Custom tooltip matches the card design system.

### Spending Donut Chart
**Component:** [`src/components/dashboard/SpendingDonutChart.tsx`](src/components/dashboard/SpendingDonutChart.tsx)

Recharts `PieChart` with `innerRadius=60 / outerRadius=85` showing current month expense distribution by category. Center label shows total spend. The legend lists the top 5 categories with percentage and amount. If there are no expenses this month, `EmptyState` is shown instead.

---

## 7. Transactions Section

**Page assembler:** [`src/pages/TransactionsPage.tsx`](src/pages/TransactionsPage.tsx)

Contains the Add Transaction button (Admin only), the table, and the modal renders.

### Filter Bar
**Component:** [`src/components/transactions/TransactionFilters.tsx`](src/components/transactions/TransactionFilters.tsx)

- **Search input** with a 300ms debounce ([`src/components/transactions/TransactionFilters.tsx:24`](src/components/transactions/TransactionFilters.tsx#L24)) — local state drives a `useEffect` that writes to `filterStore` after the delay
- **Filters toggle** reveals a second row with: Type select, Category select, Date From, Date To
- **Clear button** appears only when any filter is active; calls `resetFilters()` and resets local search state

### Transaction Table
**Component:** [`src/components/transactions/TransactionTable.tsx`](src/components/transactions/TransactionTable.tsx)

- Reads `useFilteredTransactions()` for the filtered+sorted list
- **Sortable headers** — clicking cycles between `desc` and `asc`; active column shows an arrow icon ([`src/components/transactions/TransactionTable.tsx:38`](src/components/transactions/TransactionTable.tsx#L38))
- **Pagination** — shows first 20 rows; "Load more" increments `visibleCount` by 20 ([`src/components/transactions/TransactionTable.tsx:65`](src/components/transactions/TransactionTable.tsx#L65))
- Footer shows "Showing X of Y transactions"
- When filtered list is empty, renders `EmptyState` with a "Clear filters" action

### Transaction Row
**Component:** [`src/components/transactions/TransactionRow.tsx`](src/components/transactions/TransactionRow.tsx)

Each row shows Date, Description (+ optional note), Category badge, Type badge, and Amount (green for income, red for expense with +/- prefix). **Edit and Delete buttons appear on hover only** (`opacity-0 group-hover:opacity-100`) and are rendered only when `isAdmin` is true.

### Transaction Form
**Component:** [`src/components/transactions/TransactionForm.tsx`](src/components/transactions/TransactionForm.tsx)

Used for both **Add** and **Edit** modes. When `editingTransactionId` is set in `uiStore`, the form pre-fills from that transaction.

- Type selector (Expense / Income) is a segmented pill — category options filter based on selected type ([`src/components/transactions/TransactionForm.tsx:49`](src/components/transactions/TransactionForm.tsx#L49))
- Validates: required fields, amount > 0, date must be present
- Calls `addTransaction` or `updateTransaction` on submit

### Delete Confirm Modal
**Component:** [`src/components/transactions/DeleteConfirmModal.tsx`](src/components/transactions/DeleteConfirmModal.tsx)

Shows the transaction description and a confirmation prompt. Calls `deleteTransaction(editingTransactionId)` on confirm.

### Modal System
**Component:** [`src/components/ui/Modal.tsx`](src/components/ui/Modal.tsx)

Portal-based (`createPortal` to `document.body`). Closes on Escape keypress or backdrop click. Locks body scroll while open. Animated with `animate-scale-in` (Tailwind keyframe).

---

## 8. Role-Based UI

**Store:** [`src/store/uiStore.ts:10`](src/store/uiStore.ts#L10) — `role: UserRole`  
**Toggle:** [`src/components/layout/Header.tsx:38`](src/components/layout/Header.tsx#L38) — header pill button  
**Persistence:** `localStorage` via Zustand `persist`

| Location | Admin behavior | Viewer behavior |
|---|---|---|
| Header | Shows "Admin" pill with shield icon | Shows "Viewer" pill with eye icon |
| Sidebar | Role badge shows "Administrator / Full access" | Shows "Viewer / Read only" |
| Transactions page | "Add Transaction" button visible | Button hidden |
| Transaction row | Edit + Delete icons appear on hover | Icons not rendered |
| Modals | Add/Edit/Delete modals can be opened | Modals not accessible |

The role check is done inline wherever it matters:
- `TransactionsPage` ([`src/pages/TransactionsPage.tsx:13`](src/pages/TransactionsPage.tsx#L13)) — `isAdmin && <Button ...>`
- `TransactionTable` ([`src/components/transactions/TransactionTable.tsx:75`](src/components/transactions/TransactionTable.tsx#L75)) — `isAdmin && <th>Actions</th>`
- `TransactionRow` ([`src/components/transactions/TransactionRow.tsx:39`](src/components/transactions/TransactionRow.tsx#L39)) — `isAdmin && <td>...buttons</td>`

---

## 9. Insights Section

**Page assembler:** [`src/pages/InsightsPage.tsx`](src/pages/InsightsPage.tsx)

Calls `useChartData()` and distributes data to insight components.

### Quick Stat Cards
Three summary cards at the top of the page ([`src/pages/InsightsPage.tsx:21`](src/pages/InsightsPage.tsx#L21)):
- **Best Savings Month** — month name + savings rate from `savingsTrend` sorted by rate
- **Average Savings Rate** — mean of all 6 monthly savings rates
- **Current Month Net** — income minus expenses, colored green if positive

### Top Spending Category
**Component:** [`src/components/insights/TopCategoryCard.tsx`](src/components/insights/TopCategoryCard.tsx)

Displays the highest-spend category for the current month. Includes:
- Category name and colored icon dot
- Total amount spent
- Progress bar showing what % of total expenses this category represents
- Delta vs. previous month ("$X more/less than last month")

Data comes from `topCategory` and `topCategoryPrevAmount` in `useChartData`.

### Monthly Bar Chart
**Component:** [`src/components/insights/MonthlyBarChart.tsx`](src/components/insights/MonthlyBarChart.tsx)

Recharts `BarChart` with two grouped `Bar` components — emerald for income, rose for expenses — for each of the 6 months. Custom tooltip shows formatted currency for both bars. `cursor` prop is themed for dark/light mode.

### Savings Rate Trend
**Component:** [`src/components/insights/SavingsTrendChart.tsx`](src/components/insights/SavingsTrendChart.tsx)

Recharts `AreaChart` with an amber gradient fill. Y-axis is a 0–100% scale. Custom tooltip shows both savings rate and absolute amount saved that month.

### Category Breakdown Table
Inline in [`src/pages/InsightsPage.tsx:93`](src/pages/InsightsPage.tsx#L93).

Renders the top 8 expense categories as a ranked list with colored dots, percentage, amount, and a proportional progress bar. Same data as the donut chart on the dashboard, presented in a scannable tabular format.

---

## 10. Dark Mode

**Hook:** [`src/hooks/useTheme.ts`](src/hooks/useTheme.ts) — syncs `isDarkMode` from `uiStore` to `document.documentElement.classList`

**Config:** [`tailwind.config.ts`](tailwind.config.ts) — `darkMode: 'class'` means all `dark:` variants activate when the `dark` class is on the root `<html>` element.

**Storage:** `isDarkMode` is persisted to `localStorage` (key: `finance-ui`) via Zustand `persist` middleware in [`src/store/uiStore.ts:54`](src/store/uiStore.ts#L54).

**Coverage:** Every surface has explicit dark variants — backgrounds (`dark:bg-slate-800/900`), text (`dark:text-slate-100/400`), borders (`dark:border-slate-700`), chart axes and grid lines.

Chart components read `isDarkMode` from `uiStore` directly to change axis tick color and grid color, since Recharts SVG elements cannot be styled with CSS classes ([`src/components/dashboard/BalanceTrendChart.tsx:30`](src/components/dashboard/BalanceTrendChart.tsx#L30)).

---

## 11. UI Primitives

All in [`src/components/ui/`](src/components/ui/)

| Component | File | Key props |
|---|---|---|
| `Card` | [`Card.tsx`](src/components/ui/Card.tsx) | `padding`, `hover`, `onClick` |
| `CategoryBadge` | [`Badge.tsx`](src/components/ui/Badge.tsx) | `categoryId`, `size` — renders colored dot + label |
| `TypeBadge` | [`Badge.tsx`](src/components/ui/Badge.tsx) | `type` — green for income, red for expense |
| `Button` | [`Button.tsx`](src/components/ui/Button.tsx) | `variant` (primary/secondary/danger/ghost), `size`, `loading`, `leftIcon`, `rightIcon` |
| `Input` | [`Input.tsx`](src/components/ui/Input.tsx) | `leftIcon`, `label`, `error` |
| `Select` | [`Select.tsx`](src/components/ui/Select.tsx) | `options: { value, label }[]`, `label`, `error` |
| `Modal` | [`Modal.tsx`](src/components/ui/Modal.tsx) | `isOpen`, `onClose`, `title`, `size` — portal-based |
| `EmptyState` | [`EmptyState.tsx`](src/components/ui/EmptyState.tsx) | `title`, `description`, `action` |
| `AnimatedNumber` | [`AnimatedNumber.tsx`](src/components/ui/AnimatedNumber.tsx) | `value`, `prefix`, `suffix`, `decimals`, `duration`, `formatter` |

`cn()` in [`src/utils/cn.ts`](src/utils/cn.ts) is used throughout all primitives to merge Tailwind classes without conflicts (via `tailwind-merge`).

---

## 12. Data Flow Diagram

```
src/constants/mockData.ts (103 transactions)
        │
        ▼
transactionStore ◄─────────── TransactionForm (add / update)
        │                      DeleteConfirmModal (delete)
        │
        ├──► useChartData ──► summaryMetrics ──► SummaryCard × 4
        │         │
        │         ├──► balanceTrend ────────────► BalanceTrendChart
        │         ├──► spendingByCategory ───────► SpendingDonutChart
        │         │                               InsightsPage (breakdown table)
        │         ├──► monthlyComparison ─────────► MonthlyBarChart
        │         ├──► savingsTrend ──────────────► SavingsTrendChart
        │         ├──► topCategory ───────────────► TopCategoryCard
        │         └──► topCategoryPrevAmount ──────► TopCategoryCard
        │
        └──► useFilteredTransactions ◄── filterStore ◄── TransactionFilters
                        │
                        ▼
                TransactionTable
                        │
                        └──► TransactionRow
                                  │
                                  ├── (admin) Edit → openModal('edit', id) → uiStore
                                  └── (admin) Delete → openModal('delete', id) → uiStore


uiStore ──► AppShell    (dark class on root)
        ──► Header      (role toggle, dark mode toggle)
        ──► Sidebar     (active nav link, role badge)
        ──► App.tsx     (activePage → which page renders)
        ──► TransactionsPage (isAdmin gate)
        ──► Modal       (activeModal, editingTransactionId)
```
