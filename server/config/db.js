import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log("- PostgreSQL Connected Successfully"))
  .catch((err) => console.error("- PostgreSQL Connection Failed:", err));
