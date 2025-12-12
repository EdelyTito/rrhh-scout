import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { registrarLog } from "../utils/logger.js";

const router = express.Router();
const ROLES_FORM = [1, 3, 6]; // 1=admin, 3=resp_form, 6=sub_form

//
// CURSOS
//
router.get("/cursos", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.nombre AS creado_por
      FROM cursos c
      JOIN usuarios u ON c.responsable_id = u.id
      ORDER BY c.id DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener cursos:", err);
    res.status(500).json({ error: "Error al obtener cursos" });
  }
});

router.get("/cursos/:id", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT c.*, u.nombre AS creado_por
      FROM cursos c
      LEFT JOIN usuarios u ON c.responsable_id = u.id
      WHERE c.id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener curso:", err);
    res.status(500).json({ error: "Error al obtener curso" });
  }
});

router.put("/cursos/:id", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      modalidad,
      lugar,
      cupo,
    } = req.body || {};

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: "El nombre y la descripción son obligatorios" });
    }

    const cursoExist = await pool.query("SELECT id FROM cursos WHERE id = $1", [id]);
    if (cursoExist.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const result = await pool.query(
      `
      UPDATE cursos
      SET nombre = $1,
          descripcion = $2,
          fecha_inicio = $3,
          fecha_fin = $4,
          modalidad = $5,
          lugar = $6,
          cupo = $7
      WHERE id = $8
      RETURNING *
      `,
      [nombre, descripcion, fecha_inicio, fecha_fin, modalidad, lugar, cupo, id]
    );

    await registrarLog(
      req.user.id,
      "Actualizó curso de formación",
      "cursos",
      id,
      `Curso actualizado: ${nombre}`,
      req.user.rol_nombre
    );

    res.json({ message: "Curso actualizado correctamente", curso: result.rows[0] });
  } catch (err) {
    console.error("Error al actualizar curso:", err);
    res.status(500).json({ error: "Error interno al actualizar curso" });
  }
});

router.post("/cursos", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const data = req.body || {};
    const {
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin,
      modalidad,
      lugar,
      cupo,
    } = data;

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: "El nombre y la descripción son obligatorios" });
    }

    const responsableId = req.user?.id;
    if (!responsableId) {
      return res.status(401).json({ error: "Token inválido o usuario no autenticado" });
    }

    const result = await pool.query(
      `INSERT INTO cursos (nombre, descripcion, fecha_inicio, fecha_fin, modalidad, lugar, cupo, responsable_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [nombre, descripcion, fecha_inicio, fecha_fin, modalidad, lugar, cupo, responsableId]
    );

    const curso = result.rows[0];
    await registrarLog(responsableId, "Creó un nuevo curso", "cursos", curso.id, `Curso: ${nombre}`);
    res.status(201).json({ id: curso.id, message: "Curso creado correctamente", curso });
  } catch (err) {
    console.error("Error al crear curso:", err);
    res.status(500).json({ error: "Error interno al crear curso" });
  }
});

//
// 🧩 MÓDULOS DEL CURSO
//
router.get("/cursos/:cursoId/modulos", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { cursoId } = req.params;
    const curso = await pool.query("SELECT id, nombre FROM cursos WHERE id = $1", [cursoId]);
    if (curso.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const result = await pool.query(
      `
      SELECT m.*
      FROM modulos_curso m
      WHERE m.curso_id = $1
      ORDER BY m.id ASC
      `,
      [cursoId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener módulos:", err);
    res.status(500).json({ error: "Error al obtener módulos" });
  }
});

router.post("/cursos/:cursoId/modulos", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { cursoId } = req.params;
    const data = req.body || {};
    const { titulo, descripcion, duracion_horas } = data;

    if (!titulo || !duracion_horas) {
      return res.status(400).json({ error: "Debe especificar título y duración del módulo" });
    }

    const curso = await pool.query("SELECT id FROM cursos WHERE id=$1", [cursoId]);
    if (curso.rowCount === 0) return res.status(404).json({ error: "Curso no encontrado" });

    const result = await pool.query(
      `INSERT INTO modulos_curso (curso_id, titulo, descripcion, duracion_horas)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [cursoId, titulo, descripcion, duracion_horas]
    );

    await registrarLog(
      req.user.id,
      "Creó módulo de curso",
      "modulos_curso",
      result.rows[0].id,
      `Curso ${cursoId} - ${titulo}`
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear módulo:", err);
    res.status(500).json({ error: "Error interno al crear módulo" });
  }
});

//
// 🟣 ASISTENCIAS
//
router.get("/modulos/:moduloId/asistencias", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { moduloId } = req.params;

    const modulo = await pool.query("SELECT id, titulo FROM modulos_curso WHERE id = $1", [moduloId]);
    if (modulo.rowCount === 0) {
      return res.status(404).json({ error: "Módulo no encontrado" });
    }

    const result = await pool.query(
      `
      SELECT a.*
      FROM asistencias a
      WHERE a.modulos_curso_id = $1
      ORDER BY a.id ASC
      `,
      [moduloId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener asistencias:", err);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
});

router.post("/asistencias", verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const data = req.body || {};
    const { modulos_curso_id, nombre_participante, grupo, presente, pago_cuota, observaciones } = data;

    if (!modulos_curso_id || !nombre_participante) {
      return res.status(400).json({ error: "Debe indicar módulo y nombre del participante" });
    }

    const modulo = await pool.query("SELECT id FROM modulos_curso WHERE id=$1", [modulos_curso_id]);
    if (modulo.rowCount === 0) return res.status(404).json({ error: "Módulo no encontrado" });

    const result = await pool.query(
      `INSERT INTO asistencias (modulos_curso_id, nombre_participante, grupo, presente, pago_cuota, observaciones)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [modulos_curso_id, nombre_participante, grupo, presente, pago_cuota, observaciones]
    );

    await registrarLog(
      req.user.id,
      "Registró asistencia",
      "asistencias",
      result.rows[0].id,
      `Módulo ${modulos_curso_id}`
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al registrar asistencia:", err);
    res.status(500).json({ error: "Error interno al registrar asistencia" });
  }
});

export default router;
