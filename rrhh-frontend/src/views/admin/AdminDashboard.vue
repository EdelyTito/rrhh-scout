<template>
  <div class="min-h-screen bg-gray-50">
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
            @click="() => navegarA('inicio')"
            :class="navClass('inicio')"
          >
            Inicio
          </button>
          
          <!-- Dropdown Comisiones -->
          <!--
          <div class="relative">
            <button 
              @click="toggleComisiones"
              :class="comisionesButtonClass()"
            >
              Comisiones
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <!--
            <div v-if="comisionesAbierto" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button 
                  @click="() => navegarAComision('seguimiento')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Seguimiento</div>
                  <div class="text-xs text-gray-500 mt-1">Gestión y monitoreo de actividades</div>
                </button>
                
                <button 
                  @click="() => navegarAComision('formacion')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Formación</div>
                  <div class="text-xs text-gray-500 mt-1">Control de cursos y capacitaciones</div>
                </button>
                
                <button 
                  @click="() => navegarAComision('registro')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div class="font-medium">Registro y Habilitación</div>
                  <div class="text-xs text-gray-500 mt-1">Registro y habilitación de personal</div>
                </button>
              </div>
            </div>
          </div>
          -->

          <button 
            @click="() => navegarA('admin/lista-usuarios')"
            :class="navClass('admin/lista-usuarios')"
          >
            Lista de usuarios
          </button>
          
          <button 
            @click="() => navegarA('admin/logs')"
            :class="navClass('admin/logs')"
          >
            Logs del sistema
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
      <!-- Welcome Section -->
      <div class="px-4 py-4 sm:px-0">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Bienvenido Administrador</h2>
          <p class="text-sm text-gray-500 mt-2">
            Último inicio de sesión:
            <span class="font-medium text-gray-700">
              {{ formatFechaHora(dashboard.ultimo_login) }}
            </span>
          </p>
          <p class="text-gray-600">Panel de control principal del sistema de Recursos Humanos</p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Seguimiento - VERDE -->
          <div class="bg-[#009d71] rounded-lg p-8 border-2 border-black shadow-lg cursor-pointer hover:shadow-xl transition duration-200">
            <h3 class="text-lg font-bold text-white mb-4">Seguimiento</h3>
              <p class="text-sm text-white">Solicitudes totales</p>
              <p class="text-4xl font-bold text-white">
                {{ dashboard.seguimiento.total }}
              </p>

              <p class="text-xs text-white mt-2">
                ✔ {{ dashboard.seguimiento.aprobados }} aprobadas<br>
                ⏳ {{ dashboard.seguimiento.pendientes }} pendientes
              </p>
          </div>

          <!-- Formación - BLANCO -->
          <div class="bg-white rounded-lg p-8 border-2 border-black shadow-lg cursor-pointer hover:shadow-xl transition duration-200">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Formación</h3>
              <p class="text-sm text-gray-600">Cursos registrados</p>
              <p class="text-4xl font-bold text-gray-900">
                {{ dashboard.formacion.total_cursos }}
              </p>

              <p class="text-xs text-gray-500 mt-2">
                {{ dashboard.formacion.cursos_activos }} activos
              </p>
          </div>

          <!-- Registro y Habilitación - ROJO -->
          <div class="bg-[#d32d27] rounded-lg p-8 border-2 border-black shadow-lg cursor-pointer hover:shadow-xl transition duration-200">
            <h3 class="text-lg font-bold text-white mb-4">Registro y Habilitación</h3>
              <p class="text-sm text-white">Dirigentes habilitados</p>
              <p class="text-4xl font-bold text-white">
                {{ dashboard.registro.habilitados }}
              </p>

              <p class="text-xs text-white mt-2">
                ⏳ {{ dashboard.registro.pendientes }} pendientes
              </p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '../../services/api'

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('inicio')
const comisionesAbierto = ref(false)

const dashboard = ref({
  seguimiento: { total: 0, aprobados: 0, pendientes: 0 },
  formacion: { total_cursos: 0, cursos_activos: 0 },
  registro: { habilitados: 0, pendientes: 0 },
  ultimo_login: null
})

const formatFechaHora = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const loadingDashboard = ref(false)

const cargarDashboard = async () => {
  loadingDashboard.value = true
  try {
    const res = await adminService.getDashboard()
    dashboard.value = res.data
  } catch (err) {
    console.error('Error cargando dashboard:', err)
  } finally {
    loadingDashboard.value = false
  }
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario?.nombre || 'Administrador'
  cargarDashboard()
})

const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navClass = (destino) => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200'
  if (rutaActiva.value === destino) return `${base} border-[#009d71] text-[#009d71]`
  return `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

const comisionesButtonClass = () => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200 flex items-center'
  if (comisionesAbierto.value) return `${base} border-[#009d71] text-[#009d71]`
  return `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false
  
  if (!destino) return

  if (destino === 'inicio') {
    router.push('/admin').catch(()=>{})
    return
  }

  if (destino.startsWith('/')) {
    router.push(destino).catch(()=>{})
    return
  }

  router.push(`/${destino}`).catch(()=>{})
}

const navegarAComision = (comision) => {
  comisionesAbierto.value = false
  rutaActiva.value = comision
  router.push(`/${comision}`).catch(()=>{})
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/').catch(()=>{})
}
</script>
