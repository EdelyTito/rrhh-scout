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
    .trim()
    .notEmpty().withMessage("Nombre obligatorio")
    .isLength({ max: 150 }),

  body("grupo")
    .trim()
    .notEmpty().withMessage("Grupo obligatorio")
    .isLength({ max: 100 }),

  body("correo")
    .optional()
    .isEmail().withMessage("Correo inválido"),

  body("rama_scout")
    .optional()
    .isLength({ max: 50 }),

  body("tipo_im")
    .isIn(["IM1", "IM2", "IM3", "Paxtu", "Koodoo"])
    .withMessage("Tipo IM no válido"),

  body("tipo_proceso")
    .isIn(["primera vez", "revalidacion"])
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
    .optional()
    .isEmail(),

  body("telefono")
    .optional()
    .isLength({ max: 20 }),

  body("documento_url")
    .optional()
    .isURL(),

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
      "primera entrega",
      "segunda entrega",
      "observado",
      "entrega final"
    ])
    .withMessage("Etapa no válida"),

  body("documento_url")
    .optional()
    .isURL(),

  body("observaciones")
    .optional()
    .isLength({ max: 500 })
]

/* ============================
   RESULTADO FINAL
============================ */
export const validarResultadoFinal = [
  body("resultado_final")
    .isIn(["aprobado", "rechazado"])
    .withMessage("Resultado final inválido")
]
