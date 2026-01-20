import { body } from "express-validator"
import { CARGOS } from "../../config/cargos.config.js"

export const validarRegistroAdmin = [
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

  body("cargo")
    .trim()
    .custom(value => {
      const normalizado = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

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
