import type { Expense } from "../types";

interface Props {
  expenses: Expense[];
  loading: boolean;
  total: number;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const categoryClass: Record<string, string> = {
  Food: "cat-food",
  Transport: "cat-transport",
  Shopping: "cat-shopping",
  Health: "cat-health",
  Entertainment: "cat-entertainment",
  Utilities: "cat-utilities",
  Other: "cat-other",
};

export default function ExpenseTable({
  expenses,
  loading,
  total,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem",
          color: "var(--text-muted)",
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          letterSpacing: "0.05em",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Total bar */}
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--bg-secondary)",
        }}
      >
        <span
          style={{
            color: "var(--text-muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}
        </span>
        <span
          className="amount"
          style={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--text-heading)",
          }}
        >
          Total: ₹{total.toFixed(2)}
        </span>
      </div>

      {expenses.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🧾</div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "var(--text-heading)",
              marginBottom: "0.35rem",
            }}
          >
            No expenses found
          </div>
          <div style={{ fontSize: "0.82rem" }}>
            Try changing your filters or add a new expense
          </div>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Date", "Category", "Description", "Amount", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.75rem 1.25rem",
                        textAlign:
                          h === "Amount" || h === "Actions" ? "right" : "left",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        borderBottom: "1px solid var(--border)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr
                  key={e.id}
                  className="expense-row"
                  style={{
                    animationDelay: `${i * 0.04}s`,
                    borderBottom:
                      i < expenses.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                    transition: "background var(--transition)",
                  }}
                  onMouseEnter={(el) =>
                    (el.currentTarget.style.background = "var(--bg-secondary)")
                  }
                  onMouseLeave={(el) =>
                    (el.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      ...tdStyle,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.82rem",
                    }}
                  >
                    {e.date}
                  </td>
                  <td style={tdStyle}>
                    <span
                      className={`category-pill ${categoryClass[e.category] ?? "cat-other"}`}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: "var(--text-heading)",
                      fontWeight: 500,
                    }}
                  >
                    {e.description}
                  </td>
                  <td
                    className="amount"
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontWeight: 500,
                      color: "var(--text-heading)",
                    }}
                  >
                    ₹{e.amount.toFixed(2)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn btn-ghost"
                        style={{
                          padding: "0.28rem 0.7rem",
                          fontSize: "0.78rem",
                        }}
                        onClick={() => onEdit(e)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{
                          padding: "0.28rem 0.7rem",
                          fontSize: "0.78rem",
                        }}
                        onClick={() => onDelete(e.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "0.95rem 1.25rem",
  fontSize: "0.88rem",
  whiteSpace: "nowrap",
};
