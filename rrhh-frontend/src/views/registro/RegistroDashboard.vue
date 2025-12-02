<!-- src/views/registro/RegistroDashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header específico para Registro y Habilitación -->
    <header class="bg-[#009d71] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo y título -->
          <div class="flex items-center space-x-4">
            <img 
              src="/images/rraa.png" 
              alt="Logo Distrito Scout"
              class="h-10 w-auto"
            >
            <h1 class="text-2xl font-bold text-white">Sistema RRHH - Distrito Scout</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-white">¡Hola {{ nombreResponsable }}!</span>
            <button 
              @click="cerrarSesion"
              class="bg-white text-[#009d71] px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-semibold"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation específica para Registro y Habilitación -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            @click="navegarA('inicio-registro')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'inicio-registro' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Inicio
          </button>
          
          <button 
            @click="navegarA('solicitudes-pendientes-registro')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'solicitudes-pendientes-registro' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Solicitudes pendientes
          </button>
          
          <button 
            @click="navegarA('lista-dirigentes-habilitados')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'lista-dirigentes-habilitados' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Dirigentes habilitados
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título con saludo -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">¡Hola {{ nombreResponsable }}!</h1>
          <p class="text-gray-600 mt-1">Bienvenido a Registro y Habilitación</p>
        </div>

        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total de dirigentes -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Total dirigentes</p>
                <p class="text-3xl font-bold text-gray-900">150</p>
              </div>
              <div class="bg-blue-100 rounded-full p-3">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                <span>+12 desde el mes pasado</span>
              </div>
            </div>
          </div>

          <!-- Dirigentes habilitados -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Dirigentes habilitados</p>
                <p class="text-3xl font-bold text-gray-900">60</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 40%"></div>
              </div>
              <p class="text-xs text-gray-600 mt-1">40% del total</p>
            </div>
          </div>

          <!-- Dirigentes inhabilitados -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 mb-1">Dirigentes inhabilitados</p>
                <p class="text-3xl font-bold text-gray-900">90</p>
              </div>
              <div class="bg-red-100 rounded-full p-3">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
              </div>
            </div>
            <div class="mt-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-red-600 h-2 rounded-full" style="width: 60%"></div>
              </div>
              <p class="text-xs text-gray-600 mt-1">60% del total</p>
            </div>
          </div>
        </div>

        <!-- Gráfico de distribución -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Distribución de dirigentes</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Gráfico circular -->
            <div>
              <div class="flex items-center justify-center">
                <div class="relative w-48 h-48">
                  <!-- Círculo de fondo -->
                  <div class="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                  <!-- Segmento habilitados -->
                  <div class="absolute inset-0 rounded-full border-8 border-green-600" 
                       style="clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%); transform: rotate(144deg);">
                  </div>
                  <!-- Segmento inhabilitados -->
                  <div class="absolute inset-0 rounded-full border-8 border-red-600" 
                       style="clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 50%); transform: rotate(144deg);">
                  </div>
                  <!-- Centro -->
                  <div class="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full"></div>
                  <!-- Texto central -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-2xl font-bold text-gray-900">150</span>
                    <span class="text-sm text-gray-600">Total</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Leyenda y estadísticas detalladas -->
            <div>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full bg-green-600 mr-3"></div>
                    <div>
                      <p class="font-medium text-gray-900">Habilitados</p>
                      <p class="text-sm text-gray-600">Cumplen todos los requisitos</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">60</p>
                    <p class="text-sm text-gray-600">40%</p>
                  </div>
                </div>

                <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full bg-red-600 mr-3"></div>
                    <div>
                      <p class="font-medium text-gray-900">Inhabilitados</p>
                      <p class="text-sm text-gray-600">Falta documentación o requisitos</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">90</p>
                    <p class="text-sm text-gray-600">60%</p>
                  </div>
                </div>

                <!-- Estadísticas adicionales -->
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm font-medium text-gray-700 mb-1">Pendientes de revisión</p>
                    <p class="text-xl font-bold text-gray-900">8</p>
                  </div>
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm font-medium text-gray-700 mb-1">Rechazados este mes</p>
                    <p class="text-xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Acciones rápidas</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              @click="navegarA('solicitudes-pendientes-registro')"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              <div class="bg-blue-100 rounded-full p-2 mr-4">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">Revisar solicitudes</p>
                <p class="text-sm text-gray-600">8 pendientes de revisión</p>
              </div>
            </button>

            <button 
              @click="navegarA('lista-dirigentes-habilitados')"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              <div class="bg-green-100 rounded-full p-2 mr-4">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">Dirigentes habilitados</p>
                <p class="text-sm text-gray-600">60 dirigentes activos</p>
              </div>
            </button>

            <button 
              @click="verReportes"
              class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              <div class="bg-purple-100 rounded-full p-2 mr-4">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-gray-900">Reportes</p>
                <p class="text-sm text-gray-600">Estadísticas y análisis</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer del módulo -->
        <footer class="mt-8 text-center">
          <p class="text-gray-500 text-sm">
            Desarrollado por Edely Tito - GSA • Distrito Scout La Paz
          </p>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreResponsable = ref('Responsable de Registro')
const rutaActiva = ref('inicio-registro')

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  
  switch(destino) {
    case 'inicio-registro':
      break
    case 'solicitudes-pendientes-registro':
      router.push('/registro/solicitudes-pendientes-registro')
      break
    case 'lista-dirigentes-habilitados':
      router.push('/registro/dirigentes-habilitados')
      break
  }
}

const verReportes = () => {
  alert('Funcionalidad de reportes en desarrollo')
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
/* Estilos específicos para la vista de Registro y Habilitación */
</style>