import express from "express";
import multer from "multer";
import { pool } from "../config/db.js";

const router = express.Router();

// configuración básica de multer
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// SUBIR DOCUMENTO
router.post(
  "/",
  upload.single("archivo"),
  async (req, res) => {
    try {
      const { solicitud_id, tipo_documento } = req.body;
      const archivo = req.file;

      if (!solicitud_id || !tipo_documento || !archivo) {
        return res.status(400).json({ error: "Datos incompletos" });
      }

      await pool.query(
        `INSERT INTO documentos_dirigente (
          solicitud_id,
          tipo_documento,
          nombre_archivo,
          mime_type,
          archivo
        ) VALUES ($1,$2,$3,$4,$5)`,
        [
          solicitud_id,
          tipo_documento,
          archivo.originalname,
          archivo.mimetype,
          archivo.buffer
        ]
      );

      res.status(201).json({ message: "Documento subido correctamente" });

    } catch (err) {
      console.error("Error al subir documento:", err);
      res.status(500).json({ error: "Error al subir documento" });
    }
  }
);

export default router;
