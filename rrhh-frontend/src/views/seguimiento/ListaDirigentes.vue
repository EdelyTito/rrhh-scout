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
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Lista de Dirigentes</h1>
          <p class="text-gray-600">Consulta y gestiona la información de todos los dirigentes</p>
        </div>

        <!-- Indicador de carga -->
        <div v-if="isLoading" class="text-center py-8">
          <svg class="animate-spin h-8 w-8 text-[#009d71] mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500 mt-2">Cargando dirigentes...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-700">{{ error }}</span>
            <button @click="fetchDirigentes" class="ml-auto text-sm text-[#009d71] font-semibold hover:underline">
              Reintentar
            </button>
          </div>
        </div>

        <!-- Contenido principal -->
        <div v-else>
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
                            {{ getIniciales(dirigente.nombre_participante) }}
                          </span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ dirigente.nombre_participante }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ dirigente.correo }}
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
                      <span v-else-if="esProgramaJovenes(dirigente.tipo_im)" 
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {{ getNivelTexto(dirigente.tipo_im) }}
                      </span>
                      <span v-else class="text-xs text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="dirigente.formadorLideres" 
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ dirigente.formadorLideres }}
                      </span>
                      <span v-else-if="esFormadorLideres(dirigente.tipo_im)" 
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {{ getNivelTexto(dirigente.tipo_im) }}
                      </span>
                      <span v-else class="text-xs text-gray-400">-</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="dirigente.gestionInstitucional" 
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {{ dirigente.gestionInstitucional }}
                      </span>
                      <span v-else-if="esGestionInstitucional(dirigente.tipo_im)" 
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {{ getNivelTexto(dirigente.tipo_im) }}
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
  name: 'ListaDirigentes',
  setup() {
    const router = useRouter()
    
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('lista-dirigentes')
    const isLoading = ref(false)
    const error = ref(null)

    const filtros = ref({
      busqueda: '',
      nivel: '',
      grupo: ''
    })

    const dirigentes = ref([])

    // Obtener dirigentes desde el backend
    const fetchDirigentes = async () => {
      isLoading.value = true
      error.value = null
      
      try {
        // Obtener todos los seguimientos (que contienen información de dirigentes)
        const response = await seguimientoService.getSeguimientos()
        
        // Mapear los datos del backend a la estructura del frontend
        dirigentes.value = response.data.map(item => ({
          id: item.id,
          nombre_participante: item.nombre_participante || 'Sin nombre',
          correo: item.correo || 'Sin correo',
          grupo: item.grupo || 'Sin grupo',
          tipo_im: item.tipo_im || '',
          estado: item.estado || '',
          resultado_final: item.resultado_final || '',
          fecha_creacion: item.fecha_creacion || '',
          rama_scout: item.rama_scout || '',
          // Solo mostrar en la categoría correspondiente si está aprobado
          programaJovenes: item.resultado_final === 'Aprobado' && ['IM2', 'IM3'].includes(item.tipo_im) ? getNivelTexto(item.tipo_im) : '',
          formadorLideres: item.resultado_final === 'Aprobado' && ['PaxtuGrupo', 'PaxtuDistrito'].includes(item.tipo_im) ? getNivelTexto(item.tipo_im) : '',
          gestionInstitucional: item.resultado_final === 'Aprobado' && ['KoodooAdjunto', 'KoodooDirector'].includes(item.tipo_im) ? getNivelTexto(item.tipo_im) : ''
        }))
        
      } catch (err) {
        console.error('Error al obtener dirigentes:', err)
        error.value = 'Error al cargar los dirigentes. Intenta nuevamente.'
        
        // Datos de ejemplo en caso de error
        dirigentes.value = [
          {
            id: 1,
            nombre_participante: 'Felipe Alejandro Lopez',
            correo: 'felipe@ejemplo.com',
            grupo: 'Boliviano Israelita',
            tipo_im: 'IM2',
            resultado_final: 'Aprobado',
            programaJovenes: 'IM Nivel II',
            formadorLideres: '',
            gestionInstitucional: ''
          },
          {
            id: 2,
            nombre_participante: 'Alejandra Calles',
            correo: 'alejandra@ejemplo.com',
            grupo: 'Amerinst 301',
            tipo_im: 'IM3',
            resultado_final: 'Aprobado',
            programaJovenes: 'IM Nivel III',
            formadorLideres: 'Paxtu Distrito',
            gestionInstitucional: ''
          },
          {
            id: 3,
            nombre_participante: 'Luciana Montes',
            correo: 'luciana@ejemplo.com',
            grupo: 'San Calixto',
            tipo_im: 'PaxtuGrupo',
            resultado_final: 'Aprobado',
            programaJovenes: '',
            formadorLideres: 'Paxtu Grupo',
            gestionInstitucional: ''
          },
          {
            id: 4,
            nombre_participante: 'Rodrigo Llano',
            correo: 'rodrigo@ejemplo.com',
            grupo: 'Boliviano Israelita',
            tipo_im: 'KoodooAdjunto',
            resultado_final: 'Aprobado',
            programaJovenes: '',
            formadorLideres: '',
            gestionInstitucional: 'Koodoo Adjunto'
          },
          {
            id: 5,
            nombre_participante: 'Francisco Santos',
            correo: 'francisco@ejemplo.com',
            grupo: 'Amerinst 301',
            tipo_im: 'KoodooDirector',
            resultado_final: 'Aprobado',
            programaJovenes: '',
            formadorLideres: '',
            gestionInstitucional: 'Koodoo Director'
          }
        ]
      } finally {
        isLoading.value = false
      }
    }

    const grupos = computed(() => {
      return [...new Set(dirigentes.value.map(d => d.grupo))]
    })

    const dirigentesFiltrados = computed(() => {
      return dirigentes.value.filter(dirigente => {
        const busquedaMatch = !filtros.value.busqueda || 
          dirigente.nombre_participante.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
          dirigente.correo.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
          dirigente.grupo.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
        
        const nivelMatch = !filtros.value.nivel || 
          dirigente.tipo_im?.toLowerCase().includes(filtros.value.nivel.toLowerCase()) ||
          dirigente.programaJovenes?.toLowerCase().includes(filtros.value.nivel.toLowerCase()) ||
          dirigente.formadorLideres?.toLowerCase().includes(filtros.value.nivel.toLowerCase()) ||
          dirigente.gestionInstitucional?.toLowerCase().includes(filtros.value.nivel.toLowerCase())
        
        const grupoMatch = !filtros.value.grupo || dirigente.grupo === filtros.value.grupo
        
        return busquedaMatch && nivelMatch && grupoMatch
      })
    })

    const totalDirigentes = computed(() => dirigentes.value.length)

    const contarPorNivel = (nivel) => {
      if (nivel === 'Paxtu') {
        return dirigentes.value.filter(d => 
          d.formadorLideres?.includes('Paxtu')
        ).length
      } else if (nivel === 'Koodoo') {
        return dirigentes.value.filter(d => 
          d.gestionInstitucional?.includes('Koodoo')
        ).length
      } else {
        return dirigentes.value.filter(d => 
          d.programaJovenes?.includes(nivel)
        ).length
      }
    }

    // Funciones de utilidad
    const getIniciales = (nombreCompleto) => {
      if (!nombreCompleto) return '??'
      const partes = nombreCompleto.split(' ')
      if (partes.length >= 2) {
        return partes[0].charAt(0) + partes[1].charAt(0)
      }
      return partes[0].charAt(0)
    }

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

    const esProgramaJovenes = (codigo) => {
      return ['IM2', 'IM3'].includes(codigo)
    }

    const esFormadorLideres = (codigo) => {
      return ['PaxtuGrupo', 'PaxtuDistrito'].includes(codigo)
    }

    const esGestionInstitucional = (codigo) => {
      return ['KoodooAdjunto', 'KoodooDirector'].includes(codigo)
    }

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

    const verDirigente = async (id) => {
      try {
        // Obtener detalles del dirigente
        const response = await seguimientoService.getSeguimiento(id)
        console.log('Detalles del dirigente:', response.data)
        
        // Aquí podrías navegar a una página de detalle o mostrar un modal
        alert(`Ver perfil del dirigente ${id}\nNombre: ${response.data.nombre_participante}`)
      } catch (err) {
        console.error('Error al obtener detalles del dirigente:', err)
        alert('Error al cargar los detalles del dirigente')
      }
    }

    const editarDirigente = (id) => {
      console.log('Editar dirigente:', id)
      // Aquí podrías navegar a una página de edición
      alert(`Editar dirigente ${id}`)
    }

    const eliminarDirigente = async (id) => {
      if (confirm('¿Estás seguro de eliminar este seguimiento/dirigente?')) {
        try {
          await seguimientoService.deleteSeguimiento(id)
          
          // Eliminar localmente
          const index = dirigentes.value.findIndex(d => d.id === id)
          if (index !== -1) {
            dirigentes.value.splice(index, 1)
          }
          
          alert('Seguimiento eliminado correctamente')
        } catch (err) {
          console.error('Error al eliminar seguimiento:', err)
          alert('Error al eliminar el seguimiento')
        }
      }
    }

    const nuevoDirigente = () => {
      console.log('Nuevo dirigente')
      // Navegar al formulario público de aprobaciones
      router.push('/public/aprobaciones')
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

    onMounted(() => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
      nombreResponsable.value = usuario.nombre || 'Responsable de Seguimiento'
      
      // Cargar dirigentes al montar el componente
      fetchDirigentes()
    })

    return {
      nombreResponsable,
      rutaActiva,
      filtros,
      dirigentes,
      grupos,
      dirigentesFiltrados,
      totalDirigentes,
      isLoading,
      error,
      contarPorNivel,
      getIniciales,
      getNivelTexto,
      esProgramaJovenes,
      esFormadorLideres,
      esGestionInstitucional,
      aplicarFiltros,
      limpiarFiltros,
      verDirigente,
      editarDirigente,
      eliminarDirigente,
      nuevoDirigente,
      exportarExcel,
      fetchDirigentes,
      navegarA,
      cerrarSesion
    }
  }
}
</script>