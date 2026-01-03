import { query } from "express-validator"

export const validarConsultaLogs = [
  query("tabla")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Nombre de tabla demasiado largo")
    .matches(/^[a-zA-Z_]+$/)
    .withMessage("Nombre de tabla inválido"),

  query("usuario_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("usuario_id inválido"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage("Límite inválido (1–200)"),

  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset inválido")
]
