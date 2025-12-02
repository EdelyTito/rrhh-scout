import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
import { registrarLog } from "../utils/logger.js";

dotenv.config();
const router = express.Router();

//
// 🟢 REGISTRO DE USUARIO
//
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol_id, cargo } = req.body;

    // Verificar si el correo ya existe
    const checkUser = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    // Cifrar la contraseña
    const hashed = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo usuario
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol_id, cargo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, correo, rol_id, cargo`,
      [nombre, correo, hashed, rol_id, cargo]
    );

    const nuevoUsuario = result.rows[0];

    // Obtener nombre del rol
    const rolQuery = await pool.query("SELECT nombre FROM roles WHERE id = $1", [rol_id]);
    const rolNombre = rolQuery.rows[0]?.nombre || "desconocido";

    // 🧠 Registrar log
    await registrarLog(
      nuevoUsuario.id,
      "Registro de nuevo usuario",
      "usuarios",
      nuevoUsuario.id,
      `Usuario: ${nombre}, Rol: ${rolNombre}, Cargo: ${cargo}, Correo: ${correo}`,
      rolNombre
    );

    res.status(201).json({
      message: "✅ Usuario registrado con éxito",
      usuario: {
        ...nuevoUsuario,
        rol_nombre: rolNombre,
      },
    });
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

//Listar usuarios
router.get("/register", async (req, res) => {
  try {
    const result = await pool.query(` SELECT u.id, u.nombre, u.correo, r.nombre AS rol_nombre, u.cargo
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id DESC;`);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});


//
// 🔐 LOGIN DE USUARIO
//
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Buscar usuario y su rol
    const userResult = await pool.query(
      `SELECT u.*, r.nombre AS rol_nombre
       FROM usuarios u
       JOIN roles r ON r.id = u.rol_id
       WHERE correo = $1`,
      [correo]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar token JWT con más datos del usuario
    const token = jwt.sign(
      {
        id: user.id,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre,
        correo: user.correo,
        nombre: user.nombre,
        cargo: user.cargo,
      },
      process.env.JWT_SECRET.trim(), // 🔥 trim() elimina espacios accidentales
      { expiresIn: "4h" }
    );

    // Registrar log de inicio de sesión
    await registrarLog(
      user.id,
      "Inicio de sesión exitoso",
      "usuarios",
      user.id,
      `Correo: ${correo}, Rol: ${user.rol_nombre}, Cargo: ${user.cargo}`,
      user.rol_nombre
    );

    res.json({
      message: "✅ Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre,
        cargo: user.cargo,
      },
    });
  } catch (err) {
    console.error("❌ Error en el login:", err);
    res.status(500).json({ error: "Error en el login" });
  }
});

export default router;
