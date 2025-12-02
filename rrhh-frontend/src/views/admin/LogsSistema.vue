<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-[#009d71] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <img src="/images/rraa.png" alt="Logo Distrito Scout" class="h-10 w-auto" />
            <h1 class="text-2xl font-bold text-white">Sistema RRHH - Distrito Scout</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-white">¡Hola {{ nombreResponsable }}!</span>
            <button @click="cerrarSesion" class="bg-white text-[#009d71] px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-semibold">
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
          <button @click="navegarA('admin')" :class="navClass('admin')">Inicio</button>

          <div class="relative">
            <button @click="toggleComisiones" :class="comisionesButtonClass">
              Comisiones
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <div v-if="comisionesAbierto" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button @click="navegarAComision('seguimiento')" class="dropdown-item">Seguimiento</button>
                <button @click="navegarAComision('formacion')" class="dropdown-item">Formación</button>
                <button @click="navegarAComision('registro')" class="dropdown-item">Registro y Habilitación</button>
              </div>
            </div>
          </div>

          <button @click="navegarA('admin/lista-usuarios')" :class="navClass('admin/lista-usuarios')">Lista de usuarios</button>
          <button @click="navegarA('admin/logs')" :class="navClass('admin/logs')">Logs del sistema</button>
        </div>
      </div>
    </nav>

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
            <button @click="exportarLogs" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 font-semibold">
              Exportar
            </button>
            <button @click="limpiarFiltros" class="bg-[#d32d27] text-white px-4 py-2 rounded-lg hover:bg-[#b32520] transition duration-200 font-semibold">
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Acción</label>
              <select v-model="filtroAccion" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent">
                <option value="">Todas las acciones</option>
                <option value="login">Inicio de sesión</option>
                <option value="crear">Creación</option>
                <option value="actualizar">Actualización</option>
                <option value="eliminar">Eliminación</option>
                <option value="registro">Registro</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <select v-model="filtroFecha" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent">
                <option value="">Todo el período</option>
                <option value="hoy">Hoy</option>
                <option value="ayer">Ayer</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Estadísticas Rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="bg-purple-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Tablas Afectadas</p>
                <p class="text-2xl font-bold text-gray-900">{{ tablasUnicas.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="flex items-center">
              <div class="bg-orange-100 p-2 rounded-full">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-600">Hoy</p>
                <p class="text-2xl font-bold text-gray-900">{{ logsHoy.length }}</p>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tabla</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="log in logsFiltrados" :key="log.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="font-medium">{{ formatFecha(log.fecha_accion) }}</div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ log.usuario_nombre || 'Sistema' }}</div>
                    <div class="text-xs text-gray-500">{{ log.correo || 'N/A' }}</div>
                    <div class="text-xs text-gray-400">{{ log.cargo || 'Sin cargo' }}</div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getAccionBadgeClasses(log.accion)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ log.accion }}
                    </span>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {{ log.tabla_afectada }}
                    </span>
                  </td>

                  <td class="px-6 py-4 text-sm text-gray-500 max-w-md">
                    <div class="break-words">{{ log.detalle }}</div>
                    <div v-if="log.registro_id" class="text-xs text-gray-400 mt-1">ID Registro: {{ log.registro_id }}</div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.rol_nombre || 'N/A' }}</td>
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

        <!-- Paginación y Contador -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ logsFiltrados.length }}</span> de <span class="font-medium">{{ logs.length }}</span> registros
          </div>
          <div class="flex space-x-2">
            <button @click="cargarMasLogs" :disabled="!hayMasLogs" class="px-4 py-2 text-sm font-medium text-[#009d71] hover:text-[#008060] disabled:text-gray-400 disabled:cursor-not-allowed">
              {{ hayMasLogs ? 'Cargar más' : 'No hay más registros' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">Desarrollado por Edely Tito - GSA</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logsService } from '../../services/api' // ajusta ruta si hace falta

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('admin/logs')
const comisionesAbierto = ref(false)
const loading = ref(false)

// filtros
const filtroTabla = ref('')
const filtroUsuario = ref('')
const filtroAccion = ref('')
const filtroFecha = ref('')

const logs = ref([])

// -----------------------------
// NAV HELPERS
// -----------------------------
const navClass = (destino) => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200'
  if (rutaActiva.value === destino) return `${base} border-[#009d71] text-[#009d71]`
  return `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

// Clase específica para el botón "Comisiones" (la plantilla usa comisionesButtonClass)
const comisionesButtonClass = () => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200 flex items-center'
  if (comisionesAbierto.value) return `${base} border-[#009d71] text-[#009d71]`
  return `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

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

const navegarAComision = (comision) => {
  comisionesAbierto.value = false
  rutaActiva.value = comision
  router.push(`/${comision}`)
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/') // o '/login'
}

// -----------------------------
// Cargar logs
// -----------------------------
const cargarLogs = async () => {
  loading.value = true
  try {
    const res = await logsService.getLogs({ tabla: filtroTabla.value })
    logs.value = res.data || []
  } catch (err) {
    console.error('Error cargando logs:', err)
    alert('No se pudo cargar logs. Verifica backend y token.')
  } finally {
    loading.value = false
  }
}

// -----------------------------
// Computeds auxiliares requeridos por la plantilla
// -----------------------------
const usuariosUnicos = computed(() => {
  const map = new Map()
  logs.value.forEach(l => {
    // evitar mezclar ?? y ||
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

const logsHoy = computed(() => {
  const hoy = new Date().toDateString()
  return logs.value.filter(l => {
    const fecha = new Date(l.fecha_accion || l.created_at || l.fecha || null)
    return fecha && fecha.toDateString() === hoy
  })
})

// -----------------------------
// Filtrado principal (sin mezclar ?? y || en la misma expresión)
// -----------------------------
const logsFiltrados = computed(() => {
  return logs.value.filter(log => {
    const coincideTabla = !filtroTabla.value || (log.tabla_afectada || '').toLowerCase().includes(filtroTabla.value.toLowerCase())

    const rawUserId = (log.usuario_id !== undefined && log.usuario_id !== null) ? log.usuario_id
                    : (log.usuario && log.usuario.id !== undefined ? log.usuario.id : undefined)
    const userKey = String(rawUserId ?? log.usuario_nombre ?? (typeof log.usuario === 'string' ? log.usuario : '')).toLowerCase()
    const filtroUserStr = String(filtroUsuario.value ?? '').toLowerCase()
    const coincideUsuario = !filtroUsuario.value || userKey === filtroUserStr

    const coincideAccion = !filtroAccion.value || (log.accion || '').toLowerCase().includes(filtroAccion.value.toLowerCase())

    // Filtro por fecha
    let coincideFecha = true
    if (filtroFecha.value) {
      const fecha = new Date(log.fecha_accion || log.created_at || log.fecha || null)
      if (!fecha || isNaN(fecha)) coincideFecha = false
      else {
        const ahora = new Date()
        if (filtroFecha.value === 'hoy') {
          coincideFecha = fecha.toDateString() === ahora.toDateString()
        } else if (filtroFecha.value === 'ayer') {
          const ayer = new Date()
          ayer.setDate(ahora.getDate() - 1)
          coincideFecha = fecha.toDateString() === ayer.toDateString()
        } else if (filtroFecha.value === 'semana') {
          const diffDays = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24))
          coincideFecha = diffDays <= 7
        } else if (filtroFecha.value === 'mes') {
          const diffDays = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24))
          coincideFecha = diffDays <= 31
        }
      }
    }

    return coincideTabla && coincideUsuario && coincideAccion && coincideFecha
  })
})

// -----------------------------
// Helpers UI
// -----------------------------
const getAccionBadgeClasses = (accion) => {
  const k = (accion || '').toString().toLowerCase()
  if (k.includes('login')) return 'bg-green-100 text-green-800'
  if (k.includes('crear')) return 'bg-blue-100 text-blue-800'
  if (k.includes('actualiz')) return 'bg-yellow-100 text-yellow-800'
  if (k.includes('elim') || k.includes('desactiv')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

const formatTiempoTranscurrido = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  if (isNaN(fecha)) return ''
  const diff = Date.now() - fecha.getTime()
  const minutos = Math.floor(diff / 60000)
  if (minutos < 1) return 'hace unos segundos'
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `hace ${horas} h`
  const dias = Math.floor(horas / 24)
  return `hace ${dias} d`
}

// Formatea fecha legible para la tabla (función requerida por la plantilla)
const formatFecha = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  if (isNaN(fecha)) return ''
  // Formato corto: dd/mm/yyyy hh:mm
  const dd = String(fecha.getDate()).padStart(2, '0')
  const mm = String(fecha.getMonth() + 1).padStart(2, '0')
  const yyyy = fecha.getFullYear()
  const hh = String(fecha.getHours()).padStart(2, '0')
  const min = String(fecha.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

// -----------------------------
// Acciones relacionadas (placeholders)
// -----------------------------
const exportarLogs = () => {
  alert('Función exportar aún no implementada.')
}

const limpiarFiltros = () => {
  filtroTabla.value = ''
  filtroUsuario.value = ''
  filtroAccion.value = ''
  filtroFecha.value = ''
}

const hayMasLogs = ref(false)
const cargarMasLogs = async () => {
  alert('Cargar más logs: no implementado (aquí iría paginación).')
}

// -----------------------------
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'
  cargarLogs()
})
</script>


<style scoped>
.dropdown-item { display:block; width:100%; text-align:left; padding:.75rem 1rem; font-size:.875rem; color:#374151; border-bottom:1px solid #f3f4f6; background:white }
.dropdown-item:hover { background:#f3f4f6 }
</style>
