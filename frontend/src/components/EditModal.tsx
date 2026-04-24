import { useState } from "react";
import type { Expense } from "../types";

interface Props {
  expense: Expense;
  categories: string[];
  submitting: boolean;
  onSubmit: (
    id: string,
    payload: {
      amount: string;
      category: string;
      description: string;
      date: string;
    },
  ) => Promise<boolean>;
  onClose: () => void;
}

export default function EditModal({
  expense,
  categories,
  submitting,
  onSubmit,
  onClose,
}: Props) {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [date, setDate] = useState(expense.date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(expense.id, { amount, category, description, date });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: "1.15rem" }}>Edit Expense</h2>
          <button
            className="btn btn-secondary"
            style={{ padding: "0.3rem 0.75rem", fontSize: "0.85rem" }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label className="label">Amount (₹)</label>
              <input
                type="number"
                min="0.01"
                max="10000000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input"
                placeholder="e.g. 299.99"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input"
                placeholder="e.g. Lunch with team"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className="label">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                className="input"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
