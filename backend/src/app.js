// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middleware/auth.js";
import dirigentesRoutes from "./routes/dirigentes.routes.js";
import registroRoutes from "./routes/registro.routes.js";
import formacionRoutes from "./routes/formacion.routes.js";
import seguimientoRoutes from "./routes/seguimiento.routes.js";
import logsRoutes from "./routes/logs.routes.js";

// Cargar variables de entorno lo antes posible
dotenv.config();

const app = express();

// --------------------------------------------------
// CORS: permitir el frontend y la cabecera Authorization
// --------------------------------------------------
// Puedes configurar FRONTEND_ORIGINS en tu .env como:
// FRONTEND_ORIGINS=http://localhost:5173,https://mi-front-en-prod.com
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || "http://localhost:5173").split(",")

app.use(cors({
  origin: (origin, callback) => {
    // origin === undefined -> peticiones desde herramientas (curl, Postman)
    if (!origin) return callback(null, true)
    if (FRONTEND_ORIGINS.includes(origin)) return callback(null, true)
    // Rechazar orígenes no listados
    return callback(new Error("CORS - Origin no permitido"), false)
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Authorization']
}));

// Middlewares para parsear body
app.use(express.json({ type: ["application/json", "application/*+json"] }));
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Rutas públicas / healthchecks
// --------------------------------------------------
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "API funcionando", fecha: result.rows[0].now });
  } catch (err) {
    console.error("❌ Error en /api/test:", err);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

// --------------------------------------------------
// Rutas principales del API
// --------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/dirigentes", dirigentesRoutes);
app.use("/api/registro", registroRoutes);
app.use("/api/formacion", formacionRoutes);
app.use("/api/seguimiento", seguimientoRoutes);
app.use("/api/logs", logsRoutes);

// --------------------------------------------------
// Ruta protegida de ejemplo (verifica token)
// --------------------------------------------------
app.get("/api/privado", verifyToken, (req, res) => {
  res.json({
    message: "Acceso autorizado",
    usuario: req.user,
  });
});

// --------------------------------------------------
// Manejo centralizado de errores (fallback)
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error("❗ Error no manejado:", err && err.stack ? err.stack : err);
  // Si el error proviene de CORS (origin no permitido), enviar 403
  if (err?.message && err.message.includes("CORS - Origin no permitido")) {
    return res.status(403).json({ error: "Origin no permitido por CORS" });
  }
  res.status(500).json({ error: "Internal server error" });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

export default app;
