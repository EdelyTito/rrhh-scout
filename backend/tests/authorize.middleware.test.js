import request from 'supertest';
import express from 'express';
import { authorizeRoles } from '../src/middleware/authorize.js';

const app = express();
app.use((req, _res, next) => { req.user = { rol_id: 1 }; next(); });
app.get('/solo-admin', authorizeRoles(1), (_req, res) => res.json({ ok: true }));

test('permite acceso al rol autorizado', async () => {
  const res = await request(app).get('/solo-admin');
  expect(res.status).toBe(200);
});

test('bloquea rol no autorizado', async () => {
  const app2 = express();
  app2.use((req, _res, next) => { req.user = { rol_id: 5 }; next(); });
  app2.get('/solo-admin', authorizeRoles(1), (_req, res) => res.json({ ok: true }));
  const res = await request(app2).get('/solo-admin');
  expect(res.status).toBe(403);
});
