import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

// Mock de jsonwebtoken antes de importarlo
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn()
  }
}));

const jwt = (await import('jsonwebtoken')).default;
const { verifyToken } = await import('../src/middleware/auth.js');

const app = express();
app.get('/protegido', verifyToken, (req, res) => res.json({ ok: true, user: req.user }));

test('rechaza si no hay token', async () => {
  const res = await request(app).get('/protegido');
  expect(res.status).toBe(403);
});

test('acepta token válido y expone req.user', async () => {
  jwt.verify.mockReturnValue({ id: 1, rol_id: 1, correo: 'admin@rrhh.com' });
  const res = await request(app)
    .get('/protegido')
    .set('Authorization', 'Bearer token-falso');
  expect(res.status).toBe(200);
  expect(res.body.user.id).toBe(1);
});
