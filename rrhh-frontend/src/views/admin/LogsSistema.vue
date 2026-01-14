<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header de la página -->
        <div class="flex justify-between items-center mb-6">
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tabla Afectada</label>
              <select v-model="filtroTabla" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent">
                <option value="">Todas las tablas</option>
                <option v-for="t in tablasUnicas" :key="t">{{ t }}</option>
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

              <div class="flex gap-2">
                <input
                  type="date"
                  v-model="fechaDesde"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                />

                <input
                  type="date"
                  v-model="fechaHasta"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md
                        focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                />
              </div>

              <p class="text-xs text-gray-500 mt-1">
                Desde / Hasta (opcional)
              </p>
            </div>
          </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div class="grid md:grid-cols-2 gap-4 mb-8">
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="bg-blue-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Total Logs</p>
                <p class="text-2xl font-bold text-gray-900">{{ logs.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="bg-green-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Usuarios activos (únicos)</p>
                <p class="text-2xl font-bold text-gray-900">{{ usuariosUnicos.length }}</p>
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
                  <th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Nivel</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in logsPaginados" :key="log.id" class="hover:bg-gray-50">

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

                  <td class="px-4 py-3">
                    <span
                      :class="getNivelBadge(log.nivel)"
                      class="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                    >
                      {{ log.nivel }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="logsFiltrados.length === 0" class="text-center py-8">
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
              @click="paginaActual = 1"
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
              @click="paginaActual = p"
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
              @click="paginaActual = totalPaginas"
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
const fechaDesde = ref('')
const fechaHasta = ref('')

const logs = ref([])

const limit = 5
const offset = ref(0)
const hayMasLogs = ref(true)

const paginaActual = ref(1)
const registrosPorPagina = 5

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
const irAComision = (vista) => {
  comisionesAbierto.value = false
  router.push({
    path: '/admin',
    query: { comision: vista }
  })
}

const getNivelBadge = (nivel) => {
  switch ((nivel || '').toUpperCase()) {
    case 'INFO':
      return 'bg-blue-100 text-blue-800'
    case 'WARN':
      return 'bg-yellow-100 text-yellow-800'
    case 'ERROR':
      return 'bg-red-100 text-red-800'
    case 'SECURITY':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/') 
}

const logsPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * registrosPorPagina
  return logsFiltrados.value.slice(inicio, inicio + registrosPorPagina)
})

const totalPaginas = computed(() =>
  Math.ceil(logsFiltrados.value.length / registrosPorPagina)
)

const cargarLogs = async (reset = false) => {
  if (reset) {
    offset.value = 0
    logs.value = []
    hayMasLogs.value = true
  }

  loading.value = true
  try {
    const res = await logsService.getLogs({
      tabla: filtroTabla.value || undefined,
      usuario_id: filtroUsuario.value || undefined,
      accion: filtroAccion.value || undefined,
      limit,
      offset: offset.value
    })

    const nuevosLogs = res.data || []

    if (nuevosLogs.length < limit) {
      hayMasLogs.value = false
    }

    logs.value.push(...nuevosLogs)
    offset.value += limit
  } catch (err) {
    console.error('Error cargando logs:', err)
    alert('No se pudo cargar logs.')
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

const logsFiltrados = computed(() => {
  return logs.value.filter(log => {

    // TABLA
    const coincideTabla =
      !filtroTabla.value ||
      log.tabla_afectada === filtroTabla.value

    // USUARIO
    const coincideUsuario =
      !filtroUsuario.value ||
      String(log.usuario_id) === String(filtroUsuario.value)

    // ACCIÓN (limpia)
    const accionLimpia = limpiarAccion(log.accion).toLowerCase()
    const coincideAccion =
      !filtroAccion.value ||
      accionLimpia.includes(filtroAccion.value.toLowerCase())

    // FECHA (rango)
    let coincideFecha = true

    if (fechaDesde.value || fechaHasta.value) {
      const fechaLog = new Date(log.fecha_accion)
      fechaLog.setHours(0, 0, 0, 0)

      if (fechaDesde.value) {
        const desde = new Date(fechaDesde.value)
        desde.setHours(0, 0, 0, 0)
        if (fechaLog < desde) coincideFecha = false
      }

      if (fechaHasta.value) {
        const hasta = new Date(fechaHasta.value)
        hasta.setHours(23, 59, 59, 999)
        if (fechaLog > hasta) coincideFecha = false
      }
    }

    return (
      coincideTabla &&
      coincideUsuario &&
      coincideAccion &&
      coincideFecha
    )
  })
})

const getAccionBadgeClasses = (accion) => {
  const k = (accion || '').toString().toLowerCase()
  if (k.includes('login')) return 'bg-green-100 text-green-800'
  if (k.includes('crear')) return 'bg-blue-100 text-blue-800'
  if (k.includes('actualiz')) return 'bg-yellow-100 text-yellow-800'
  if (k.includes('elim') || k.includes('desactiv')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const formatFechaSolo = (fechaStr) => {
  if (!fechaStr) return ''
  const f = new Date(fechaStr)
  return f.toLocaleDateString('es-BO')
}

const formatHora = (fechaStr) => {
  if (!fechaStr) return ''
  const f = new Date(fechaStr)
  return f.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })
}

const limpiarFiltros = () => {
  filtroTabla.value = ''
  filtroUsuario.value = ''
  filtroAccion.value = ''
  fechaDesde.value = ''
  fechaHasta.value = ''
}

const limpiarAccion = (accion = '') => {
  return accion.replace(/\[.*?\]/g, '').trim()
}

const exportarCSV = () => {
  const headers = [
    'Fecha',
    'Usuario',
    'Correo',
    'Cargo',
    'Rol',
    'Acción',
    'Detalle',
    'Nivel'
  ]

  const rows = logsFiltrados.value.map(l => [
    l.fecha_accion,
    l.usuario_nombre || 'Sistema',
    l.correo || '',
    l.cargo || '',
    l.rol_nombre || '',
    limpiarAccion(l.accion),
    l.detalle || '',
    l.nivel || ''
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

const exportarPDF = () => {
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
    'Detalle',
    'Nivel'
  ]

  const filas = logsFiltrados.value.map(l => {
    const fecha = new Date(l.fecha_accion)
    return [
      formatFechaSolo(l.fecha_accion),
      formatHora(l.fecha_accion),
      l.usuario_nombre || 'Sistema',
      l.correo || '',
      l.cargo || '',
      limpiarAccion(l.accion),
      l.detalle || '',
      l.nivel || ''
    ]
  })

  autoTable(doc, {
    head: [columnas],
    body: filas,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 157, 113] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  })

  doc.save(`logs_${Date.now()}.pdf`)
}


watch(
  [filtroTabla, filtroUsuario, filtroAccion, fechaDesde, fechaHasta],
  () => {
    paginaActual.value = 1
  }
)

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'
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
