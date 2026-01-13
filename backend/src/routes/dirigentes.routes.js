import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { registrarLog } from "../utils/logger.js";
import { validarCrearDirigente, validarActualizarDirigente, validarIdDirigente } from "../middleware/validators/dirigentes.validators.js";
import { validar } from "../middleware/validators/index.js";

const router = express.Router();

//
// OBTENER TODOS LOS DIRIGENTES
//
router.get("/", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, u.nombre AS creado_por
      FROM dirigentes d
      LEFT JOIN usuarios u ON d.id_usuario = u.id
      ORDER BY d.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener dirigentes" });
  }
});

// DETALLE COMPLETO DE DIRIGENTE (CON DOCUMENTOS)
router.get("/:id/detalle", async (req, res) => {
  try {
    const { id } = req.params;

    const dirigenteRes = await pool.query(
      `SELECT * FROM dirigentes WHERE id = $1`,
      [id]
    );

    if (!dirigenteRes.rowCount) {
      return res.status(404).json({ error: "Dirigente no encontrado" });
    }

    const documentosRes = await pool.query(
      `SELECT * FROM documentos_dirigente WHERE dirigente_id = $1`,
      [id]
    );

    res.json({
      dirigente: dirigenteRes.rows[0],
      documentos: documentosRes.rows
    });
  } catch (error) {
    console.error("Error detalle dirigente:", error);
    res.status(500).json({ error: "Error al obtener detalle del dirigente" });
  }
});

//
// CREAR NUEVO DIRIGENTE
//
router.post(
  "/",
  verifyToken,
  authorizeRoles(1),
  validarCrearDirigente,
  validar,
  async (req, res) => {
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
        anios_servicio,
        grupo_anterior,
        fecha_ingreso,
        estado = "Habilitado",
        distrito
      } = req.body;

      const result = await pool.query(
        `INSERT INTO dirigentes (
          nombre, ci, fecha_nacimiento, genero,
          telefono, correo, direccion,
          grupo, rama, cargo_actual, nivel_scout,
          anios_servicio, grupo_anterior,
          fecha_ingreso, estado,
          fecha_actualizacion, id_usuario, distrito
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,
          $8,$9,$10,$11,$12,
          $13,$14,$15,NOW(),$16,$17
        )
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
          anios_servicio,
          grupo_anterior,
          fecha_ingreso,
          estado,
          req.user.id,
          distrito
        ]
      );

      await registrarLog(
        req.user.id,
        "Creó dirigente manualmente",
        "dirigentes",
        result.rows[0].id,
        `Dirigente: ${nombre}`
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al crear dirigente" });
    }
  }
);

//
// ACTUALIZAR DIRIGENTE EXISTENTE
//
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(1, 2, 5),
  validarActualizarDirigente,
  validar,
  async (req, res) => {
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
        anios_servicio,
        grupo_anterior,
        fecha_ingreso,
        estado,
        distrito
      } = req.body;

      const result = await pool.query(
        `UPDATE dirigentes SET
          nombre=$1,
          ci=$2,
          fecha_nacimiento=$3,
          genero=$4,
          telefono=$5,
          correo=$6,
          direccion=$7,
          grupo=$8,
          rama=$9,
          cargo_actual=$10,
          nivel_scout=$11,
          anios_servicio=$12,
          grupo_anterior=$13,
          fecha_ingreso=$14,
          estado=$15,
          distrito=$16,
          fecha_actualizacion=NOW()
        WHERE id=$17
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
          anios_servicio,
          grupo_anterior,
          fecha_ingreso,
          estado,
          distrito,
          id
        ]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al actualizar dirigente" });
    }
  }
);

export default router;
