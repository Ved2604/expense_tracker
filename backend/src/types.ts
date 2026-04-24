export interface Expense {
  id: string;
  amount: number; // stored in paise in DB, converted to rupees in API responses
  category: string;
  description: string;
  date: string; // ISO 8601 format: YYYY-MM-DD
  created_at: string;
}

export interface CreateExpenseBody {
  amount: number; // in rupees (e.g., 299.99)
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  idempotency_key: string; // client-generated UUID to prevent duplicate submissions
}

export interface GetExpensesQuery {
  category?: string;
  sort?: "date_desc";
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
