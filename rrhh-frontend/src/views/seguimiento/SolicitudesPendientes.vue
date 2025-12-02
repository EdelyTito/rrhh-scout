<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header con color verde -->
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

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            @click="navegarA('inicio')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'inicio' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Inicio
          </button>
          
          <button 
            @click="navegarA('solicitudes')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'solicitudes' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Solicitudes Pendientes
          </button>
          
          <button 
            @click="navegarA('dirigentes')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'dirigentes' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Lista de Dirigentes
          </button>
          
          <button 
            @click="navegarA('periodo-prueba')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'periodo-prueba' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Período de Prueba
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Solicitudes Pendientes</h1>
          <p class="text-gray-600">Gestiona las solicitudes de aprobación y nombramientos</p>
        </div>

        <!-- Filtros -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Filtro por Nivel -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
              <select v-model="filtros.nivel" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]">
                <option value="">Todos los niveles</option>
                <option value="IM2">IM Nivel II</option>
                <option value="IM3">IM Nivel III</option>
                <option value="PaxtuGrupo">Paxtu Grupo</option>
                <option value="PaxtuDistrito">Paxtu Distrito</option>
                <option value="KoodooAdjunto">Koodoo Adjunto</option>
                <option value="KoodooDirector">Koodoo Director</option>
              </select>
            </div>

            <!-- Filtro por Grupo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Grupo Scout</label>
              <select v-model="filtros.grupo" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]">
                <option value="">Todos los grupos</option>
                <option v-for="grupo in grupos" :key="grupo" :value="grupo">{{ grupo }}</option>
              </select>
            </div>

            <!-- Filtro por Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select v-model="filtros.estado" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="revision">En revisión</option>
                <option value="observado">Observado</option>
              </select>
            </div>

            <!-- Botones de acción -->
            <div class="flex items-end space-x-2">
              <button 
                @click="aplicarFiltros"
                class="bg-[#009d71] text-white px-4 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 font-semibold"
              >
                Aplicar
              </button>
              <button 
                @click="limpiarFiltros"
                class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de Solicitudes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header de la tabla -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">Solicitudes ({{ solicitudesFiltradas.length }})</h2>
              <div class="flex space-x-2">
                <button 
                  @click="exportarExcel"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-semibold"
                >
                  Exportar Excel
                </button>
              </div>
            </div>
          </div>

          <!-- Tabla -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="solicitud in solicitudesFiltradas" :key="solicitud.id" 
                    class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-[#009d71] rounded-full flex items-center justify-center">
                        <span class="text-white font-semibold text-sm">
                          {{ solicitud.nombre.charAt(0) }}{{ solicitud.apellido.charAt(0) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ solicitud.nombre }} {{ solicitud.apellido }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ solicitud.ci }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="nivelBadgeClass(solicitud.nivel)">
                      {{ solicitud.nivel }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ solicitud.grupo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatFecha(solicitud.fecha) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="estadoBadgeClass(solicitud.estado)">
                      {{ solicitud.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="verDetalle(solicitud.id)"
                        class="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        Ver
                      </button>
                      <button 
                        @click="aprobarSolicitud(solicitud.id)"
                        class="text-green-600 hover:text-green-900 font-semibold"
                      >
                        Aprobar
                      </button>
                      <button 
                        @click="rechazarSolicitud(solicitud.id)"
                        class="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="solicitudesFiltradas.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-gray-500 text-lg">No hay solicitudes pendientes</p>
            <p class="text-gray-400 text-sm mt-1">Todas las solicitudes han sido procesadas</p>
          </div>

          <!-- Paginación -->
          <div v-if="solicitudesFiltradas.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-700">
                Mostrando <span class="font-semibold">{{ solicitudesFiltradas.length }}</span> solicitudes
              </div>
              <div class="flex space-x-2">
                <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Anterior
                </button>
                <button class="px-3 py-1 border border-gray-300 rounded text-sm bg-[#009d71] text-white">
                  1
                </button>
                <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          Desarrollado por Edely Tito - GSA
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SolicitudesPendientes',
  setup() {
    const router = useRouter()
    
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('solicitudes')

    // Filtros
    const filtros = ref({
      nivel: '',
      grupo: '',
      estado: ''
    })

    // Datos de ejemplo
    const solicitudes = ref([
      {
        id: 1,
        nombre: 'Felipe Alejandro',
        apellido: 'Lopez',
        ci: '2065866',
        nivel: 'IM Nivel II',
        grupo: 'Boliviano Israelita',
        fecha: '2025-03-25',
        estado: 'pendiente'
      },
      {
        id: 2,
        nombre: 'Alejandra',
        apellido: 'Calles',
        ci: '2154876',
        nivel: 'IM Nivel III',
        grupo: 'Amerinst 301',
        fecha: '2025-02-02',
        estado: 'revision'
      },
      {
        id: 3,
        nombre: 'Luciana',
        apellido: 'Montes',
        ci: '1987452',
        nivel: 'Paxtu Grupo',
        grupo: 'San Calixto',
        fecha: '2025-01-20',
        estado: 'observado'
      },
      {
        id: 4,
        nombre: 'Rodrigo',
        apellido: 'Llano',
        ci: '2245871',
        nivel: 'Koodoo Adjunto',
        grupo: 'Boliviano Israelita',
        fecha: '2025-03-28',
        estado: 'pendiente'
      }
    ])

    const grupos = computed(() => {
      return [...new Set(solicitudes.value.map(s => s.grupo))]
    })

    // Solicitudes filtradas
    const solicitudesFiltradas = computed(() => {
      return solicitudes.value.filter(solicitud => {
        const nivelMatch = !filtros.value.nivel || 
                          solicitud.nivel.toLowerCase().includes(filtros.value.nivel.toLowerCase())
        const grupoMatch = !filtros.value.grupo || solicitud.grupo === filtros.value.grupo
        const estadoMatch = !filtros.value.estado || solicitud.estado === filtros.value.estado
        
        return nivelMatch && grupoMatch && estadoMatch
      })
    })

    // Clases para badges
    const nivelBadgeClass = (nivel) => {
      const classes = {
        'IM Nivel II': 'bg-blue-100 text-blue-800',
        'IM Nivel III': 'bg-green-100 text-green-800',
        'Paxtu Grupo': 'bg-purple-100 text-purple-800',
        'Paxtu Distrito': 'bg-purple-100 text-purple-800',
        'Koodoo Adjunto': 'bg-orange-100 text-orange-800',
        'Koodoo Director': 'bg-orange-100 text-orange-800'
      }
      return classes[nivel] || 'bg-gray-100 text-gray-800'
    }

    const estadoBadgeClass = (estado) => {
      const classes = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'revision': 'bg-blue-100 text-blue-800',
        'observado': 'bg-red-100 text-red-800'
      }
      return classes[estado] || 'bg-gray-100 text-gray-800'
    }

    // Funciones
    const formatFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES')
    }

    const aplicarFiltros = () => {
      console.log('Aplicando filtros:', filtros.value)
    }

    const limpiarFiltros = () => {
      filtros.value = {
        nivel: '',
        grupo: '',
        estado: ''
      }
    }

    const verDetalle = (id) => {
      console.log('Ver detalle de solicitud:', id)
      // router.push(`/seguimiento/solicitud/${id}`)
      alert(`Ver detalle de solicitud ${id}`)
    }

    const aprobarSolicitud = (id) => {
      if (confirm('¿Estás seguro de aprobar esta solicitud?')) {
        console.log('Aprobando solicitud:', id)
        // Aquí iría la lógica para aprobar
        alert(`Solicitud ${id} aprobada`)
      }
    }

    const rechazarSolicitud = (id) => {
      if (confirm('¿Estás seguro de rechazar esta solicitud?')) {
        console.log('Rechazando solicitud:', id)
        // Aquí iría la lógica para rechazar
        alert(`Solicitud ${id} rechazada`)
      }
    }

    const exportarExcel = () => {
      console.log('Exportando a Excel...')
      alert('Exportando datos a Excel...')
    }

    const navegarA = (destino) => {
      rutaActiva.value = destino
      if (destino === 'inicio') {
        router.push('/seguimiento')
      } else {
        router.push(`/seguimiento/${destino}`)
      }
    }

    const cerrarSesion = () => {
      localStorage.removeItem('usuario')
      localStorage.removeItem('token')
      router.push('/login')
    }

    // Cargar datos del usuario
    onMounted(() => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
      nombreResponsable.value = usuario.nombre || 'Responsable de Seguimiento'
    })

    return {
      nombreResponsable,
      rutaActiva,
      filtros,
      solicitudes,
      grupos,
      solicitudesFiltradas,
      nivelBadgeClass,
      estadoBadgeClass,
      formatFecha,
      aplicarFiltros,
      limpiarFiltros,
      verDetalle,
      aprobarSolicitud,
      rechazarSolicitud,
      exportarExcel,
      navegarA,
      cerrarSesion
    }
  }
}
</script>