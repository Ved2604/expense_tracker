# 💸 Paisa — Personal Expense Tracker

A minimal, production-grade full-stack expense tracker built with Node.js, TypeScript, React, and SQLite.

![Tech Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20TypeScript-informational)
![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)
![Tech Stack](https://img.shields.io/badge/Database-SQLite-003b57)
![Deployed](https://img.shields.io/badge/Deployed-Render-46e3b7)

---

## Live Demo

🔗 **https://expense-tracker-backend-l0x5.onrender.com/**

> Note: Hosted on Render's free tier — first load may take ~30s if the service has been idle.

---

## Features

- Add, edit, and delete expenses with amount, category, description, and date
- Filter expenses by category
- Sort by date (newest/oldest) or amount (high/low)
- Running total for the current filtered view
- Idempotent expense creation — safe to retry or double-submit
- Input validation on both frontend and backend
- Dark / Light mode toggle with system preference detection, persisted via localStorage
- Fully responsive UI

---

## Tech Stack

### Backend

| Tech                        | Reason                                      |
| --------------------------- | ------------------------------------------- |
| Node.js + TypeScript        | Type safety and developer experience        |
| Express                     | Lightweight, well-understood HTTP framework |
| SQLite via `better-sqlite3` | See persistence decision below              |
| `express-rate-limit`        | Basic abuse prevention                      |

### Frontend

| Tech           | Reason                                      |
| -------------- | ------------------------------------------- |
| React + Vite   | Fast dev experience, modern tooling         |
| TypeScript     | End-to-end type safety                      |
| Custom hooks   | Separation of data logic from UI            |
| CSS Variables  | Clean dark/light theming without a library  |
| Sora + DM Mono | Readable UI font + tabular mono for amounts |

---

## Key Design Decisions

### Money as Integer (Paise)

Amounts are stored as integers in paise (1 INR = 100 paise) in the database to avoid floating point precision errors. For example, `₹299.99` is stored as `29999`. All conversion happens at the API boundary — the API always accepts and returns rupees as decimals.

### Persistence: SQLite

SQLite was chosen over an in-memory store or external database for the following reasons:

- **Persistence across restarts** — data survives server reboots
- **Zero infrastructure** — no external DB service to provision, connect, or pay for
- **Sufficient for scale** — SQLite handles thousands of concurrent reads easily for a personal finance tool
- **WAL mode enabled** — Write-Ahead Logging improves concurrent read performance

For a multi-user production system, this would be replaced with PostgreSQL.

### Idempotency

The `POST /expenses` endpoint accepts a client-generated `idempotency_key` (UUID v4). If the same key is submitted twice (e.g., due to a network retry or double-click), the server returns the original expense without creating a duplicate. Keys are stored in a separate `idempotency_keys` table linked to the expense.

On the frontend, the idempotency key is stored in a `useRef` and only rotated after a successful submission — meaning retries from the same form state are always safe.

### Monorepo + Single Deployment

Frontend and backend live in the same repository. In production, Express serves the compiled React app as static files from `frontend/dist/`. This means:

- Single Render deployment
- No CORS issues
- No cold-start mismatch between frontend and backend
- API calls use relative URLs in production (`/expenses` instead of `https://...`)

### Component Architecture

The frontend is split into focused, single-responsibility components:

```
App.tsx                  — thin orchestrator
hooks/useExpenses.ts     — all data fetching, state, and business logic
components/
  ExpenseTable.tsx       — display only
  ExpenseFilters.tsx     — filter + sort controls
  AddExpenseModal.tsx    — add form in modal
  EditModal.tsx          — edit form in modal
  ConfirmDeleteModal.tsx — delete confirmation
  ErrorBanner.tsx        — error display
```

---

## API Reference

### `POST /expenses`

Create a new expense.

**Request body:**

```json
{
  "amount": 299.99,
  "category": "Food",
  "description": "Lunch with team",
  "date": "2026-04-24",
  "idempotency_key": "uuid-v4-here"
}
```

**Response:** `201 Created` with the created expense object.
Submitting the same `idempotency_key` twice returns `200 OK` with the original expense.

---

### `GET /expenses`

Fetch expenses with optional filters.

**Query params:**
| Param | Values | Description |
|-------|--------|-------------|
| `category` | e.g. `Food` | Filter by category |
| `sort` | `date_desc` | Sort by date, newest first |

---

### `PATCH /expenses/:id`

Update an existing expense. All fields optional.

---

### `DELETE /expenses/:id`

Delete an expense by ID.

---

### `GET /health`

Returns `{ "status": "ok" }`. Used for uptime checks.

---

## Validation Rules

| Field             | Rules                                         |
| ----------------- | --------------------------------------------- |
| `amount`          | Required, positive number, max ₹1,00,00,000   |
| `category`        | Required, must be a known category            |
| `description`     | Required, non-empty                           |
| `date`            | Required, valid date, cannot be in the future |
| `idempotency_key` | Required for POST                             |

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Environment Variables

**Backend** (optional):

```
PORT=3000
DATA_DIR=/path/to/data   # defaults to backend/data/
```

**Frontend** (optional, create `frontend/.env`):

```
VITE_API_URL=http://localhost:3000   # leave empty in production (same-origin)
```

---

## Trade-offs Made Due to Timebox

- **No authentication** — all expenses are shared/global. In a real system, expenses would be scoped per user with auth (JWT or session-based).
- **No pagination** — the `GET /expenses` endpoint returns all expenses. For large datasets, cursor-based pagination would be added.
- **SQLite over PostgreSQL** — suitable for a single-instance deployment but would not scale horizontally. Migration to PostgreSQL would be straightforward given the simple schema.
- **No automated tests** — given the timebox, manual testing was prioritized. The architecture (isolated hooks, pure components, thin routes) is designed to be easily testable.
- **Client-side sorting for amount** — amount sorting is done on the frontend after fetching. A production system would push all sorting to the database query.

---

## Intentionally Not Built

- **User authentication / OAuth** — would require sessions, user table, and scoped queries. Out of scope for this timebox.
- **Pagination** — not needed at this data scale for a personal tool.
- **Recurring expenses** — a natural extension but outside the spec.
- **Export to CSV/PDF** — useful but not in acceptance criteria.

---

## Project Structure

```
expense_tracker/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express server entry point
│   │   ├── db.ts             # SQLite connection and schema
│   │   ├── types.ts          # Shared TypeScript types
│   │   └── routes/
│   │       └── expenses.ts   # POST, GET, PATCH, DELETE /expenses
│   ├── data/                 # SQLite DB file (gitignored)
│   ├── dist/                 # Compiled JS (gitignored)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api.ts            # API client (axios)
│   │   ├── types.ts          # Shared TypeScript types
│   │   ├── context/
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   └── useExpenses.ts
│   │   └── components/
│   │       ├── ExpenseTable.tsx
│   │       ├── ExpenseFilters.tsx
│   │       ├── AddExpenseModal.tsx
│   │       ├── EditModal.tsx
│   │       ├── ConfirmDeleteModal.tsx
│   │       └── ErrorBanner.tsx
│   ├── index.html
│   └── package.json
└── README.md
```
