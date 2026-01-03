/**
 * 
 * @param  {...number} allowedRoles - IDs de los roles que pueden acceder
 */
export const authorizeRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol_nombre) {
      return res.status(401).json({ error: "No autenticado" })
    }

    if (!rolesPermitidos.includes(req.user.rol_nombre)) {
      return res.status(403).json({
        error: "No tienes permisos para acceder a este recurso"
      })
    }

    next()
  }
}

