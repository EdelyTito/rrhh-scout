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
            @click="navegarA('/registro')"
            :class="navClass('/registro')"
          >
            Inicio
          </button>

          <button
            @click="navegarA('/registro/solicitudes-pendientes')"
            :class="navClass('solicitudes-pendientes', true)"
          >
            Solicitudes pendientes
          </button>

          <button
            @click="navegarA('/registro/solicitudes-rechazadas')"
            :class="navClass('solicitudes-rechazadas', true)"
          >
            Solicitudes rechazadas
          </button>

          <button
            @click="navegarA('/registro/dirigentes-habilitados')"
            :class="navClass('dirigentes-habilitados', true)"
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

        <!-- Estado de carga -->
        <div v-if="cargando" class="flex justify-center items-center h-64">
          <div class="text-center">
            <svg class="animate-spin h-12 w-12 text-[#009d71] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        </div>

        <!-- Contenido cuando no está cargando -->
        <div v-else>
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
                          <div class="text-sm font-medium text-gray-900">
                            {{ solicitud.nombre }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ solicitud.ci }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 py-1 text-xs font-medium rounded-full',
                        getColorRama(solicitud.rama)
                      ]">
                        {{ solicitud.rama }}
                        <span v-if="!solicitud.rama || solicitud.rama === 'Sin rama'" 
                              class="ml-1 text-xs text-red-500">
                          (!)
                        </span>
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ solicitud.grupo}}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ solicitud.distrito}}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ solicitud.fecha || 'Fecha no disponible' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="verSolicitud(solicitud.id)"
                        class="text-[#009d71] hover:text-[#007a5c] mr-3 font-medium"
                      >
                        Ver solicitud
                      </button>
                      <button
                        @click="abrirModalRechazo(solicitud)"
                        class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
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
        </div>

        <!-- Footer del módulo -->
        <footer class="mt-8 text-center">
          <p class="text-gray-500 text-sm">
            Desarrollado por Edely Tito - GSA • Distrito Scout La Paz
          </p>
        </footer>
      </div>

      <!-- MODAL RECHAZO -->
      <div
        v-if="mostrarModalRechazo"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg w-full max-w-md p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">
            Rechazar solicitud
          </h3>

          <p class="text-sm text-gray-600 mb-2">
            Indica el motivo del rechazo
          </p>

          <textarea
            v-model="motivoRechazo"
            rows="4"
            class="w-full border rounded p-2 text-sm"
            placeholder="Ej: Documentación incompleta"
          ></textarea>

          <p v-if="errorRechazo" class="text-red-600 text-sm mt-1">
            {{ errorRechazo }}
          </p>

          <div class="flex justify-end gap-2 mt-4">
            <button
              @click="mostrarModalRechazo = false"
              class="px-4 py-2 text-sm border rounded"
            >
              Cancelar
            </button>

            <button
              @click="confirmarRechazo"
              class="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirmar rechazo
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { registroService } from '../../services/api'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Registro')

const filtroGrupo = ref('')
const filtroRama = ref('')
const filtroFecha = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 10

const solicitudesPendientes = ref([])
const cargando = ref(true)

// Modal de rechazo
const mostrarModalRechazo = ref(false)
const solicitudSeleccionada = ref(null)
const motivoRechazo = ref('')
const errorRechazo = ref('')

const abrirModalRechazo = (solicitud) => {
  solicitudSeleccionada.value = solicitud
  motivoRechazo.value = ''
  errorRechazo.value = ''
  mostrarModalRechazo.value = true
}

const confirmarRechazo = async () => {
  if (!motivoRechazo.value.trim()) {
    errorRechazo.value = 'El motivo de rechazo es obligatorio'
    return
  }

  try {
    await registroService.rechazarSolicitud(
      solicitudSeleccionada.value.id,
      { motivo: motivoRechazo.value }
    )

    mostrarModalRechazo.value = false
    await cargarSolicitudes() // refresca tabla
  } catch (err) {
    console.error(err)
    errorRechazo.value = 'No se pudo rechazar la solicitud'
  }
}

const estadisticas = ref({
  hoy: 2,
  semana: 8,
  tiempoPromedio: 18
})

onMounted(async () => {
  await cargarSolicitudes()
})

const cargarSolicitudes = async () => {
  try {
    cargando.value = true
    console.log('Intentando cargar solicitudes desde:', 'http://localhost:4000/api/registro')
    
    const response = await registroService.getSolicitudes()
    
    console.log('Respuesta recibida del backend:', response)
    console.log('Datos recibidos:', response.data)
    
    // Depuración detallada
    if (response.data && Array.isArray(response.data)) {
      console.log('Número de solicitudes:', response.data.length)
      
      if (response.data.length > 0) {
        // Mostrar estructura completa del primer elemento
        console.log('Estructura completa del primer elemento:')
        console.table(response.data[0])
        
        // Mostrar todos los campos disponibles
        console.log('Campos disponibles en el primer elemento:')
        Object.keys(response.data[0]).forEach(key => {
          console.log(`  ${key}:`, response.data[0][key])
        })
      }
    }
    
    solicitudesPendientes.value = response.data.map(s => ({
      id: s.id,
      nombre: s.nombre_completo,
      ci: s.ci,
      rama: s.rama || 'Sin rama',
      grupo: s.grupo,
      distrito: s.distrito || 'Distrito La Paz',
      fecha: s.created_at
        ? new Date(s.created_at).toLocaleDateString('es-BO')
        : '—',
      estado: s.estado
    }))
    
    console.log('Solicitudes procesadas para frontend:', solicitudesPendientes.value)
    
  } catch (error) {
    console.error('Error detallado al cargar solicitudes:', error)
    
    if (error.response) {
      console.error('Data del error:', error.response.data)
      console.error('Status:', error.response.status)
      console.error('Headers:', error.response.headers)
      
      alert(`Error ${error.response.status}: ${error.response.data?.error || 'Error del servidor'}`)
    } else if (error.request) {
      console.error('No se recibió respuesta:', error.request)
      alert('Error de conexión: No se pudo conectar con el servidor.')
    } else {
      console.error('Error:', error.message)
      alert(`Error: ${error.message}`)
    }
    
    // Datos de prueba en caso de error
    alert('No se pudieron cargar las solicitudes')

  } finally {
    cargando.value = false
  }
}
const solicitudesFiltradas = computed(() => {
  let filtradas = [...solicitudesPendientes.value]
  
  if (filtroGrupo.value) {
    filtradas = filtradas.filter(s => s.grupo === filtroGrupo.value)
  }
  
  if (filtroRama.value) {
    filtradas = filtradas.filter(s => s.rama === filtroRama.value)
  }

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

const obtenerIniciales = (nombre) => {
  // Si nombre es undefined, null o vacío, retorna "NN"
  if (!nombre || typeof nombre !== 'string') {
    return 'NN'
  }
  
  // Divide el nombre y obtiene las iniciales
  const partes = nombre.trim().split(' ')
  
  // Filtra partes vacías y obtiene las primeras letras
  const iniciales = partes
    .filter(parte => parte.length > 0)
    .map(parte => parte[0].toUpperCase())
    .join('')
  
  // Retorna máximo 2 iniciales
  return iniciales.slice(0, 2) || 'NN'
}

const getColorRama = (rama) => {
  if (!rama || rama === 'Sin rama') {
    return 'bg-gray-100 text-gray-800'
  }
  
  const ramaLimpia = rama.toLowerCase().trim()
  
  const colores = {
    'lobatos': 'bg-orange-100 text-orange-800',
    'exploradores': 'bg-blue-100 text-blue-800',
    'pioneros': 'bg-green-100 text-green-800',
    'rovers': 'bg-purple-100 text-purple-800'
  }
  
  return colores[ramaLimpia] || 'bg-gray-100 text-gray-800'
}

const verSolicitud = (id) => {
  router.push(`/registro/solicitud/${id}`)
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