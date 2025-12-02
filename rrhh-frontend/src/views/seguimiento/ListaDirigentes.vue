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
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Lista de Dirigentes</h1>
          <p class="text-gray-600">Consulta y gestiona la información de todos los dirigentes</p>
        </div>

        <!-- Barra de búsqueda y filtros -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <!-- Búsqueda general -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar dirigente</label>
              <div class="relative">
                <input 
                  v-model="filtros.busqueda"
                  type="text" 
                  placeholder="Nombre, CI o grupo..."
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

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
              <label class="block text-sm font-medium text-gray-700 mb-2">Grupo</label>
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
                Buscar
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

        <!-- Estadísticas rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div class="text-2xl font-bold text-[#009d71]">{{ totalDirigentes }}</div>
            <div class="text-sm text-gray-600">Total Dirigentes</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ contarPorNivel('IM Nivel II') }}</div>
            <div class="text-sm text-gray-600">IM Nivel II</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div class="text-2xl font-bold text-green-600">{{ contarPorNivel('IM Nivel III') }}</div>
            <div class="text-sm text-gray-600">IM Nivel III</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <div class="text-2xl font-bold text-purple-600">{{ contarPorNivel('Paxtu') + contarPorNivel('Koodoo') }}</div>
            <div class="text-sm text-gray-600">Nombramientos</div>
          </div>
        </div>

        <!-- Tabla de Dirigentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <!-- Header de la tabla -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">Dirigentes ({{ dirigentesFiltrados.length }})</h2>
              <div class="flex space-x-2">
                <button 
                  @click="exportarExcel"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-semibold"
                >
                  Exportar Excel
                </button>
                <button 
                  @click="nuevoDirigente"
                  class="bg-[#009d71] text-white px-4 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 text-sm font-semibold"
                >
                  Nuevo Dirigente
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
                    Dirigente
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programa de Jóvenes
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formador de Líderes
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gestión Institucional
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="dirigente in dirigentesFiltrados" :key="dirigente.id" 
                    class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-[#009d71] rounded-full flex items-center justify-center">
                        <span class="text-white font-semibold text-sm">
                          {{ dirigente.nombre.charAt(0) }}{{ dirigente.apellido.charAt(0) }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ dirigente.nombre }} {{ dirigente.apellido }}
                        </div>
                        <div class="text-sm text-gray-500">
                          CI: {{ dirigente.ci }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ dirigente.grupo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="dirigente.programaJovenes" 
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ dirigente.programaJovenes }}
                    </span>
                    <span v-else class="text-xs text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="dirigente.formadorLideres" 
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {{ dirigente.formadorLideres }}
                    </span>
                    <span v-else class="text-xs text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="dirigente.gestionInstitucional" 
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {{ dirigente.gestionInstitucional }}
                    </span>
                    <span v-else class="text-xs text-gray-400">-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button 
                        @click="verDirigente(dirigente.id)"
                        class="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        Ver
                      </button>
                      <button 
                        @click="editarDirigente(dirigente.id)"
                        class="text-green-600 hover:text-green-900 font-semibold"
                      >
                        Editar
                      </button>
                      <button 
                        @click="eliminarDirigente(dirigente.id)"
                        class="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="dirigentesFiltrados.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <p class="text-gray-500 text-lg">No se encontraron dirigentes</p>
            <p class="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
          </div>

          <!-- Paginación -->
          <div v-if="dirigentesFiltrados.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-700">
                Mostrando <span class="font-semibold">{{ dirigentesFiltrados.length }}</span> de {{ totalDirigentes }} dirigentes
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
  name: 'ListaDirigentes',
  setup() {
    const router = useRouter()
    
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('dirigentes')

    // Filtros
    const filtros = ref({
      busqueda: '',
      nivel: '',
      grupo: ''
    })

    // Datos de ejemplo
    const dirigentes = ref([
      {
        id: 1,
        nombre: 'Felipe Alejandro',
        apellido: 'Lopez',
        ci: '2065866',
        grupo: 'Boliviano Israelita',
        programaJovenes: 'IM Nivel II',
        formadorLideres: '',
        gestionInstitucional: ''
      },
      {
        id: 2,
        nombre: 'Alejandra',
        apellido: 'Calles',
        ci: '2154876',
        grupo: 'Amerinst 301',
        programaJovenes: 'IM Nivel III',
        formadorLideres: 'Paxtu Distrito',
        gestionInstitucional: 'Koodoo'
      },
      {
        id: 3,
        nombre: 'Luciana',
        apellido: 'Montes',
        ci: '1987452',
        grupo: 'San Calixto',
        programaJovenes: 'IM Nivel III',
        formadorLideres: 'Paxtu Grupo',
        gestionInstitucional: ''
      },
      {
        id: 4,
        nombre: 'Rodrigo',
        apellido: 'Llano',
        ci: '2245871',
        grupo: 'Boliviano Israelita',
        programaJovenes: 'IM Nivel II',
        formadorLideres: '',
        gestionInstitucional: 'Koodoo Adjunto'
      },
      {
        id: 5,
        nombre: 'Francisco',
        apellido: 'Santos',
        ci: '2104587',
        grupo: 'Amerinst 301',
        programaJovenes: '',
        formadorLideres: 'Koodoo Director',
        gestionInstitucional: 'Paxtu Distrito'
      }
    ])

    const grupos = computed(() => {
      return [...new Set(dirigentes.value.map(d => d.grupo))]
    })

    // Dirigentes filtrados
    const dirigentesFiltrados = computed(() => {
      return dirigentes.value.filter(dirigente => {
        const busquedaMatch = !filtros.value.busqueda || 
          dirigente.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
          dirigente.apellido.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
          dirigente.ci.includes(filtros.value.busqueda) ||
          dirigente.grupo.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
        
        const nivelMatch = !filtros.value.nivel || 
          dirigente.programaJovenes?.toLowerCase().includes(filtros.value.nivel.toLowerCase()) ||
          dirigente.formadorLideres?.toLowerCase().includes(filtros.value.nivel.toLowerCase()) ||
          dirigente.gestionInstitucional?.toLowerCase().includes(filtros.value.nivel.toLowerCase())
        
        const grupoMatch = !filtros.value.grupo || dirigente.grupo === filtros.value.grupo
        
        return busquedaMatch && nivelMatch && grupoMatch
      })
    })

    // Estadísticas
    const totalDirigentes = computed(() => dirigentes.value.length)

    const contarPorNivel = (nivel) => {
      return dirigentes.value.filter(d => 
        d.programaJovenes?.includes(nivel) ||
        d.formadorLideres?.includes(nivel) ||
        d.gestionInstitucional?.includes(nivel)
      ).length
    }

    // Funciones
    const aplicarFiltros = () => {
      console.log('Aplicando filtros:', filtros.value)
    }

    const limpiarFiltros = () => {
      filtros.value = {
        busqueda: '',
        nivel: '',
        grupo: ''
      }
    }

    const verDirigente = (id) => {
      console.log('Ver dirigente:', id)
      // router.push(`/seguimiento/dirigente/${id}`)
      alert(`Ver perfil del dirigente ${id}`)
    }

    const editarDirigente = (id) => {
      console.log('Editar dirigente:', id)
      // router.push(`/seguimiento/dirigente/${id}/editar`)
      alert(`Editar dirigente ${id}`)
    }

    const eliminarDirigente = (id) => {
      if (confirm('¿Estás seguro de eliminar este dirigente?')) {
        console.log('Eliminando dirigente:', id)
        // Aquí iría la lógica para eliminar
        alert(`Dirigente ${id} eliminado`)
      }
    }

    const nuevoDirigente = () => {
      console.log('Nuevo dirigente')
      // router.push('/seguimiento/dirigentes/nuevo')
      alert('Crear nuevo dirigente')
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
      dirigentes,
      grupos,
      dirigentesFiltrados,
      totalDirigentes,
      contarPorNivel,
      aplicarFiltros,
      limpiarFiltros,
      verDirigente,
      editarDirigente,
      eliminarDirigente,
      nuevoDirigente,
      exportarExcel,
      navegarA,
      cerrarSesion
    }
  }
}
</script>