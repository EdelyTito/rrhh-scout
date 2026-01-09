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
            @click="() => navegarA('inicio-registro')"
            :class="navClass('inicio-registro')"
          >
            Inicio
          </button>
          
          <button 
            @click="() => navegarA('solicitudes-pendientes-registro')"
            :class="navClass('solicitudes-pendientes-registro')"
          >
            Solicitudes pendientes
          </button>

          <button 
            @click="() => navegarA('solicitudes-rechazadas-registro')"
            :class="navClass('solicitudes-rechazadas-registro')"
          >
            Solicitudes rechazadas
          </button>
          
          <button 
            @click="() => navegarA('lista-dirigentes-habilitados')"
            :class="navClass('lista-dirigentes-habilitados')"
          >
            Dirigentes habilitados
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Estado de carga -->
        <div v-if="cargando" class="flex justify-center items-center h-64">
          <div class="text-center">
            <svg class="animate-spin h-12 w-12 text-[#009d71] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>

        <!-- Contenido cuando no está cargando -->
        <div v-else>
          <!-- Título con saludo -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Bienvenido a Registro y Habilitación</h1>
            <p class="text-sm text-gray-500 mt-2">Última actualización: {{ fechaActualizada }}</p>
          </div>

          <!-- Estadísticas principales -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- Total de dirigentes -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Total dirigentes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ estadisticas.totalDirigentes }}</p>
                </div>
                <div class="bg-blue-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Dirigentes habilitados -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Dirigentes habilitados</p>
                  <p class="text-3xl font-bold text-gray-900">{{ estadisticas.habilitados }}</p>
                </div>
                <div class="bg-green-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="mt-4">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-green-600 h-2 rounded-full" :style="{ width: estadisticas.porcentajeHabilitados + '%' }"></div>
                </div>
                <p class="text-xs text-gray-600 mt-1">{{ estadisticas.porcentajeHabilitados.toFixed(1) }}% del total</p>
              </div>
            </div>

            <!-- Solicitudes pendientes -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Solicitudes pendientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ estadisticas.pendientes }}</p>
                </div>
                <div class="bg-yellow-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de distribución y estadísticas -->
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
                         :style="{ clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)`, 
                                  transform: `rotate(${anguloHabilitados}deg)` }">
                    </div>
                    <!-- Segmento inhabilitados -->
                    <div class="absolute inset-0 rounded-full border-8 border-red-600" 
                         :style="{ clipPath: `polygon(50% 50%, 50% 0%, 0% 0%, 0% 50%)`, 
                                  transform: `rotate(${anguloHabilitados}deg)` }">
                    </div>
                    <!-- Centro -->
                    <div class="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full"></div>
                    <!-- Texto central -->
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                      <span class="text-2xl font-bold text-gray-900">{{ estadisticas.totalDirigentes }}</span>
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
                      <p class="font-bold text-gray-900">{{ estadisticas.habilitados }}</p>
                      <p class="text-sm text-gray-600">{{ estadisticas.porcentajeHabilitados.toFixed(1) }}%</p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div class="flex items-center">
                      <div class="h-3 w-3 rounded-full bg-red-600 mr-3"></div>
                      <div>
                        <p class="font-medium text-gray-900">Pendientes</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-gray-900">{{ estadisticas.inhabilitados }}</p>
                      <p class="text-sm text-gray-600">{{ (100 - estadisticas.porcentajeHabilitados).toFixed(1) }}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { registroService, dirigentesService } from '../../services/api'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Registro')
const rutaActiva = ref('inicio-registro')
const cargando = ref(true)
const fechaActualizada = ref('')

// Estadísticas
const estadisticas = ref({
  totalDirigentes: 0,
  habilitados: 0,
  inhabilitados: 0,
  pendientes: 0,
  porcentajeHabilitados: 0,
  incrementoTotal: 0,
  tiempoPromedio: 0,
  urgentes: 0,
  rechazadosMes: 0,
  nuevasSolicitudesMes: 0,
  aprobadasMes: 0
})

onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'

  // Sincronizar ruta activa basada en la ruta actual
  sincronizarRutaActiva()
  await cargarEstadisticas()
})

const sincronizarRutaActiva = () => {
  const path = route.path
  
  if (path.includes('solicitudes-pendientes')) {
    rutaActiva.value = 'solicitudes-pendientes-registro'
  } else if (path.includes('solicitudes-rechazadas')) {
    rutaActiva.value = 'solicitudes-rechazadas-registro'
  } else if (path.includes('dirigentes-habilitados')) {
    rutaActiva.value = 'lista-dirigentes-habilitados'
  } else if (path.includes('/registro') && !path.includes('/registro/')) {
    rutaActiva.value = 'inicio-registro'
  }
}

const navClass = (destino) => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200'
  
  if (rutaActiva.value === destino) {
    return `${base} border-[#009d71] text-[#009d71]`
  }
  
  return `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

const cargarEstadisticas = async () => {
  try {
    cargando.value = true

    const res = await registroService.getEstadisticas()
    estadisticas.value = res.data

    fechaActualizada.value = new Date().toLocaleString('es-BO')
  } catch (err) {
    console.error(err)
  } finally {
    cargando.value = false
  }
}

// Calcular ángulo para el gráfico circular
const anguloHabilitados = computed(() => {
  return (estadisticas.value.porcentajeHabilitados / 100) * 360
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  
  switch(destino) {
    case 'inicio-registro':
      router.push('/registro')
      break
    case 'solicitudes-pendientes-registro':
      router.push('/registro/solicitudes-pendientes')
      break
    case 'solicitudes-rechazadas-registro':
      router.push('/registro/solicitudes-rechazadas')
      break
    case 'lista-dirigentes-habilitados':
      router.push('/registro/dirigentes-habilitados')
      break
  }
}

const exportarReporte = () => {
  alert(`Generando reporte con ${estadisticas.value.totalDirigentes} dirigentes...`)
  // Aquí iría la lógica para exportar el reporte
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}

// Observar cambios en la ruta
import { watch } from 'vue'
watch(
  () => route.path,
  () => {
    sincronizarRutaActiva()
  }
)
</script>