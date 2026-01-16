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
            @click="cerrarSession"
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
          @click="navegarA('lista-dirigentes')"
          :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200',
            rutaActiva === 'lista-dirigentes'
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
          Periodo de Prueba
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
              <option value="primera entrega">Primera entrega</option>
              <option value="devolución 1">Devolución 1</option>
              <option value="segunda entrega">Segunda entrega</option>
              <option value="devolución 2">Devolución 2</option>
              <option value="entrega final">Entrega final</option>
              <option value="en entrevista">En entrevista</option>
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

      <!-- Indicador de carga -->
      <div v-if="isLoading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 text-[#009d71] mx-auto" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 mt-2">Cargando solicitudes...</p>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-red-700">{{ error }}</span>
          <button @click="fetchSolicitudes" class="ml-auto text-sm text-[#009d71] font-semibold hover:underline">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Tabla de Solicitudes -->
      <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                        {{ solicitud.nombre_participante?.charAt(0) || '' }}{{ solicitud.nombre_participante?.split(' ')[1]?.charAt(0) || '' }}
                      </span>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ solicitud.nombre_participante }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ solicitud.correo }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="nivelBadgeClass(solicitud.tipo_im)">
                    {{ getNivelTexto(solicitud.tipo_im) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ solicitud.grupo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatFecha(solicitud.fecha_creacion) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="estadoBadgeClass(solicitud.estado)">
                    {{ getEstadoTexto(solicitud.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="verDetalle(solicitud.id)"
                      class="text-blue-600 hover:text-blue-900 font-semibold"
                    >
                      Ver/Revisar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="solicitudesFiltradas.length === 0 && !isLoading" class="text-center py-12">
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
import { seguimientoService } from '../../services/api';

export default {
  name: 'SolicitudesPendientes',
  setup() {
    const router = useRouter()
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('solicitudes')
    const isLoading = ref(false)
    const error = ref(null)

    const filtros = ref({
      nivel: '',
      grupo: '',
      estado: ''
    })

    const solicitudes = ref([])

    // Obtener solicitudes del backend usando seguimientoService
    const fetchSolicitudes = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        // Usar seguimientoService para obtener los seguimientos
        const response = await seguimientoService.getSeguimientos()
        
        // Mapear los datos del backend a la estructura esperada por el frontend
        solicitudes.value = response.data.map(item => ({
          id: item.id,
          nombre_participante: item.nombre_participante || '',
          correo: item.correo || '',
          grupo: item.grupo || '',
          tipo_im: item.tipo_im || '',
          estado: item.estado || '',
          fecha_creacion: item.fecha_creacion || '',
          resultado_final: item.resultado_final || '',
          tipo_proceso: item.tipo_proceso || '',
          rama_scout: item.rama_scout || ''
        }))
        
      } catch (err) {
        console.error('Error al obtener seguimientos:', err)
        error.value = 'Error al cargar las solicitudes. Intenta nuevamente.'
        
        // Datos de ejemplo en caso de error
        solicitudes.value = [
          {
            id: 1,
            nombre_participante: 'Felipe Alejandro Lopez',
            correo: 'felipe@ejemplo.com',
            grupo: 'Boliviano Israelita',
            tipo_im: 'IM2',
            estado: 'primera entrega',
            fecha_creacion: '2025-03-25',
            resultado_final: null,
            tipo_proceso: 'aprobacion',
            rama_scout: 'Exploradores'
          },
          {
            id: 2,
            nombre_participante: 'Alejandra Calles',
            correo: 'alejandra@ejemplo.com',
            grupo: 'Amerinst 301',
            tipo_im: 'IM3',
            estado: 'en proceso',
            fecha_creacion: '2025-02-02',
            resultado_final: null,
            tipo_proceso: 'aprobacion',
            rama_scout: 'Rovers'
          },
          {
            id: 3,
            nombre_participante: 'Luciana Montes',
            correo: 'luciana@ejemplo.com',
            grupo: 'San Calixto',
            tipo_im: 'PaxtuGrupo',
            estado: 'primera entrega',
            fecha_creacion: '2025-01-20',
            resultado_final: null,
            tipo_proceso: 'nombramiento',
            rama_scout: null
          },
          {
            id: 4,
            nombre_participante: 'Rodrigo Llano',
            correo: 'rodrigo@ejemplo.com',
            grupo: 'Boliviano Israelita',
            tipo_im: 'KoodooAdjunto',
            estado: 'entrega final',
            fecha_creacion: '2025-03-28',
            resultado_final: 'Aprobado',
            tipo_proceso: 'nombramiento',
            rama_scout: null
          }
        ]
      } finally {
        isLoading.value = false
      }
    }

    const grupos = computed(() => {
      return [...new Set(solicitudes.value.map(s => s.grupo))]
    })

    const solicitudesFiltradas = computed(() => {
      return solicitudes.value.filter(solicitud => {
        const nivelMatch = !filtros.value.nivel || 
          solicitud.tipo_im?.toLowerCase().includes(filtros.value.nivel.toLowerCase())
        
        const grupoMatch = !filtros.value.grupo || 
          solicitud.grupo === filtros.value.grupo
        
        const estadoMatch = !filtros.value.estado || 
          solicitud.estado === filtros.value.estado
        
        return nivelMatch && grupoMatch && estadoMatch
      })
    })

    // Convertir códigos de nivel a texto legible
    const getNivelTexto = (codigo) => {
      const niveles = {
        'IM2': 'IM Nivel II',
        'IM3': 'IM Nivel III',
        'PaxtuGrupo': 'Paxtu Grupo',
        'PaxtuDistrito': 'Paxtu Distrito',
        'KoodooAdjunto': 'Koodoo Adjunto',
        'KoodooDirector': 'Koodoo Director'
      }
      return niveles[codigo] || codigo
    }

    const getEstadoTexto = (estado) => {
      const estados = {
        'primera entrega': 'Primera entrega',
        'devolución 1': 'Devuelto (1)',
        'segunda entrega': 'Segunda entrega',
        'devolución 2': 'Devuelto (2)',
        'entrega final': 'Entrega final',
        'en entrevista': 'En entrevista',
        'aprobado': 'Aprobado',
        'no aprobó': 'No aprobó'
      }
      return estados[estado] || estado
    }

    const nivelBadgeClass = (codigo) => {
      const nivelTexto = getNivelTexto(codigo)
      const classes = {
        'IM Nivel II': 'bg-blue-100 text-blue-800',
        'IM Nivel III': 'bg-green-100 text-green-800',
        'Paxtu Grupo': 'bg-purple-100 text-purple-800',
        'Paxtu Distrito': 'bg-purple-100 text-purple-800',
        'Koodoo Adjunto': 'bg-orange-100 text-orange-800',
        'Koodoo Director': 'bg-orange-100 text-orange-800'
      }
      return classes[nivelTexto] || 'bg-gray-100 text-gray-800'
    }

    const estadoBadgeClass = (estado) => {
      const classes = {
        'primera entrega': 'bg-yellow-100 text-yellow-800',
        'devolución 1': 'bg-red-100 text-red-800',
        'segunda entrega': 'bg-blue-100 text-blue-800',
        'devolución 2': 'bg-red-100 text-red-800',
        'entrega final': 'bg-purple-100 text-purple-800',
        'en entrevista': 'bg-indigo-100 text-indigo-800',
        'aprobado': 'bg-green-100 text-green-800',
        'no aprobó': 'bg-gray-200 text-gray-800'
      }
      return classes[estado] || 'bg-gray-100 text-gray-800'
    }

    const formatFecha = (fecha) => {
      if (!fecha) return 'Sin fecha'
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
      console.log('Ver detalle de seguimiento:', id)
      // Navegar a la página de detalle del seguimiento
      router.push(`/seguimiento/detalle/${id}`)
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

    const cerrarSession = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      router.push('/login')
    }

    onMounted(() => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
      nombreResponsable.value = usuario.nombre || 'Responsable de Seguimiento'
      
      fetchSolicitudes()
    })

    return {
      nombreResponsable,
      rutaActiva,
      filtros,
      solicitudes,
      grupos,
      solicitudesFiltradas,
      isLoading,
      error,
      getNivelTexto,
      getEstadoTexto,
      nivelBadgeClass,
      estadoBadgeClass,
      formatFecha,
      aplicarFiltros,
      limpiarFiltros,
      verDetalle,
      exportarExcel,
      fetchSolicitudes,
      navegarA,
      cerrarSession
    }
  }
}
</script>