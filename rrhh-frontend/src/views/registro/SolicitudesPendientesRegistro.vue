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
        <!-- Título con estadísticas -->
        <div class="mb-8">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Solicitudes pendientes</h1>
              <p class="text-gray-600 mt-1">Revisión de solicitudes de habilitación</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                {{ solicitudesPendientes.length }} solicitudes pendientes
              </span>
              <button 
                @click="exportarExcel"
                class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 font-medium flex items-center space-x-2"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Filtro por grupo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Grupo Scout</label>
              <select 
                v-model="filtroGrupo"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
                <option value="">Todos los grupos</option>
                <option v-for="grupo in gruposUnicos" :key="grupo" :value="grupo">
                  {{ grupo }}
                </option>
              </select>
            </div>
            
            <!-- Filtro por rama -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rama</label>
              <select 
                v-model="filtroRama"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
                <option value="">Todas las ramas</option>
                <option v-for="rama in ramasUnicas" :key="rama" :value="rama">
                  {{ rama }}
                </option>
              </select>
            </div>
            
            <!-- Filtro por fecha -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <select 
                v-model="filtroFecha"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
                <option value="">Todas las fechas</option>
                <option value="ultima-semana">Última semana</option>
                <option value="ultimo-mes">Último mes</option>
                <option value="ultimos-3-meses">Últimos 3 meses</option>
              </select>
            </div>
            
            <!-- Botón de limpiar filtros -->
            <div class="flex items-end">
              <button 
                @click="limpiarFiltros"
                class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de solicitudes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Tabla -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rama
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="solicitud in solicitudesFiltradas" 
                  :key="solicitud.id"
                  class="hover:bg-gray-50 transition duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ obtenerIniciales(solicitud.nombre) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ solicitud.nombre }}</div>
                        <div class="text-xs text-gray-500">{{ solicitud.ci }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getColorRama(solicitud.rama)
                    ]">
                      {{ solicitud.rama }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ solicitud.grupo }}</div>
                    <div class="text-xs text-gray-500">{{ solicitud.distrito || 'Distrito La Paz' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ solicitud.fecha }}</div>
                    <div class="text-xs text-gray-500">{{ calcularDiasPendientes(solicitud.fecha) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="verSolicitud(solicitud.id)"
                      class="text-[#009d71] hover:text-[#007a5c] mr-3 font-medium"
                    >
                      Ver solicitud
                    </button>
                    <button 
                      @click="aprobarRapido(solicitud.id)"
                      class="text-green-600 hover:text-green-900 mr-3 font-medium"
                    >
                      Aprobar
                    </button>
                    <button 
                      @click="rechazarRapido(solicitud.id)"
                      class="text-red-600 hover:text-red-900 font-medium"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje si no hay solicitudes -->
          <div 
            v-if="solicitudesFiltradas.length === 0" 
            class="text-center py-12"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="mt-2 text-gray-500">No hay solicitudes pendientes con los filtros aplicados.</p>
            <button 
              @click="limpiarFiltros"
              class="mt-4 text-[#009d71] hover:text-[#007a5c] font-medium"
            >
              Limpiar filtros
            </button>
          </div>

          <!-- Footer de la tabla -->
          <div v-if="solicitudesFiltradas.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                Mostrando {{ solicitudesFiltradas.length }} de {{ solicitudesPendientes.length }} solicitudes
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="cambiarPagina(paginaActual - 1)"
                  :disabled="paginaActual === 1"
                  :class="[
                    'px-3 py-1 rounded-lg border border-gray-300 font-medium',
                    paginaActual === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  Anterior
                </button>
                <span class="text-sm text-gray-700">
                  Página {{ paginaActual }} de {{ totalPaginas }}
                </span>
                <button 
                  @click="cambiarPagina(paginaActual + 1)"
                  :disabled="paginaActual === totalPaginas"
                  :class="[
                    'px-3 py-1 rounded-lg border border-gray-300 font-medium',
                    paginaActual === totalPaginas 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de acciones masivas -->
        <div v-if="solicitudesSeleccionadas.length > 0" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-sm font-medium text-blue-900">
                {{ solicitudesSeleccionadas.length }} solicitudes seleccionadas
              </span>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="aprobarMasivo"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium text-sm"
              >
                Aprobar seleccionadas
              </button>
              <button 
                @click="rechazarMasivo"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium text-sm"
              >
                Rechazar seleccionadas
              </button>
              <button 
                @click="limpiarSeleccion"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium text-sm"
              >
                Limpiar selección
              </button>
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
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreResponsable = ref('Responsable de Registro')
const rutaActiva = ref('solicitudes-pendientes-registro')

// Filtros
const filtroGrupo = ref('')
const filtroRama = ref('')
const filtroFecha = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 10

// Selección masiva
const solicitudesSeleccionadas = ref([])

// Datos de solicitudes pendientes (según página 21 del PDF)
const solicitudesPendientes = ref([
  {
    id: 1,
    nombre: 'Felipe Alejandro Lopez',
    ci: '2065866',
    rama: 'Lobatos',
    grupo: 'Boliviano Israelita',
    distrito: 'Distrito La Paz',
    fecha: '25/03/2025',
    prioridad: 'alta',
    diasPendiente: 5
  },
  {
    id: 2,
    nombre: 'Alejandra Calles',
    ci: '1854215',
    rama: 'Pioneros',
    grupo: 'Amerinst 301',
    distrito: 'Distrito La Paz',
    fecha: '02/02/2025',
    prioridad: 'media',
    diasPendiente: 28
  },
  {
    id: 3,
    nombre: 'Luciana Montes',
    ci: '2045879',
    rama: 'Exploradores',
    grupo: 'San Calixto',
    distrito: 'Distrito La Paz',
    fecha: '20/01/2025',
    prioridad: 'baja',
    diasPendiente: 41
  },
  {
    id: 4,
    nombre: 'Carlos Mendoza',
    ci: '1987456',
    rama: 'Rovers',
    grupo: 'Boliviano Israelita',
    distrito: 'Distrito La Paz',
    fecha: '15/03/2025',
    prioridad: 'alta',
    diasPendiente: 10
  },
  {
    id: 5,
    nombre: 'Ana Rodríguez',
    ci: '2154879',
    rama: 'Lobatos',
    grupo: 'Amerinst 301',
    distrito: 'Distrito La Paz',
    fecha: '10/03/2025',
    prioridad: 'media',
    diasPendiente: 15
  },
  {
    id: 6,
    nombre: 'Juan Pérez',
    ci: '1896547',
    rama: 'Exploradores',
    grupo: 'San Calixto',
    distrito: 'Distrito La Paz',
    fecha: '28/02/2025',
    prioridad: 'baja',
    diasPendiente: 25
  },
  {
    id: 7,
    nombre: 'María González',
    ci: '2054871',
    rama: 'Pioneros',
    grupo: 'Boliviano Israelita',
    distrito: 'Distrito La Paz',
    fecha: '05/03/2025',
    prioridad: 'alta',
    diasPendiente: 20
  }
])

// Estadísticas
const estadisticas = ref({
  hoy: 2,
  semana: 8,
  tiempoPromedio: 18
})

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'
})

// Computed properties
const solicitudesFiltradas = computed(() => {
  let filtradas = [...solicitudesPendientes.value]
  
  // Aplicar filtro por grupo
  if (filtroGrupo.value) {
    filtradas = filtradas.filter(s => s.grupo === filtroGrupo.value)
  }
  
  // Aplicar filtro por rama
  if (filtroRama.value) {
    filtradas = filtradas.filter(s => s.rama === filtroRama.value)
  }
  
  // Aplicar filtro por fecha (esto es un ejemplo simple)
  if (filtroFecha.value) {
    // En una implementación real, aquí habría lógica para filtrar por fecha
    filtradas = filtradas.filter(s => s.diasPendiente > 7) // Ejemplo
  }
  
  // Paginación
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  return filtradas.slice(inicio, inicio + itemsPorPagina)
})

const gruposUnicos = computed(() => {
  const grupos = solicitudesPendientes.value.map(s => s.grupo)
  return [...new Set(grupos)]
})

const ramasUnicas = computed(() => {
  const ramas = solicitudesPendientes.value.map(s => s.rama)
  return [...new Set(ramas)]
})

const totalPaginas = computed(() => {
  return Math.ceil(solicitudesPendientes.value.length / itemsPorPagina)
})

// Métodos
const navegarA = (destino) => {
  rutaActiva.value = destino
  
  switch(destino) {
    case 'inicio-registro':
      router.push('/registro')
      break
    case 'solicitudes-pendientes-registro':
      // Ya estamos aquí
      break
    case 'lista-dirigentes-habilitados':
      router.push('/registro/dirigentes-habilitados')
      break
  }
}

const obtenerIniciales = (nombre) => {
  return nombre.split(' ')
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getColorRama = (rama) => {
  const colores = {
    'Lobatos': 'bg-orange-100 text-orange-800',
    'Exploradores': 'bg-blue-100 text-blue-800',
    'Pioneros': 'bg-green-100 text-green-800',
    'Rovers': 'bg-purple-100 text-purple-800'
  }
  return colores[rama] || 'bg-gray-100 text-gray-800'
}

const calcularDiasPendientes = (fecha) => {
  const hoy = new Date()
  const fechaSolicitud = new Date(fecha.split('/').reverse().join('-'))
  const diferencia = hoy - fechaSolicitud
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  return `${dias} días pendiente`
}

const verSolicitud = (id) => {
  router.push(`/registro/solicitud/${id}`)
}

const aprobarRapido = (id) => {
  if (confirm('¿Está seguro de aprobar esta solicitud?')) {
    solicitudesPendientes.value = solicitudesPendientes.value.filter(s => s.id !== id)
    alert('Solicitud aprobada exitosamente')
  }
}

const rechazarRapido = (id) => {
  const motivo = prompt('Ingrese el motivo del rechazo:')
  if (motivo && motivo.trim() !== '') {
    solicitudesPendientes.value = solicitudesPendientes.value.filter(s => s.id !== id)
    alert(`Solicitud rechazada. Motivo: ${motivo}`)
  }
}

const aprobarMasivo = () => {
  if (confirm(`¿Está seguro de aprobar ${solicitudesSeleccionadas.value.length} solicitudes?`)) {
    solicitudesPendientes.value = solicitudesPendientes.value.filter(
      s => !solicitudesSeleccionadas.value.includes(s.id)
    )
    solicitudesSeleccionadas.value = []
    alert('Solicitudes aprobadas exitosamente')
  }
}

const rechazarMasivo = () => {
  const motivo = prompt('Ingrese el motivo del rechazo para todas las solicitudes seleccionadas:')
  if (motivo && motivo.trim() !== '') {
    solicitudesPendientes.value = solicitudesPendientes.value.filter(
      s => !solicitudesSeleccionadas.value.includes(s.id)
    )
    solicitudesSeleccionadas.value = []
    alert(`Solicitudes rechazadas. Motivo: ${motivo}`)
  }
}

const limpiarSeleccion = () => {
  solicitudesSeleccionadas.value = []
}

const limpiarFiltros = () => {
  filtroGrupo.value = ''
  filtroRama.value = ''
  filtroFecha.value = ''
  paginaActual.value = 1
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
  }
}

const exportarExcel = () => {
  alert('Exportando datos a Excel...')
  // Aquí iría la lógica para exportar a Excel
}

const descargarFormatos = () => {
  alert('Descargando formatos de revisión...')
}

const verGuia = () => {
  alert('Abriendo guía de habilitación...')
}

const enviarRecordatorios = () => {
  if (confirm('¿Enviar recordatorios a todos los solicitantes pendientes?')) {
    alert('Recordatorios enviados exitosamente')
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
/* Estilos específicos para la vista de solicitudes pendientes */
</style>