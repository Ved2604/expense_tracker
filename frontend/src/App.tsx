import { useExpenses } from "./hooks/useExpenses";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseTable from "./components/ExpenseTable";
import ErrorBanner from "./components/ErrorBanner";
import AddExpenseModal from "./components/AddExpenseModal";
import EditModal from "./components/EditModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { useState } from "react";

export default function App() {
  const {
    expenses,
    loading,
    submitting,
    error,
    filterCategory,
    setFilterCategory,
    sortOption,
    setSortOption,
    submitExpense,
    handleDelete,
    handleUpdate,
    total,
    CATEGORIES,
    showAddModal,
    setShowAddModal,
    editingExpense,
    setEditingExpense,
  } = useExpenses();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (!deletingId) return;
    await handleDelete(deletingId);
    setDeletingId(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 0 4rem",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)",
          boxShadow: "var(--shadow-sm)",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.5rem" }}>💸</span>
            <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
              Expense Tracker
            </h1>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Expense
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.5rem" }}>
        {error && <ErrorBanner message={error} />}

        <ExpenseFilters
          categories={CATEGORIES}
          filterCategory={filterCategory}
          sortOption={sortOption}
          onFilterChange={setFilterCategory}
          onSortChange={setSortOption}
        />

        <ExpenseTable
          expenses={expenses}
          loading={loading}
          total={total}
          onEdit={setEditingExpense}
          onDelete={(id) => setDeletingId(id)}
        />

        {deletingId && (
          <ConfirmDeleteModal
            onConfirm={confirmDelete}
            onClose={() => setDeletingId(null)}
          />
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <AddExpenseModal
          categories={CATEGORIES}
          submitting={submitting}
          onSubmit={submitExpense}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Modal */}
      {editingExpense && (
        <EditModal
          expense={editingExpense}
          categories={CATEGORIES}
          submitting={submitting}
          onSubmit={handleUpdate}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}
