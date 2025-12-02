import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Verifica que el header exista y tenga el formato correcto
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "No se proporcionó un token válido" });
  }

  // Extrae el token después de la palabra "Bearer"
  const token = authHeader.split(" ")[1];

  // Verificar que el token no esté vacío
  if (!token) {
    return res.status(403).json({ error: "Token no puede estar vacío" });
  }

  try {
    // 🔐 OPCIÓN 1: Sin log del secret (RECOMENDADO para producción)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔍 OPCIÓN 2: Con log solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log("🔐 Token decodificado para usuario:", decoded.correo);
    }

    // Guarda toda la información del usuario en req.user
    req.user = decoded;

    next();
  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);
    
    // Mensajes más específicos según el error
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expirado" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Token inválido" });
    } else {
      return res.status(401).json({ error: "Error de autenticación" });
    }
  }
};