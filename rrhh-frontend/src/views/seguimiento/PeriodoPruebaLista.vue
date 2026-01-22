<template>
  <div class="min-h-screen bg-gray-50">
    
    <SeguimientoHeader
      v-if="!embebido"
      :nombre="nombreResponsable"
      @logout="cerrarSesion"
    />

    <SeguimientoNav
      v-if="!embebido"
      :ruta-activa="rutaActiva"
      @navegar="navegarA"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-xl font-bold text-gray-800 mb-1">
                Período de Prueba y Reincorporación
              </h1>
              <p class="text-sm text-gray-600">
                Gestiona los registros de período de prueba y reincorporación de dirigentes
              </p>
            </div>
          </div>
        </div>

        <!-- Indicador de carga -->
        <div v-if="isLoading" class="text-center py-8">
          <svg class="animate-spin h-8 w-8 text-[#009d71] mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500 mt-2">Cargando registros...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-700">{{ error }}</span>
            <button @click="fetchReincorporaciones" class="ml-auto text-sm text-[#009d71] font-semibold hover:underline">
              Reintentar
            </button>
          </div>
        </div>

        <!-- Contenido principal -->
        <div v-else>
          <!-- Estadísticas rápidas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div class="text-2xl font-bold text-[#009d71]">{{ totalRegistros }}</div>
              <div class="text-sm text-gray-600">Total Registros</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ contarPorTipo('periodo de prueba') }}</div>
              <div class="text-sm text-gray-600">Período de Prueba</div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
              <div class="text-2xl font-bold text-green-600">{{ contarPorTipo('reincorporacion') }}</div>
              <div class="text-sm text-gray-600">Reincorporación</div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Filtro por Tipo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select v-model="filtros.tipo" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]">
                  <option value="">Todos los tipos</option>
                  <option value="periodo de prueba">Período de Prueba</option>
                  <option value="reincorporacion">Reincorporación</option>
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

          <!-- Lista de Registros -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <!-- Header de la tabla -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold text-gray-800">Registros ({{ registrosFiltrados.length }})</h2>
                <div class="flex space-x-2">
                  <button @click="exportarPDF" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                    Exportar PDF
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
                      Nombre
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="registro in registrosFiltrados" :key="registro.id" 
                      class="hover:bg-gray-50 transition duration-150">
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ registro.nombre }} 
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ registro.grupo }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                            :class="tipoBadgeClass(registro.tipo)">
                        {{ getTipoTexto(registro.tipo) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button 
                          @click="verRegistro(registro.id)"
                          class="text-blue-600 hover:text-blue-900 font-semibold"
                        >
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-if="registrosFiltrados.length === 0 && !isLoading" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <p class="text-gray-500 text-lg">No hay registros de período de prueba o reincorporación</p>
              <p class="text-gray-400 text-sm mt-1">Crea un nuevo registro para comenzar</p>
            </div>

            <!-- Paginación -->
            <div v-if="registrosFiltrados.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div class="flex justify-between items-center">
                <div class="text-sm text-gray-700">
                  Mostrando <span class="font-semibold">{{ registrosFiltrados.length }}</span> registros
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

<script setup>
import SeguimientoHeader from '../../components/seguimiento/SeguimientoHeader.vue';
import SeguimientoNav from '../../components/seguimiento/SeguimientoNav.vue';
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const props = defineProps({
  embebido: {
    type: Boolean,
    default: false
  }
})

const baseRuta = computed(() =>
  props.embebido ? '/admin/seguimiento' : '/seguimiento'
)

    const router = useRouter()
    
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('periodo-prueba')
    const isLoading = ref(false)
    const error = ref(null)

    const filtros = ref({
      tipo: '',
      grupo: '',
      estado: ''
    })

    const registros = ref([])

    // Obtener reincorporaciones desde el backend
    const fetchReincorporaciones = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        // Obtener todas las reincorporaciones/períodos de prueba
        const response = await seguimientoService.getReincorporaciones()
        
        // Mapear los datos del backend a la estructura del frontend
        registros.value = response.data.map(item => ({
          id: item.id,
          nombre: item.nombre || 'Sin nombre',
          grupo: item.grupo || 'Sin grupo',
          tipo: item.tipo || '',
          motivo: item.motivo || '',
          fecha_inicio: item.fecha_inicio || '',
          fecha_fin: item.fecha_fin || '',
          telefono: item.telefono || '',
          correo: item.correo || '',
          estado: item.estado || 'pendiente',
          // Simular múltiples dirigentes (en realidad cada registro es un dirigente)
          dirigentes: [
            { 
              nombre: item.nombre || 'Sin nombre',
              ci: item.ci || 'Sin CI'
            }
          ]
        }))
        
      } catch (err) {
        console.error('Error al obtener reincorporaciones:', err)
        error.value = 'Error al cargar los registros. Intenta nuevamente.'
        registros.value = []
      } finally {
        isLoading.value = false
      }
    }

    const grupos = computed(() => {
      return [...new Set(registros.value.map(r => r.grupo))]
    })

    const registrosFiltrados = computed(() => {
      return registros.value.filter(registro => {
        const tipoMatch = !filtros.value.tipo || registro.tipo === filtros.value.tipo
        const grupoMatch = !filtros.value.grupo || registro.grupo === filtros.value.grupo
        const estadoMatch = !filtros.value.estado || registro.estado === filtros.value.estado
        
        return tipoMatch && grupoMatch && estadoMatch
      })
    })

    const totalRegistros = computed(() => registros.value.length)

    const contarPorTipo = (tipo) => {
      return registros.value.filter(r => r.tipo === tipo).length
    }

    const contarPorEstado = (estado) => {
      return registros.value.filter(r => r.estado === estado).length
    }

    // Funciones de utilidad
    const getTipoTexto = (tipo) => {
      const tipos = {
        'periodo de prueba': 'Período de Prueba',
        'reincorporacion': 'Reincorporación'
      }
      return tipos[tipo] || tipo
    }

    const tipoBadgeClass = (tipo) => {
      const classes = {
        'periodo de prueba': 'bg-blue-100 text-blue-800',
        'reincorporacion': 'bg-green-100 text-green-800'
      }
      return classes[tipo] || 'bg-gray-100 text-gray-800'
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
        tipo: '',
        grupo: '',
        estado: ''
      }
    }

const verRegistro = (id) => {
  router.push(`${baseRuta.value}/periodos-prueba-reincorporaciones/${id}`)
}

const exportarPDF = () => {
  if (!registrosFiltrados.value.length) {
    alert('No hay registros para exportar')
    return
  }

  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.text('Reporte – Período de Prueba y Reincorporación', 14, 15)

  doc.setFontSize(10)
  doc.text(`Total: ${registrosFiltrados.value.length}`, 14, 22)
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-BO')}`, 14, 27)

  const columnas = [
    'Nombre',
    'Grupo',
    'Tipo',
    'Estado'
  ]

  const filas = registrosFiltrados.value.map(r => [
    r.nombre,
    r.grupo,
    getTipoTexto(r.tipo),
    r.estado
  ])

  autoTable(doc, {
    startY: 32,
    head: [columnas],
    body: filas,
    styles: { fontSize: 8 }
  })

  doc.save('periodo_prueba_reincorporacion.pdf')
}

const navegarA = (destino) => {
  rutaActiva.value = destino

  if (destino === 'inicio') {
    router.push(baseRuta.value)
  } else {
    router.push(`${baseRuta.value}/${destino}`)
  }
}

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/')
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Seguimiento'
  
  fetchReincorporaciones()
})

</script>