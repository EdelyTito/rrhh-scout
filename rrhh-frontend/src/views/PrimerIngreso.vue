<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white max-w-md w-full rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">
        Primer ingreso al sistema
      </h1>

      <p class="text-gray-600 mb-6">
        Por seguridad, debes cambiar tu contraseña antes de continuar.
      </p>

      <form @submit.prevent="cambiarContrasena" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <div class="relative mt-1">
            <input
              v-model="nuevaContrasena"
              :type="showNueva ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-[#009d71]"
            />
            <button
              type="button"
              @click="showNueva = !showNueva"
              class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              tabindex="-1"
            >
              <!-- Ojo abierto -->
              <svg v-if="!showNueva" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"/>
              </svg>

              <!-- Ojo cerrado -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19
                  c-4.478 0-8.27-2.943-9.543-7
                  a9.956 9.956 0 012.658-4.568M6.223 6.223
                  A9.956 9.956 0 0112 5
                  c4.478 0 8.27 2.943 9.543 7
                  a9.96 9.96 0 01-4.293 5.036M15 12
                  a3 3 0 00-3-3m0 0a3 3 0 013 3m-3-3L3 21"/>
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <div class="relative mt-1">
            <input
              v-model="confirmarContrasena"
              :type="showConfirmar ? 'text' : 'password'"
              minlength="12"
              required
              class="w-full px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-[#009d71]"
            />
            <button
              type="button"
              @click="showConfirmar = !showConfirmar"
              class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              tabindex="-1"
            >
              <!-- mismo SVG de arriba -->
              <svg v-if="!showConfirmar" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"/>
              </svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19
                  c-4.478 0-8.27-2.943-9.543-7
                  a9.956 9.956 0 012.658-4.568M6.223 6.223
                  A9.956 9.956 0 0112 5
                  c4.478 0 8.27 2.943 9.543 7
                  a9.96 9.96 0 01-4.293 5.036M15 12
                  a3 3 0 00-3-3m0 0a3 3 0 013 3m-3-3L3 21"/>
              </svg>
            </button>
          </div>
          <ul class="text-xs text-gray-500 mt-2 space-y-1">
            <li>• Mínimo 12 caracteres</li>
            <li>• Una mayúscula</li>
            <li>• Una minúscula</li>
            <li>• Un número</li>
            <li>• Un símbolo (!@#$%^&*)</li>
          </ul>
        </div>

        <button
          type="submit"
          class="w-full bg-[#009d71] text-white py-2 rounded-lg hover:bg-[#008060]"
        >
          Cambiar contraseña y continuar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api'

const router = useRouter()

const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const loading = ref(false)

const showNueva = ref(false)
const showConfirmar = ref(false)

const validarPasswordOWASP = (password) => {
  const errores = []

  if (password.length < 12) errores.push('Mínimo 12 caracteres')
  if (!/[A-Z]/.test(password)) errores.push('Al menos una mayúscula')
  if (!/[a-z]/.test(password)) errores.push('Al menos una minúscula')
  if (!/[0-9]/.test(password)) errores.push('Al menos un número')
  if (!/[!@#$%^&*]/.test(password)) errores.push('Al menos un símbolo (!@#$%^&*)')

  return errores
}

const cambiarContrasena = async () => {
  const errores = validarPasswordOWASP(nuevaContrasena.value)

  if (errores.length > 0) {
    alert(
      'La contraseña no cumple los requisitos:\n\n' +
      errores.map(e => `• ${e}`).join('\n')
    )
    return
  }

  if (nuevaContrasena.value !== confirmarContrasena.value) {
    alert('Las contraseñas no coinciden')
    return
  }

  loading.value = true

  try {
    await authService.resetPasswordPrimerIngreso({
      nuevaContrasena: nuevaContrasena.value
    })

    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    alert('Contraseña cambiada correctamente. Inicia sesión nuevamente.')
    router.replace('/')
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.error || 'Error al cambiar contraseña')
  } finally {
    loading.value = false
  }
}
</script>
