<template>
  <div class="min-h-screen bg-gray-50">
    <RegistroHeader
      v-if="!embebido"
      :nombre="nombreResponsable"
      @logout="cerrarSesion"
    />
    
    <RegistroNav
      v-if="!embebido"
      :navClass="navClass"
      :navegar="navegarA"
    />

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
            <p class="text-sm text-gray-500 mt-2">
              Último inicio de sesión:
              <span class="font-medium text-gray-700">
                {{ ultimoLogin
                  ? new Date(ultimoLogin).toLocaleString('es-BO')
                  : '—'
                }}
              </span>
            </p>
          </div>

          <!-- Estadísticas principales -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <!-- Dirigentes habilitados -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">
                    Dirigentes habilitados
                  </p>
                  <p class="text-3xl font-bold text-gray-900">
                    {{ estadisticas.solicitudes.habilitadas }}
                  </p>
                </div>
                <div class="bg-green-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>


            <!-- Solicitudes pendientes -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Solicitudes pendientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ estadisticas.solicitudes.pendientes }}</p>
                </div>
                <div class="bg-yellow-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Solicitudes rechazadas -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Solicitudes rechazadas (histórico)</p>
                  <p class="text-3xl font-bold text-gray-900">
                    {{ estadisticas.solicitudes.rechazadas }}
                  </p>
                </div>
                <div class="bg-red-100 rounded-full p-3">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          <!-- Gráfico de distribución y estadísticas -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Distribución de solicitudes de Registro y Habilitación</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

              <!-- GRÁFICO DE PASTEL -->
              <div class="flex justify-center">
                <div
                  class="w-56 h-56 rounded-full relative"
                  :style="pieStyle"
                >
                  <div class="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center">
                    <p class="text-2xl font-bold text-gray-900">
                      {{ totalSolicitudes }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Solicitudes
                    </p>
                  </div>
                </div>
              </div>

              <!-- LEYENDA -->
              <div class="space-y-4">
                <div class="flex items-center justify-between bg-yellow-50 p-3 rounded">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span class="font-medium">Pendientes</span>
                  </div>
                  <span class="font-semibold">
                    {{ porcentajePendientesFmt }}%
                  </span>
                </div>

                <div class="flex items-center justify-between bg-green-50 p-3 rounded">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-green-600"></span>
                    <span class="font-medium">Habilitadas</span>
                  </div>
                  <span class="font-semibold">
                    {{ porcentajeHabilitadasFmt }}%
                  </span>
                </div>

                <div class="flex items-center justify-between bg-red-50 p-3 rounded">
                  <div class="flex items-center gap-3">
                    <span class="w-3 h-3 rounded-full bg-red-600"></span>
                    <span class="font-medium">Rechazadas</span>
                  </div>
                  <span class="font-semibold">
                    {{ porcentajeRechazadasFmt }}%
                  </span>
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
import RegistroHeader from '../../components/registro/RegistroHeader.vue'
import RegistroNav from '../../components/registro/RegistroNav.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { registroService} from '../../services/api'

const props = defineProps({
  embebido: {
    type: Boolean,
    default: false
  }
})

const esAdmin = computed(() => props.embebido === true)

const router = useRouter()
const route = useRoute()

const nombreResponsable = ref('Responsable de Registro')
const cargando = ref(true)
const fechaActualizada = ref('')

const ultimoLogin = ref(null)

const cargarUltimoLogin = async () => {
  try {
    const res = await authService.getUltimoLogin()
    ultimoLogin.value = res.data.ultimo_login
  } catch (e) {
    console.error(e)
  }
}

// Estadísticas
const estadisticas = ref({
  totalDirigentes: 0,
  solicitudes: {
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0
  }
})

const totalSolicitudes = computed(() => {
  const s = estadisticas.value.solicitudes
  return s.pendientes + s.habilitadas + s.rechazadas
})

const porcentajePendientes = computed(() =>
  totalSolicitudes.value
    ? (estadisticas.value.solicitudes.pendientes / totalSolicitudes.value) * 100
    : 0
)

const porcentajeHabilitadas = computed(() =>
  totalSolicitudes.value
    ? (estadisticas.value.solicitudes.habilitadas / totalSolicitudes.value) * 100
    : 0
)

const porcentajeRechazadas = computed(() =>
  totalSolicitudes.value
    ? (estadisticas.value.solicitudes.rechazadas / totalSolicitudes.value) * 100
    : 0
)

const porcentajePendientesFmt = computed(() =>
  porcentajePendientes.value.toFixed(1)
)

const porcentajeHabilitadasFmt = computed(() =>
  porcentajeHabilitadas.value.toFixed(1)
)

const porcentajeRechazadasFmt = computed(() =>
  porcentajeRechazadas.value.toFixed(1)
)

const pieStyle = computed(() => {
  const pPend = porcentajePendientes.value
  const pHab = porcentajeHabilitadas.value
  const pRech = porcentajeRechazadas.value

  return {
    background: `conic-gradient(
      #eab308 0% ${pPend}%,
      #16a34a ${pPend}% ${pPend + pHab}%,
      #dc2626 ${pPend + pHab}% 100%
    )`
  }
})

onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'

  await cargarEstadisticas()
  await cargarultimoLogin()
})

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

const navClass = (pathExacto, incluye = false) => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200'
  const activo = incluye
    ? route.path.includes(pathExacto)
    : route.path === pathExacto

  return activo
    ? `${base} border-[#009d71] text-[#009d71]`
    : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

const navegarA = (path) => {
  router.push(path)
}


const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}

</script>