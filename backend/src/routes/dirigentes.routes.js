import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { registrarLog } from "../utils/logger.js";

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
      ORDER BY d.id ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error al obtener dirigentes:", err);
    res.status(500).json({ error: "Error al obtener dirigentes" });
  }
});

//
// CREAR NUEVO DIRIGENTE
//
router.post("/", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const data = req.body || {};
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
      anios_servicio,
      grupo_anterior,
      fecha_ingreso,
      estado = "Activo",
      distrito,
      archivo_ci_anverso,
      archivo_ci_reverso,
      direccion_domicilio,
      archivo_croquis_domicilio,
      archivo_safe_from_harm,
      archivo_codigo_conducta,
      archivo_certificado_no_violencia,
    } = data;

    if (!nombre || !grupo) {
      return res.status(400).json({
        error: "Los campos 'nombre' y 'grupo' son obligatorios.",
      });
    }

    const result = await pool.query(
      `INSERT INTO dirigentes (
        nombre, ci, fecha_nacimiento, genero, telefono, correo, direccion,
        grupo, cargo_actual, nivel_scout, anios_servicio, grupo_anterior,
        fecha_ingreso, estado, fecha_actualizacion, id_usuario, distrito,
        archivo_ci_anverso, archivo_ci_reverso, direccion_domicilio,
        archivo_croquis_domicilio, archivo_safe_from_harm,
        archivo_codigo_conducta, archivo_certificado_no_violencia
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,$12,
        $13,$14,NOW(),$15,$16,
        $17,$18,$19,
        $20,$21,$22,$23
      )
      RETURNING *`,
      [
        nombre, ci, fecha_nacimiento, genero, telefono, correo, direccion,
        grupo, cargo_actual, nivel_scout, anios_servicio, grupo_anterior,
        fecha_ingreso, estado, req.user.id, distrito,
        archivo_ci_anverso, archivo_ci_reverso, direccion_domicilio,
        archivo_croquis_domicilio, archivo_safe_from_harm,
        archivo_codigo_conducta, archivo_certificado_no_violencia,
      ]
    );

    const nuevoDirigente = result.rows[0];

    await registrarLog(
      req.user.id,
      "Creó un nuevo dirigente",
      "dirigentes",
      nuevoDirigente.id,
      `Dirigente: ${nombre}, Grupo: ${grupo}, Estado: ${estado}, Distrito: ${distrito}`
    );

    res.status(201).json(nuevoDirigente);
  } catch (err) {
    console.error("❌ Error al crear dirigente:", err);
    res.status(500).json({ error: "Error interno al crear dirigente" });
  }
});

//
// ACTUALIZAR DIRIGENTE EXISTENTE
//
router.put("/:id", verifyToken, authorizeRoles(1, 2, 5), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body || {};
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
      anios_servicio,
      grupo_anterior,
      fecha_ingreso,
      estado,
      distrito,
      archivo_ci_anverso,
      archivo_ci_reverso,
      direccion_domicilio,
      archivo_croquis_domicilio,
      archivo_safe_from_harm,
      archivo_codigo_conducta,
      archivo_certificado_no_violencia,
    } = data;

    if (!nombre) {
      return res.status(400).json({ error: "El campo 'nombre' es obligatorio" });
    }

    const result = await pool.query(
      `UPDATE dirigentes SET
        nombre=$1, ci=$2, fecha_nacimiento=$3, genero=$4, telefono=$5, correo=$6,
        direccion=$7, grupo=$8, cargo_actual=$9, nivel_scout=$10,
        anios_servicio=$11, grupo_anterior=$12, fecha_ingreso=$13,
        estado=$14, fecha_actualizacion=NOW(), distrito=$15,
        archivo_ci_anverso=$16, archivo_ci_reverso=$17,
        direccion_domicilio=$18, archivo_croquis_domicilio=$19,
        archivo_safe_from_harm=$20, archivo_codigo_conducta=$21,
        archivo_certificado_no_violencia=$22
      WHERE id=$23
      RETURNING *`,
      [
        nombre, ci, fecha_nacimiento, genero, telefono, correo,
        direccion, grupo, cargo_actual, nivel_scout,
        anios_servicio, grupo_anterior, fecha_ingreso,
        estado, distrito,
        archivo_ci_anverso, archivo_ci_reverso,
        direccion_domicilio, archivo_croquis_domicilio,
        archivo_safe_from_harm, archivo_codigo_conducta,
        archivo_certificado_no_violencia,
        id,
      ]
    );

    const dirigenteActualizado = result.rows[0];

    await registrarLog(
      req.user.id,
      "Actualizó datos de un dirigente",
      "dirigentes",
      id,
      `Actualización de: ${nombre}, Estado: ${estado}, Distrito: ${distrito}`
    );

    res.json(dirigenteActualizado);
  } catch (err) {
    console.error("❌ Error al actualizar dirigente:", err);
    res.status(500).json({ error: "Error interno al actualizar dirigente" });
  }
});

//
// ELIMINAR DIRIGENTE
//
router.delete("/:id", verifyToken, authorizeRoles(1), async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM dirigentes WHERE id=$1", [id]);

    await registrarLog(
      req.user.id,
      "Eliminó un dirigente",
      "dirigentes",
      id,
      "Registro eliminado por administrador"
    );

    res.json({ message: "Dirigente eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar dirigente:", err);
    res.status(500).json({ error: "Error interno al eliminar dirigente" });
  }
});

export default router;
