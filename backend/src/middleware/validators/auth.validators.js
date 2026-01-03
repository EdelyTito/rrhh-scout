import { body } from "express-validator"

export const validarLogin = [
  body("correo")
    .trim()
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),

  body("contrasena")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Contraseña mínima 6 caracteres")
]

export const validarRegistro = [
  body("nombre")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nombre inválido"),

  body("correo")
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),

  body("contrasena")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage("Contraseña débil"),

  body("rol_id")
    .isInt()
    .withMessage("Rol inválido")
]
