import type { SortOption } from "../hooks/useExpenses";

interface Props {
  categories: string[];
  filterCategory: string;
  sortOption: SortOption;
  onFilterChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
}

export default function ExpenseFilters({
  categories,
  filterCategory,
  sortOption,
  onFilterChange,
  onSortChange,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-end",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <label className="label">Filter by Category</label>
        <select
          value={filterCategory}
          onChange={(e) => onFilterChange(e.target.value)}
          className="input"
          style={{ width: "auto", minWidth: 160 }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Sort By</label>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="input"
          style={{ width: "auto", minWidth: 200 }}
        >
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
          <option value="amount_desc">Amount (High to Low)</option>
          <option value="amount_asc">Amount (Low to High)</option>
        </select>
      </div>
    </div>
  );
}
