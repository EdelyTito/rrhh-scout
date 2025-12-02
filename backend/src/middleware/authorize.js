/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos
 * @param  {...number} allowedRoles - IDs de los roles que pueden acceder
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoleId = req.user?.rol_id;
    const userName = req.user?.correo || "Usuario desconocido";

    if (!userRoleId) {
      return res.status(403).json({ error: "No se encontró el rol del usuario" });
    }

    if (!allowedRoles.includes(userRoleId)) {
      console.warn(`🚫 Acceso denegado para ${userName} (Rol ID ${userRoleId})`);
      return res.status(403).json({ error: "No tienes permisos para esta acción" });
    }

    next();
  };
};
