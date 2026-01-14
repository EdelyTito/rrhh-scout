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
        nombre_completo,
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
          nombre_completo, ci, fecha_nacimiento, genero,
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
          nombre_completo,
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
        `Dirigente: ${nombre_completo}`
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
      const { id } = req.params

      const {
        nombre_completo,
        ci,
        fecha_nacimiento,
        genero,
        telefono,
        correo,
        grupo,
        rama,
        anios_servicio,
        grupo_anterior,
        distrito,

        cargo_distrital,
        cargo_grupo_1,
        cargo_grupo_2,
        cargo_grupo_3,

        programa_jovenes,
        formador_lideres,
        gestion_institucional,

        estado
      } = req.body

      const result = await pool.query(
        `
        UPDATE dirigentes SET
          nombre_completo=$1,
          ci=$2,
          fecha_nacimiento=$3,
          genero=$4,
          telefono=$5,
          correo=$6,
          grupo=$7,
          rama=$8,
          anios_servicio=$9,
          grupo_anterior=$10,
          distrito=$11,

          cargo_distrital=$12,
          cargo_grupo_1=$13,
          cargo_grupo_2=$14,
          cargo_grupo_3=$15,

          programa_jovenes=$16,
          formador_lideres=$17,
          gestion_institucional=$18,

          estado=$19,
          fecha_actualizacion=NOW()
        WHERE id=$20
        RETURNING *
        `,
        [
          nombre_completo,
          ci,
          fecha_nacimiento,
          genero,
          telefono,
          correo,
          grupo,
          rama,
          anios_servicio,
          grupo_anterior,
          distrito,

          cargo_distrital,
          cargo_grupo_1,
          cargo_grupo_2,
          cargo_grupo_3,

          programa_jovenes,
          formador_lideres,
          gestion_institucional,

          estado,
          id
        ]
      )

      res.json(result.rows[0])
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error al actualizar dirigente" })
    }
  }
)

export default router;
