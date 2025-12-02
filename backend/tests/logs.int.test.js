import request from "supertest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ correo: "admin@rrhh.com", contrasena: "123456" });
  token = res.body.token;
  expect(token).toBeDefined();
});

describe("🪵 Pruebas de integración - Módulo Logs del Sistema", () => {
  test("📚 Lista los logs del sistema", async () => {
    const res = await request(app)
      .get("/api/logs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
