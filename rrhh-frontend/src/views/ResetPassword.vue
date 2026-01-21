<template>
  <div class="login-container" :style="backgroundStyle">
    <div class="absolute inset-0 bg-blue-900 bg-opacity-60"></div>
    <div class="relative z-10 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">
        Restablecer contraseña
      </h2>

      <form @submit.prevent="handleReset">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Nueva contraseña
          </label>
          <div class="relative">
            <input
              v-model="nuevaContrasena"
              :type="showNueva ? 'text' : 'password'"
              class="w-full border rounded px-3 py-2 pr-10"
              required
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
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
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

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Confirmar contraseña
          </label>
          <div class="relative">
            <input
              v-model="confirmarContrasena"
              :type="showConfirmar ? 'text' : 'password'"
              minlength="12"
              class="w-full border rounded px-3 py-2 pr-10"
              required
            />
            <button
              type="button"
              @click="showConfirmar = !showConfirmar"
              class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              tabindex="-1"
            >
              <!-- Ojo abierto -->
              <svg v-if="!showConfirmar" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
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
          <ul class="text-xs mt-2 space-y-1">
            <li :class="reglasPassword.longitud ? 'text-green-600' : 'text-red-500'">
              • Mínimo 12 caracteres
            </li>
            <li :class="reglasPassword.mayuscula ? 'text-green-600' : 'text-red-500'">
              • Una mayúscula
            </li>
            <li :class="reglasPassword.minuscula ? 'text-green-600' : 'text-red-500'">
              • Una minúscula
            </li>
            <li :class="reglasPassword.numero ? 'text-green-600' : 'text-red-500'">
              • Un número
            </li>
            <li :class="reglasPassword.simbolo ? 'text-green-600' : 'text-red-500'">
              • Un símbolo (!@#$%^&*)
            </li>
          </ul>
        </div>

        <div v-if="error" class="text-red-600 text-sm mb-3">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="!passwordValida || nuevaContrasena.value !== confirmarContrasena.value"
          class="w-full py-2 rounded text-white transition
                bg-[#009d71] hover:bg-[#008060]
                disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Guardar nueva contraseña
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/api'

const route = useRoute()
const router = useRouter()

const token = route.query.token
const nuevaContrasena = ref('')
const confirmarContrasena = ref('')
const error = ref('')

const showNueva = ref(false)
const showConfirmar = ref(false)

const backgroundImage = ref('/images/distrito.jpg')

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImage.value})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const validarPasswordOWASP = (password) => {
  const errores = []

  if (password.length < 12) errores.push('Mínimo 12 caracteres')
  if (!/[A-Z]/.test(password)) errores.push('Al menos una mayúscula')
  if (!/[a-z]/.test(password)) errores.push('Al menos una minúscula')
  if (!/[0-9]/.test(password)) errores.push('Al menos un número')
  if (!/[!@#$%^&*]/.test(password)) errores.push('Al menos un símbolo (!@#$%^&*)')

  return errores
}

const reglasPassword = computed(() => {
  const pwd = nuevaContrasena.value

  return {
    longitud: pwd.length >= 12,
    mayuscula: /[A-Z]/.test(pwd),
    minuscula: /[a-z]/.test(pwd),
    numero: /[0-9]/.test(pwd),
    simbolo: /[!@#$%^&*]/.test(pwd)
  }
})

const passwordValida = computed(() =>
  Object.values(reglasPassword.value).every(v => v)
)

const handleReset = async () => {
  error.value = ''

  if (!nuevaContrasena.value || !confirmarContrasena.value) {
    error.value = 'Completa todos los campos'
    return
  }

  const erroresPassword = validarPasswordOWASP(nuevaContrasena.value)
  if (erroresPassword.length > 0) {
    error.value =
      'La contraseña no cumple los requisitos:\n' +
      erroresPassword.map(e => `• ${e}`).join(' ')
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
    router.replace('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al actualizar contraseña'
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
</style>
