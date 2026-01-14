import express from "express"
import multer from "multer"
import { pool } from "../config/db.js"

const router = express.Router()

// ===============================
// CONFIGURACIÓN MULTER
// ===============================
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      "application/pdf",
      "image/jpeg",
      "image/png"
    ]

    if (!tiposPermitidos.includes(file.mimetype)) {
      return cb(
        new Error("Formato de archivo no permitido"),
        false
      )
    }

    cb(null, true)
  }
})

const tiposUnicos = [
  "CI_ANVERSO",
  "CI_REVERSO",
  "CROQUIS_DOMICILIO",
  "SAFE_FROM_HARM",
  "CODIGO_CONDUCTA",
  "CERTIFICADO_NO_VIOLENCIA",
  "VALORACION_PERFIL"
]

// ===============================
// SUBIR DOCUMENTO
// ===============================
router.post(
  "/",
  upload.single("archivo"),
  async (req, res) => {
    const client = await pool.connect()

    try {
      const { solicitud_id, dirigente_id, tipo_documento } = req.body
      const archivo = req.file

      if (!solicitud_id && !dirigente_id || !tipo_documento || !archivo) {
        return res.status(400).json({
          error: "Debe enviar solicitud_id o dirigente_id, tipo_documento y archivo"
        })
      }

      // Tipos válidos de documentos
      const tiposValidos = [
      // Registro administrativo
      "CI_ANVERSO",
      "CI_REVERSO",
      "CROQUIS_DOMICILIO",
      "SAFE_FROM_HARM",
      "CODIGO_CONDUCTA",

      // Formación / requisitos
      "CERTIFICADO_FORMACION",
      "CERTIFICADO_NO_VIOLENCIA",
      "VALORACION_PERFIL"
    ]

      if (!tiposValidos.includes(tipo_documento)) {
        return res.status(400).json({
          error: "Tipo de documento no válido"
        })
      }

      await client.query("BEGIN")

      if (tiposUnicos.includes(tipo_documento)) {
        if (dirigente_id) {
          await client.query(
            `DELETE FROM documentos_dirigente
            WHERE dirigente_id = $1
              AND tipo_documento = $2`,
            [dirigente_id, tipo_documento]
          )
        }

        if (solicitud_id) {
          await client.query(
            `DELETE FROM documentos_dirigente
            WHERE solicitud_id = $1
              AND tipo_documento = $2`,
            [solicitud_id, tipo_documento]
          )
        }
      }

      await client.query(
        `INSERT INTO documentos_dirigente (
          solicitud_id,
          dirigente_id,
          tipo_documento,
          nombre_archivo,
          mime_type,
          archivo,
          fecha_subida
        ) VALUES ($1,$2,$3,$4,$5,$6,NOW())`,
        [
          solicitud_id || null,
          dirigente_id || null,
          tipo_documento,
          archivo.originalname,
          archivo.mimetype,
          archivo.buffer
        ]
      )

      await client.query("COMMIT")

      return res.status(201).json({
        message: "Documento subido correctamente"
      })

    } catch (err) {
      await client.query("ROLLBACK")

      console.error("Error al subir documento:", err.message)

      // Error de multer
      if (err.message.includes("Formato de archivo")) {
        return res.status(400).json({ error: err.message })
      }

      return res.status(500).json({
        error: "Error al subir documento"
      })

    } finally {
      client.release()
    }
  }
)

// OBTENER DOCUMENTOS POR SOLICITUD
router.get(
  "/solicitud/:id",
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(
        `SELECT id, tipo_documento, nombre_archivo, fecha_subida
         FROM documentos_dirigente
         WHERE solicitud_id = $1
         ORDER BY fecha_subida ASC`,
        [id]
      )

      res.json(result.rows)

    } catch (err) {
      console.error("Error al obtener documentos:", err)
      res.status(500).json({ error: "Error al obtener documentos" })
    }
  }
)

router.get(
  "/dirigente/:id",
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, tipo_documento, nombre_archivo, fecha_subida
         FROM documentos_dirigente
         WHERE dirigente_id = $1
         ORDER BY fecha_subida ASC`,
        [req.params.id]
      )

      res.json(result.rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error al obtener documentos" })
    }
  }
)

// DESCARGAR DOCUMENTO
router.get(
  "/:id/descargar",
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(
        `SELECT nombre_archivo, mime_type, archivo
         FROM documentos_dirigente
         WHERE id = $1`,
        [id]
      )

      if (!result.rowCount) {
        return res.status(404).json({ error: "Documento no encontrado" })
      }

      const doc = result.rows[0]

      res.setHeader(
        "Content-Disposition",
        `inline; filename="${doc.nombre_archivo}"`
      )
      res.setHeader("Content-Type", doc.mime_type)

      res.send(doc.archivo)

    } catch (err) {
      console.error("Error al descargar documento:", err)
      res.status(500).json({ error: "Error al descargar documento" })
    }
  }
)

export default router
