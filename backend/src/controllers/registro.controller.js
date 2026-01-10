export const rechazarSolicitud = async (req, res) => {
  const { id } = req.params
  const { motivo } = req.body

  if (!motivo) {
    return res.status(400).json({ error: 'Motivo requerido' })
  }

  try {
    await pool.query(
      `
      UPDATE solicitudes_registro
      SET estado = 'rechazado',
          motivo_rechazo = $1,
          fecha_estado = NOW()
      WHERE id = $2
      `,
      [motivo, id]
    )

    // LOG
    await registrarLog({
      req,
      accion: 'RECHAZAR_SOLICITUD',
      tabla: 'solicitudes_registro',
      detalle: `Solicitud ${id} rechazada`
    })

    res.json({ message: 'Solicitud rechazada correctamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al rechazar solicitud' })
  }
}
