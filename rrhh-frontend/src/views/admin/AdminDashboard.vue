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
            
            <!-- Dropdown Menu -->
            <div v-if="comisionesAbierto" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button 
                  @click="navegarAComision('seguimiento')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Seguimiento</div>
                  <div class="text-xs text-gray-500 mt-1">Gestión y monitoreo de actividades</div>
                </button>
                
                <button 
                  @click="navegarAComision('formacion')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Formación</div>
                  <div class="text-xs text-gray-500 mt-1">Control de cursos y capacitaciones</div>
                </button>
                
                <button 
                  @click="navegarAComision('registro')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div class="font-medium">Registro y Habilitación</div>
                  <div class="text-xs text-gray-500 mt-1">Registro y habilitación de personal</div>
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="navegarA('admin/lista-usuarios')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'admin/lista-usuarios' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Lista de usuarios
          </button>
          
          <button 
            @click="navegarA('admin/logs')"
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
      <!-- Welcome Section -->
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Bienvenido Administrador</h2>
          <p class="text-gray-600">Panel de control principal del sistema de Recursos Humanos</p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Seguimiento - VERDE -->
          <div class="bg-[#009d71] rounded-lg p-8 border-2 border-black shadow-lg cursor-pointer hover:shadow-xl transition duration-200">
            <h3 class="text-lg font-bold text-white mb-4">Seguimiento</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-white opacity-90">Total solicitudes</p>
                <p class="text-4xl font-bold text-white mt-2">10</p>
                <p class="text-xs text-white opacity-80 mt-3">3 pendientes</p>
              </div>
              <div class="bg-white bg-opacity-20 p-4 rounded-full">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Formación - BLANCO -->
          <div class="bg-white rounded-lg p-8 border-2 border-black shadow-lg cursor-pointer hover:shadow-xl transition duration-200">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Formación</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total cursos</p>
                <p class="text-4xl font-bold text-gray-900 mt-2">115</p>
                <p class="text-xs text-gray-500 mt-3">Activos este año</p>
              </div>
              <div class="bg-gray-100 p-4 rounded-full">
                <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Registro y Habilitación - ROJO -->
          <div class="bg-[#d32d27] rounded-lg p-8 border-2 border-black shadow-lg cursor-pointer hover:shadow-xl transition duration-200">
            <h3 class="text-lg font-bold text-white mb-4">Registro y Habilitación</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-white opacity-90">Total habilitados</p>
                <p class="text-4xl font-bold text-white mt-2">84</p>
                <p class="text-xs text-white opacity-80 mt-3">5 solicitudes pendientes</p>
              </div>
              <div class="bg-white bg-opacity-20 p-4 rounded-full">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            @click="navegarA('admin/lista-usuarios')"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Gestión de Usuarios</h3>
                <p class="text-sm text-gray-600 mt-1">Administrar usuarios del sistema</p>
              </div>
            </div>
          </div>

          <div 
            @click="navegarA('admin/logs')"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-green-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Logs del Sistema</h3>
                <p class="text-sm text-gray-600 mt-1">Ver actividad del sistema</p>
              </div>
            </div>
          </div>

          <div 
            @click="navegarAComision('seguimiento')"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-purple-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Reportes</h3>
                <p class="text-sm text-gray-600 mt-1">Generar reportes</p>
              </div>
            </div>
          </div>

          <div 
            @click="navegarAComision('registro')"
            class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-orange-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Habilitaciones</h3>
                <p class="text-sm text-gray-600 mt-1">Gestionar habilitaciones</p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('inicio')
const comisionesAbierto = ref(false)

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'
})

const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false
  
  if (destino === 'inicio') {
    return
  }
  
  // Si destino ya empieza con "/", usar directamente, sino agregar "/"
  if (destino.startsWith('/')) {
    router.push(destino)
  } else {
    router.push(`/${destino}`)
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
</script>