import request from "supertest";
import app from "../src/app.js";

let token;

beforeAll(async () => {
  // Simula login del administrador real
  const res = await request(app)
    .post("/api/auth/login")
    .send({ correo: "admin@rrhh.com", contrasena: "123456" });

  // Guarda el token para usarlo en las demás peticiones
  token = res.body.token;

  expect(token).toBeDefined();
});

describe("🧩 Pruebas de integración - Módulo Formación (Cursos)", () => {
  test("Debería crear un curso y devolverlo correctamente", async () => {
    const nuevoCurso = {
      nombre: "Curso Integración Jest",
      descripcion: "Curso de prueba automatizada",
      fecha_inicio: "2025-11-06",
      fecha_fin: "2025-11-07",
      modalidad: "presencial",
      lugar: "Sede Central",
      cupo: 40
    };

    const res = await request(app)
      .post("/api/formacion/cursos")
      .set("Authorization", `Bearer ${token}`)
      .send(nuevoCurso);

    expect(res.status).toBe(201);
    expect(res.body.curso).toHaveProperty("nombre", "Curso Integración Jest");
  });

  test("Debería listar los cursos existentes", async () => {
    const res = await request(app)
      .get("/api/formacion/cursos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
