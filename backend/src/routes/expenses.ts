import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db";
import { CreateExpenseBody, GetExpensesQuery, Expense } from "../types";

const router = Router();

// Helper: convert paise (DB) to rupees (API response)
const toRupees = (paise: number): number => paise / 100;

// Helper: convert rupees (request) to paise (DB)
const toPaise = (rupees: number): number => Math.round(rupees * 100);

// POST /expenses
router.post("/", (req: Request<{}, {}, CreateExpenseBody>, res: Response) => {
  const { amount, category, description, date, idempotency_key } = req.body;

  // --- Validation ---
  if (!amount || !category || !description || !date || !idempotency_key) {
    return res.status(400).json({
      error:
        "amount, category, description, date, and idempotency_key are required",
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }

  if (!date || isNaN(Date.parse(date))) {
    return res
      .status(400)
      .json({ error: "date must be a valid date string (YYYY-MM-DD)" });
  }

  const today = new Date().toISOString().split("T")[0];
  if (date > today) {
    return res.status(400).json({ error: "date cannot be in the future" });
  }

  // --- Idempotency check ---
  const existing = db
    .prepare("SELECT expense_id FROM idempotency_keys WHERE key = ?")
    .get(idempotency_key) as { expense_id: string } | undefined;

  if (existing) {
    // Return the existing expense instead of creating a duplicate
    const expense = db
      .prepare("SELECT * FROM expenses WHERE id = ?")
      .get(existing.expense_id) as Expense;

    return res.status(200).json({
      data: { ...expense, amount: toRupees(expense.amount) },
    });
  }

  // --- Insert new expense ---
  const id = uuidv4();
  const amountInPaise = toPaise(amount);
  const created_at = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO expenses (id, amount, category, description, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    amountInPaise,
    category.trim(),
    description.trim(),
    date,
    created_at,
  );

  db.prepare(
    `
    INSERT INTO idempotency_keys (key, expense_id, created_at)
    VALUES (?, ?, ?)
  `,
  ).run(idempotency_key, id, created_at);

  const expense = db
    .prepare("SELECT * FROM expenses WHERE id = ?")
    .get(id) as Expense;

  return res.status(201).json({
    data: { ...expense, amount: toRupees(expense.amount) },
  });
});

// GET /expenses
router.get("/", (req: Request<{}, {}, {}, GetExpensesQuery>, res: Response) => {
  const { category, sort } = req.query;

  let query = "SELECT * FROM expenses";
  const params: string[] = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "date_desc") {
    query += " ORDER BY date DESC, created_at DESC";
  } else {
    query += " ORDER BY created_at DESC";
  }

  const expenses = db.prepare(query).all(...params) as Expense[];

  const converted = expenses.map((e) => ({
    ...e,
    amount: toRupees(e.amount),
  }));

  return res.status(200).json({ data: converted });
});

export default router;
