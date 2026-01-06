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
import authConfig from "../config/auth.config.js";
import {validarLogin, validarRegistro, validar} from "../middleware/validators/index.js";
import {CARGOS} from "../config/cargos.config.js";


dotenv.config();
const router = express.Router();

//
// REGISTRO DE USUARIO
//
router.post("/register", validarRegistro, validar, async (req, res) => {
  try {
    const { nombre, correo, contrasena, cargo } = req.body;

    const cargoConfig = Object.values(CARGOS)
      .find(c => c.label === cargo);

    if (!cargoConfig) {
      return res.status(400).json({ error: "Cargo inválido" });
    }

    const rol_id = cargoConfig.rol_id;

    const checkUser = await pool.query(
      "SELECT 1 FROM usuarios WHERE correo = $1",
      [correo]
    );
    if (checkUser.rowCount > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashed = await bcrypt.hash(contrasena, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contrasena, cargo, rol_id, primer_ingreso)
       VALUES ($1,$2,$3,$4,$5,true)
       RETURNING id, nombre, correo, cargo, primer_ingreso`,
      [nombre, correo, hashed, cargo, rol_id]
    );

    res.status(201).json({
      message: "Usuario registrado con éxito",
      usuario: result.rows[0]
    });

  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

router.get("/register", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.nombre,
        u.correo,
        u.cargo,
        u.activo,
        r.nombre AS rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id ASC;`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// EDITAR USUARIO (PUT /api/auth/:id) — solo admin (rol_id = 1)
router.put("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  console.log('REQ.USER:', req.user)
  try {
    const { id } = req.params
    const { nombre, correo, cargo } = req.body

    if (!nombre || !correo || !cargo) {
      return res.status(400).json({ error: "Faltan campos obligatorios" })
    }

    const cargoConfig = Object.values(CARGOS)
      .find(c => c.label === cargo)

    if (!cargoConfig) {
      return res.status(400).json({ error: "Cargo inválido" })
    }

    const rol_id = cargoConfig.rol_id

    const result = await pool.query(
      `UPDATE usuarios u
      SET nombre = $1, correo = $2, cargo = $3, rol_id = $4
      FROM roles r
      WHERE u.id = $5
        AND r.id = $4
      RETURNING
        u.id, u.nombre, u.correo, u.cargo, r.nombre AS rol_nombre`,
      [nombre, correo, cargo, rol_id, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    await registrarLog(
      req.user.id,
      "Actualizó usuario",
      "usuarios",
      id,
      `Cargo asignado: ${cargo} (rol automático)`,
      req.user.rol_nombre
    )

    res.json({
      message: "Usuario actualizado correctamente",
      usuario: result.rows[0]
    })

    console.log('REQ.USER:', req.user)

  } catch (err) {
    console.error("Error actualizando usuario:", err)
    res.status(500).json({ error: "Error interno al actualizar usuario" })
  }
})

// ELIMINAR USUARIO
router.delete("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params
    const idNum = parseInt(id, 10)

    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: "ID inválido" })
    }

    if (idNum === req.user.id) {
      return res.status(400).json({
        error: "No puedes desactivar tu propia cuenta"
      })
    }

    const result = await pool.query(
      `UPDATE usuarios
       SET activo = false
       WHERE id = $1 AND activo = true
       RETURNING id, nombre, correo, activo`,
      [idNum]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Usuario no existe o ya está desactivado"
      })
    }

    await registrarLog(
      req.user.id,
      "Desactivó usuario",
      "usuarios",
      idNum,
      `Usuario desactivado: ${result.rows[0].nombre}`,
      req.user.rol_nombre
    )

    res.json({
      message: "Usuario desactivado correctamente",
      usuario: result.rows[0]
    })
  } catch (err) {
    console.error("Error al desactivar usuario:", err)
    res.status(500).json({ error: "Error interno al desactivar usuario" })
  }
})

// REACTIVAR USUARIO
router.patch("/:id/reactivar", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params
    const idNum = parseInt(id, 10)

    if (Number.isNaN(idNum)) {
      return res.status(400).json({ error: "ID inválido" })
    }

    if (idNum === req.user.id) {
      return res.status(400).json({
        error: "No puedes reactivar tu propia cuenta"
      })
    }

    const result = await pool.query(
      `UPDATE usuarios
       SET activo = true
       WHERE id = $1 AND activo = false
       RETURNING id, nombre, correo, activo`,
      [idNum]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado o ya activo"
      })
    }

    await registrarLog(
      req.user.id,
      "Reactivó usuario",
      "usuarios",
      idNum,
      `Usuario reactivado: ${result.rows[0].nombre}`,
      req.user.rol_nombre
    )

    res.json({
      message: "Usuario reactivado correctamente",
      usuario: result.rows[0]
    })
  } catch (err) {
    console.error("Error al reactivar usuario:", err)
    res.status(500).json({ error: "Error interno al reactivar usuario" })
  }
})

//
// LOGIN DE USUARIO
//
router.post("/login", validarLogin, validar, async (req, res) => {
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

      if (user.activo === false) {
        return res.status(403).json({
          error: "Usuario desactivado. Contacta al administrador."
        })
      }

      if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
        const diffMs = new Date(user.bloqueado_hasta) - new Date();
        const minutos = Math.ceil(diffMs / 60000);

        return res.status(423).json({
          error: "Cuenta bloqueada temporalmente",
          minutos_restantes: minutos
        });
      }

      const validPassword = await bcrypt.compare(contrasena, user.contrasena);

      if (!validPassword) {
        const intentos = (user.intentos_fallidos || 0) + 1;

        if (intentos >= authConfig.MAX_LOGIN_ATTEMPTS) {
          const bloqueo = new Date(
            Date.now() + authConfig.LOCK_TIME_MINUTES * 60000
          );

          await pool.query(
            `UPDATE usuarios
             SET intentos_fallidos = $1,
                 bloqueado_hasta = $2
             WHERE id = $3`,
            [intentos, bloqueo, user.id]
          );

          return res.status(423).json({
            error: "Cuenta bloqueada por múltiples intentos fallidos",
            minutos_restantes: authConfig.LOCK_TIME_MINUTES
          });
        }

        await pool.query(
          `UPDATE usuarios
           SET intentos_fallidos = $1
           WHERE id = $2`,
          [intentos, user.id]
        );

        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // ✅ LOGIN OK → reset
      await pool.query(
        `UPDATE usuarios
         SET intentos_fallidos = 0,
             bloqueado_hasta = NULL
         WHERE id = $1`,
        [user.id]
      );

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
      );

      await registrarLog(
        user.id,
        "Inicio de sesión exitoso",
        "usuarios",
        user.id,
        `Correo: ${correo}, Rol: ${user.rol_nombre}`,
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
        }
      });

    } catch (err) {
      console.error("Error en el login:", err);
      res.status(500).json({ error: "Error en el login" });
    }
  }
);



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

    if (user.bloqueado_hasta) {
      const ahora = new Date()
      const bloqueoHasta = new Date(user.bloqueado_hasta)

      if (bloqueoHasta > ahora) {
        const minutosRestantes = Math.ceil(
          (bloqueoHasta - ahora) / 60000
        )

        return res.status(423).json({
          error: "Cuenta bloqueada temporalmente",
          minutos_restantes: minutosRestantes
        })
      } else {
        await pool.query(
          `UPDATE usuarios
          SET intentos_fallidos = 0,
              bloqueado_hasta = NULL
          WHERE id = $1`,
          [user.id]
        )

        user.intentos_fallidos = 0
        user.bloqueado_hasta = null
      }
    }

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
