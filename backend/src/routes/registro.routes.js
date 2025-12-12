import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { sendEmail } from "../utils/email.js";
import { registrarLog } from "../utils/logger.js";

const router = express.Router();

//
// RUTA PÚBLICA — Envío de solicitud de registro o habilitación
//
router.post("/public", async (req, res) => {
  try {
    const {
      nombre,
      ci,
      fecha_nacimiento,
      genero,
      telefono,
      correo,
      direccion,
      grupo,
      cargo_actual,
      nivel_scout,
      distrito,
      archivo_ci_anverso,
      archivo_ci_reverso,
      archivo_croquis_domicilio,
      archivo_safe_from_harm,
      archivo_codigo_conducta,
      archivo_certificado_no_violencia
    } = req.body;

    // Crear dirigente
    const resultDirigente = await pool.query(
      `INSERT INTO dirigentes (
        nombre, ci, fecha_nacimiento, genero, telefono, correo, direccion, grupo,
        cargo_actual, nivel_scout, estado, distrito, archivo_ci_anverso, archivo_ci_reverso,
        archivo_croquis_domicilio, archivo_safe_from_harm, archivo_codigo_conducta, archivo_certificado_no_violencia
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Postulante',$11,$12,$13,$14,$15,$16,$17)
      RETURNING id`,
      [
        nombre, ci, fecha_nacimiento, genero, telefono, correo, direccion, grupo,
        cargo_actual, nivel_scout, distrito, archivo_ci_anverso, archivo_ci_reverso,
        archivo_croquis_domicilio, archivo_safe_from_harm, archivo_codigo_conducta, archivo_certificado_no_violencia
      ]
    );

    const dirigente_id = resultDirigente.rows[0].id;

    //Crear solicitud
    const resultSol = await pool.query(
      `INSERT INTO solicitudes_registro (dirigente_id, correo, telefono, estado)
       VALUES ($1, $2, $3, 'pendiente') RETURNING id`,
      [dirigente_id, correo, telefono]
    );

    //Enviar correo de confirmación
    if (correo) {
      await sendEmail(
        correo,
        "📬 Solicitud recibida - Distrito Scout La Paz",
        `<p>Estimado/a ${nombre},</p>
         <p>Tu solicitud de registro y habilitación fue recibida correctamente.</p>
         <p>El Comisionado de Registro y Habilitación revisará la documentación enviada y se contactará contigo a través de este correo.</p>
         <p>Atentamente,<br>Recursos Adultos - Distrito Scout La Paz</p>`
      );
    }

    res.status(201).json({
      message: "Solicitud enviada exitosamente.",
      solicitud_id: resultSol.rows[0].id,
    });
  } catch (err) {
    console.error("Error al registrar solicitud:", err);
    res.status(500).json({ error: "Error al registrar solicitud pública" });
  }
});

//
//RUTAS PRIVADAS — Solo para admin y responsables
//

//Listar todas las solicitudes
router.get("/", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*, 
        d.nombre AS dirigente, 
        d.grupo, 
        d.ci, 
        d.telefono, 
        d.distrito
      FROM solicitudes_registro s
      JOIN dirigentes d ON s.dirigente_id = d.id
      ORDER BY s.id DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener solicitudes:", err);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

// Actualizar estado de solicitud (Revisión / Aprobación / Rechazo)
router.put("/:id", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const { id } = req.params;

    const { estado = "pendiente", observaciones = "" } = req.body || {};

    if (!["pendiente", "habilitado", "rechazado"].includes(estado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const fecha_aprobacion = estado === "habilitado" ? new Date() : null;

    const result = await pool.query(
      `UPDATE solicitudes_registro
       SET estado = $1, observaciones = $2, fecha_revision = NOW(), fecha_aprobacion = $3
       WHERE id = $4 RETURNING id, estado, observaciones`,
      [estado, observaciones, fecha_aprobacion, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    await registrarLog(
      req.user.id,
      "Actualizó estado de solicitud de registro",
      "solicitudes_registro",
      id,
      `Nuevo estado: ${estado} - Observaciones: ${observaciones}`,
      req.user.rol_nombre
    );

    res.status(200).json({
      estado: result.rows[0].estado,
      message: "Solicitud actualizada correctamente"
    });

  } catch (err) {
    console.error("Error al actualizar solicitud:", err);
    res.status(500).json({ error: "Error al actualizar solicitud" });
  }
});


// Eliminar solicitud (solo admin)
router.delete("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM solicitudes_registro WHERE id=$1", [id]);

    await registrarLog(
      req.user.id,
      "Eliminó una solicitud de registro",
      "solicitudes_registro",
      id,
      "Eliminación realizada por administrador",
      req.user.rol_nombre
    );

    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar solicitud:", err);
    res.status(500).json({ error: "Error al eliminar solicitud" });
  }
});


//
// 🟢 EDITAR DATOS DE UN DIRIGENTE (uso interno)
//
router.put("/dirigente/:id", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      ci,
      fecha_nacimiento,
      genero,
      telefono,
      correo,
      direccion,
      grupo,
      cargo_actual,
      nivel_scout,
      distrito,
      archivo_ci_anverso,
      archivo_ci_reverso,
      archivo_croquis_domicilio,
      archivo_safe_from_harm,
      archivo_codigo_conducta,
      archivo_certificado_no_violencia
    } = req.body;

    const result = await pool.query(
      `UPDATE dirigentes
       SET
         nombre = $1,
         ci = $2,
         fecha_nacimiento = $3,
         genero = $4,
         telefono = $5,
         correo = $6,
         direccion = $7,
         grupo = $8,
         cargo_actual = $9,
         nivel_scout = $10,
         distrito = $11,
         archivo_ci_anverso = $12,
         archivo_ci_reverso = $13,
         archivo_croquis_domicilio = $14,
         archivo_safe_from_harm = $15,
         archivo_codigo_conducta = $16,
         archivo_certificado_no_violencia = $17,
         fecha_actualizacion = NOW()
       WHERE id = $18
       RETURNING *`,
      [
        nombre,
        ci,
        fecha_nacimiento,
        genero,
        telefono,
        correo,
        direccion,
        grupo,
        cargo_actual,
        nivel_scout,
        distrito,
        archivo_ci_anverso,
        archivo_ci_reverso,
        archivo_croquis_domicilio,
        archivo_safe_from_harm,
        archivo_codigo_conducta,
        archivo_certificado_no_violencia,
        id,
      ]
    );

    const dirigenteActualizado = result.rows[0];

    await registrarLog(
      req.user.id,
      "Actualizó datos del dirigente (verificación ASB)",
      "dirigentes",
      id,
      `Dirigente: ${nombre}, Grupo: ${grupo}, Distrito: ${distrito}`,
      req.user.rol_nombre
    );

    res.json({
      message: "Datos del dirigente actualizados correctamente.",
      dirigente: dirigenteActualizado,
    });
  } catch (err) {
    console.error("Error al actualizar dirigente:", err);
    res.status(500).json({ error: "Error al actualizar los datos del dirigente" });
  }
});


export default router;
