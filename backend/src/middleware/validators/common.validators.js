import { param, validationResult } from "express-validator"

export const validarIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID inválido")
]

export const validar = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {

    console.log("❌ VALIDATION ERRORS:", errors.array())

    return res.status(400).json({
      error: "Datos inválidos",
      detalles: errors.array().map(e => ({
        campo: e.param,
        mensaje: e.msg
      }))
    })
  }

  next()
}
