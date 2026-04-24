import { useExpenses } from "./hooks/useExpenses";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseTable from "./components/ExpenseTable";
import ErrorBanner from "./components/ErrorBanner";

export default function App() {
  const {
    expenses,
    loading,
    submitting,
    error,
    filterCategory,
    setFilterCategory,
    sortByDate,
    setSortByDate,
    submitExpense,
    total,
    CATEGORIES,
  } = useExpenses();

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "1.5rem" }}>💸 Expense Tracker</h1>

      <ExpenseForm
        categories={CATEGORIES}
        submitting={submitting}
        onSubmit={submitExpense}
      />

      {error && <ErrorBanner message={error} />}

      <ExpenseFilters
        categories={CATEGORIES}
        filterCategory={filterCategory}
        sortByDate={sortByDate}
        onFilterChange={setFilterCategory}
        onSortChange={setSortByDate}
      />

      <ExpenseTable expenses={expenses} loading={loading} total={total} />
    </div>
  );
}
