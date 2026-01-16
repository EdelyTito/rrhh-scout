import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { sendEmail } from "../utils/email.js";
import { registrarLog } from "../utils/logger.js";
import { validarSeguimientoPublico, validarReincorporacion, validarEntrega, validarResultadoFinal, validarId} from "../middleware/validators/seguimiento.validators.js"
import { validar } from "../middleware/validators/index.js"

import { upload } from "../middleware/upload.js";
import { subirArchivoSupabase } from "../utils/supabaseUpload.js";

const router = express.Router();

const guardarArchivo = async ({ seguimientoId, entregaId, tipo, file }) => {
  const archivo = await subirArchivoSupabase(
    file,
    `seguimiento/${seguimientoId}/entregas/${entregaId}/${tipo}`
  );

  await pool.query(
    `INSERT INTO archivos_seguimiento
     (seguimiento_id, entrega_id, tipo, nombre_original, url)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      seguimientoId,
      entregaId,
      tipo,
      archivo.nombre_original,
      archivo.url
    ]
  );
};

const ESTADOS = {
  PRIMERA: "primera entrega",
  SEGUNDA: "segunda entrega",
  FINAL: "entrega final",
  ENTREVISTA: "en entrevista",
  DEVOLUCION_1: "devolución 1",
  DEVOLUCION_2: "devolución 2",
  APROBADO: "aprobado",
  NO_APROBO: "no aprobó",
  EN_PROCESO: "en proceso"
};


//
// RUTA PÚBLICA — Envío de formulario IM / Paxtu / Koodoo
//
router.post(
    "/public",
    upload.fields([
      { name: "cuadernillo", maxCount: 1 },
      { name: "cartaRespaldo", maxCount: 1 },
      { name: "certificados", maxCount: 10 },
      { name: "mediosVerificacion", maxCount: 10 },
      { name: "informesCursos", maxCount: 10 },
      { name: "informePractica", maxCount: 1 },
      { name: "formularioKoodoo", maxCount: 1 }
    ]),
    validarSeguimientoPublico,
    validar,
    async (req, res) => {

  try {

    const {
      nombre_participante,
      grupo,
      correo,
      rama_scout,
      tipo_im,
      observaciones,
      tipo_entrega
    } = req.body;

    if (!["primera", "segunda", "final"].includes(tipo_entrega)) {
      return res.status(400).json({
        error: "Tipo de entrega inválido"
      });
    }

    let estadoInicial = ESTADOS.PRIMERA;

    if (tipo_entrega === "segunda") estadoInicial = ESTADOS.SEGUNDA;
    if (tipo_entrega === "final") estadoInicial = ESTADOS.FINAL;

    let seguimientoId = null;

    const existente = await pool.query(
      `SELECT id FROM seguimiento 
      WHERE correo = $1 
        AND tipo_im = $2 
        AND resultado_final = $3
      ORDER BY fecha_creacion DESC
      LIMIT 1`,
      [correo, tipo_im, ESTADOS.EN_PROCESO]
    );

    if (existente.rows.length > 0) {
      seguimientoId = existente.rows[0].id;
    }

    if (!seguimientoId && tipo_entrega === "primera") {
      const resultSeg = await pool.query(
        `INSERT INTO seguimiento (
          nombre_participante, correo, grupo, rama_scout, tipo_im,
          observaciones_generales, estado, resultado_final,
          fecha_creacion, fecha_actualizacion
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW(), NOW())
        RETURNING id`,
        [
          nombre_participante,
          correo,
          grupo,
          rama_scout,
          tipo_im,
          observaciones,
          estadoInicial,
          ESTADOS.EN_PROCESO
        ]
      );
      seguimientoId = resultSeg.rows[0].id;
    }

    if (!seguimientoId && tipo_entrega !== "primera") {
      return res.status(400).json({
        error: "No existe una primera entrega registrada con este correo"
      });
    }

    if (seguimientoId && tipo_entrega !== "primera") {
      await pool.query(
        `UPDATE seguimiento
        SET estado = $1,
            observaciones_generales = $2,
            fecha_actualizacion = NOW()
        WHERE id = $3`,
        [estadoInicial, observaciones, seguimientoId]
      );
    }

    const entregaResult = await pool.query(
      `INSERT INTO entregas_seguimiento (
        seguimiento_id, etapa, observaciones, fecha
      )
      VALUES ($1, $2, $3, NOW())
      RETURNING id`,
      [
        seguimientoId,
        estadoInicial,
        `Entrega pública: ${tipo_entrega}`
      ]
    );

    const entregaId = entregaResult.rows[0].id;


    if (req.files?.cuadernillo) {
      await guardarArchivo({
        seguimientoId,
        entregaId,
        tipo: "cuadernillo",
        file: req.files.cuadernillo[0]
      });
    }

    if (req.files?.cartaRespaldo) {
      await guardarArchivo({
        seguimientoId,
        entregaId,
        tipo: "carta_respaldo",
        file: req.files.cartaRespaldo[0]
      });
    }

    if (req.files?.informePractica) {
      await guardarArchivo({
        seguimientoId,
        entregaId,
        tipo: "informe_practica",
        file: req.files.informePractica[0]
      });
    }

    if (req.files?.formularioKoodoo) {
      await guardarArchivo({
        seguimientoId,
        entregaId,
        tipo: "formulario_koodoo",
        file: req.files.formularioKoodoo[0]
      });
    }

    if (req.files?.certificados) {

      for (const file of req.files.certificados) {
        const archivo = await subirArchivoSupabase(
          file,
          `seguimiento/${seguimientoId}/entregas/${entregaId}/certificados`
        );

        await pool.query(
          `INSERT INTO archivos_seguimiento
          (seguimiento_id, entrega_id, tipo, nombre_original, url)
          VALUES ($1, $2, $3, $4, $5)`,
          [
            seguimientoId,
            entregaId,
            "certificado",
            archivo.nombre_original,
            archivo.url
          ]
        );
      }
    }

    if (req.files?.mediosVerificacion) {

      for (const file of req.files.mediosVerificacion) {
        const archivo = await subirArchivoSupabase(
          file,
          `seguimiento/${seguimientoId}/entregas/${entregaId}/medios_verificacion`
        );

        await pool.query(
          `INSERT INTO archivos_seguimiento
          (seguimiento_id, entrega_id, tipo, nombre_original, url)
          VALUES ($1, $2, $3, $4, $5)`,
          [
            seguimientoId,
            entregaId,
            "medio_verificacion",
            archivo.nombre_original,
            archivo.url
          ]
        );
      }
    }

    if (req.files?.informesCursos) {

      for (const file of req.files.informesCursos) {
        const archivo = await subirArchivoSupabase(
          file,
          `seguimiento/${seguimientoId}/entregas/${entregaId}/informes_cursos`
        );

        await pool.query(
          `INSERT INTO archivos_seguimiento
          (seguimiento_id, entrega_id, tipo, nombre_original, url)
          VALUES ($1, $2, $3, $4, $5)`,
          [
            seguimientoId,
            entregaId,
            "informe_curso",
            archivo.nombre_original,
            archivo.url
          ]
        );
      }
    }

    let asuntoCorreo = "";
    let contenidoCorreo = "";

    if (tipo_entrega === "primera") {
      asuntoCorreo = "Primera entrega recibida - Seguimiento Scout";
      contenidoCorreo = `
        <p>Hola ${nombre_participante},</p>
        <p>Hemos recibido correctamente tu <strong>primera entrega</strong> para el proceso <strong>${tipo_im}</strong>.</p>
        <p>El equipo de Recursos Adultos revisará tu documentación.</p>
        <p>Atentamente,<br><strong>Equipo RRAA – Distrito Scout La Paz</strong></p>
      `;
    }

    if (tipo_entrega === "segunda") {
      asuntoCorreo = "Segunda entrega recibida - Seguimiento Scout";
      contenidoCorreo = `
        <p>Hola ${nombre_participante},</p>
        <p>Confirmamos la recepción de tu <strong>segunda entrega (correcciones)</strong>.</p>
        <p>Tu documentación será revisada nuevamente.</p>
        <p>Atentamente,<br><strong>Equipo RRAA – Distrito Scout La Paz</strong></p>
      `;
    }

    if (tipo_entrega === "final") {
      asuntoCorreo = "Entrega final recibida - Seguimiento Scout";
      contenidoCorreo = `
        <p>Hola ${nombre_participante},</p>
        <p>Tu <strong>entrega final</strong> ha sido recibida correctamente.</p>
        <p>Nos comunicaremos contigo para informarte la <strong>fecha de tu entrevista</strong>.</p>
        <p>Atentamente,<br><strong>Equipo RRAA – Distrito Scout La Paz</strong></p>
      `;
    }

    if (correo && asuntoCorreo) {
      await sendEmail(correo, asuntoCorreo, contenidoCorreo);
    }

    res.status(201).json({
      message: "Formulario recibido exitosamente.",
      seguimiento_id: seguimientoId,
    });

  } catch (err) {
    console.error("Error al registrar formulario público:", err);
    res.status(500).json({ error: "Error al registrar formulario público" });
  }
});

//
// RUTA PÚBLICA — Reincorporación o Periodo de Prueba
//
router.post("/reincorporacion", validarReincorporacion, validar, async (req, res) => {
  try {
    const {
      nombre,
      grupo,
      tipo,
      motivo,
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
    console.error("Error al registrar reincorporación:", err);
    res.status(500).json({ error: "Error al registrar reincorporación" });
  }
});

// ESTADÍSTICAS PARA EL DASHBOARD
router.get("/estadisticas", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {
  
  const ejecutarConsulta = async (query, defaultValue = 0) => {
    try {
      const result = await pool.query(query)
      const count = result.rows[0]?.count || result.rows[0]?.total || result.rows[0]?.COUNT || defaultValue
      return parseInt(count) || defaultValue
    } catch (error) {
      console.warn(`Consulta fallida (${query.substring(0, 50)}...):`, error.message)
      return defaultValue
    }
  }

  try {
    console.log("Calculando estadísticas...")
    
    const totalSolicitudes = await ejecutarConsulta("SELECT COUNT(*) FROM seguimiento", 0)
    const aprobadosNivelII = await ejecutarConsulta("SELECT COUNT(*) FROM seguimiento WHERE tipo_im = 'IM2' AND resultado_final = 'aprobado'", 0)
    const aprobadosNivelIII = await ejecutarConsulta("SELECT COUNT(*) FROM seguimiento WHERE tipo_im = 'IM3' AND resultado_final = 'aprobado'", 0)
    const enProceso = await ejecutarConsulta(`
      SELECT COUNT(*) 
      FROM seguimiento 
      WHERE estado IN (
        'primera entrega',
        'devolución 1',
        'segunda entrega',
        'devolución 2',
        'entrega final',
        'en entrevista'
      )
    `)

    const pendientes = await ejecutarConsulta(`
      SELECT COUNT(*) 
      FROM seguimiento 
      WHERE estado = 'primera entrega'
    `)

    console.log("Estadísticas:", { totalSolicitudes, aprobadosNivelII, aprobadosNivelIII, enProceso, pendientes })

    res.json({
      success: true,
      stats: { totalSolicitudes, aprobadosNivelII, aprobadosNivelIII, enProceso, pendientes }
    })
    
  } catch (err) {
    console.error("Error general:", err)
    res.status(500).json({ 
      success: false, 
      error: "Error interno del servidor" 
    })
  }
})

//
// LISTAR REINCORPORACIONES
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
    console.error("Error al obtener reincorporaciones:", err);
    res.status(500).json({ error: "Error al obtener reincorporaciones" });
  }
});

//
//LISTAR TODOS LOS SEGUIMIENTOS
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
    console.error("Error al obtener seguimientos:", err);
    res.status(500).json({ error: "Error al obtener seguimientos" });
  }
});

//
//REGISTRAR NUEVA ENTREGA / DEVOLUCIÓN
//
router.post("/:id/entregas", verifyToken, authorizeRoles(1, 4, 7), validarId, validarEntrega, validar, async (req, res) => {
  try {
    const { id } = req.params;
    const { etapa, archivo_extra, observaciones } = req.body;

    const entrega = await pool.query(
      `INSERT INTO entregas_seguimiento (seguimiento_id, etapa, archivo_extra, observaciones)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id, etapa, archivo_extra, observaciones]
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
    console.error("Error al registrar entrega:", err);
    res.status(500).json({ error: "Error al registrar entrega" });
  }
});

//
//DETALLE DE SEGUIMIENTO (con entregas)
//
router.get("/:id", verifyToken, authorizeRoles(1, 4, 7), validarId, validar, async (req, res) => {
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
    console.error("Error al obtener detalle del seguimiento:", err);
    res.status(500).json({ error: "Error al obtener detalle del seguimiento" });
  }
});

//
//ELIMINAR UN SEGUIMIENTO (solo admin)
//
router.delete("/:id", verifyToken, authorizeRoles(1), validarId, validar, async (req, res) => {
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
    console.error("Error al eliminar seguimiento:", err);
    res.status(500).json({ error: "Error al eliminar seguimiento" });
  }
});


router.put("/:id/resultado", verifyToken, authorizeRoles(1, 4, 7),
  validarId, validarResultadoFinal, validar,
  async (req, res) => {
    try {
      const { id } = req.params
      const { resultado_final } = req.body

      const nuevoEstado =
        resultado_final === ESTADOS.APROBADO
          ? ESTADOS.APROBADO
          : ESTADOS.NO_APROBO

      const result = await pool.query(
        `UPDATE seguimiento
         SET resultado_final = $1,
             estado = $2,
             fecha_actualizacion = NOW()
         WHERE id = $3
         RETURNING *`,
        [resultado_final, nuevoEstado, id]
      )

      await registrarLog(
        req.user.id,
        "Finalizó proceso de seguimiento",
        "seguimiento",
        id,
        `Resultado final: ${resultado_final}`,
        req.user.rol_nombre
      )

      res.json(result.rows[0])
    } catch (err) {
      console.error("Error al actualizar resultado final:", err)
      res.status(500).json({ error: "Error al actualizar resultado final" })
    }
  }
)


export default router;
