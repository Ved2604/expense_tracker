import { useState, useEffect, useRef } from "react";
import type { Expense } from "../types";
import {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  generateIdempotencyKey,
} from "../api";

export type SortOption =
  | "date_desc"
  | "date_asc"
  | "amount_desc"
  | "amount_asc";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Utilities",
  "Other",
];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const idempotencyKey = useRef(generateIdempotencyKey());

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      // Only date sorting goes to backend, amount sorting is client-side
      const backendSort =
        sortOption === "date_desc" || sortOption === "date_asc"
          ? "date_desc"
          : "date_desc";

      const data = await getExpenses({
        category: filterCategory || undefined,
        sort: backendSort,
      });

      // Client-side sorting for amount + date_asc
      const sorted = [...data].sort((a, b) => {
        if (sortOption === "date_desc")
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortOption === "date_asc")
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortOption === "amount_desc") return b.amount - a.amount;
        if (sortOption === "amount_asc") return a.amount - b.amount;
        return 0;
      });

      setExpenses(sorted);
    } catch {
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, sortOption]);

  const submitExpense = async (payload: {
    amount: string;
    category: string;
    description: string;
    date: string;
  }): Promise<boolean> => {
    const parsedAmount = parseFloat(payload.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10000000) {
      setError("Amount must be between ₹0.01 and ₹1,00,00,000.");
      return false;
    }
    if (!payload.date) {
      setError("Please select a date.");
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createExpense({
        amount: parsedAmount,
        category: payload.category,
        description: payload.description,
        date: payload.date,
        idempotency_key: idempotencyKey.current,
      });

      idempotencyKey.current = generateIdempotencyKey();
      await fetchExpenses();
      setShowAddModal(false);
      return true;
    } catch {
      setError("Failed to save expense. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    setError(null);
    try {
      await deleteExpense(id);
      await fetchExpenses();
    } catch {
      setError("Failed to delete expense. Please try again.");
    }
  };

  const handleUpdate = async (
    id: string,
    payload: {
      amount: string;
      category: string;
      description: string;
      date: string;
    },
  ): Promise<boolean> => {
    const parsedAmount = parseFloat(payload.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10000000) {
      setError("Amount must be between ₹0.01 and ₹1,00,00,000.");
      return false;
    }
    if (!payload.date) {
      setError("Please select a date.");
      return false;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateExpense(id, {
        amount: parsedAmount,
        category: payload.category,
        description: payload.description,
        date: payload.date,
      });

      await fetchExpenses();
      setEditingExpense(null);
      return true;
    } catch {
      setError("Failed to update expense. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return {
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
  };
};
