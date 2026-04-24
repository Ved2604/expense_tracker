import { useState, useEffect, useRef } from "react";
import type { Expense } from "../types";
import { createExpense, getExpenses, generateIdempotencyKey } from "../api";

const CATEGORIES = [
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
  const [sortByDate, setSortByDate] = useState(false);

  const idempotencyKey = useRef(generateIdempotencyKey());

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpenses({
        category: filterCategory || undefined,
        sort: sortByDate ? "date_desc" : undefined,
      });
      setExpenses(data);
    } catch {
      setError("Failed to load expenses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, sortByDate]);

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

      // Only rotate key on success
      idempotencyKey.current = generateIdempotencyKey();
      await fetchExpenses();
      return true;
    } catch {
      setError("Failed to save expense. Please try again.");
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
    sortByDate,
    setSortByDate,
    submitExpense,
    total,
    CATEGORIES,
  };
};
