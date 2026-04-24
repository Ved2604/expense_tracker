interface Props {
  categories: string[];
  filterCategory: string;
  sortByDate: boolean;
  onFilterChange: (category: string) => void;
  onSortChange: (sort: boolean) => void;
}

export default function ExpenseFilters({
  categories,
  filterCategory,
  sortByDate,
  onFilterChange,
  onSortChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <label>Filter by category: </label>
        <select
          value={filterCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={sortByDate}
          onChange={(e) => onSortChange(e.target.checked)}
        />
        Sort by date (newest first)
      </label>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "0.5rem",
  marginLeft: "0.5rem",
  borderRadius: 4,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
};
