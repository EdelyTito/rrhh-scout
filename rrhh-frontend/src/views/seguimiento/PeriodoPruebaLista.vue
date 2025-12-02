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
            @click="navegarA('solicitudes-pendientes')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'solicitudes-pendientes' 
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
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-800 mb-2">Período de Prueba y Reincorporación</h1>
              <p class="text-gray-600">Gestiona los registros de período de prueba y reincorporación de dirigentes</p>
            </div>
            <button 
              @click="nuevoRegistro"
              class="bg-[#009d71] text-white px-6 py-3 rounded-lg hover:bg-[#007a5c] transition duration-200 font-semibold"
            >
              Nuevo Registro
            </button>
          </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div class="text-2xl font-bold text-orange-600">{{ contarPorEstado('pendiente') }}</div>
            <div class="text-sm text-gray-600">Pendientes</div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <!-- Filtro por Estado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select v-model="filtros.estado" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]">
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
                <option value="completado">Completado</option>
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
                    Grupo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirigente(s)
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
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
                <tr v-for="registro in registrosFiltrados" :key="registro.id" 
                    class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ registro.grupo }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      <div v-for="dirigente in registro.dirigentes" :key="dirigente.ci" class="mb-1">
                        {{ dirigente.nombre }} - CI: {{ dirigente.ci }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="tipoBadgeClass(registro.tipo)">
                      {{ registro.tipo }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatFecha(registro.fecha) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="estadoBadgeClass(registro.estado)">
                      {{ registro.estado }}
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
                      <button 
                        v-if="registro.estado === 'pendiente'"
                        @click="aprobarRegistro(registro.id)"
                        class="text-green-600 hover:text-green-900 font-semibold"
                      >
                        Aprobar
                      </button>
                      <button 
                        v-if="registro.estado === 'pendiente'"
                        @click="rechazarRegistro(registro.id)"
                        class="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Rechazar
                      </button>
                      <button 
                        v-if="registro.estado === 'aprobado' && registro.tipo === 'periodo de prueba'"
                        @click="finalizarPeriodo(registro.id)"
                        class="text-purple-600 hover:text-purple-900 font-semibold"
                      >
                        Finalizar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="registrosFiltrados.length === 0" class="text-center py-12">
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
  name: 'PeriodoPruebaLista',
  setup() {
    const router = useRouter()
    
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('periodo-prueba')

    // Filtros
    const filtros = ref({
      tipo: '',
      grupo: '',
      estado: ''
    })

    // Datos de ejemplo
    const registros = ref([
      {
        id: 1,
        grupo: 'Boliviano Israelita',
        tipo: 'periodo de prueba',
        fecha: '2025-03-25',
        estado: 'pendiente',
        dirigentes: [
          { nombre: 'Felipe Alejandro Lopez', ci: '2065866' }
        ]
      },
      {
        id: 2,
        grupo: 'Amerinst 301',
        tipo: 'reincorporacion',
        fecha: '2025-02-02',
        estado: 'aprobado',
        dirigentes: [
          { nombre: 'Alejandra Calles', ci: '2154876' }
        ]
      },
      {
        id: 3,
        grupo: 'San Calixto',
        tipo: 'periodo de prueba',
        fecha: '2025-01-20',
        estado: 'completado',
        dirigentes: [
          { nombre: 'Luciana Montes', ci: '1987452' },
          { nombre: 'Carlos Rodriguez', ci: '2014587' }
        ]
      },
      {
        id: 4,
        grupo: 'Boliviano Israelita',
        tipo: 'reincorporacion',
        fecha: '2025-03-28',
        estado: 'rechazado',
        dirigentes: [
          { nombre: 'Rodrigo Llano', ci: '2245871' }
        ]
      }
    ])

    const grupos = computed(() => {
      return [...new Set(registros.value.map(r => r.grupo))]
    })

    // Registros filtrados
    const registrosFiltrados = computed(() => {
      return registros.value.filter(registro => {
        const tipoMatch = !filtros.value.tipo || registro.tipo === filtros.value.tipo
        const grupoMatch = !filtros.value.grupo || registro.grupo === filtros.value.grupo
        const estadoMatch = !filtros.value.estado || registro.estado === filtros.value.estado
        
        return tipoMatch && grupoMatch && estadoMatch
      })
    })

    // Estadísticas
    const totalRegistros = computed(() => registros.value.length)

    const contarPorTipo = (tipo) => {
      return registros.value.filter(r => r.tipo === tipo).length
    }

    const contarPorEstado = (estado) => {
      return registros.value.filter(r => r.estado === estado).length
    }

    // Clases para badges
    const tipoBadgeClass = (tipo) => {
      const classes = {
        'periodo de prueba': 'bg-blue-100 text-blue-800',
        'reincorporacion': 'bg-green-100 text-green-800'
      }
      return classes[tipo] || 'bg-gray-100 text-gray-800'
    }

    const estadoBadgeClass = (estado) => {
      const classes = {
        'pendiente': 'bg-yellow-100 text-yellow-800',
        'aprobado': 'bg-green-100 text-green-800',
        'rechazado': 'bg-red-100 text-red-800',
        'completado': 'bg-purple-100 text-purple-800'
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
        tipo: '',
        grupo: '',
        estado: ''
      }
    }

    const verRegistro = (id) => {
      console.log('Ver registro:', id)
      // router.push(`/seguimiento/periodo-prueba/${id}`)
      alert(`Ver detalle del registro ${id}`)
    }

    const aprobarRegistro = (id) => {
      if (confirm('¿Estás seguro de aprobar este registro?')) {
        console.log('Aprobando registro:', id)
        // Aquí iría la lógica para aprobar
        alert(`Registro ${id} aprobado`)
      }
    }

    const rechazarRegistro = (id) => {
      if (confirm('¿Estás seguro de rechazar este registro?')) {
        console.log('Rechazando registro:', id)
        // Aquí iría la lógica para rechazar
        alert(`Registro ${id} rechazado`)
      }
    }

    const finalizarPeriodo = (id) => {
      if (confirm('¿Estás seguro de finalizar este período de prueba?')) {
        console.log('Finalizando período:', id)
        // Aquí iría la lógica para finalizar
        alert(`Período de prueba ${id} finalizado`)
      }
    }

    const nuevoRegistro = () => {
      console.log('Nuevo registro')
      // router.push('/seguimiento/periodo-prueba/nuevo')
      alert('Crear nuevo registro de período de prueba/reincorporación')
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
      registros,
      grupos,
      registrosFiltrados,
      totalRegistros,
      contarPorTipo,
      contarPorEstado,
      tipoBadgeClass,
      estadoBadgeClass,
      formatFecha,
      aplicarFiltros,
      limpiarFiltros,
      verRegistro,
      aprobarRegistro,
      rechazarRegistro,
      finalizarPeriodo,
      nuevoRegistro,
      exportarExcel,
      navegarA,
      cerrarSesion
    }
  }
}
</script>