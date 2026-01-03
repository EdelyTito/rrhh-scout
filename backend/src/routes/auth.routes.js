import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
import {verifyToken} from "../middleware/auth.js";
import { registrarLog } from "../utils/logger.js";
import {authorizeRoles} from "../middleware/authorize.js";
import crypto from "crypto";
import {sendEmail} from "../utils/email.js";

dotenv.config();
const router = express.Router();

//
// REGISTRO DE USUARIO
//
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol_id, cargo } = req.body;

    const checkUser = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, rol_id, cargo, primer_ingreso)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id, nombre, correo, rol_id, cargo, primer_ingreso`,
      [nombre, correo, hashed, rol_id, cargo]
    );

    const nuevoUsuario = result.rows[0];

    const rolQuery = await pool.query("SELECT nombre FROM roles WHERE id = $1", [rol_id]);
    const rolNombre = rolQuery.rows[0]?.nombre || "desconocido";

    // await registrarLog(
    //   nuevoUsuario.id,
    //   "Registro de nuevo usuario",
    //   "usuarios",
    //   nuevoUsuario.id,
    //   `Usuario: ${nombre}, Rol: ${rolNombre}, Cargo: ${cargo}, Correo: ${correo}`,
    //   rolNombre
    // );

    res.status(201).json({
      message: "✅ Usuario registrado con éxito",
      usuario: {
        ...nuevoUsuario,
        rol_nombre: rolNombre,
      },
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

router.get("/register", async (req, res) => {
  try {
    const result = await pool.query(` SELECT u.id, u.nombre, u.correo, r.nombre AS rol_nombre, u.cargo
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id DESC;`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// EDITAR USUARIO (PUT /api/auth/:id) — solo admin (rol_id = 1)
router.put("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, correo, rol_id, cargo } = req.body
    if (!nombre || !correo || !rol_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios" })
    }
    const result = await pool.query(
      `UPDATE usuarios SET nombre=$1, correo=$2, rol_id=$3, cargo=$4 WHERE id=$5 RETURNING id, nombre, correo, rol_id, cargo`,
      [nombre, correo, rol_id, cargo, id]
    )
    if (result.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" })

    await registrarLog(
      req.user.id,
      "Actualizó un usuario",
      "usuarios",
      id,
      `Usuario actualizado: ${nombre}, rol_id: ${rol_id}`,
      req.user.rol_nombre
    )

    res.json({ message: "Usuario actualizado", usuario: result.rows[0] })
  } catch (err) {
    console.error("Error actualizando usuario:", err)
    res.status(500).json({ error: "Error interno al actualizar usuario" })
  }
})

// ELIMINAR USUARIO
router.delete("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params;

    const idNum = parseInt(id, 10);
    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    if (idNum === req.user.id) {
      return res.status(400).json({ error: "No puedes eliminar tu propia cuenta." });
    }

    const colCheck = await pool.query(
      `SELECT column_name FROM informacion_schema.columns 
       WHERE table_name='usuarios' AND column_name='activo'`
    );
    if (colCheck.rowCount === 0) {
      console.warn("WARN: la columna 'activo' no existe en usuarios. Considera agregarla para soft-delete.");
      return res.status(500).json({ error: "Columna 'activo' no encontrada en tabla usuarios" });
    }

    const check = await pool.query("SELECT id, nombre, activo FROM usuarios WHERE id = $1", [idNum]);
    if (check.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (check.rows[0].activo === false) {
      return res.status(200).json({ message: "Usuario ya estaba desactivado" });
    }

    const result = await pool.query(
      "UPDATE usuarios SET activo = false WHERE id = $1 RETURNING id, nombre, correo, activo",
      [idNum]
    );

    if (result.rowCount === 0) {
      return res.status(500).json({ error: "No se pudo desactivar el usuario" });
    }

    try {
      await registrarLog(
        req.user.id,
        "Desactivó (soft-delete) un usuario",
        "usuarios",
        idNum,
        `Usuario desactivado: ${result.rows[0].nombre}`,
        req.user.rol_nombre
      );
    } catch (logErr) {
      console.error("Error registrando log después de desactivar usuario:", logErr);
    }

    res.json({ message: "Usuario desactivado (soft-delete) correctamente", usuario: result.rows[0] });
  } catch (err) {
    console.error("Error interno en DELETE /auth/:id:", err);

    if (err.code === "23503") {
      return res.status(409).json({
        error: "No se puede eliminar/desactivar el usuario por referencias en otras tablas (constraint).",
        detail: err.detail || null
      });
    }

    const isDev = (process.env.NODE_ENV || "").trim() !== "production";
    return res.status(500).json({
      error: "Error interno al desactivar usuario",
      message: isDev ? err.message : undefined
    });
  }
});

//
// LOGIN DE USUARIO
//
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

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

    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre,
        correo: user.correo,
        nombre: user.nombre,
        cargo: user.cargo,
        primer_ingreso: user.primer_ingreso
      },
      process.env.JWT_SECRET.trim(),
      { expiresIn: "4h" }
    )

    await registrarLog(
      user.id,
      "Inicio de sesión exitoso",
      "usuarios",
      user.id,
      `Correo: ${correo}, Rol: ${user.rol_nombre}, Cargo: ${user.cargo}`,
      user.rol_nombre
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre,
        cargo: user.cargo,
        primer_ingreso: user.primer_ingreso
      },
    });

  } catch (err) {
    console.error("Error en el login:", err);
    res.status(500).json({ error: "Error en el login" });
  }
});

// ------------------------------------
// OLVIDÉ MI CONTRASEÑA
// ------------------------------------
router.post("/forgot-password", async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: "Correo requerido" });
    }

    const userResult = await pool.query(
      "SELECT id, nombre FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await pool.query(
      `UPDATE usuarios
       SET reset_token = $1, reset_token_expira = $2
       WHERE id = $3`,
      [token, expires, user.id]
    );

    const resetLink = `${process.env.FRONTEND_ORIGINS}/reset-password?token=${token}`;

    await sendEmail(
      correo,
      "Recuperación de contraseña – Sistema Scout RRAA",
      `
        <p>Hola <b>${user.nombre}</b>,</p>
        <p>Solicitaste recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expira en 1 hora.</p>
      `
    );

    await registrarLog(
      user.id,
      "Solicitud de recuperación de contraseña",
      "usuarios",
      user.id,
      `Solicitud enviada a ${correo}`,
      "sistema"
    );

    res.json({ message: "Correo de recuperación enviado" });

  } catch (err) {
    console.error("Error forgot-password:", err);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body;

    if (!token || !nuevaContrasena) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const userResult = await pool.query(
      `SELECT id FROM usuarios
       WHERE reset_token = $1
       AND reset_token_expira > NOW()`,
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const hashed = await bcrypt.hash(nuevaContrasena, 10);

    await pool.query(
      `UPDATE usuarios
      SET contrasena = $1,
          reset_token = NULL,
          reset_token_expira = NULL,
          primer_ingreso = false
      WHERE id = $2`,
      [hashed, userResult.rows[0].id]
    );

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error reset-password:", err);
    res.status(500).json({ error: "Error al actualizar contraseña" });
  }
});

router.post(
  "/primer-ingreso",
  verifyToken,
  async (req, res) => {
    try {
      console.log("REQ.USER:", req.user)
      console.log("BODY:", req.body)
      const { nuevaContrasena } = req.body

      if (!nuevaContrasena || nuevaContrasena.length < 6) {
        return res.status(400).json({ error: "Contraseña inválida" })
      }

      const hashed = await bcrypt.hash(nuevaContrasena, 10)

      await pool.query(
        `UPDATE usuarios
         SET contrasena = $1,
             primer_ingreso = false
         WHERE id = $2`,
        [hashed, req.user.id]
      )

      res.json({ message: "Contraseña actualizada" })
    } catch (err) {
      console.error("Error primer ingreso:", err)
      res.status(500).json({ error: "Error al actualizar contraseña" })
    }
  }
)

export default router;
