import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    usuario: null,
    token: null,
    baseUrl: "http://localhost:4000/api",
  }),

  actions: {
    async login(correo, contrasena) {
      try {
        const res = await axios.post(`${this.baseUrl}/auth/login`, {
          correo,
          contrasena,
        });

        this.usuario = res.data.usuario;
        this.token = res.data.token;

        // Guardar en localStorage para persistencia
        localStorage.setItem("token", this.token);
        localStorage.setItem("usuario", JSON.stringify(this.usuario));

        return true;
      } catch (err) {
        console.error("❌ Error en login:", err.response?.data || err);
        return false;
      }
    },

    logout() {
      this.usuario = null;
      this.token = null;
      localStorage.clear();
    },

    cargarSesion() {
      const token = localStorage.getItem("token");
      const usuario = localStorage.getItem("usuario");
      if (token && usuario) {
        this.token = token;
        this.usuario = JSON.parse(usuario);
      }
    },
  },
});
