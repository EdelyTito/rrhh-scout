<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header de la página -->
        <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Logs del Sistema</h1>
            <p class="text-gray-600">Registro de actividades y eventos del sistema</p>
          </div>
          <div class="flex space-x-3">
            <button @click="exportarCSV" class="bg-gray-700 text-white px-4 py-2 rounded-lg">
              Exportar CSV</button>
            <button @click="exportarPDF" class="bg-gray-700 text-white px-4 py-2 rounded-lg">
              Exportar PDF
            </button>
            <button @click="limpiarFiltros" class="bg-[#d32d27] text-white px-4 py-2 rounded-lg">
              Limpiar Filtros
            </button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tabla Afectada</label>
              <select
                v-model="filtroTabla"
                class="w-full px-3 py-2 border border-gray-300 rounded-md
                      focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
                <option value="">Todas las tablas</option>
                <option v-for="t in tablasDisponibles" :key="t" :value="t">
                  {{ t }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select v-model="filtroUsuario" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent">
                <option value="">Todos los usuarios</option>
                <option v-for="u in usuariosUnicos" :key="u.id" :value="u.id">{{ u.nombre }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Fecha (rango)
              </label>

              <div class="flex flex-col gap-2 sm:flex-row sm:items-end">
                <input
                  type="date"
                  v-model="fechaDesdeInput"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                />

                <input
                  type="date"
                  v-model="fechaHastaInput"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                />

                <button
                  @click="aplicarFiltroFechas"
                  class="h-[42px] w-full sm:w-auto px-6 bg-[#009d71] text-white rounded-md
                        text-sm font-medium hover:bg-[#007f5f]"
                >
                  Aplicar fechas
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#009d71]"></div>
          <p class="text-gray-600 mt-2">Cargando logs...</p>
        </div>

        <!-- Tabla de Logs -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Cargo</th>
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acción</th>
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Detalle</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50">

                  <td class="px-4 py-3 text-sm text-gray-700">
                    <div class="font-medium">{{ formatFechaSolo(log.fecha_accion) }}</div>
                    <div class="text-xs text-gray-400">{{ formatHora(log.fecha_accion) }}</div>
                  </td>

                  <td class="px-4 py-3">
                    <div class="text-sm font-medium text-gray-900">
                      {{ log.usuario_nombre || 'Sistema' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ log.correo || '—' }}
                    </div>
                  </td>

                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-900">
                      {{ log.cargo || '—' }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ log.rol_nombre || '' }}
                    </div>
                  </td>

                  <td class="px-4 py-3">
                    <span
                      :class="getAccionBadgeClasses(log.accion)"
                      class="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ limpiarAccion(log.accion) }}
                    </span>
                  </td>

                  <td class="px-4 py-3 text-sm text-gray-600 max-w-md">
                    <div class="break-words">{{ log.detalle }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && logs.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron logs</h3>
            <p class="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        </div>

        <div class="flex justify-between items-center mt-4">
          <p class="text-sm text-gray-600">
            Página {{ paginaActual }} de {{ totalPaginas }}
          </p>

          <div class="flex space-x-1 items-center">
            <!-- Primera -->
            <button
              @click="irAPagina(1)"
              :disabled="paginaActual === 1"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              «
            </button>

            <!-- Ellipsis inicial -->
            <span v-if="paginasVisibles.mostrarPrimera" class="px-2 text-gray-400">
              …
            </span>

            <!-- Páginas visibles -->
            <button
              v-for="p in paginasVisibles.paginas"
              :key="p"
              @click="irAPagina(p)"
              :class="[
                'px-3 py-1 border rounded text-sm',
                p === paginaActual
                  ? 'bg-[#009d71] text-white'
                  : 'hover:bg-gray-100'
              ]"
            >
              {{ p }}
            </button>

            <!-- Ellipsis final -->
            <span v-if="paginasVisibles.mostrarUltima" class="px-2 text-gray-400">
              …
            </span>

            <!-- Última -->
            <button
              @click="irAPagina(totalPaginas)"
              :disabled="paginaActual === totalPaginas"
              class="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logsService } from '../../services/api'
import { watch } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('admin/logs')
const comisionesAbierto = ref(false)
const loading = ref(false)

const filtroTabla = ref('')
const filtroUsuario = ref('')
const filtroAccion = ref('')

// Inputs (no filtran todavía)
const fechaDesdeInput = ref('')
const fechaHastaInput = ref('')

// Fechas aplicadas al filtro
const fechaDesde = ref('')
const fechaHasta = ref('')

const logs = ref([])

const offset = ref(0)
const totalRegistros = ref(0)


const paginaActual = ref(1)
const registrosPorPagina = 5

const tablasDisponibles = ref([])


const totalPaginas = computed(() => {
  const total = Math.ceil(totalRegistros.value / registrosPorPagina)
  return total > 0 ? total : 1
})

const maxPaginasVisibles = 5

const paginasVisibles = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const half = Math.floor(maxPaginasVisibles / 2)

  let inicio = Math.max(1, actual - half)
  let fin = Math.min(total, inicio + maxPaginasVisibles - 1)

  if (fin - inicio < maxPaginasVisibles - 1) {
    inicio = Math.max(1, fin - maxPaginasVisibles + 1)
  }

  const paginas = []
  for (let i = inicio; i <= fin; i++) {
    paginas.push(i)
  }

  return {
    paginas,
    mostrarPrimera: inicio > 1,
    mostrarUltima: fin < total
  }
})

const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false
  if (!destino) return
  if (destino === 'admin') {
    router.push('/admin')
    return
  }
  if (destino.startsWith('/')) {
    router.push(destino)
    return
  }
  router.push(`/${destino}`)
}

const aplicarFiltroFechas = () => {
  fechaDesde.value = fechaDesdeInput.value || ''
  fechaHasta.value = fechaHastaInput.value || ''

  paginaActual.value = 1
  offset.value = 0
  totalRegistros.value = 0  

  cargarLogs(true)
}

const irAComision = (vista) => {
  comisionesAbierto.value = false
  router.push({
    path: '/admin',
    query: { comision: vista }
  })
}

const irAPagina = (p) => {
  paginaActual.value = p
  offset.value = (p - 1) * registrosPorPagina
  cargarLogs()
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/') 
}

const cargarLogs = async (reset = false) => {
  if (reset) {
    offset.value = 0
    logs.value = []
  }

  loading.value = true
  try {
    const res = await logsService.getLogs({
      tabla: filtroTabla.value || undefined,
      usuario_id: filtroUsuario.value || undefined,
      desde: fechaDesde.value || undefined,
      hasta: fechaHasta.value || undefined,
      limit: registrosPorPagina,
      offset: offset.value
    })

    logs.value = res.data.data || []
    totalRegistros.value = res.data.total || 0

  } catch (err) {
    if (err.response?.status === 401) {
      alert('Sesión expirada')
      router.push('/login')
    } else {
      alert('No se pudo cargar logs')
    }
  } finally {
    loading.value = false
  }
}

const usuariosUnicos = computed(() => {
  const map = new Map()
  logs.value.forEach(l => {
    const rawId = (l.usuario_id !== undefined && l.usuario_id !== null) ? l.usuario_id
                : (l.usuario && l.usuario.id !== undefined ? l.usuario.id : undefined)
    const id = rawId !== undefined ? rawId : (l.usuario_nombre ?? (typeof l.usuario === 'string' ? l.usuario : undefined))
    const nombre = l.usuario_nombre ?? (l.usuario && l.usuario.nombre) ?? (typeof l.usuario === 'string' ? l.usuario : 'Sistema')

    const key = id !== undefined && id !== null ? String(id) : `sistema-${String(nombre)}`
    if (!map.has(key)) map.set(key, { id: id ?? key, nombre })
  })
  return Array.from(map.values()).sort((a, b) => ('' + a.nombre).localeCompare(b.nombre))
})

const tablasUnicas = computed(() => {
  const set = new Set()
  logs.value.forEach(l => {
    if (l.tabla_afectada) set.add(l.tabla_afectada)
  })
  return Array.from(set).sort()
})

const getAccionBadgeClasses = (accion) => {
  const k = (accion || '').toString().toLowerCase()
  if (k.includes('login')) return 'bg-green-100 text-green-800'
  if (k.includes('crear')) return 'bg-blue-100 text-blue-800'
  if (k.includes('actualiz')) return 'bg-yellow-100 text-yellow-800'
  if (k.includes('elim') || k.includes('desactiv')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const ZONA_BOLIVIA = 'America/La_Paz'

const convertirABolivia = (fechaStr) => {
  if (!fechaStr) return null
  return new Date(
    new Date(fechaStr).toLocaleString('en-US', {
      timeZone: ZONA_BOLIVIA
    })
  )
}

const formatFechaSolo = (fechaStr) => {
  if (!fechaStr) return '—'
  const f = new Date(fechaStr)
  return f.toLocaleDateString('es-BO', { timeZone: ZONA_BOLIVIA })
}

const formatHora = (fechaStr) => {
  if (!fechaStr) return '—'
  const f = new Date(fechaStr)
  return f.toLocaleTimeString('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: ZONA_BOLIVIA
  })
}

const limpiarFiltros = () => {
  filtroTabla.value = ''
  filtroUsuario.value = ''
  filtroAccion.value = ''

  fechaDesdeInput.value = ''
  fechaHastaInput.value = ''
  fechaDesde.value = ''
  fechaHasta.value = ''

  paginaActual.value = 1
  offset.value = 0
  cargarLogs(true)
}

const limpiarAccion = (accion = '') => {
  return accion.replace(/\[.*?\]/g, '').trim()
}

const obtenerLogsParaExportar = async () => {
  const res = await logsService.getLogs({
    tabla: filtroTabla.value || undefined,
    usuario_id: filtroUsuario.value || undefined,
    desde: fechaDesde.value || undefined,
    hasta: fechaHasta.value || undefined,
    exportar: true
  })

  return res.data.data || []
}

const exportarCSV = async () => {
  const logsExportar = await obtenerLogsParaExportar()

  const headers = [
    'Fecha',
    'Usuario',
    'Correo',
    'Cargo',
    'Rol',
    'Acción',
    'Detalle'
  ]

  const rows = logsExportar.map(l => [
    l.fecha_accion,
    l.usuario_nombre || 'Sistema',
    l.correo || '',
    l.cargo || '',
    l.rol_nombre || '',
    limpiarAccion(l.accion),
    l.detalle || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `logs_${Date.now()}.csv`
  link.click()

  URL.revokeObjectURL(url)
}

const exportarPDF = async () => {
  const logsExportar = await obtenerLogsParaExportar()
  const doc = new jsPDF('landscape')

  doc.setFontSize(14)
  doc.text('Logs del Sistema - Distrito Scout', 14, 15)

  doc.setFontSize(10)
  doc.text(`Generado: ${new Date().toLocaleString('es-BO')}`, 14, 22)

  const columnas = [
    'Fecha',
    'Hora',
    'Usuario',
    'Correo',
    'Cargo',
    'Acción',
    'Detalle'
  ]

  const filas = logsExportar.map(l => [
    formatFechaSolo(l.fecha_accion),
    formatHora(l.fecha_accion),
    l.usuario_nombre || 'Sistema',
    l.correo || '',
    l.cargo || '',
    limpiarAccion(l.accion),
    l.detalle || ''
  ])

  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 157, 113] }
  })

  doc.save(`logs_${Date.now()}.pdf`)
}

watch(
  [filtroTabla, filtroUsuario, filtroAccion],
  () => {
    paginaActual.value = 1
    offset.value = 0
    cargarLogs(true)
  },
  { flush: 'post' }
)

onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'

  const resTablas = await logsService.getTablasLogs()
  tablasDisponibles.value = resTablas.data

  cargarLogs()
})

</script>

<style scoped>
.dropdown-item { display:block; width:100%; text-align:left; padding:.75rem 1rem; font-size:.875rem; color:#374151; border-bottom:1px solid #f3f4f6; background:white }
.dropdown-item:hover { background:#f3f4f6 }

  .dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  background: white;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}
</style>
