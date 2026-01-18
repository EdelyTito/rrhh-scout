<template>
  <div class="min-h-screen bg-gray-50">
    
    <SeguimientoHeader
    :nombre="nombreResponsable"
    @logout="cerrarSesion"
    />

    <SeguimientoNav
    :ruta-activa="rutaActiva"
    @navegar="navegarA"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <h1 class="text-xl font-bold text-gray-800 mb-1">
            Lista de dirigentes
          </h1>
          <p class="text-sm text-gray-600">
            Consulta y gestiona la información de todos los dirigentes
          </p>
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
          <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">

            <!-- IM -->
            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div class="text-2xl font-bold text-blue-600">{{ contarTipo('IM2') }}</div>
              <div class="text-sm text-gray-600">IM Nivel II</div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div class="text-2xl font-bold text-green-600">{{ contarTipo('IM3') }}</div>
              <div class="text-sm text-gray-600">IM Nivel III</div>
            </div>

            <!-- Paxtu -->
            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div class="text-2xl font-bold text-purple-600">{{ contarTipo('Paxtu Grupo') }}</div>
              <div class="text-sm text-gray-600">Paxtu Grupo</div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div class="text-2xl font-bold text-purple-600">{{ contarTipo('Paxtu Distrito') }}</div>
              <div class="text-sm text-gray-600">Paxtu Distrito</div>
            </div>

            <!-- Koodoo -->
            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div class="text-2xl font-bold text-orange-600">{{ contarTipo('Koodoo Formacion') }}</div>
              <div class="text-sm text-gray-600">Koodoo Adjunto</div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm border text-center">
              <div class="text-2xl font-bold text-orange-600">{{ contarTipo('Koodoo Director') }}</div>
              <div class="text-sm text-gray-600">Koodoo Director</div>
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
                </div>
              </div>
            </div>

            <!-- Tabla -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Dirigente
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Grupo
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tipo de aprobación
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-gray-200">
                  <tr v-for="d in dirigentesFiltrados" :key="d.id">
                    
                    <!-- Nombre -->
                    <td class="px-6 py-4">
                      <div class="font-medium text-gray-900">{{ d.nombre_participante }}</div>
                      <div class="text-sm text-gray-500">{{ d.correo }}</div>
                    </td>

                    <!-- Grupo -->
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ d.grupo }}
                    </td>

                    <!-- Tipo -->
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                        :class="badgeTipo(d.tipo_im)"
                      >
                        {{ getNivelTexto(d.tipo_im) }}
                      </span>
                    </td>

                    <!-- Estado -->
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 rounded-full text-xs font-semibold"
                        :class="d.resultado_final === 'aprobado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'"
                      >
                        {{ d.resultado_final }}
                      </span>
                    </td>

                    <!-- Acciones -->
                    <td class="px-6 py-4">
                      <button
                        @click="verDirigente(d.id)"
                        class="text-blue-600 hover:underline font-semibold"
                      >
                        Ver
                      </button>
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

<script setup>
import SeguimientoHeader from '../../components/seguimiento/SeguimientoHeader.vue'
import SeguimientoNav from '../../components/seguimiento/SeguimientoNav.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'

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

const fetchDirigentes = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await seguimientoService.getSeguimientos()

    const data = response.data.filter(item =>
      ['aprobado', 'no aprobó'].includes(item.resultado_final)
    )

    dirigentes.value = data.map(item => ({
      id: item.id,
      nombre_participante: item.nombre_participante,
      correo: item.correo,
      grupo: item.grupo,
      tipo_im: item.tipo_im,
      resultado_final: item.resultado_final
    }))

  } catch (e) {
    error.value = 'Error al cargar los dirigentes'
  } finally {
    isLoading.value = false
  }
}

const grupos = computed(() =>
  [...new Set(dirigentes.value.map(d => d.grupo))]
)

const dirigentesFiltrados = computed(() =>
  dirigentes.value.filter(d => {
    const busqueda =
      !filtros.value.busqueda ||
      d.nombre_participante.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      d.correo.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      d.grupo.toLowerCase().includes(filtros.value.busqueda.toLowerCase())

    const nivel =
      !filtros.value.nivel ||
      d.tipo_im === filtros.value.nivel

    const grupo =
      !filtros.value.grupo ||
      d.grupo === filtros.value.grupo

    return busqueda && nivel && grupo
  })
)

const totalDirigentes = computed(() => dirigentes.value.length)

const normalizar = (valor) =>
  valor
    ?.toString()
    .toLowerCase()
    .replace(/\s+/g, '')


const contarTipo = (tipo) =>
  dirigentes.value.filter(
    d =>
      normalizar(d.tipo_im) === normalizar(tipo) &&
      d.resultado_final === 'aprobado'
  ).length


const contarKoodoo = computed(() =>
  dirigentes.value.filter(d =>
    ['KoodooAdjunto', 'KoodooDirector'].includes(d.tipo_im)
  ).length
)

const getNivelTexto = (codigo) => ({
  IM2: 'IM Nivel II',
  IM3: 'IM Nivel III',
  PaxtuGrupo: 'Paxtu Grupo',
  PaxtuDistrito: 'Paxtu Distrito',
  KoodooAdjunto: 'Koodoo Adjunto',
  KoodooDirector: 'Koodoo Director'
}[codigo] || codigo)

const badgeTipo = (tipo) => ({
  IM2: 'bg-blue-100 text-blue-800',
  IM3: 'bg-green-100 text-green-800',
  PaxtuGrupo: 'bg-purple-100 text-purple-800',
  PaxtuDistrito: 'bg-purple-100 text-purple-800',
  KoodooAdjunto: 'bg-orange-100 text-orange-800',
  KoodooDirector: 'bg-orange-100 text-orange-800'
}[tipo] || 'bg-gray-100 text-gray-800')

const verDirigente = (id) => {
  router.push(`/seguimiento/dirigente/${id}`)
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  router.push(destino === 'inicio' ? '/seguimiento' : `/seguimiento/${destino}`)
}

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/')
}

onMounted(() => {
  const u = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = u.nombre || nombreResponsable.value
  fetchDirigentes()
})
</script>

