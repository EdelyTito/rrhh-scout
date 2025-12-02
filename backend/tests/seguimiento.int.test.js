import request from "supertest";
import app from "../src/app.js";

let token;
let seguimientoId;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ correo: "admin@rrhh.com", contrasena: "123456" });
  token = res.body.token;
  expect(token).toBeDefined();
});

describe("📦 Pruebas de integración - Módulo Seguimiento", () => {
  test("📤 Envía un formulario público de seguimiento", async () => {
    const nuevoSeg = {
      nombre_participante: "Participante Test",
      grupo: "Grupo Scout La Paz",
      correo: "segtest@correo.com",
      rama_scout: "Tropa",
      tipo_im: "IM3",
      tipo_proceso: "Evaluación",
      documento_url: "https://ejemplo.com/doc.pdf",
      observaciones: "Todo correcto"
    };

    const res = await request(app)
      .post("/api/seguimiento/public")
      .send(nuevoSeg);

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("seguimiento_id");
    seguimientoId = res.body.seguimiento_id;
  });

  test("📄 Lista los seguimientos existentes (privado)", async () => {
    const res = await request(app)
      .get("/api/seguimiento")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
