import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: "induction",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});
