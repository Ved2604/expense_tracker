import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "../data");
const DB_PATH = path.join(DATA_DIR, "expenses.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id          TEXT PRIMARY KEY,
    amount      INTEGER NOT NULL,  -- stored in paise (1 INR = 100 paise) to avoid float issues
    category    TEXT NOT NULL,
    description TEXT NOT NULL,
    date        TEXT NOT NULL,     -- stored as ISO 8601 date string (YYYY-MM-DD)
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS idempotency_keys (
    key        TEXT PRIMARY KEY,
    expense_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
