import { jest } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

let token;

jest.unstable_mockModule("../src/utils/email.js", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ correo: "admin@rrhh.com", contrasena: "123456" });
  token = res.body.token;
  expect(token).toBeDefined();
});

describe("🧩 Pruebas de integración - Módulo Registro y Habilitación", () => {
  test("📬 Envía una solicitud pública de registro", async () => {
    const nuevaSolicitud = {
      nombre: "Dirigente Test",
      ci: "TEST123LP",
      fecha_nacimiento: "1990-01-01",
      genero: "M",
      telefono: "77777777",
      correo: "test@correo.com",
      direccion: "Zona Central",
      grupo: "Grupo Scout La Paz",
      cargo_actual: "Dirigente de Unidad",
      nivel_scout: "Dirigente",
      distrito: "La Paz",
    };

    const res = await request(app)
      .post("/api/registro/public")
      .send(nuevaSolicitud);

    expect([201, 200]).toContain(res.status);
    expect(res.body).toHaveProperty("message");
  });

  test("📋 Lista las solicitudes registradas (privado)", async () => {
    const res = await request(app)
      .get("/api/registro")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
