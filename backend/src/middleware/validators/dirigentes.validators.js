import { body, param } from "express-validator"

/* ===============================
   CREAR DIRIGENTE
================================ */
export const validarCrearDirigente = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 }).withMessage("Nombre inválido"),

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
    .isLength({ max: 100 }).withMessage("Grupo demasiado largo"),

  body("rama")
    .optional()
    .isIn(["Manada", "Unidad", "Caminantes", "Rovers"])
    .withMessage("Rama no válida"),

  body("anios_servicio")
    .optional()
    .isInt({ min: 0, max: 80 })
    .withMessage("Años de servicio inválidos"),

  body("estado")
    .optional()
    .isIn(["Activo", "Postulante", "Inactivo"])
    .withMessage("Estado no válido")
]

/* ===============================
   ACTUALIZAR DIRIGENTE
================================ */
export const validarActualizarDirigente = [
  param("id")
    .isInt().withMessage("ID de dirigente inválido"),

  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nombre inválido"),

  body("correo")
    .optional()
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),
]

/* ===============================
   ID PARAM
================================ */
export const validarIdDirigente = [
  param("id")
    .isInt()
    .withMessage("ID inválido")
]
