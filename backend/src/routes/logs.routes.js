// src/routes/logs.routes.js
import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";

const router = express.Router();

//
// 🔒 OBTENER TODOS LOS LOGS (solo roles con permisos de gestión)
//
router.get("/", verifyToken, authorizeRoles(1, 2, 3, 4, 5, 6, 7), async (req, res) => {
  try {
    const { tabla, usuario_id } = req.query;

    let query = `
      SELECT 
        l.id,
        l.usuario_id,
        u.nombre AS usuario_nombre,
        u.correo,
        u.cargo,
        r.nombre AS rol_nombre,
        l.accion,
        l.tabla_afectada,
        l.registro_id,
        l.detalle,
        TO_CHAR(l.fecha_accion, 'DD/MM/YYYY HH24:MI') AS fecha_accion
      FROM logs l
      LEFT JOIN usuarios u ON l.usuario_id = u.id
      LEFT JOIN roles r ON u.rol_id = r.id
    `;

    const params = [];
    const conditions = [];

    if (tabla) {
      conditions.push(`l.tabla_afectada ILIKE $${conditions.length + 1}`);
      params.push(`%${tabla}%`);
    }

    if (usuario_id) {
      conditions.push(`l.usuario_id = $${conditions.length + 1}`);
      params.push(usuario_id);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY l.fecha_accion DESC";

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener logs:", err);
    res.status(500).json({ error: "Error al obtener logs" });
  }
});

export default router;
