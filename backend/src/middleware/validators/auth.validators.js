import { body } from "express-validator"
import { CARGOS } from "../../config/cargos.config.js"

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
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("cargo")
  .trim()
  .custom(value => {
    const normalizado = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const existe = Object.values(CARGOS).some(c =>
      c.label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") === normalizado
    )
    if (!existe) {
      throw new Error("Cargo inválido")
    }
    return true
  })
]

