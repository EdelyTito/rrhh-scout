import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { pool } from "../config/db.js"

dotenv.config()

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No se proporcionó token" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      ...decoded,
      rol_id: Number(decoded.rol_id)
    }

    const result = await pool.query(
      "SELECT primer_ingreso FROM usuarios WHERE id = $1",
      [decoded.id]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no válido" })
    }

    const primerIngreso = result.rows[0].primer_ingreso

    const rutasPermitidasPrimerIngreso = [
      "/auth/primer-ingreso",
      "/auth/login",
      "/auth/forgot-password",
      "/auth/reset-password"
    ]

    const rutaPermitida = rutasPermitidasPrimerIngreso.some(r =>
      req.originalUrl.includes(r)
    )

    if (primerIngreso === true && !rutaPermitida) {
      return res.status(403).json({
        error: "Debes cambiar tu contraseña antes de continuar",
        primer_ingreso: true
      })
    }

    next()
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" })
  }
}
