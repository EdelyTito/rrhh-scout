import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { sendEmail } from "../utils/email.js";
import { registrarLog } from "../utils/logger.js";
import { validarIdSolicitud, validarActualizarSolicitud, validarActualizarDirigenteRegistro, validarSolicitudPublica} from "../middleware/validators/registro.validators.js"
import { validarIdDirigente } from "../middleware/validators/dirigentes.validators.js"
import { validar } from "../middleware/validators/index.js";

const router = express.Router();

//
// RUTA PÚBLICA — Envío de solicitud de registro o habilitación
//
router.post("/public", validarSolicitudPublica, validar, async (req, res) => {
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
      rama,
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
        nombre, ci, fecha_nacimiento, genero, telefono, correo, direccion, grupo, rama,
        cargo_actual, nivel_scout, estado, distrito, archivo_ci_anverso, archivo_ci_reverso,
        archivo_croquis_domicilio, archivo_safe_from_harm, archivo_codigo_conducta, archivo_certificado_no_violencia
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'Postulante',$12,$13,$14,$15,$16,$17,$18)
      RETURNING id`,
      [
        nombre, ci, fecha_nacimiento, genero, telefono, correo, direccion, grupo, rama,
        cargo_actual, nivel_scout, distrito, archivo_ci_anverso, archivo_ci_reverso,
        archivo_croquis_domicilio, archivo_safe_from_harm, archivo_codigo_conducta, archivo_certificado_no_violencia
      ]
    );

    const dirigente_id = resultDirigente.rows[0].id;

    //Crear solicitud
    const resultSol = await pool.query(
      `INSERT INTO solicitudes_registro (dirigente_id, nombre_completo, rama, correo, telefono, estado)
       VALUES ($1, $2, $3, $4, $5, 'pendiente') RETURNING id`,
      [dirigente_id, nombre, rama, correo, telefono]
    );

    //Enviar correo de confirmación
    if (correo) {
      await sendEmail(
        correo,
        "Solicitud recibida - Distrito Scout La Paz",
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

router.get("/:id",
  verifyToken,
  authorizeRoles(1, 2, 5),
  validarIdSolicitud,
  validar,
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(`
        SELECT 
          s.*,
          d.nombre,
          d.ci,
          d.fecha_nacimiento,
          d.genero,
          d.telefono,
          d.correo,
          d.grupo,
          d.rama,
          d.distrito,
          d.cargo_actual,
          d.nivel_scout,
          d.archivo_ci_anverso,
          d.archivo_ci_reverso,
          d.archivo_croquis_domicilio,
          d.archivo_safe_from_harm,
          d.archivo_codigo_conducta,
          d.archivo_certificado_no_violencia
        FROM solicitudes_registro s
        JOIN dirigentes d ON d.id = s.dirigente_id
        WHERE s.id = $1
      `, [id])

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Solicitud no encontrada" })
      }

      res.json(result.rows[0])

    } catch (err) {
      console.error("Error al obtener solicitud:", err)
      res.status(500).json({ error: "Error al obtener solicitud" })
    }
  }
)

//
//RUTAS PRIVADAS — Solo para admin y responsables
//

router.get("/", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    console.log("Ejecutando consulta para obtener solicitudes...");
    
    // Opción 1: Usar s.rama de solicitudes_registro (si está ahí)
    const result = await pool.query(`
      SELECT 
        s.id,
        s.dirigente_id,
        s.estado,
        s.observaciones,
        s.fecha_revision,
        s.fecha_aprobacion,
        s.created_at,
        s.correo,
        s.telefono,
        s.nombre_completo,
        -- OBTENER LA RAMA - primero de solicitudes_registro, luego de dirigentes
        COALESCE(s.rama, d.rama) AS rama,
        d.grupo,
        d.ci,
        d.distrito,
        d.nombre AS nombre_dirigente
      FROM solicitudes_registro s
      LEFT JOIN dirigentes d ON s.dirigente_id = d.id
      WHERE s.estado = 'pendiente'
      ORDER BY s.created_at DESC;
    `);
    
    console.log("Consulta exitosa. Filas encontradas:", result.rows.length);
    
    if (result.rows.length > 0) {
      console.log("Primera solicitud (con rama):", {
        id: result.rows[0].id,
        nombre: result.rows[0].nombre_completo,
        rama_solicitud: result.rows[0].rama, // Esto debería mostrar la rama
        grupo: result.rows[0].grupo
      });
    }
    
    res.json(result.rows);
    
  } catch (err) {
    console.error("ERROR en consulta SQL:", err.message);
    res.status(500).json({ 
      error: "Error al obtener solicitudes", 
      details: err.message
    });
  }
});

router.put("/:id", verifyToken, authorizeRoles(1, 2, 5), validarActualizarSolicitud, validar, async (req, res) => {
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

// Endpoint para estadísticas del dashboard
router.get("/estadisticas", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const [
      totalDirigentes,
      habilitados,
      pendientes,
      nuevasSolicitudesMes,
      aprobadasMes,
      rechazadosMes
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM dirigentes"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado = 'habilitado'"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado = 'pendiente'"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado = 'habilitado' AND fecha_aprobacion >= DATE_TRUNC('month', CURRENT_DATE)"),
      pool.query("SELECT COUNT(*) FROM solicitudes_registro WHERE estado = 'rechazado' AND fecha_revision >= DATE_TRUNC('month', CURRENT_DATE)")
    ]);

    const estadisticas = {
      totalDirigentes: parseInt(totalDirigentes.rows[0].count),
      habilitados: parseInt(habilitados.rows[0].count),
      pendientes: parseInt(pendientes.rows[0].count),
      nuevasSolicitudesMes: parseInt(nuevasSolicitudesMes.rows[0].count),
      aprobadasMes: parseInt(aprobadasMes.rows[0].count),
      rechazadosMes: parseInt(rechazadosMes.rows[0].count),
      porcentajeHabilitados: totalDirigentes.rows[0].count > 0 ? 
        (parseInt(habilitados.rows[0].count) / parseInt(totalDirigentes.rows[0].count)) * 100 : 0
    };

    res.json(estadisticas);
    
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// Endpoint para obtener TODAS las solicitudes
router.get("/todas", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.dirigente_id,
        s.estado,
        s.observaciones,
        s.fecha_revision,
        s.fecha_aprobacion,
        s.created_at,
        s.correo,
        s.telefono,
        s.nombre_completo,
        s.rama,
        d.grupo,
        d.ci,
        d.distrito
      FROM solicitudes_registro s
      LEFT JOIN dirigentes d ON s.dirigente_id = d.id
      ORDER BY s.created_at DESC;
    `);
    
    res.json(result.rows);
    
  } catch (err) {
    console.error("ERROR al obtener todas las solicitudes:", err.message);
    res.status(500).json({ 
      error: "Error al obtener solicitudes", 
      details: err.message
    });
  }
});

// Eliminar solicitud (solo admin)
router.delete("/:id", verifyToken, authorizeRoles(1), validarIdSolicitud, validar, async (req, res) => {
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

//Obtener dirigentes habilitados
router.get("/dirigentes-habilitados", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    console.log("Ejecutando consulta para obtener dirigentes habilitados...");
    
    const result = await pool.query(`
      SELECT 
        d.id,
        d.nombre,
        d.ci,
        COALESCE(d.rama, 'Sin especificar') AS rama,
        d.grupo,
        COALESCE(d.distrito, 'Distrito La Paz') AS distrito,
        d.cargo_actual AS cargo_grupo,
        d.nivel_scout,
        d.telefono,
        d.correo,
        TO_CHAR(d.fecha_nacimiento, 'DD/MM/YYYY') AS fecha_nacimiento_formateada,
        d.genero,
        d.direccion,
        TO_CHAR(d.fecha_ingreso, 'DD/MM/YYYY') AS fecha_ingreso_formateada,
        d.anios_servicio,
        -- Fecha de aprobación formateada
        TO_CHAR(s.fecha_aprobacion, 'DD/MM/YYYY') AS fecha_aprobacion_formateada,
        s.observaciones,
        s.id AS solicitud_id
      FROM dirigentes d
      INNER JOIN solicitudes_registro s ON d.id = s.dirigente_id
      WHERE s.estado = 'habilitado'
      ORDER BY s.fecha_aprobacion DESC, d.nombre ASC;
    `);
    
    console.log("Dirigentes habilitados encontrados:", result.rows.length);
    
    res.json(result.rows);
    
  } catch (err) {
    console.error("ERROR al obtener dirigentes habilitados:", err.message);
    res.status(500).json({ 
      error: "Error al obtener dirigentes habilitados", 
      details: err.message
    });
  }
});

router.get("/dirigente/:id", verifyToken, authorizeRoles(1, 2, 5), validarIdDirigente, validar, async (req, res) => {
    const { id } = req.params

    const result = await pool.query(
      "SELECT * FROM dirigentes WHERE id = $1",
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Dirigente no encontrado" })
    }

    res.json(result.rows[0])
  }
)

//
// EDITAR DATOS DE UN DIRIGENTE (uso interno)
//
router.put("/dirigente/:id", verifyToken, authorizeRoles(1, 2, 5), validarIdDirigente, validarActualizarDirigenteRegistro, validar, async (req, res) => {
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
      rama,
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
         rama = $9,
         cargo_actual = $10,
         nivel_scout = $11,
         distrito = $12,
         archivo_ci_anverso = $13,
         archivo_ci_reverso = $14,
         archivo_croquis_domicilio = $15,
         archivo_safe_from_harm = $16,
         archivo_codigo_conducta = $17,
         archivo_certificado_no_violencia = $18,
         fecha_actualizacion = NOW()
       WHERE id = $19
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
        rama,
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
      `Dirigente: ${nombre}, Grupo: ${grupo}, Rama: ${rama || 'N/A'}, Distrito: ${distrito}`,
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
