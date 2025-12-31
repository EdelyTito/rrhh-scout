<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">
        Restablecer contraseña
      </h2>

      <form @submit.prevent="handleReset">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Nueva contraseña
          </label>
          <input
            v-model="nuevaContrasena"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Confirmar contraseña
          </label>
          <input
            v-model="confirmarContrasena"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm mb-3">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full bg-[#009d71] text-white py-2 rounded hover:bg-[#008060]"
        >
          Guardar nueva contraseña
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/api'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const error = ref('')

const handleReset = async () => {
  error.value = ''

  if (!nuevaContrasena.value || !confirmarContrasena.value) {
    error.value = 'Completa todos los campos'
    return
  }

  if (nuevaContrasena.value !== confirmarContrasena.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    await authService.resetPassword({
      token,
      nuevaContrasena: nuevaContrasena.value
    })

    alert('Contraseña actualizada correctamente')
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al actualizar contraseña'
  }
}
</script>
