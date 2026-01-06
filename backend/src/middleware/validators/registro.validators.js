import { body, param } from "express-validator"

// ===============================
// 📌 VALIDAR ID SOLICITUD
// ===============================
export const validarIdSolicitud = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID de solicitud inválido")
]

// ===============================
// 📌 SOLICITUD PÚBLICA
// ===============================
export const validarSolicitudPublica = [

  body("nombre")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre inválido"),

  body("ci")
    .trim()
    .isLength({ min: 5 })
    .withMessage("CI inválido"),

  body("fecha_nacimiento")
    .isISO8601()
    .withMessage("Fecha de nacimiento inválida"),

  body("correo")
    .optional()
    .isEmail()
    .withMessage("Correo inválido"),

  body("telefono")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Teléfono inválido"),

  body("grupo")
    .trim()
    .notEmpty()
    .withMessage("Grupo es obligatorio"),

  body("rama")
    .optional()
    .isString(),

  body("nivel_scout")
    .optional()
    .isString(),

  body("distrito")
    .optional()
    .isString(),

  body("archivo_ci_anverso").notEmpty(),
  body("archivo_ci_reverso").notEmpty(),
  body("archivo_safe_from_harm").notEmpty(),
  body("archivo_codigo_conducta").notEmpty(),
  body("archivo_certificado_no_violencia").notEmpty()
]

// ===============================
// 📌 ACTUALIZAR SOLICITUD
// ===============================
export const validarActualizarSolicitud = [

  body("estado")
    .isIn(["pendiente", "habilitado", "rechazado"])
    .withMessage("Estado inválido"),

  body("observaciones")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Observaciones demasiado largas")
]

// ===============================
// 📌 EDITAR DIRIGENTE DESDE REGISTRO
// ===============================
export const validarActualizarDirigenteRegistro = [

  body("nombre")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre inválido"),

  body("telefono")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Teléfono inválido"),

  body("correo")
    .optional()
    .isEmail()
    .withMessage("Correo inválido"),

  body("grupo")
    .notEmpty()
    .withMessage("Grupo obligatorio"),

  body("rama")
    .optional()
    .isString(),

  body("nivel_scout")
    .optional()
    .isString()
]
