import { body, param } from "express-validator"

/* ============================
   PARAMS
============================ */
export const validarId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID inválido")
]

/* ============================
   RUTA PÚBLICA – IM / Paxtu / Koodoo
============================ */
export const validarSeguimientoPublico = [
  body("nombre_participante")
    .optional()
    .isLength({ max: 150 }),

  body("grupo")
    .optional()
    .isLength({ max: 100 }),

  body("correo")
    .notEmpty().withMessage("Correo obligatorio")
    .isEmail().withMessage("Correo inválido"),

  body("rama_scout")
    .optional()
    .isLength({ max: 50 }),

  body("tipo_im")
    .isIn([
      "IM2",
      "IM3",
      "PaxtuGrupo",
      "PaxtuDistrito",
      "KoodooAdjunto",
      "KoodooDirector"
    ])
    .withMessage("Tipo IM no válido"),

  body("tipo_proceso")
    .isIn(["aprobacion", "revalidacion"])
    .withMessage("Tipo de proceso no válido"),

  body("documento_url")
    .optional()
    .isURL().withMessage("URL de documento inválida"),

  body("observaciones")
    .optional()
    .isLength({ max: 500 })
]

/* ============================
   REINCORPORACIÓN / PRUEBA
============================ */
export const validarReincorporacion = [
  body("nombre")
    .trim()
    .notEmpty()
    .isLength({ max: 150 }),

  body("grupo")
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),

  body("tipo")
    .isIn(["reincorporacion", "periodo de prueba"])
    .withMessage("Tipo inválido"),

  body("motivo")
    .trim()
    .notEmpty()
    .isLength({ max: 500 }),

  body("correo")
  .notEmpty().withMessage("Correo obligatorio")
  .isEmail().withMessage("Correo inválido"),

  body("telefono")
    .optional()
    .isLength({ max: 20 }),

  body("documento_url")
    .optional(),

  body("fecha_inicio")
    .optional()
    .isISO8601(),

  body("fecha_fin")
    .optional()
    .isISO8601()
]

/* ============================
   ENTREGAS / DEVOLUCIONES
============================ */
export const validarEntrega = [
  body("etapa")
    .isIn([
      "devolución 1",
      "segunda entrega",
      "devolución 2",
      "entrega final",
      "en entrevista"
    ])
    .withMessage("Etapa no válida"),

  body("documento_url").optional(),
  body("observaciones").optional().isLength({ max: 500 })
]

/* ============================
   RESULTADO FINAL
============================ */
export const validarResultadoFinal = [
  body("resultado_final")
    .isIn(["aprobado", "no aprobó"])
    .withMessage("Resultado final inválido")
]

