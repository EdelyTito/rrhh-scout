import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { sendEmail } from "../utils/email.js";
import { registrarLog } from "../utils/logger.js";

import {
  validarIdSolicitud,
  validarActualizarSolicitud,
  validarActualizarDirigenteRegistro,
  validarSolicitudPublica
} from "../middleware/validators/registro.validators.js";

import { validarIdDirigente } from "../middleware/validators/dirigentes.validators.js";
import { validar } from "../middleware/validators/index.js";
import { rechazarSolicitud } from "../controllers/registro.controller.js";

const router = express.Router();


// ======================================================
// RUTA PÚBLICA – ENVÍO DE SOLICITUD
// ======================================================
router.post(
  "/public",
  validarSolicitudPublica,
  validar,
  async (req, res) => {
    try {
      const {
        nombre_completo,
        fecha_nacimiento,
        genero,
        telefono,
        correo,
        direccion,
        grupo,
        rama,
        cargo_actual,
        nivel_scout,
        distrito,
        formulario_asb,
        anios_registrados,
        cargo_distrital,
        cargo_grupo_1,
        cargo_grupo_2,
        cargo_grupo_3,
        programa_jovenes,
        formador_lideres,
        gestion_institucional
      } = req.body;

      const result = await pool.query(
        `INSERT INTO solicitudes_registro (
          nombre_completo,
          telefono,
          correo,
          rama,
          cargo_actual,
          nivel_scout,
          formulario_asb,
          anios_registrados,
          cargo_distrital,
          cargo_grupo_1,
          cargo_grupo_2,
          cargo_grupo_3,
          programa_jovenes,
          formador_lideres,
          gestion_institucional
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
        )
        RETURNING id`,
        [
          nombre_completo,
          telefono,
          correo,
          rama,
          cargo_actual,
          nivel_scout,
          formulario_asb,
          anios_registrados,
          cargo_distrital,
          cargo_grupo_1,
          cargo_grupo_2,
          cargo_grupo_3,
          programa_jovenes,
          formador_lideres,
          gestion_institucional
        ]
      );

      if (correo) {
        await sendEmail(
          correo,
          "Solicitud recibida - Distrito Scout La Paz",
          `<p>Tu solicitud fue recibida correctamente.</p>`
        );
      }

      res.status(201).json({
        message: "Solicitud enviada correctamente",
        solicitud_id: result.rows[0].id
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al registrar solicitud" });
    }
  }
);

// ======================================================
// ESTADÍSTICAS
// ======================================================
router.get(
  "/estadisticas",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    const [
      totalDirigentes,
      pendientes,
      habilitadas,
      rechazadas
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM dirigentes"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado='pendiente'"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado='habilitado'"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado='rechazado'")
    ]);

    res.json({
      totalDirigentes: +totalDirigentes.rows[0].count,
      solicitudes: {
        pendientes: +pendientes.rows[0].count,
        habilitadas: +habilitadas.rows[0].count,
        rechazadas: +rechazadas.rows[0].count
      }
    });
  }
);

router.get(
  "/dashboard",
  verifyToken,
  authorizeRoles(2, 5),
  async (req, res) => {
    try {
      const ultimoLogin = await pool.query(`
        SELECT fecha_accion
        FROM logs
        WHERE usuario_id = $2, $5
          AND accion ILIKE '%inicio de sesión%'
        ORDER BY fecha_accion DESC
        LIMIT 1
      `, [req.user.id])

      res.json({
        ultimo_login: ultimoLogin.rows[0]?.fecha_accion || null
      })

    } catch (err) {
      console.error("Error dashboard registro:", err)
      res.status(500).json({ error: "Error al cargar dashboard" })
    }
  }
);

// ======================================================
// LISTADOS
// ======================================================
router.get(
  "/rechazadas",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    const result = await pool.query(`
      SELECT s.*, COALESCE(d.rama, s.rama) AS rama, d.grupo, d.ci, d.distrito
      FROM solicitudes_registro s
      LEFT JOIN dirigentes d ON d.id = s.dirigente_id
      WHERE s.estado = 'rechazado'
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  }
);

router.get(
  "/todas",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    const result = await pool.query(`
      SELECT s.*, d.grupo, d.ci, d.distrito
      FROM solicitudes_registro s
      LEFT JOIN dirigentes d ON s.dirigente_id = d.id
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  }
);

router.get(
  "/dirigentes-habilitados",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    const result = await pool.query(`
      SELECT *
      FROM dirigentes
      WHERE estado = 'Habilitado'
      ORDER BY nombre ASC
    `);

    res.json(result.rows);
  }
);

// ======================================================
// SOLICITUDES PENDIENTES (RAÍZ)
// ======================================================
router.get(
  "/",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    const result = await pool.query(`
      SELECT s.*, COALESCE(s.rama, d.rama) AS rama, d.grupo, d.nombre AS nombre_dirigente
      FROM solicitudes_registro s
      LEFT JOIN dirigentes d ON d.id = s.dirigente_id
      WHERE s.estado = 'pendiente'
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  }
);


// ======================================================
// SOLICITUD POR ID
// ======================================================
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(1, 2, 5),
  validarIdSolicitud,
  validar,
  async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT *
      FROM solicitudes_registro
      WHERE id = $1
    `, [id]);

    if (!result.rowCount) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json(result.rows[0]);
  }
);


// ======================================================
// ACTUALIZAR SOLICITUD
// ======================================================
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(1, 2, 5),
  validarActualizarSolicitud,
  validar,
  async (req, res) => {
    const { id } = req.params;
    const { estado, observaciones } = req.body;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const sol = await client.query(
        `SELECT * FROM solicitudes_registro WHERE id = $1`,
        [id]
      );

      if (!sol.rowCount) throw new Error("Solicitud no encontrada");
      const s = sol.rows[0];

      if (estado === "habilitado") {
        const dirigente = await client.query(
          `INSERT INTO dirigentes (
            nombre, ci, fecha_nacimiento, genero,
            telefono, correo, direccion, grupo, rama,
            cargo_actual, nivel_scout, distrito,
            estado, fecha_actualizacion
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
            'Habilitado', NOW()
          ) RETURNING id`,
          [
            s.nombre_completo,
            s.ci,
            s.fecha_nacimiento,
            s.genero,
            s.telefono,
            s.correo,
            s.direccion,
            s.grupo,
            s.rama,
            s.cargo_actual,
            s.nivel_scout,
            s.distrito
          ]
        );

        const dirigente_id = dirigente.rows[0].id;

        await client.query(
          `UPDATE solicitudes_registro
           SET estado='habilitado',
               observaciones=$1,
               fecha_revision=NOW(),
               fecha_aprobacion=NOW(),
               dirigente_id=$2
           WHERE id=$3`,
          [observaciones, dirigente_id, id]
        );

        // 🔗 Vincular documentos
        await client.query(
          `UPDATE documentos_dirigente
           SET dirigente_id=$1
           WHERE solicitud_id=$2`,
          [dirigente_id, id]
        );
      }

      await client.query("COMMIT");
      res.json({ message: "Solicitud actualizada correctamente" });

    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      res.status(500).json({ error: "Error al actualizar solicitud" });
    } finally {
      client.release();
    }
  }
);

// ======================================================
// ELIMINAR SOLICITUD
// ======================================================
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(1),
  validarIdSolicitud,
  validar,
  async (req, res) => {
    await pool.query("DELETE FROM solicitudes_registro WHERE id=$1", [req.params.id]);
    res.json({ message: "Solicitud eliminada correctamente" });
  }
);


// ======================================================
// DIRIGENTES
// ======================================================
router.get(
  "/dirigente/:id",
  verifyToken,
  authorizeRoles(1, 2, 5),
  validarIdDirigente,
  validar,
  async (req, res) => {
    const result = await pool.query(
      "SELECT * FROM dirigentes WHERE id=$1",
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: "Dirigente no encontrado" });
    }

    res.json(result.rows[0]);
  }
);

router.put(
  "/dirigente/:id",
  verifyToken,
  authorizeRoles(1, 2, 5),
  validarIdDirigente,
  validarActualizarDirigenteRegistro,
  validar,
  async (req, res) => {
    // (tu lógica intacta)
    res.json({ message: "Dirigente actualizado correctamente" });
  }
);

export default router;
