import express from "express"
import { verifyToken } from "../middleware/auth.js"
import { authorizeRoles } from "../middleware/authorize.js"
import { pool } from "../config/db.js"

const router = express.Router()

router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles(1),
  async (req, res) => {
    try {
      const seguimiento = await pool.query(`
        SELECT 
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE resultado_final = 'aprobado') AS aprobados,
          COUNT(*) FILTER (WHERE resultado_final = 'pendiente') AS pendientes
        FROM seguimiento
      `)

      const formacion = await pool.query(`
        SELECT 
          COUNT(*) AS total_cursos,
          COUNT(*) FILTER (WHERE estado = 'activo') AS cursos_activos
        FROM cursos
      `)

      const registro = await pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE estado = 'habilitado') AS habilitados,
          COUNT(*) FILTER (WHERE estado = 'pendiente') AS pendientes
        FROM solicitudes_registro
      `)

      const ultimoLogin = await pool.query(`
        SELECT fecha_accion
        FROM logs
        WHERE usuario_id = $1
          AND accion ILIKE '%inicio de sesión%'
        ORDER BY fecha_accion DESC
        LIMIT 1 OFFSET 1
      `, [req.user.id])

      res.json({
        seguimiento: seguimiento.rows[0],
        formacion: formacion.rows[0],
        registro: registro.rows[0],
        ultimo_login: ultimoLogin.rows[0]?.fecha_accion || null
      })

    } catch (err) {
      console.error("Error dashboard admin:", err)
      res.status(500).json({ error: "Error al cargar dashboard" })
    }
  }
)

export default router
