export interface Expense {
  id: string;
  amount: number; // in rupees
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  created_at: string;
}

export interface CreateExpensePayload {
  amount: number;
  category: string;
  description: string;
  date: string;
  idempotency_key: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
