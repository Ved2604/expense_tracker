import type { Expense } from "../types";

interface Props {
  expenses: Expense[];
  loading: boolean;
  total: number;
}

export default function ExpenseTable({ expenses, loading, total }: Props) {
  if (loading) return <p>Loading expenses...</p>;

  return (
    <>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.1rem",
          marginBottom: "1rem",
        }}
      >
        Total: ₹{total.toFixed(2)}
      </div>

      {expenses.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No expenses found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={tdStyle}>{e.date}</td>
                <td style={tdStyle}>{e.category}</td>
                <td style={tdStyle}>{e.description}</td>
                <td style={tdStyle}>₹{e.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

const thStyle: React.CSSProperties = {
  padding: "0.6rem 0.8rem",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "0.6rem 0.8rem",
};
