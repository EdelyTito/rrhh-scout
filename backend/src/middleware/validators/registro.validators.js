import { body, param } from "express-validator"

/* =====================================
   RUTA PÚBLICA – SOLICITUD REGISTRO
===================================== */
export const validarSolicitudPublica = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 3, max: 120 }).withMessage("Nombre inválido"),

  body("ci")
    .optional()
    .trim()
    .isLength({ min: 4, max: 20 }).withMessage("CI inválido"),

  body("correo")
    .optional()
    .isEmail().withMessage("Correo inválido")
    .normalizeEmail(),

  body("telefono")
    .optional()
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage("Teléfono inválido"),

  body("grupo")
    .trim()
    .notEmpty().withMessage("El grupo es obligatorio")
    .isLength({ max: 100 }),

  body("rama")
    .optional()
    .isIn(["Manada", "Unidad", "Caminantes", "Rovers"])
    .withMessage("Rama no válida"),

  body("genero")
    .optional()
    .isIn(["Masculino", "Femenino", "Otro"])
    .withMessage("Género no válido"),

  body("nivel_scout")
    .optional()
    .isLength({ max: 100 }),

  body("distrito")
    .optional()
    .isLength({ max: 100 })
]

/* =====================================
   ACTUALIZAR ESTADO SOLICITUD
===================================== */
export const validarActualizarSolicitud = [
  param("id")
    .isInt().withMessage("ID de solicitud inválido"),

  body("estado")
    .isIn(["pendiente", "habilitado", "rechazado"])
    .withMessage("Estado no válido"),

  body("observaciones")
    .optional()
    .isLength({ max: 500 })
]

/* =====================================
   PARAM ID GENÉRICO
===================================== */
export const validarIdSolicitud = [
  param("id")
    .isInt().withMessage("ID inválido")
]
