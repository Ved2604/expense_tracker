import { useState } from "react";

interface Props {
  categories: string[];
  submitting: boolean;
  onSubmit: (payload: {
    amount: string;
    category: string;
    description: string;
    date: string;
  }) => Promise<boolean>;
}

export default function ExpenseForm({
  categories,
  submitting,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({ amount, category, description, date });
    if (success) {
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory(categories[0]);
    }
  };

  return (
    <section
      style={{
        background: "#f9f9f9",
        padding: "1.5rem",
        borderRadius: 8,
        marginBottom: "2rem",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <label>Amount (₹)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={inputStyle}
              placeholder="e.g. 299.99"
            />
          </div>
          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={inputStyle}
              placeholder="e.g. Lunch with team"
            />
          </div>
          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>
        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? "Saving..." : "Add Expense"}
        </button>
      </form>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.5rem",
  marginTop: "0.25rem",
  borderRadius: 4,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "1rem",
  padding: "0.6rem 1.5rem",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
  fontSize: "1rem",
  cursor: "pointer",
};
