// src/routes/seguimiento.routes.js
import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { sendEmail } from "../utils/email.js";
import { registrarLog } from "../utils/logger.js";

const router = express.Router();

//
// 🟢 RUTA PÚBLICA — Envío de formulario IM / Paxtu / Koodoo
//
router.post("/public", async (req, res) => {
  try {
    const {
      nombre_participante,
      grupo,
      correo,
      rama_scout,
      tipo_im,
      tipo_proceso,
      documento_url,
      observaciones,
    } = req.body;

    const resultSeg = await pool.query(
      `INSERT INTO seguimiento (
        nombre_participante, correo, grupo, rama_scout, tipo_im, tipo_proceso,
        observaciones_generales, estado, resultado_final, fecha_creacion, fecha_actualizacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,'primera entrega','en proceso', NOW(), NOW())
      RETURNING id`,
      [nombre_participante, correo, grupo, rama_scout, tipo_im, tipo_proceso, observaciones]
    );

    await pool.query(
      `INSERT INTO entregas_seguimiento (seguimiento_id, etapa, documento_url, observaciones)
       VALUES ($1, 'primera entrega', $2, $3)`,
      [resultSeg.rows[0].id, documento_url, observaciones]
    );

    if (correo) {
      await sendEmail(
        correo,
        "📬 Formulario recibido - Seguimiento Scout",
        `<p>Hola ${nombre_participante},</p>
         <p>Tu formulario <strong>${tipo_im}</strong> ha sido recibido exitosamente.</p>
         <p>El equipo RRAA revisará tu documentación y se comunicará contigo.</p>
         <p>Atentamente,<br>Equipo RRAA Distrito Scout La Paz</p>`
      );
    }

    res.status(201).json({
      message: "Formulario recibido exitosamente.",
      seguimiento_id: resultSeg.rows[0].id,
    });
  } catch (err) {
    console.error("❌ Error al registrar formulario público:", err);
    res.status(500).json({ error: "Error al registrar formulario público" });
  }
});

//
// 🟢 RUTA PÚBLICA — Reincorporación o Periodo de Prueba
// (⚠️ SE MUEVE ANTES DE LA RUTA DINÁMICA /:id)
//
router.post("/reincorporacion", async (req, res) => {
  try {
    const {
      nombre,
      grupo,
      tipo,
      motivo,
      documento_url,
      archivo_formulario,
      archivo_carta_respaldo,
      telefono,
      correo,
      fecha_inicio,
      fecha_fin,
    } = req.body;

    const fechaFinValida = tipo === "periodo de prueba" ? fecha_fin : null;

    const result = await pool.query(
      `INSERT INTO reincorporaciones 
       (nombre, grupo, tipo, motivo, documento_url, archivo_formulario, archivo_carta_respaldo,
        telefono, correo, fecha_inicio, fecha_fin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [nombre, grupo, tipo, motivo, documento_url, archivo_formulario, archivo_carta_respaldo,
       telefono, correo, fecha_inicio, fechaFinValida]
    );

    res.status(201).json({
      message: "Formulario de reincorporación recibido correctamente.",
      reincorporacion_id: result.rows[0].id,
    });
  } catch (err) {
    console.error("❌ Error al registrar reincorporación:", err);
    res.status(500).json({ error: "Error al registrar reincorporación" });
  }
});

//
// 🔒 LISTAR REINCORPORACIONES
//
router.get("/reincorporacion", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM reincorporaciones
      ORDER BY fecha_envio DESC
    `);

    await registrarLog(
      req.user.id,
      "Consultó lista de reincorporaciones",
      "reincorporaciones",
      null,
      "Visualizó listado de reincorporaciones",
      req.user.rol_nombre
    );

    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener reincorporaciones:", err);
    res.status(500).json({ error: "Error al obtener reincorporaciones" });
  }
});

//
// 🔒 LISTAR TODOS LOS SEGUIMIENTOS
//
router.get("/", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM seguimiento
      ORDER BY fecha_creacion DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener seguimientos:", err);
    res.status(500).json({ error: "Error al obtener seguimientos" });
  }
});

//
// 🔒 REGISTRAR NUEVA ENTREGA / DEVOLUCIÓN
//
router.post("/:id/entregas", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {
  try {
    const { id } = req.params;
    const { etapa, documento_url, archivo_extra, observaciones } = req.body;

    const entrega = await pool.query(
      `INSERT INTO entregas_seguimiento (seguimiento_id, etapa, documento_url, archivo_extra, observaciones)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, etapa, documento_url, archivo_extra, observaciones]
    );

    await pool.query(
      `UPDATE seguimiento
       SET estado = $1, observaciones_generales = $2, fecha_actualizacion = NOW()
       WHERE id = $3`,
      [etapa, observaciones, id]
    );

    await registrarLog(
      req.user.id,
      "Registró entrega o devolución en seguimiento",
      "entregas_seguimiento",
      entrega.rows[0].id,
      `Etapa: ${etapa} - Observaciones: ${observaciones}`,
      req.user.rol_nombre
    );

    res.status(201).json(entrega.rows[0]);
  } catch (err) {
    console.error("❌ Error al registrar entrega:", err);
    res.status(500).json({ error: "Error al registrar entrega" });
  }
});

//
// 🔒 CAMBIAR RESULTADO FINAL DEL PROCESO
//
router.put("/:id/resultado", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado_final } = req.body;

    const result = await pool.query(
      `UPDATE seguimiento
       SET resultado_final = $1, estado = 'entrega final', fecha_actualizacion = NOW()
       WHERE id = $2 RETURNING *`,
      [resultado_final, id]
    );

    await registrarLog(
      req.user.id,
      "Actualizó resultado final de seguimiento",
      "seguimiento",
      id,
      `Resultado final: ${resultado_final}`,
      req.user.rol_nombre
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error al actualizar resultado final:", err);
    res.status(500).json({ error: "Error al actualizar resultado final" });
  }
});

//
// 🔒 DETALLE DE SEGUIMIENTO (con entregas)
// ⚠️ ESTA DEBE IR AL FINAL para no interferir con /reincorporacion
//
router.get("/:id", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {
  try {
    const { id } = req.params;

    const seguimiento = await pool.query(`SELECT * FROM seguimiento WHERE id = $1`, [id]);
    if (seguimiento.rows.length === 0)
      return res.status(404).json({ error: "Seguimiento no encontrado" });

    const entregas = await pool.query(
      `SELECT * FROM entregas_seguimiento WHERE seguimiento_id = $1 ORDER BY fecha ASC`,
      [id]
    );

    res.json({ seguimiento: seguimiento.rows[0], entregas: entregas.rows });
  } catch (err) {
    console.error("❌ Error al obtener detalle del seguimiento:", err);
    res.status(500).json({ error: "Error al obtener detalle del seguimiento" });
  }
});

//
// 🔒 ELIMINAR UN SEGUIMIENTO (solo admin)
//
router.delete("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM seguimiento WHERE id=$1", [id]);

    await registrarLog(
      req.user.id,
      "Eliminó registro de seguimiento",
      "seguimiento",
      id,
      "Registro eliminado por administrador",
      req.user.rol_nombre
    );

    res.json({ message: "Seguimiento eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar seguimiento:", err);
    res.status(500).json({ error: "Error al eliminar seguimiento" });
  }
});

export default router;
