import { body } from "express-validator"
import { CARGOS } from "../../config/cargos.config.js"

export const validarLogin = [
  body("correo")
    .trim()
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    }),

  body("contrasena")
    .isString()
    .isLength({ min: 12 })
    .withMessage("Contraseña mínima 12 caracteres")
]

export const validarRegistro = [
  body("nombre")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nombre inválido"),

  body("correo")
    .trim()
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false
    }),

  body("contrasena")
    .isLength({ min: 12 })
    .withMessage("La contraseña debe tener al menos 12 caracteres"),

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

