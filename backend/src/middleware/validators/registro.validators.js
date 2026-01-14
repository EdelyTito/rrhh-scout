import { body, param } from "express-validator"

// ===============================
// VALIDAR ID SOLICITUD
// ===============================
export const validarIdSolicitud = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID de solicitud inválido")
]

// ===============================
// SOLICITUD PÚBLICA
// ===============================
export const validarSolicitudPublica = [

  body("nombre_completo")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Nombre inválido"),

  body("correo")
    .optional()
    .isEmail(),

  body("telefono")
    .optional()
    .isLength({ min: 6 }),

  body("rama")
    .optional()
    .isString(),

  body("cargo_actual")
    .optional()
    .isString(),

  body("nivel_scout")
    .optional()
    .isString(),

  body("anios_servicio")
    .optional()
    .isInt({ min: 0 }),

  body("cargo_distrital").optional(),
  body("cargo_grupo_1").optional(),
  body("cargo_grupo_2").optional(),
  body("cargo_grupo_3").optional(),

  body("programa_jovenes").optional(),
  body("formador_lideres").optional(),
  body("gestion_institucional").optional(),

  body("formulario_asb")
    .optional()
    .isBoolean()
]

// ===============================
// ACTUALIZAR SOLICITUD
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
// EDITAR DIRIGENTE DESDE REGISTRO
// ===============================
export const validarActualizarDirigenteRegistro = [

  body("nombre_completo")
    .optional()
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
    .optional()
    .isString(),

  body("rama")
    .optional()
    .isString(),

  body("nivel_scout")
    .optional()
    .isString(),

  body("anios_servicio")
    .optional()
    .isInt({ min: 0 }),

  body("cargo_distrital").optional(),
  body("cargo_grupo_1").optional(),
  body("cargo_grupo_2").optional(),
  body("cargo_grupo_3").optional(),

  body("programa_jovenes").optional(),
  body("formador_lideres").optional(),
  body("gestion_institucional").optional(),
  body("telefono").optional().isString(),
  body("correo").optional().isEmail(),
  body("direccion_domicilio").optional().isString(),
  body("grupo_anterior").optional().isString(),
  body("fecha_ingreso").optional().isISO8601(),
  body("formulario_asb").optional().isBoolean(),

  body("estado").optional().isString()
]
