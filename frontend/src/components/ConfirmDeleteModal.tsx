interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({ onConfirm, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 400 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 style={{ fontSize: "1.1rem" }}>Delete Expense</h2>
          <button
            className="btn btn-secondary"
            style={{ padding: "0.3rem 0.75rem", fontSize: "0.85rem" }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
            fontSize: "0.95rem",
          }}
        >
          Are you sure you want to delete this expense? This action cannot be
          undone.
        </p>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
