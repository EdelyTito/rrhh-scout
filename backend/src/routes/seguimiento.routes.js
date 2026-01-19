import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { sendEmail } from "../utils/email.js";
import { registrarLog } from "../utils/logger.js";
import { validarSeguimientoPublico, validarEntrega, validarResultadoFinal, validarId} from "../middleware/validators/seguimiento.validators.js"
import { validar } from "../middleware/validators/index.js"
import multer from "multer";

const router = express.Router();

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

const TIPOS_UNICOS = [
  "cuadernillo",
  "carta_respaldo",
  "informe_practica",
  "formulario_koodoo"
]

const upload = multer({storage: multer.memoryStorage() });

//
// RUTA PÚBLICA — Envío de formulario IM / Paxtu / Koodoo
//
router.post(
  "/public",
  validarSeguimientoPublico,
  validar,
  async (req, res) => {
    try {
      const {
        nombre_participante,
        correo,
        grupo,
        rama_scout,
        tipo_im,
        tipo_proceso,
        observaciones,
        tipo_entrega
      } = req.body;

      let estadoInicial = 
        tipo_entrega === "segunda" ? "segunda entrega" :
        tipo_entrega === "final" ? "entrega final" :
        "primera entrega";

      const existente = await pool.query(
        `SELECT id FROM seguimiento
         WHERE correo=$1 AND tipo_im=$2 AND resultado_final='en proceso'
         ORDER BY fecha_creacion DESC LIMIT 1`,
        [correo, tipo_im]
      );

      let seguimientoId;
      let nombreFinal = nombre_participante
      let grupoFinal = grupo

      if (existente.rowCount > 0) {
        seguimientoId = existente.rows[0].id

        const datos = await pool.query(
          `SELECT nombre_participante, grupo
          FROM seguimiento
          WHERE id = $1`,
          [seguimientoId]
        )

        nombreFinal = datos.rows[0]?.nombre_participante
        grupoFinal = datos.rows[0]?.grupo
      } else {
        const seg = await pool.query(
          `INSERT INTO seguimiento
          (nombre_participante, correo, grupo, rama_scout, tipo_im, tipo_proceso,
          observaciones_generales, estado, resultado_final)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'en proceso')
          RETURNING id`,
          [
            nombre_participante,
            correo,
            grupo,
            rama_scout,
            tipo_im,
            tipo_proceso,
            observaciones,
            estadoInicial
          ]
        )

        seguimientoId = seg.rows[0].id
      }

      const existeEntrega = await pool.query(
        `SELECT 1 FROM entregas_seguimiento
        WHERE seguimiento_id = $1 AND etapa = $2`,
        [seguimientoId, estadoInicial]
      )

      if (existeEntrega.rowCount > 0) {
        return res.status(400).json({
          error: `Ya existe una ${estadoInicial} para este seguimiento`
        })
      }

      const entrega = await pool.query(
        `INSERT INTO entregas_seguimiento
        (seguimiento_id, etapa, observaciones)
        VALUES ($1,$2,$3)
        RETURNING id`,
        [seguimientoId, estadoInicial, `Entrega ${tipo_entrega}`]
      );

      await pool.query(
        `UPDATE seguimiento
        SET estado = $1,
            fecha_actualizacion = NOW()
        WHERE id = $2`,
        [estadoInicial, seguimientoId]
      )

      const asunto =
        estadoInicial === "primera entrega"
          ? "Primera entrega recibida – Recursos Adultos"
          : estadoInicial === "segunda entrega"
          ? "Segunda entrega recibida – Recursos Adultos"
          : "Entrega final recibida – Recursos Adultos"

      const mensaje = `
        <p>Hola <strong>${nombreFinal}</strong>,</p>

        <p>
        Te confirmamos que hemos recibido correctamente tu 
        <strong>${estadoInicial}</strong> correspondiente al proceso de 
        <strong>${tipo_im}</strong>.
        </p>

        <p>
        <b>Correo registrado:</b> ${correo}<br>
        <b>Grupo Scout:</b> ${grupoFinal}
        </p>

        <p>
        La Comisión de Seguimiento revisará la documentación enviada.
        En caso de existir observaciones o requerir información adicional,
        nos pondremos en contacto contigo por este medio.
        </p>

        <p>
        Un apretón de mano izquierda,<br>
        <b>Coordinación de Recursos Adultos</b><br>
        Distrito Scout La Paz
        </p>`

      await sendEmail(correo, asunto, mensaje)

      res.status(201).json({
        seguimiento_id: seguimientoId,
        entrega_id: entrega.rows[0].id
      });

    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error al crear seguimiento" });
    }
  }
);

// POST /api/seguimiento/archivo
router.post("/archivo", async (req, res) => {
  try {
    const {
      seguimiento_id,
      entrega_id,
      tipo_documento,
      nombre_archivo,
      mime_type,
      archivo_base64
    } = req.body

    if (
      !seguimiento_id ||
      !entrega_id ||
      !tipo_documento ||
      !archivo_base64
    ) {
      return res.status(400).json({ error: "Datos incompletos" })
    }

    const buffer = Buffer.from(archivo_base64, "base64")

    if (TIPOS_UNICOS.includes(tipo_documento)) {
      const yaExiste = await pool.query(
        `SELECT 1 FROM archivos_seguimiento
        WHERE entrega_id = $1 AND tipo = $2`,
        [entrega_id, tipo_documento]
      )

      if (yaExiste.rowCount > 0) {
        return res.status(409).json({
          error: `El archivo ${tipo_documento} ya fue subido`
        })
      }
    }

    await pool.query(
      `INSERT INTO archivos_seguimiento
      (seguimiento_id, entrega_id, tipo, nombre_archivo, mime_type, archivo)
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        seguimiento_id,
        entrega_id,
        tipo_documento,
        nombre_archivo,
        mime_type,
        buffer
      ]
    )

    res.json({ ok: true })

  } catch (err) {
    console.error("ERROR ARCHIVO SEGUIMIENTO:", err)
    res.status(500).json({ error: "Error al subir archivo" })
  }
});

router.get(
  "/:id/detalle-completo",
  verifyToken,
  authorizeRoles(1, 4, 7),
  validarId,
  validar,
  async (req, res) => {
    try {
      const { id } = req.params

      const seguimiento = await pool.query(
        `SELECT * FROM seguimiento WHERE id = $1`,
        [id]
      )

      if (seguimiento.rowCount === 0)
        return res.status(404).json({ error: "Seguimiento no encontrado" })

      const entregas = await pool.query(`
        SELECT 
          e.id,
          e.etapa,
          e.observaciones,
          e.fecha,
          COALESCE(
            json_agg(
              json_build_object(
                'id', a.id,
                'tipo', a.tipo,
                'nombre', a.nombre_archivo,
                'mime', a.mime_type,
                'fecha', a.fecha_subida
              )
            ) FILTER (WHERE a.id IS NOT NULL),
            '[]'
          ) AS archivos
        FROM entregas_seguimiento e
        LEFT JOIN archivos_seguimiento a
          ON a.entrega_id = e.id
        WHERE e.seguimiento_id = $1
        GROUP BY e.id
        ORDER BY e.fecha ASC
      `, [id])

      res.json({
        seguimiento: seguimiento.rows[0],
        entregas: entregas.rows
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error al obtener detalle completo" })
    }
  }
)

router.put('/:id/estado', verifyToken, authorizeRoles(1,4,7), async (req, res) => {
  const { id } = req.params
  const { estado } = req.body

  await pool.query(
    `UPDATE seguimiento SET estado=$1, fecha_actualizacion=NOW() WHERE id=$2`,
    [estado, id]
  )

  res.json({ ok: true })
})

// DESCARGAR / VER ARCHIVO
router.get(
  "/archivo/:id",
  verifyToken,
  authorizeRoles(1, 4, 7),
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(
        `SELECT nombre_archivo, mime_type, archivo
         FROM archivos_seguimiento
         WHERE id = $1`,
        [id]
      )

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Archivo no encontrado" })
      }

      const file = result.rows[0]

      res.setHeader("Content-Type", file.mime_type)
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${file.nombre_archivo}"`
      )

      res.send(file.archivo)
    } catch (err) {
      console.error("Error al descargar archivo:", err)
      res.status(500).json({ error: "Error al descargar archivo" })
    }
  }
)

router.post(
  "/:id/devolver",
  verifyToken,
  authorizeRoles(1, 4, 7),
  upload.array("archivos"),
  async (req, res) => {
    const { id } = req.params
    const { observaciones } = req.body

    const seg = await pool.query(
      `SELECT * FROM seguimiento WHERE id = $1`,
      [id]
    )

    const estadoNuevo =
      seg.rows[0].estado === "primera entrega"
        ? "devolución 1"
        : "devolución 2"

    // Guardar devolución (SIN archivos)
    await pool.query(
      `INSERT INTO entregas_seguimiento
       (seguimiento_id, etapa, observaciones)
       VALUES ($1,$2,$3)`,
      [id, estadoNuevo, observaciones]
    )

    await pool.query(
      `UPDATE seguimiento
       SET estado=$1, fecha_actualizacion=NOW()
       WHERE id=$2`,
      [estadoNuevo, id]
    )

    // Preparar adjuntos
    const attachments = (req.files || []).map(file => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    }))

    const mensaje = `
      <p>Hola <strong>${seg.rows[0].nombre_participante}</strong>,</p>

      <p>
        Tras la revisión de tu documentación, se realizaron las siguientes observaciones:
      </p>

      <blockquote>${observaciones}</blockquote>

      <p>
        Adjuntamos los documentos revisados para que puedas realizar las correcciones
        correspondientes y reenviarlos en la siguiente entrega.
      </p>

      <p>
        Un apretón de mano izquierda,<br>
        <b>Comisión de Seguimiento – Recursos Adultos</b><br>
        Distrito Scout La Paz
      </p>
    `

    await sendEmail(
      seg.rows[0].correo,
      "Observaciones a tu documentación – Recursos Adultos",
      mensaje,
      attachments
    )

    res.json({ ok: true })
  }
)


//
// RUTA PÚBLICA — Reincorporación o Periodo de Prueba
//
router.post(
  '/periodos-prueba-reincorporaciones/public',
  async (req, res) => {
    try {
      const {
        nombre,
        ci,
        grupo,
        tipo,
        fecha_inicio,
        fecha_fin,
        motivo,
        telefono,
        correo
      } = req.body

      const result = await pool.query(
        `INSERT INTO periodos_prueba_reincorporaciones
        (nombre, ci, grupo, tipo, fecha_inicio, fecha_fin, motivo, telefono, correo)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING id`,
        [
          nombre,
          ci,
          grupo,
          tipo,
          fecha_inicio,
          fecha_fin || null,
          motivo || null,
          telefono,
          correo
        ]
      )

      res.status(201).json({ periodo_id: result.rows[0].id })

    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al registrar dirigente' })
    }
  }
)

// POST /api/seguimiento/periodos-prueba-reincorporaciones/archivo
router.post(
  '/periodos-prueba-reincorporaciones/archivo',
  async (req, res) => {
    try {
      const {
        periodo_id,
        tipo_documento,
        nombre_archivo,
        mime_type,
        archivo_base64
      } = req.body

      if (!periodo_id || !tipo_documento || !archivo_base64) {
        return res.status(400).json({ error: 'Datos incompletos' })
      }

      const buffer = Buffer.from(archivo_base64, 'base64')

      await pool.query(
        `INSERT INTO documentos_prueba_reincorporacion
        (registro_id, tipo, nombre_archivo, mime_type, archivo)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          periodo_id,
          tipo_documento,
          nombre_archivo,
          mime_type,
          buffer
        ]
      )

      res.json({ ok: true })

    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al subir archivo' })
    }
  }
)

// ESTADÍSTICAS PARA EL DASHBOARD
router.get("/estadisticas", verifyToken, authorizeRoles(1, 4, 7), async (req, res) => {

  const ejecutar = async (sql) => {
    const r = await pool.query(sql)
    return parseInt(r.rows[0].count || 0)
  }

  try {
    console.log("Calculando estadísticas aprobadas...")

    const im2 = await ejecutar(`
      SELECT COUNT(*) FROM seguimiento
      WHERE tipo_im = 'IM2' AND estado = 'aprobado'
    `)

    const im3 = await ejecutar(`
      SELECT COUNT(*) FROM seguimiento
      WHERE tipo_im = 'IM3' AND estado = 'aprobado'
    `)

    const paxtuGrupo = await ejecutar(`
      SELECT COUNT(*) FROM seguimiento
      WHERE tipo_im = 'Paxtu Grupo' AND estado = 'aprobado'
    `)

    const paxtuDistrito = await ejecutar(`
      SELECT COUNT(*) FROM seguimiento
      WHERE tipo_im = 'Paxtu Distrito' AND estado = 'aprobado'
    `)

    const koodooAdjunto = await ejecutar(`
      SELECT COUNT(*) FROM seguimiento
      WHERE tipo_im = 'Koodoo Formación' AND estado = 'aprobado'
    `)

    const koodooDirector = await ejecutar(`
      SELECT COUNT(*) FROM seguimiento
      WHERE tipo_im = 'Koodoo Director' AND estado = 'aprobado'
    `)

    const periodosPrueba = await ejecutar(`
      SELECT COUNT(*) FROM periodos_prueba_reincorporaciones
      WHERE tipo = 'periodo de prueba'
    `)

    const reincorporaciones = await ejecutar(`
      SELECT COUNT(*) FROM periodos_prueba_reincorporaciones
      WHERE tipo = 'reincorporacion'
    `)

    const stats = {
      im2,
      im3,
      paxtuGrupo,
      paxtuDistrito,
      koodooAdjunto,
      koodooDirector,
      periodosPrueba,
      reincorporaciones
    }

    console.log("Estadísticas:", stats)

    res.json({ success: true, stats })

  } catch (err) {
    console.error("Error estadísticas:", err)
    res.status(500).json({ success: false })
  }
})

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

// LISTAR periodos de prueba y reincorporaciones
router.get(
  '/periodos-prueba-reincorporaciones',
  verifyToken,
  authorizeRoles(1, 4, 7),
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT *
        FROM periodos_prueba_reincorporaciones
        ORDER BY fecha_envio DESC
      `)

      res.json(result.rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener registros' })
    }
  }
)

// DETALLE periodo de prueba / reincorporación
router.get(
  '/periodos-prueba-reincorporaciones/:id',
  verifyToken,
  authorizeRoles(1, 4, 7),
  async (req, res) => {
    try {
      const { id } = req.params

      const registro = await pool.query(
        `SELECT *
         FROM periodos_prueba_reincorporaciones
         WHERE id = $1`,
        [id]
      )

      if (registro.rowCount === 0) {
        return res.status(404).json({ error: 'Registro no encontrado' })
      }

      const archivos = await pool.query(
        `SELECT id, tipo, nombre_archivo, mime_type
         FROM documentos_prueba_reincorporacion
         WHERE registro_id = $1
         ORDER BY fecha_subida ASC`,
        [id]
      )

      res.json({
        registro: registro.rows[0],
        archivos: archivos.rows
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error al obtener detalle' })
    }
  }
)

// DESCARGAR DOCUMENTO PERIODO DE PRUEBA / REINCORPORACION
router.get(
  '/periodos-prueba-reincorporaciones/archivo/:id',
  verifyToken,
  authorizeRoles(1, 4, 7),
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(
        `SELECT nombre_archivo, mime_type, archivo
         FROM documentos_prueba_reincorporacion
         WHERE id = $1`,
        [id]
      )

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Archivo no encontrado' })
      }

      const file = result.rows[0]

      res.setHeader('Content-Type', file.mime_type)
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${file.nombre_archivo}"`
      )

      res.send(file.archivo)

    } catch (err) {
      console.error('Error al descargar documento PP:', err)
      res.status(500).json({ error: 'Error al descargar documento' })
    }
  }
)

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
