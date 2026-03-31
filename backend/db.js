import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  password: "jack",
  host: "localhost",
  port: 5432,
  database: "task-manager-db",
});

export default pool;
