import axios from "axios";
import type { Expense, CreateExpensePayload, ApiResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const generateIdempotencyKey = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createExpense = async (
  payload: CreateExpensePayload,
): Promise<Expense> => {
  const response = await client.post<ApiResponse<Expense>>(
    "/expenses",
    payload,
  );
  return response.data.data;
};

export const getExpenses = async (params?: {
  category?: string;
  sort?: "date_desc";
}): Promise<Expense[]> => {
  const response = await client.get<ApiResponse<Expense[]>>("/expenses", {
    params,
  });
  return response.data.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await client.delete(`/expenses/${id}`);
};

export const updateExpense = async (
  id: string,
  payload: Partial<Omit<CreateExpensePayload, "idempotency_key">>,
): Promise<Expense> => {
  const response = await client.patch<ApiResponse<Expense>>(
    `/expenses/${id}`,
    payload,
  );
  return response.data.data;
};
