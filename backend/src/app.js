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

// 🔹 Cargar variables de entorno primero
dotenv.config();

// 🔹 Inicializar app antes de usarla
const app = express();

// 🔹 Middlewares globales
app.use(cors());
app.use(express.json({ type: ["application/json", "application/*+json"] }));
app.use(express.urlencoded({ extended: true }));

// 🔹 Ruta de prueba rápida
app.get("/api/test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ message: "API funcionando", fecha: result.rows[0].now });
});

// 🔹 Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/dirigentes", dirigentesRoutes);
app.use("/api/registro", registroRoutes);
app.use("/api/formacion", formacionRoutes);
app.use("/api/seguimiento", seguimientoRoutes);
app.use("/api/logs", logsRoutes);

// 🔒 Ruta protegida (prueba de token)
app.get("/api/privado", verifyToken, (req, res) => {
  res.json({
    message: "Acceso autorizado",
    usuario: req.user,
  });
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

export default app;
