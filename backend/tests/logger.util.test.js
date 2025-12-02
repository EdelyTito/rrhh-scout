import { jest } from '@jest/globals';

// Mock antes de importar registrarLog
jest.unstable_mockModule('../src/config/db.js', () => ({
  pool: { query: jest.fn().mockResolvedValue({ rows: [] }) }
}));

const { registrarLog } = await import('../src/utils/logger.js');
const { pool } = await import('../src/config/db.js');

test('inserta registro de log correctamente', async () => {
  await registrarLog(1, 'Acción', 'tabla', 9, 'detalle', 'Admin');
  expect(pool.query).toHaveBeenCalled();
});
