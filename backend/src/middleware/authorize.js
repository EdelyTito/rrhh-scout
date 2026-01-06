/**
 * @param  {...number} rolesPermitidos
 */
export const authorizeRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || typeof req.user.rol_id !== "number") {
      return res.status(401).json({ error: "No autenticado" })
    }

    if (!rolesPermitidos.includes(req.user.rol_id)) {
      return res.status(403).json({
        error: "No tienes permisos para acceder a este recurso"
      })
    }

    next()
  }
}
