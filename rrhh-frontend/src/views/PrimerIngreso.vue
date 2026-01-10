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
          <input
            v-model="nuevaContrasena"
            type="password"
            required
            class="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#009d71]"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            v-model="confirmarContrasena"
            type="password"
            minlength="6"
            required
            class="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#009d71]"
          />
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
