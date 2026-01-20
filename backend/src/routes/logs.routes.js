import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { validarConsultaLogs } from "../middleware/validators/logs.validators.js";
import { validar } from "../middleware/validators/index.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles(1, 2, 3, 4, 5, 6, 7),
  validarConsultaLogs,
  validar,
  async (req, res) => {
    try {
      const {
        tabla,
        usuario_id,
        nivel,
        desde,
        hasta,
        limit = 100,
        offset = 0,
        exportar = false
      } = req.query;

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
          l.nivel,
          l.fecha_accion
        FROM logs l
        LEFT JOIN usuarios u ON l.usuario_id = u.id
        LEFT JOIN roles r ON u.rol_id = r.id
      `;

      const params = [];
      const conditions = [];

      if (tabla) {
        conditions.push(`l.tabla_afectada ILIKE $${params.length + 1}`);
        params.push(`%${tabla}%`);
      }

      if (usuario_id) {
        conditions.push(`l.usuario_id = $${params.length + 1}`);
        params.push(usuario_id);
      }

      if (nivel) {
        conditions.push(`l.nivel = $${params.length + 1}`);
        params.push(nivel);
      }

      if (desde) {
        conditions.push(`
          (l.fecha_accion AT TIME ZONE 'America/La_Paz')::date >= $${params.length + 1}
        `)
        params.push(desde)
      }

      if (hasta) {
        conditions.push(`
          (l.fecha_accion AT TIME ZONE 'America/La_Paz')::date <= $${params.length + 1}
        `)
        params.push(hasta)
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      let countQuery = `
        SELECT COUNT(*) 
        FROM logs l
        LEFT JOIN usuarios u ON l.usuario_id = u.id
      `;

      if (conditions.length > 0) {
        countQuery += " WHERE " + conditions.join(" AND ");
      }

      const totalResult = await pool.query(countQuery, params);
      const total = parseInt(totalResult.rows[0].count, 10);

      if (!exportar) {
        const safeLimit = Math.min(parseInt(limit) || 100, 200);
        const safeOffset = parseInt(offset) || 0;

        query += `
          ORDER BY l.fecha_accion DESC
          LIMIT $${params.length + 1}
          OFFSET $${params.length + 2}
        `;

        params.push(safeLimit, safeOffset);
      } else {
        query += `
          ORDER BY l.fecha_accion DESC
        `;
      }

      const result = await pool.query(query, params);

      res.json({
        data: result.rows,
        total
      });
    } catch (err) {
      console.error("Error al obtener logs:", err);
      res.status(500).json({ error: "Error al obtener logs" });
    }
  }
);

router.get(
  "/tablas",
  verifyToken,
  authorizeRoles(1, 2, 3, 4, 5, 6, 7),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT DISTINCT tabla_afectada
        FROM logs
        WHERE tabla_afectada IS NOT NULL
        ORDER BY tabla_afectada
      `)

      res.json(
        result.rows.map(r => r.tabla_afectada)
      )
    } catch (err) {
      console.error("Error al obtener tablas de logs:", err)
      res.status(500).json({ error: "Error al obtener tablas" })
    }
  }
)


export default router;
