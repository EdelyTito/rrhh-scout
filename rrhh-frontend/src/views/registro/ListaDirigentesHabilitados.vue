<!-- src/views/registro/ListaDirigentesHabilitados.vue -->
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
              <h1 class="text-2xl font-bold text-gray-900">Lista de dirigentes habilitados</h1>
              <p class="text-gray-600 mt-1">Dirigentes con habilitación vigente</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">
                {{ dirigentesHabilitados.length }} dirigentes habilitados
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

        <!-- Filtros y búsqueda -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <!-- Búsqueda por nombre -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar dirigente</label>
              <div class="relative">
                <input 
                  v-model="filtroBusqueda"
                  type="text"
                  placeholder="Buscar por nombre, CI o grupo..."
                  class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
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

        <!-- Tabla de dirigentes habilitados -->
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
                    Cargo Distrito
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo Grupo
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="dirigente in dirigentesFiltrados" 
                  :key="dirigente.id"
                  class="hover:bg-gray-50 transition duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ dirigente.nombre }}</div>
                        <div class="text-xs text-gray-500">{{ dirigente.ci }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      getColorRama(dirigente.rama)
                    ]">
                      {{ dirigente.rama }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ dirigente.grupo }}</div>
                    <div class="text-xs text-gray-500">{{ dirigente.distrito || 'Distrito La Paz' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ dirigente.cargoDistrito }}</div>
                    <div v-if="dirigente.cargoDistritoSecundario" class="text-xs text-gray-500">
                      {{ dirigente.cargoDistritoSecundario }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ dirigente.cargoGrupo1 }}</div>
                    <div v-if="dirigente.cargoGrupo2" class="text-xs text-gray-500">
                      +{{ dirigente.cargoGrupo2 }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="verDirigente(dirigente.id)"
                      class="text-[#009d71] hover:text-[#007a5c] mr-3 font-medium"
                    >
                      Ver
                    </button>
                    <button 
                      @click="editarDirigente(dirigente.id)"
                      class="text-blue-600 hover:text-blue-900 mr-3 font-medium"
                    >
                      Editar
                    </button>
                    <button 
                      @click="deshabilitarDirigente(dirigente.id)"
                      class="text-red-600 hover:text-red-900 font-medium"
                    >
                      Deshabilitar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje si no hay dirigentes -->
          <div 
            v-if="dirigentesFiltrados.length === 0" 
            class="text-center py-12"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="mt-2 text-gray-500">No hay dirigentes habilitados con los filtros aplicados.</p>
            <button 
              @click="limpiarFiltros"
              class="mt-4 text-[#009d71] hover:text-[#007a5c] font-medium"
            >
              Limpiar filtros
            </button>
          </div>

          <!-- Footer de la tabla -->
          <div v-if="dirigentesFiltrados.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                Mostrando {{ dirigentesFiltrados.length }} de {{ dirigentesHabilitados.length }} dirigentes
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
const rutaActiva = ref('lista-dirigentes-habilitados')

// Filtros
const filtroBusqueda = ref('')
const filtroGrupo = ref('')
const filtroRama = ref('')
const paginaActual = ref(1)
const itemsPorPagina = 10

// Datos de dirigentes habilitados (según página 23 del PDF)
const dirigentesHabilitados = ref([
  {
    id: 1,
    nombre: 'Felipe Alejandro Lopez',
    ci: '2065866',
    rama: 'Lobatos',
    grupo: 'Boliviano Israelita',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Programa',
    cargoDistritoSecundario: 'Capacitación',
    cargoGrupo1: 'Programa',
    cargoGrupo2: 'Administración',
    añosRegistrados: 10
  },
  {
    id: 2,
    nombre: 'Alejandra Calles',
    ci: '1854215',
    rama: 'Pioneros',
    grupo: 'Amerinst 301',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Formación',
    cargoDistritoSecundario: null,
    cargoGrupo1: 'Dirección',
    cargoGrupo2: null,
    añosRegistrados: 8
  },
  {
    id: 3,
    nombre: 'Luciana Montes',
    ci: '2045879',
    rama: 'Exploradores',
    grupo: 'San Calixto',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Programa',
    cargoDistritoSecundario: 'Eventos',
    cargoGrupo1: 'Programa',
    cargoGrupo2: 'Logística',
    añosRegistrados: 5
  },
  {
    id: 4,
    nombre: 'Carlos Mendoza',
    ci: '1987456',
    rama: 'Rovers',
    grupo: 'Boliviano Israelita',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Administración',
    cargoDistritoSecundario: null,
    cargoGrupo1: 'Tesorería',
    cargoGrupo2: 'Logística',
    añosRegistrados: 12
  },
  {
    id: 5,
    nombre: 'Ana Rodríguez',
    ci: '2154879',
    rama: 'Lobatos',
    grupo: 'Amerinst 301',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Comunicación',
    cargoDistritoSecundario: null,
    cargoGrupo1: 'Programa',
    cargoGrupo2: 'Comunicación',
    añosRegistrados: 3
  },
  {
    id: 6,
    nombre: 'Juan Pérez',
    ci: '1896547',
    rama: 'Exploradores',
    grupo: 'San Calixto',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Formación',
    cargoDistritoSecundario: 'Capacitación',
    cargoGrupo1: 'Formación',
    cargoGrupo2: null,
    añosRegistrados: 7
  },
  {
    id: 7,
    nombre: 'María González',
    ci: '2054871',
    rama: 'Pioneros',
    grupo: 'Boliviano Israelita',
    distrito: 'Distrito La Paz',
    cargoDistrito: 'Programa',
    cargoDistritoSecundario: 'Proyectos',
    cargoGrupo1: 'Dirección',
    cargoGrupo2: 'Programa',
    añosRegistrados: 6
  }
])

// Estadísticas
const estadisticas = ref({
  vigentes: 5,
  proximosVencer: 2,
  renovacionesMes: 8,
  porcentajeHabilitados: 40
})

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'
})

// Computed properties
const dirigentesFiltrados = computed(() => {
  let filtrados = [...dirigentesHabilitados.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    filtrados = filtrados.filter(d => 
      d.nombre.toLowerCase().includes(busqueda) ||
      d.ci.includes(busqueda) ||
      d.grupo.toLowerCase().includes(busqueda)
    )
  }
  
  // Aplicar filtro por grupo
  if (filtroGrupo.value) {
    filtrados = filtrados.filter(d => d.grupo === filtroGrupo.value)
  }
  
  // Aplicar filtro por rama
  if (filtroRama.value) {
    filtrados = filtrados.filter(d => d.rama === filtroRama.value)
  }
  
  // Paginación
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  return filtrados.slice(inicio, inicio + itemsPorPagina)
})

const gruposUnicos = computed(() => {
  const grupos = dirigentesHabilitados.value.map(d => d.grupo)
  return [...new Set(grupos)]
})

const ramasUnicas = computed(() => {
  const ramas = dirigentesHabilitados.value.map(d => d.rama)
  return [...new Set(ramas)]
})

const totalPaginas = computed(() => {
  return Math.ceil(dirigentesHabilitados.value.length / itemsPorPagina)
})

// Métodos
const navegarA = (destino) => {
  rutaActiva.value = destino
  
  switch(destino) {
    case 'inicio-registro':
      router.push('/registro')
      break
    case 'solicitudes-pendientes-registro':
      router.push('/registro/solicitudes-pendientes')
      break
    case 'lista-dirigentes-habilitados':
      // Ya estamos aquí
      break
  }
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

const verDirigente = (id) => {
  router.push(`/registro/dirigente/${id}`)
}

const editarDirigente = (id) => {
  router.push(`/registro/dirigente/${id}/editar`)
}

const deshabilitarDirigente = (id) => {
  const dirigente = dirigentesHabilitados.value.find(d => d.id === id)
  if (dirigente && confirm(`¿Está seguro de deshabilitar a ${dirigente.nombre}?`)) {
    dirigentesHabilitados.value = dirigentesHabilitados.value.filter(d => d.id !== id)
    alert('Dirigente deshabilitado exitosamente')
  }
}

const limpiarFiltros = () => {
  filtroBusqueda.value = ''
  filtroGrupo.value = ''
  filtroRama.value = ''
  paginaActual.value = 1
}

const cambiarPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
  }
}

const exportarExcel = () => {
  alert('Exportando lista de dirigentes a Excel...')
  // Aquí iría la lógica para exportar a Excel
}

const exportarCertificados = () => {
  alert('Exportando certificados de habilitación...')
}

const enviarRecordatoriosVencimiento = () => {
  if (confirm('¿Enviar recordatorios de vencimiento a todos los dirigentes próximos a vencer?')) {
    alert('Recordatorios enviados exitosamente')
  }
}

const generarReporte = () => {
  alert('Generando reporte anual de habilitaciones...')
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>

