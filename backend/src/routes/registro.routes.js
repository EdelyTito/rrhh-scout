import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";

import {
  validarIdSolicitud,
  validarActualizarSolicitud,
  validarActualizarDirigenteRegistro,
  validarSolicitudPublica
} from "../middleware/validators/registro.validators.js";

import { validarIdDirigente } from "../middleware/validators/dirigentes.validators.js";
import { validar } from "../middleware/validators/index.js";

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
        ci,
        fecha_nacimiento,
        genero,
        grupo,
        rama,
        formulario_asb,
        anios_servicio,
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
          ci,
          fecha_nacimiento,
          genero,
          grupo,
          rama,
          formulario_asb,
          anios_servicio,
          cargo_distrital,
          cargo_grupo_1,
          cargo_grupo_2,
          cargo_grupo_3,
          programa_jovenes,
          formador_lideres,
          gestion_institucional,
          estado
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pendiente'
        )
        RETURNING id`,
        [
          nombre_completo,
          ci,
          fecha_nacimiento,
          genero,
          grupo,
          rama,
          formulario_asb,
          anios_servicio,
          cargo_distrital,
          cargo_grupo_1,
          cargo_grupo_2,
          cargo_grupo_3,
          programa_jovenes,
          formador_lideres,
          gestion_institucional
        ]
      );

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

// ======================================================
// LISTADOS
// ======================================================
router.get(
  "/rechazadas",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    const result = await pool.query(`
      SELECT
        s.*,
        COALESCE(d.grupo, s.grupo) AS grupo,
        COALESCE(d.rama, s.rama) AS rama,
        COALESCE(d.ci, s.ci) AS ci,
        d.distrito
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
      SELECT
        s.*,
        COALESCE(d.grupo, s.grupo) AS grupo,
        COALESCE(d.ci, s.ci) AS ci,
        d.distrito
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
      ORDER BY nombre_completo ASC
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
      SELECT
        s.*,
        COALESCE(d.grupo, s.grupo) AS grupo,
        COALESCE(d.rama, s.rama) AS rama,
        d.nombre_completo AS nombre_dirigente
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
            nombre_completo,
            ci,
            fecha_nacimiento,
            genero,
            grupo,
            rama,

            anios_servicio,

            cargo_distrital,
            cargo_grupo_1,
            cargo_grupo_2,
            cargo_grupo_3,

            programa_jovenes,
            formador_lideres,
            gestion_institucional,
            formulario_asb,

            estado,
            fecha_actualizacion
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,
            $7,
            $8,$9,$10,$11,
            $12,$13,$14,$15,
            'Habilitado', NOW()
          )
          RETURNING id`,
          [
            s.nombre_completo,
            s.ci,
            s.fecha_nacimiento,
            s.genero,
            s.grupo,
            s.rama,

            s.anios_servicio,    

            s.cargo_distrital,
            s.cargo_grupo_1,
            s.cargo_grupo_2,
            s.cargo_grupo_3,

            s.programa_jovenes,
            s.formador_lideres,
            s.gestion_institucional,
            s.formulario_asb
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

        await client.query(
          `UPDATE documentos_dirigente
          SET dirigente_id=$1
          WHERE solicitud_id=$2`,
          [dirigente_id, id]
        );
      }

      if (estado === "rechazado") {
        await client.query(
          `UPDATE solicitudes_registro
          SET estado='rechazado',
              observaciones=$1,
              fecha_revision=NOW()
          WHERE id=$2`,
          [observaciones, id]
        );
      }

      await client.query("COMMIT");

      if (estado === "habilitado") {
        await registrarLog(
          req.user.id,
          "Aprobó solicitud de registro",
          "solicitudes_registro",
          id,
          "Solicitud aprobada y dirigente habilitado",
          req.user.rol_nombre
        )
      }

      if (estado === "rechazado") {
        await registrarLog(
          req.user.id,
          "Rechazó solicitud de registro",
          "solicitudes_registro",
          id,
          `Solicitud rechazada. Obs: ${observaciones || 'sin observaciones'}`,
          req.user.rol_nombre
        )
      }

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

// ======================================================
// DETALLE DE DIRIGENTE PARA REGISTRO (CON DOCUMENTOS)
// ======================================================
// registro.routes.js
router.get(
  "/dirigente/:id/detalle",
  verifyToken,
  authorizeRoles(1, 2, 5),
  async (req, res) => {
    try {
      const { id } = req.params;

      const dirigenteRes = await pool.query(
        `SELECT
          d.id,
          d.nombre_completo,
          d.ci,
          d.genero,
          d.fecha_nacimiento,
          d.grupo,
          d.rama,
          d.estado,
          d.fecha_actualizacion,

          -- Scout
          d.anios_servicio,
          d.cargo_distrital,
          d.cargo_grupo_1,
          d.cargo_grupo_2,
          d.cargo_grupo_3,

          -- Formación
          d.programa_jovenes,
          d.formador_lideres,
          d.gestion_institucional,

          -- Administrativos
          d.telefono,
          d.correo,
          d.direccion_domicilio,
          d.grupo_anterior,
          d.fecha_ingreso,
          d.distrito,
          d.formulario_asb
        FROM dirigentes d
        WHERE d.id = $1`,
        [id]
      );

      if (!dirigenteRes.rowCount) {
        return res.status(404).json({ error: "Dirigente no encontrado" });
      }

      const documentosRes = await pool.query(
        `
        SELECT id, tipo_documento, nombre_archivo
        FROM documentos_dirigente
        WHERE dirigente_id = $1
        `,
        [id]
      );

      res.json({
        dirigente: dirigenteRes.rows[0],
        documentos: documentosRes.rows
      });

    } catch (error) {
      console.error("Error detalle dirigente:", error.message);
      res.status(500).json({ error: "Error al obtener detalle del dirigente" });
    }
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
    const campos = []
    const valores = []
    let idx = 1

    for (const [key, value] of Object.entries(req.body)) {
      campos.push(`${key} = $${idx}`)
      valores.push(value)
      idx++
    }

    if (!campos.length) {
      return res.status(400).json({ error: 'No hay campos para actualizar' })
    }

    valores.push(req.params.id)

    await pool.query(
      `
      UPDATE dirigentes
      SET ${campos.join(', ')},
          fecha_actualizacion = NOW()
      WHERE id = $${idx}
      `,
      valores
    )

    await registrarLog(
      req.user.id,
      "Actualizó dirigente desde registro",
      "dirigentes",
      req.params.id,
      "Actualización de datos del dirigente",
      req.user.rol_nombre
    )

    res.json({ message: 'Dirigente actualizado correctamente' })
  }
);

export default router;
