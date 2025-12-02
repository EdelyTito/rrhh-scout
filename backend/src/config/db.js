// src/config/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: (process.env.DB_HOST || "localhost").trim(),
  user: (process.env.DB_USER || "postgres").trim(),
  password: (process.env.DB_PASSWORD || "").trim(),
  database: (process.env.DB_NAME || "rrhh_scout").trim(),
  port: parseInt(process.env.DB_PORT || "5432", 10),
  // opcional: puedes agregar ssl: { rejectUnauthorized: false } si usas cloud PG con TLS
});

export { pool };

if ((process.env.NODE_ENV || "development") === "development") {
  (async () => {
    try {
      const client = await pool.connect();
      await client.query("SELECT NOW()");
      client.release();
      console.log("✅ Conexión a Postgres OK");
    } catch (err) {
      console.error("❌ Error al conectar a Postgres:", err.message || err);
    }
  })();
}
