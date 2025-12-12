import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "No se proporcionó un token válido" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token no puede estar vacío" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (process.env.NODE_ENV === 'development') {
      console.log("Token decodificado para usuario:", decoded.correo);
    }

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Error al verificar token:", err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expirado" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: "Token inválido" });
    } else {
      return res.status(401).json({ error: "Error de autenticación" });
    }
  }
};