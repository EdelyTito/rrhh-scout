import express from "express";
import { pool } from "../config/db.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import { registrarLog } from "../utils/logger.js";
import { validarId, validarCursoId, validarModuloId, validarCurso, validarModulo, validarAsistencia} from "../middleware/validators/formacion.validators.js"
import { validar } from "../middleware/validators/index.js"


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

router.get("/cursos/:id", verifyToken, authorizeRoles(...ROLES_FORM), validarId, validar, async (req, res) => {

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

router.put("/cursos/:id", verifyToken, authorizeRoles(...ROLES_FORM), validarId, validarCurso, validar, async (req, res) => {
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

router.post("/cursos", verifyToken, authorizeRoles(...ROLES_FORM), validarCurso, validar, async (req, res) => {
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
router.get("/cursos/:cursoId/modulos", verifyToken, authorizeRoles(...ROLES_FORM), validarCursoId, validar, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const curso = await pool.query("SELECT id, nombre FROM cursos WHERE id = $1", [cursoId]);
    if (curso.rowCount === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const result = await pool.query(
      `SELECT 
        m.*,
        tm.nombre AS tipo_modulo,
        f.nombre AS formador
      FROM modulos_curso m
      LEFT JOIN tipos_modulo tm ON tm.id = m.tipo_modulo_id
      LEFT JOIN formadores f ON f.id = m.formador_id
      WHERE m.curso_id = $1;
      ORDER BY m.id ASC`,
      [cursoId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener módulos:", err);
    res.status(500).json({ error: "Error al obtener módulos" });
  }
});

router.post("/cursos/:cursoId/modulos", verifyToken, authorizeRoles(...ROLES_FORM), validarCursoId, validarModulo, validar, async (req, res) => {
  try {
    const { cursoId } = req.params;
    const data = req.body || {};
    const {
      titulo,
      descripcion,
      duracion_horas,
      tipo_modulo_id,
      formador_id
    } = data;

    if (!titulo || !duracion_horas) {
      return res.status(400).json({ error: "Debe especificar título y duración del módulo" });
    }

    const curso = await pool.query("SELECT id FROM cursos WHERE id=$1", [cursoId]);
    if (curso.rowCount === 0) return res.status(404).json({ error: "Curso no encontrado" });

    // Validar que el formador pueda dictar ese tipo de módulo
    const validacion = await pool.query(
      `
      SELECT 1
      FROM formadores_tipos_modulo
      WHERE formador_id = $1
        AND tipo_modulo_id = $2
      `,
      [formador_id, tipo_modulo_id]
    );

    if (validacion.rowCount === 0) {
      return res.status(400).json({
        error: "El formador no está habilitado para este tipo de módulo"
      });
    }


    const result = await pool.query(
      `INSERT INTO modulos_curso
      (curso_id, titulo, descripcion, duracion_horas, tipo_modulo_id, formador_id)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        cursoId,
        titulo,
        descripcion,
        duracion_horas,
        tipo_modulo_id,
        formador_id
      ]
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

////editar modulo
router.put(
  "/modulos/:moduloId",
  verifyToken,
  authorizeRoles(...ROLES_FORM),
  validarModuloId,
  validarModulo,
  validar,
  async (req, res) => {
    try {
      const { moduloId } = req.params;
      const {
        titulo,
        descripcion,
        duracion_horas,
        tipo_modulo_id,
        formador_id
      } = req.body || {};

      // Verificar que el módulo exista
      const moduloExist = await pool.query(
        "SELECT id, curso_id FROM modulos_curso WHERE id = $1",
        [moduloId]
      );

      if (moduloExist.rowCount === 0) {
        return res.status(404).json({ error: "Módulo no encontrado" });
      }

      // Validar que el formador pueda dictar el tipo de módulo
      const validacion = await pool.query(
        `
        SELECT 1
        FROM formadores_tipos_modulo
        WHERE formador_id = $1
          AND tipo_modulo_id = $2
        `,
        [formador_id, tipo_modulo_id]
      );

      if (validacion.rowCount === 0) {
        return res.status(400).json({
          error: "El formador no está habilitado para este tipo de módulo"
        });
      }

      // Actualizar módulo
      const result = await pool.query(
        `
        UPDATE modulos_curso
        SET titulo = $1,
            descripcion = $2,
            duracion_horas = $3,
            tipo_modulo_id = $4,
            formador_id = $5
        WHERE id = $6
        RETURNING *
        `,
        [
          titulo,
          descripcion,
          duracion_horas,
          tipo_modulo_id,
          formador_id,
          moduloId
        ]
      );

      await registrarLog(
        req.user.id,
        "Actualizó módulo de curso",
        "modulos_curso",
        moduloId,
        `Módulo actualizado: ${titulo}`
      );

      res.json({
        message: "Módulo actualizado correctamente",
        modulo: result.rows[0]
      });

    } catch (err) {
      console.error("Error al actualizar módulo:", err);
      res.status(500).json({ error: "Error interno al actualizar módulo" });
    }
  }
);


//////////////////////
////FORMADORES////////
//////////////////////

router.get('/formadores', verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM formadores
      ORDER BY nombre
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Error obteniendo formadores:', err)
    res.status(500).json({ error: 'Error obteniendo formadores' })
  }
})

router.post('/formadores', verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const {
      nombre,
      nivel_programa,
      nivel_formador,
      nivel_gestion,
      telefono,
      email
    } = req.body

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' })
    }

    const result = await pool.query(`
      INSERT INTO formadores
      (nombre, nivel_programa, nivel_formador, nivel_gestion, telefono, email)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [
      nombre,
      nivel_programa,
      nivel_formador,
      nivel_gestion,
      telefono,
      email
    ])

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error creando formador:', err)
    res.status(500).json({ error: 'Error creando formador' })
  }
})

router.get(
  '/formadores/:id/modulos',
  verifyToken,
  authorizeRoles(...ROLES_FORM),
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(`
        SELECT tm.id, tm.nombre
        FROM tipos_modulo tm
        JOIN formadores_tipos_modulo ftm
          ON ftm.tipo_modulo_id = tm.id
        WHERE ftm.formador_id = $1
        ORDER BY tm.nombre
      `, [id])

      res.json(result.rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error obteniendo módulos del formador' })
    }
  }
)

router.put(
  '/formadores/:id/modulos',
  verifyToken,
  authorizeRoles(...ROLES_FORM),
  async (req, res) => {
    try {
      const { id } = req.params
      const { tipos_modulo } = req.body

      if (!Array.isArray(tipos_modulo)) {
        return res.status(400).json({ error: 'tipos_modulo debe ser un array' })
      }

      // 1️⃣ borrar relaciones actuales
      await pool.query(
        'DELETE FROM formadores_tipos_modulo WHERE formador_id = $1',
        [id]
      )

      // 2️⃣ insertar nuevas
      for (const tipoId of tipos_modulo) {
        await pool.query(`
          INSERT INTO formadores_tipos_modulo (formador_id, tipo_modulo_id)
          VALUES ($1, $2)
        `, [id, tipoId])
      }

      res.json({ message: 'Módulos del formador actualizados correctamente' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error actualizando módulos del formador' })
    }
  }
)


router.put(
  '/formadores/:id/tipos-modulo',
  verifyToken,
  authorizeRoles(...ROLES_FORM),
  async (req, res) => {
    try {
      const { id } = req.params
      const { tipos_modulo } = req.body // array de IDs

      if (!Array.isArray(tipos_modulo)) {
        return res.status(400).json({ error: 'tipos_modulo debe ser un array' })
      }

      await pool.query(
        'DELETE FROM formadores_tipos_modulo WHERE formador_id = $1',
        [id]
      )

      for (const tipoId of tipos_modulo) {
        await pool.query(
          `INSERT INTO formadores_tipos_modulo (formador_id, tipo_modulo_id)
           VALUES ($1, $2)`,
          [id, tipoId]
        )
      }

      res.json({ message: 'Módulos actualizados correctamente' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error actualizando módulos del formador' })
    }
  }
)

router.put(
  '/formadores/:id',
  verifyToken,
  authorizeRoles(...ROLES_FORM),
  async (req, res) => {
    try {
      const { id } = req.params
      const {
        nombre,
        nivel_programa,
        nivel_formador,
        nivel_gestion,
        telefono,
        email,
        activo
      } = req.body

      const result = await pool.query(
        `
        UPDATE formadores
        SET nombre = $1,
            nivel_programa = $2,
            nivel_formador = $3,
            nivel_gestion = $4,
            telefono = $5,
            email = $6,
            activo = $7
        WHERE id = $8
        RETURNING *
        `,
        [
          nombre,
          nivel_programa,
          nivel_formador,
          nivel_gestion,
          telefono,
          email,
          activo,
          id
        ]
      )

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Formador no encontrado' })
      }

      res.json(result.rows[0])
    } catch (err) {
      console.error('Error actualizando formador:', err)
      res.status(500).json({ error: 'Error actualizando formador' })
    }
  }
)


//////////////////////
////TIPOS MODULO//////
//////////////////////

router.get('/tipos-modulo', verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM tipos_modulo
      WHERE activo = true
      ORDER BY nombre
    `)
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo tipos de módulo' })
  }
})

router.post('/tipos-modulo', verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { nombre } = req.body
    if (!nombre) {
      return res.status(400).json({ error: 'Nombre obligatorio' })
    }

    const result = await pool.query(`
      INSERT INTO tipos_modulo (nombre)
      VALUES ($1)
      RETURNING *
    `, [nombre])

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando tipo de módulo' })
  }
})

router.get('/tipos-modulo/:id/formadores', verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(`
      SELECT f.id, f.nombre
      FROM formadores f
      JOIN formadores_tipos_modulo ftm
        ON ftm.formador_id = f.id
      WHERE ftm.tipo_modulo_id = $1
        AND f.activo = true
      ORDER BY f.nombre
    `, [id])

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo formadores por tipo de módulo' })
  }
})

router.get(
  '/formadores/:id/tipos-modulo',
  verifyToken,
  authorizeRoles(...ROLES_FORM),
  async (req, res) => {
    try {
      const { id } = req.params

      const result = await pool.query(`
        SELECT tm.id, tm.nombre
        FROM tipos_modulo tm
        JOIN formadores_tipos_modulo ftm
          ON ftm.tipo_modulo_id = tm.id
        WHERE ftm.formador_id = $1
        ORDER BY tm.nombre
      `, [id])

      res.json(result.rows)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Error obteniendo módulos del formador' })
    }
  }
)


//TIPO DE MODULO QUE DA FORMADOR
router.post('/formadores/:id/tipos-modulo', verifyToken, authorizeRoles(...ROLES_FORM), async (req, res) => {
  try {
    const { id } = req.params
    const { tipo_modulo_id } = req.body

    await pool.query(`
      INSERT INTO formadores_tipos_modulo (formador_id, tipo_modulo_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [id, tipo_modulo_id])

    res.status(201).json({ message: 'Tipo de módulo asignado al formador' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error asignando tipo de módulo' })
  }
})


//
// 🟣 ASISTENCIAS
//
router.get("/modulos/:moduloId/asistencias", verifyToken, authorizeRoles(...ROLES_FORM), validarModuloId, validar, async (req, res) => {
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

router.post("/asistencias", verifyToken, authorizeRoles(...ROLES_FORM), validarAsistencia, validar, async (req, res) => {
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
