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
    .withMessage("Offset inválido"),

  query("nivel")
    .optional()
    .isIn(["INFO", "WARN", "SECURITY", "ERROR"])
    .withMessage("Nivel de log inválido"),

  query("desde")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Fecha desde inválida"),

  query("hasta")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Fecha hasta inválida"),

]
