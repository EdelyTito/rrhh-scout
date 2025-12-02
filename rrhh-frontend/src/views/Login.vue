<template>
  <div 
    class="login-container"
    :style="backgroundStyle"
  >
    <!-- Fondo semi-transparente para mejor legibilidad -->
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
          <input
            id="contrasena"
            v-model="contrasena"
            type="password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
            :class="{ 'border-red-500': errorMessage }"
            placeholder="Ingresa tu contraseña"
            required
          >
        </div>

        <!-- Mensaje de error mejorado -->
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
            
            <!-- Sugerencias según el tipo de error -->
            <div v-if="showPasswordSuggestions" class="mt-2 text-xs">
              <p class="font-medium">Sugerencias:</p>
              <ul class="list-disc list-inside mt-1 space-y-1">
                <li>Verifica que tu contraseña sea correcta</li>
                <li>Recuerda que las contraseñas distinguen entre mayúsculas y minúsculas</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Modal para olvidó contraseña -->
        <div v-if="showForgotPassword" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-bold mb-4">Recuperar contraseña</h3>
            <p class="text-gray-600 mb-4">
              Para recuperar tu contraseña, por favor contacta al administrador del sistema.
            </p>
            <div class="flex justify-end space-x-2">
              <button 
                @click="showForgotPassword = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cerrar
              </button>
              <button 
                @click="contactAdmin"
                class="px-4 py-2 bg-[#009d71] text-white rounded-lg hover:bg-[#008060] font-medium"
              >
                Contactar administrador
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
import { useRouter } from 'vue-router'
import { authService } from '../services/api'

const router = useRouter()

// Datos del formulario
const correo = ref('')
const contrasena = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showForgotPassword = ref(false)

// Rutas de las imágenes
const logo = ref('/images/rraa.png')
const backgroundImage = ref('/images/distrito.jpg')

// Computed para mostrar sugerencias contextuales
const showPasswordSuggestions = computed(() => {
  return errorMessage.value.toLowerCase().includes('contraseña') || 
         errorMessage.value.toLowerCase().includes('password') ||
         errorMessage.value.toLowerCase().includes('credenciales')
})

const showEmailSuggestions = computed(() => {
  return errorMessage.value.toLowerCase().includes('correo') || 
         errorMessage.value.toLowerCase().includes('email') ||
         errorMessage.value.toLowerCase().includes('usuario') ||
         errorMessage.value.toLowerCase().includes('encontrado')
})

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${backgroundImage.value})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const handleImageError = (event) => {
  console.log('Error cargando imagen:', event.target.src)
  if (event.target.alt.includes('Logo')) {
    event.target.style.display = 'none'
  }
}

const handleLogin = async () => {
  console.log('=== INICIANDO LOGIN ===')
  
  // Limpiar errores previos
  errorMessage.value = ''

  // Validación básica
  if (!correo.value || !contrasena.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(correo.value)) {
    errorMessage.value = 'Por favor ingresa un correo electrónico válido'
    return
  }

  loading.value = true

  try {
    console.log('🔐 Enviando credenciales...')
    
    const response = await authService.login({
      correo: correo.value,
      contrasena: contrasena.value
    })

    console.log('✅ LOGIN EXITOSO:', response.data)

    // Guardar token y datos del usuario
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario))

    // Redirigir según el rol del usuario
    redirectByRole(response.data.usuario.rol_nombre)

  } catch (error) {
    console.log('🔴 ERROR CAPTURADO:')
    console.log('Status:', error.response?.status)
    console.log('Data:', error.response?.data)
    console.log('Mensaje del backend:', error.response?.data?.error)
    
    // Manejo específico de diferentes tipos de errores
    if (error.response?.status === 401) {
      errorMessage.value = 'Credenciales incorrectas. Verifica tu correo y contraseña.'
    } else if (error.response?.status === 404) {
      errorMessage.value = 'Usuario no encontrado. Verifica tu correo electrónico.'
    } else if (error.response?.status === 403) {
      errorMessage.value = 'Tu cuenta no tiene permisos para acceder'
    } else if (error.response?.status >= 500) {
      errorMessage.value = 'Error del servidor. Por favor, intenta más tarde.'
    } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network')) {
      errorMessage.value = 'Error de conexión. Verifica tu internet.'
    } else {
      errorMessage.value = error.response?.data?.error || error.message || 'Error en el inicio de sesión'
    }
    
    // Limpiar contraseña por seguridad
    contrasena.value = ''
    
  } finally {
    loading.value = false
  }
}

const redirectByRole = (rolNombre) => {
  const rutasPorRol = {
    'admin': '/admin',
    'responsable_registro': '/registro',
    'responsable_formation': '/formacion', 
    'responsable_seguimiento': '/seguimiento',
    'subcomisionado_registro': '/registro',
    'subcomisionado_formation': '/formacion',
    'subcomisionado_seguimiento': '/seguimiento',
    'invitado': '/invitado'
  }

  const ruta = rutasPorRol[rolNombre] || '/admin'
  router.push(ruta)
}

const contactAdmin = () => {
  // Aquí puedes implementar la lógica para contactar al administrador
  // Por ejemplo, abrir el cliente de email o mostrar información de contacto
  const adminEmail = 'admin@distritoscout.com'
  window.location.href = `mailto:${adminEmail}?subject=Solicitud de recuperación de contraseña&body=Hola, necesito ayuda para recuperar mi contraseña. Mi correo es: ${correo.value}`
  showForgotPassword.value = false
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

/* Animación para el mensaje de error */
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