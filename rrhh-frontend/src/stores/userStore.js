// src/stores/userStore.js
import { defineStore } from "pinia";
import { authService } from "../services/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    usuario: null,
    token: null
  }),

  actions: {
    async login(correo, contrasena) {
      try {
        const res = await authService.login({ correo, contrasena });

        this.usuario = res.data.usuario;
        this.token = res.data.token;

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
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    },

    cargarSesion() {
      const token = localStorage.getItem("token");
      const usuario = localStorage.getItem("usuario");
      if (token && usuario) {
        this.token = token;
        this.usuario = JSON.parse(usuario);
      }
    }
  },
});
