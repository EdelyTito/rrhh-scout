// utils/logger.js
import { pool } from "../config/db.js";

/**
 * Registra una acción en la tabla de logs
 * @param {number} usuarioId - ID del usuario que realiza la acción
 * @param {string} accion - Descripción breve de la acción
 * @param {string} tabla - Nombre de la tabla afectada
 * @param {number|null} registroId - ID del registro afectado (puede ser null)
 * @param {string|null} detalle - Detalle opcional
 * @param {string|null} rol - Nombre del rol del usuario (opcional)
 */
export const registrarLog = async (usuarioId, accion, tabla, registroId, detalle, rol = null) => {
  try {
    const accionDetallada = rol ? `[${rol}] ${accion}` : accion;

    await pool.query(
      `INSERT INTO logs (usuario_id, accion, tabla_afectada, registro_id, detalle)
       VALUES ($1, $2, $3, $4, $5)`,
      [usuarioId, accionDetallada, tabla, registroId, detalle]
    );

    console.log(`📝 Log registrado por ${rol || "usuario"}: ${accion} (${tabla})`);
  } catch (error) {
    console.error("❌ Error al registrar log:", error.message);
  }
};
