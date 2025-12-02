<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-[#009d71] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
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
            @click="navegarA('admin')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'admin' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Inicio
          </button>
          
          <!-- Dropdown Comisiones -->
          <div class="relative">
            <button 
              @click="toggleComisiones"
              :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200 flex items-center', 
                      comisionesAbierto 
                      ? 'border-[#009d71] text-[#009d71]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
              Comisiones
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-if="comisionesAbierto" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button 
                  @click="navegarAComision('seguimiento')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Seguimiento</div>
                </button>
                
                <button 
                  @click="navegarAComision('formacion')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Formación</div>
                </button>
                
                <button 
                  @click="navegarAComision('registro')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div class="font-medium">Registro y Habilitación</div>
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="navegarA('lista-usuarios')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'lista-usuarios' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Lista de usuarios
          </button>
          
          <button 
            @click="navegarA('logs')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'logs' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Logs del sistema
          </button>
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
            <button 
              @click="exportarLogs"
              class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 font-semibold"
            >
              Exportar
            </button>
            <button 
              @click="limpiarFiltros"
              class="bg-[#d32d27] text-white px-4 py-2 rounded-lg hover:bg-[#b32520] transition duration-200 font-semibold"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tabla Afectada</label>
              <select 
                v-model="filtroTabla"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
                <option value="">Todas las tablas</option>
                <option value="usuarios">Usuarios</option>
                <option value="dirigentes">Dirigentes</option>
                <option value="solicitudes_registro">Solicitudes Registro</option>
                <option value="cursos">Cursos</option>
                <option value="seguimiento">Seguimiento</option>
                <option value="reincorporaciones">Reincorporaciones</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <select 
                v-model="filtroUsuario"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
                <option value="">Todos los usuarios</option>
                <option v-for="usuario in usuariosUnicos" :key="usuario.id" :value="usuario.id">
                  {{ usuario.nombre }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Acción</label>
              <select 
                v-model="filtroAccion"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
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
              <select 
                v-model="filtroFecha"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
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
                <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tabla
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalle
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="log in logsFiltrados" 
                  :key="log.id"
                  class="hover:bg-gray-50 transition duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="font-medium">{{ log.fecha_accion }}</div>
                    <div class="text-xs text-gray-500">{{ formatTiempoTranscurrido(log.fecha_accion) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ log.usuario_nombre || 'Sistema' }}</div>
                    <div class="text-xs text-gray-500">{{ log.correo || 'N/A' }}</div>
                    <div class="text-xs text-gray-400">{{ log.cargo || 'Sin cargo' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getAccionBadgeClasses(log.accion)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
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
                    <div v-if="log.registro_id" class="text-xs text-gray-400 mt-1">
                      ID Registro: {{ log.registro_id }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ log.rol_nombre || 'N/A' }}
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

        <!-- Paginación y Contador -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ logsFiltrados.length }}</span> de 
            <span class="font-medium">{{ logs.length }}</span> registros
          </div>
          <div class="flex space-x-2">
            <button 
              @click="cargarMasLogs"
              :disabled="!hayMasLogs"
              class="px-4 py-2 text-sm font-medium text-[#009d71] hover:text-[#008060] disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {{ hayMasLogs ? 'Cargar más' : 'No hay más registros' }}
            </button>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('logs')
const comisionesAbierto = ref(false)
const loading = ref(false)

// Filtros
const filtroTabla = ref('')
const filtroUsuario = ref('')
const filtroAccion = ref('')
const filtroFecha = ref('')

// Datos de ejemplo basados en tu estructura de logs
const logs = ref([
  {
    id: 1,
    usuario_nombre: 'Administrador Principal',
    correo: 'admin@scout.com',
    cargo: 'Administrador del Sistema',
    rol_nombre: 'admin',
    accion: 'Inicio de sesión exitoso',
    tabla_afectada: 'usuarios',
    registro_id: 1,
    detalle: 'Correo: admin@scout.com, Rol: admin, Cargo: Administrador del Sistema',
    fecha_accion: '15/11/2024 14:30'
  },
  {
    id: 2,
    usuario_nombre: 'María García López',
    correo: 'registro@scout.com',
    cargo: 'Comisionado de Registro y Habilitación',
    rol_nombre: 'responsable_registro',
    accion: 'Creó un nuevo dirigente',
    tabla_afectada: 'dirigentes',
    registro_id: 5,
    detalle: 'Dirigente: Juan Pérez, Grupo: 1er La Paz, Estado: Postulante, Distrito: La Paz',
    fecha_accion: '15/11/2024 14:25'
  },
  {
    id: 3,
    usuario_nombre: 'Carlos Rodríguez',
    correo: 'formacion@scout.com',
    cargo: 'Comisionado de Formación',
    rol_nombre: 'responsable_formation',
    accion: 'Creó un nuevo curso',
    tabla_afectada: 'cursos',
    registro_id: 12,
    detalle: 'Curso: Liderazgo Scout Básico',
    fecha_accion: '15/11/2024 14:20'
  },
  {
    id: 4,
    usuario_nombre: 'Ana Martínez',
    correo: 'seguimiento@scout.com',
    cargo: 'Comisionado de Seguimiento',
    rol_nombre: 'responsable_seguimiento',
    accion: 'Registró entrega o devolución en seguimiento',
    tabla_afectada: 'entregas_seguimiento',
    registro_id: 8,
    detalle: 'Etapa: primera entrega - Observaciones: Documentación completa recibida',
    fecha_accion: '15/11/2024 14:15'
  },
  {
    id: 5,
    usuario_nombre: 'Pedro Sánchez',
    correo: 'subregistro@scout.com',
    cargo: 'Subcomisionado de Registro',
    rol_nombre: 'subcomisionado_registro',
    accion: 'Actualizó estado de solicitud de registro',
    tabla_afectada: 'solicitudes_registro',
    registro_id: 3,
    detalle: 'Nuevo estado: habilitado - Observaciones: Documentación en orden',
    fecha_accion: '15/11/2024 14:10'
  },
  {
    id: 6,
    usuario_nombre: 'Administrador Principal',
    correo: 'admin@scout.com',
    cargo: 'Administrador del Sistema',
    rol_nombre: 'admin',
    accion: 'Eliminó registro de seguimiento',
    tabla_afectada: 'seguimiento',
    registro_id: 2,
    detalle: 'Registro eliminado por administrador',
    fecha_accion: '14/11/2024 16:45'
  }
])

// Computed properties
const logsFiltrados = computed(() => {
  return logs.value.filter(log => {
    const coincideTabla = !filtroTabla.value || 
      log.tabla_afectada.toLowerCase().includes(filtroTabla.value.toLowerCase())
    
    const coincideUsuario = !filtroUsuario.value || 
      log.usuario_nombre?.toLowerCase().includes(filtroUsuario.value.toLowerCase())
    
    const coincideAccion = !filtroAccion.value || 
      log.accion.toLowerCase().includes(filtroAccion.value.toLowerCase())
    
    return coincideTabla && coincideUsuario && coincideAccion
  })
})

const usuariosUnicos = computed(() => {
  const usuarios = logs.value.map(log => ({
    id: log.usuario_nombre,
    nombre: log.usuario_nombre
  }))
  return [...new Map(usuarios.map(item => [item.id, item])).values()]
})

const tablasUnicas = computed(() => {
  return [...new Set(logs.value.map(log => log.tabla_afectada))]
})

const logsHoy = computed(() => {
  const hoy = new Date().toLocaleDateString('es-ES')
  return logs.value.filter(log => log.fecha_accion.startsWith(hoy))
})

const hayMasLogs = computed(() => {
  return logsFiltrados.value.length < 100 // Simulación
})

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'
})

// Funciones de utilidad
const formatTiempoTranscurrido = (fechaStr) => {
  // Simulación - en producción calcularías la diferencia real
  const opciones = ['Hace 5 min', 'Hace 1 hora', 'Hace 2 horas', 'Ayer']
  return opciones[Math.floor(Math.random() * opciones.length)]
}

const getAccionBadgeClasses = (accion) => {
  if (accion.includes('login') || accion.includes('sesión')) {
    return 'bg-green-100 text-green-800'
  } else if (accion.includes('Creó') || accion.includes('Registró')) {
    return 'bg-blue-100 text-blue-800'
  } else if (accion.includes('Actualizó') || accion.includes('editó')) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (accion.includes('Eliminó')) {
    return 'bg-red-100 text-red-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

// Funciones de acciones
const exportarLogs = () => {
  console.log('Exportando logs...')
  // Aquí implementarías la exportación a CSV/Excel
  alert('Funcionalidad de exportación en desarrollo')
}

const limpiarFiltros = () => {
  filtroTabla.value = ''
  filtroUsuario.value = ''
  filtroAccion.value = ''
  filtroFecha.value = ''
}

const cargarMasLogs = () => {
  console.log('Cargando más logs...')
  // Aquí implementarías la paginación
}

// Navegación (igual que en otras vistas)
const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false
  if (destino === 'admin') {
    router.push('/admin')
  } else if (destino === 'lista-usuarios') {
    router.push('/lista-usuarios')
  }
}

const navegarAComision = (comision) => {
  comisionesAbierto.value = false
  rutaActiva.value = comision
  router.push(`/${comision}`)
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}

// Manejar click fuera del dropdown
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    comisionesAbierto.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>