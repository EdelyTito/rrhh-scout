import { body } from "express-validator"
import { CARGOS } from "../../config/cargos.config.js"

export const validarCargo = [
  body("cargo")
    .notEmpty().withMessage("Cargo obligatorio")
    .custom(value => {
      const cargosValidos = Object.values(CARGOS).map(c => c.label)
      if (!cargosValidos.includes(value)) {
        throw new Error("Cargo no válido")
      }
      return true
    })
]
