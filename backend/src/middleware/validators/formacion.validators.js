import { body, param } from "express-validator"

/* ============================
   PARAMS
============================ */
export const validarId = [
  param("id").isInt().withMessage("ID inválido")
]

export const validarCursoId = [
  param("cursoId").isInt().withMessage("ID de curso inválido")
]

export const validarModuloId = (req, res, next) => {
  const moduloId = req.params.moduloId || req.params.id

  if (!moduloId || isNaN(moduloId)) {
    return res.status(400).json({ error: 'ID de módulo inválido' })
  }

  req.params.moduloId = Number(moduloId)
  next()
}

/* ============================
   CURSOS
============================ */
export const validarCurso = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 150 }),

  body("descripcion")
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria")
    .isLength({ max: 1000 }),

  body("fecha_inicio")
    .optional()
    .isISO8601().withMessage("Fecha de inicio inválida"),

  body("fecha_fin")
    .optional()
    .isISO8601().withMessage("Fecha de fin inválida"),

  body("modalidad")
    .optional()
    .isIn(["Presencial", "Virtual", "Mixto"])
    .withMessage("Modalidad no válida"),

  body("lugar")
    .optional()
    .isLength({ max: 150 }),

  body("cupo")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Cupo inválido")
]

/* ============================
   MÓDULOS
============================ */
export const validarModulo = [
  body("titulo")
    .trim()
    .notEmpty().withMessage("El título es obligatorio")
    .isLength({ max: 200 }),

  body("descripcion")
    .optional()
    .isLength({ max: 1000 }),

  body("duracion_horas")
    .isInt({ min: 1, max: 500 })
    .withMessage("Duración inválida"),

  body("tipo_modulo_id")
    .isInt()
    .withMessage("Tipo de módulo inválido"),

  body("formador_id")
    .isInt()
    .withMessage("Formador inválido")
]

/* ============================
   ASISTENCIAS
============================ */
export const validarAsistencia = [
  body("modulos_curso_id")
    .isInt().withMessage("ID de módulo inválido"),

  body("nombre_participante")
    .trim()
    .notEmpty().withMessage("Nombre del participante obligatorio")
    .isLength({ max: 150 }),

  body("grupo")
    .optional()
    .isLength({ max: 100 }),

  body("presente")
    .optional()
    .isBoolean().withMessage("Presente debe ser booleano"),

  body("pago_cuota")
    .optional()
    .isBoolean().withMessage("Pago cuota debe ser booleano"),

  body("observaciones")
    .optional()
    .isLength({ max: 500 })
]
