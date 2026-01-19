<template>
  <div 
    class="login-container"
    :style="backgroundStyle"
  >
    <div class="absolute inset-0 bg-blue-900 bg-opacity-60"></div>

    <!-- Card del login -->
    <div class="login-card">
      <div class="text-center mb-8">
        <!-- Logo dentro del card -->
        <img 
          :src="logo" 
          alt="Logo Distrito Scout"
          class="h-20 w-auto mx-auto mb-4"
          @error="handleImageError"
        >
        <h1 class="text-3xl font-bold text-white mb-2">¡Hola!</h1>
        <p class="text-white text-opacity-90">Ingresa tus datos para iniciar sesión</p>
      </div>
      
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="correo" class="block text-sm font-medium text-white mb-2">
            Correo electrónico
          </label>
          <input
            id="correo"
            v-model="correo"
            type="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            :class="{ 'border-red-500': errorMessage }"
            placeholder="Ingresa tu correo"
            required
          >
        </div>
        
        <div>
          <label for="contrasena" class="block text-sm font-medium text-white mb-2">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="contrasena"
              v-model="contrasena"
              :type="showPassword ? 'text' : 'password'"
              @keydown="checkCapsLock"
              @keyup="checkCapsLock"
              @blur="capsLockOn = false"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              :class="{ 'border-red-500': errorMessage }"
              placeholder="Ingresa tu contraseña"
              required
            >

            <p
              v-if="capsLockOn"
              class="mt-2 text-sm text-yellow-200 flex items-center gap-1"
            >
              ⚠️ Caps Lock está activado
            </p>

            <!-- Botón ojito -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              tabindex="-1"
            >
              <!-- OJO ABIERTO -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>

              <!-- OJO CERRADO -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.27-2.943-9.543-7
                  a9.956 9.956 0 012.658-4.568M6.223 6.223A9.956 9.956 0 0112 5
                  c4.478 0 8.27 2.943 9.543 7a9.96 9.96 0 01-4.293 5.036M15 12a3 3 0 00-3-3
                  m0 0a3 3 0 013 3m-3-3L3 21" />
              </svg>
            </button>
          </div>
        </div>

        <div 
          v-if="errorMessage" 
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2 animate-fade-in"
        >
          <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="font-medium">Error de autenticación</p>
            <p class="text-sm mt-1">{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Modal para olvidó contraseña -->
        <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-bold mb-4">Recuperar contraseña</h3>
            <p class="text-gray-600 mb-3">
              Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
            </p>
            <input
              v-model="correo"
              type="email"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="Correo electrónico"
              required
            />
            <div class="flex justify-end space-x-2">
              <button 
                @click="showForgotPassword = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cerrar
              </button>
              <button 
                type="button"
                @click="handleForgotPassword"
                class="px-4 py-2 bg-[#009d71] text-white rounded-lg hover:bg-[#008060] font-medium"
              >
                Enviar correo de recuperación
              </button>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          <p class="text-white mt-2">Iniciando sesión...</p>
        </div>
        
        <button 
          v-else
          type="submit" 
          :disabled="loading"
          class="w-full bg-[#009d71] text-white py-3 px-4 rounded-lg hover:bg-[#008060] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-semibold shadow-md disabled:opacity-50"
        >
          Iniciar sesión
        </button>
        
        <div class="text-center pt-2">
          <button 
            type="button"
            @click="showForgotPassword = true"
            class="text-sm text-white hover:text-gray-200 font-medium transition duration-200"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/api'


const router = useRouter()

const correo = ref('')
const contrasena = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showForgotPassword = ref(false)
const showPassword = ref(false)
const capsLockOn = ref(false)

const logo = ref('/images/rraa.png')
const backgroundImage = ref('/images/distrito.jpg')

const backgroundStyle = computed(() => ({
  'background-image': `url(${backgroundImage.value})`,
  'background-size': 'cover',
  'background-position': 'center',
  'background-repeat': 'no-repeat',
}))

const handleLogin = async () => {
  errorMessage.value = ''

  if (!correo.value || !contrasena.value) {
    errorMessage.value = 'Completa todos los campos.'
    return
  }

  loading.value = true

  try {
    const res = await authService.login({
      correo: correo.value,
      contrasena: contrasena.value
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))

    if (res.data.usuario.primer_ingreso) {
      return router.replace('/primer-ingreso')
    }

    redirectByRole(res.data.usuario.rol_nombre)

  } catch (error) {
    const status = error.response?.status

    if (status === 423) {
      const minutos = error.response.data.minutos_restantes
      errorMessage.value = `Cuenta bloqueada. Intenta nuevamente en ${minutos} minutos.`
    } else if (status === 401) {
      errorMessage.value = 'Credenciales incorrectas.'
    } else if (status === 404) {
      errorMessage.value = 'Usuario no encontrado.'
    } else if (status === 400) {
      errorMessage.value = error.response.data.error || 'Datos inválidos.'
    } else {
      errorMessage.value = 'Error del servidor.'
    }

    contrasena.value = ''
  } finally {
    loading.value = false
  }
}

const checkCapsLock = (event) => {
  if (event.getModifierState) {
    capsLockOn.value = event.getModifierState('CapsLock')
  }
}

const redirectByRole = (rol) => {
  const rutas = {
    admin: '/admin',
    responsable_registro: '/registro',
    responsable_formacion: '/formacion',
    responsable_seguimiento: '/seguimiento',
    subcomisionado_registro: '/registro',
    subcomisionado_formacion: '/formacion',
    subcomisionado_seguimiento: '/seguimiento',
  }
  router.push(rutas[rol] || '/admin')
}

const handleForgotPassword = async () => {
  if (!correo.value) {
    alert('Ingresa tu correo electrónico primero')
    return
  }

  try {
    await authService.forgotPassword(correo.value)
    alert('Correo enviado. Revisa tu bandeja.')
    showForgotPassword.value = false
  } catch (err) {
    alert(err.response?.data?.error || 'Error al enviar el correo')
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
  padding: 1rem;
}

.login-card {
  background: #d32d27b4;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 10;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>