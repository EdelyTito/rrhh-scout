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
      <!-- Welcome Section -->
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Hola {{ nombreResponsable }}!</h2>
          <p class="text-gray-600">Bienvenido a Seguimiento</p>
        </div>

        <!-- Statistics Cards - SEGUIMIENTO -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <!-- Total Solicitudes -->
          <div class="bg-white rounded-lg p-6 border-2 border-black shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Total Solicitudes</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">{{ stats.totalSolicitudes }}</p>
                <p class="text-xs text-gray-500 mt-3">Solicitudes recibidas</p>
              </div>
              <div class="bg-blue-100 p-4 rounded-full">
                <span class="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <!-- Aprobados Nivel II -->
          <div class="bg-white rounded-lg p-6 border-2 border-black shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Aprobados Nivel II</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">{{ stats.aprobadosNivelII}}</p>
                <p class="text-xs text-gray-500 mt-3">Dirigentes aprobados</p>
              </div>
              <div class="bg-green-100 p-4 rounded-full">
                <span class="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <!-- Aprobados Nivel III -->
          <div class="bg-white rounded-lg p-6 border-2 border-black shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Aprobados Nivel III</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">{{ stats.aprobadosNivelIII }}</p>
                <p class="text-xs text-gray-500 mt-3">Dirigentes aprobados</p>
              </div>
              <div class="bg-green-100 p-4 rounded-full">
                <span class="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <!-- En Proceso -->
          <div class="bg-white rounded-lg p-6 border-2 border-black shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4">En Proceso</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">{{ stats.enProceso }}</p>
                <p class="text-xs text-gray-500 mt-3">Solicitudes en trámite</p>
              </div>
              <div class="bg-yellow-100 p-4 rounded-full">
                <span class="text-2xl">🔄</span>
              </div>
            </div>
          </div>

          <!-- Pendientes -->
          <div class="bg-white rounded-lg p-6 border-2 border-black shadow-lg">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Pendientes</h3>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">{{ stats.pendientes }}</p>
                <p class="text-xs text-gray-500 mt-3">Por revisar</p>
              </div>
              <div class="bg-orange-100 p-4 rounded-full">
                <span class="text-2xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid - APROBADOS Y NOMBRAMIENTOS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <!-- Aprobados Nivel II -->
          <div class="bg-white rounded-lg shadow p-6 border-2 border-black">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Aprobados Nivel II</h2>
            <div class="space-y-3">
              <div v-for="rama in aprobadosNivelII" :key="rama.nombre" 
                  class="flex justify-between items-center p-3 bg-gray-50 rounded border">
                <span class="font-medium text-gray-700">{{ rama.nombre }}</span>
                <span class="text-lg font-bold text-blue-600">{{ rama.cantidad }}</span>
              </div>
            </div>
          </div>
          <!-- Aprobados Nivel III -->
          <div class="bg-white rounded-lg shadow p-6 border-2 border-black">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Aprobados Nivel III</h2>
            <div class="space-y-3">
              <div v-for="rama in aprobadosRamas" :key="rama.nombre" 
                   class="flex justify-between items-center p-3 bg-gray-50 rounded border">
                <span class="font-medium text-gray-700">{{ rama.nombre }}</span>
                <span class="text-lg font-bold text-blue-600">{{ rama.cantidad }}</span>
              </div>
            </div>
          </div>

          <!-- Nombramientos -->
          <div class="bg-white rounded-lg shadow p-6 border-2 border-black">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Nombramientos</h2>
            <div class="space-y-3">
              <div v-for="nombramiento in nombramientos" :key="nombramiento.tipo" 
                   class="flex justify-between items-center p-3 bg-gray-50 rounded border">
                <span class="font-medium text-gray-700">{{ nombramiento.tipo }}</span>
                <span class="text-lg font-bold text-green-600">{{ nombramiento.cantidad }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            @click="navegarA('solicitudes-pendientes')"
            class="bg-white p-6 rounded-lg shadow-sm border-2 border-black cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-blue-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Solicitudes Pendientes</h3>
                <p class="text-sm text-gray-600 mt-1">Revisar y gestionar solicitudes</p>
              </div>
            </div>
          </div>

          <div 
            @click="navegarA('dirigentes')"
            class="bg-white p-6 rounded-lg shadow-sm border-2 border-black cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-green-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Lista de Dirigentes</h3>
                <p class="text-sm text-gray-600 mt-1">Ver todos los dirigentes</p>
              </div>
            </div>
          </div>

          <div 
            @click="navegarA('periodo-prueba')"
            class="bg-white p-6 rounded-lg shadow-sm border-2 border-black cursor-pointer hover:shadow-md transition duration-200"
          >
            <div class="flex items-center">
              <div class="bg-purple-100 p-3 rounded-full">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-semibold text-gray-800">Período de Prueba</h3>
                <p class="text-sm text-gray-600 mt-1">Gestionar períodos de prueba</p>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SeguimientoDashboard',
  setup() {
    const router = useRouter()
    
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('inicio')

    // Stats específicos de Seguimiento
    const stats = ref({
      totalSolicitudes: 10,
      aprobadosNivelII: 78,
      aprobadosNivelIII: 115,
      enProceso: 25,
      pendientes: 8
    })

    const aprobadosRamas = ref([
      { nombre: 'Lobatos', cantidad: 50 },
      { nombre: 'Exploradores', cantidad: 40 },
      { nombre: 'Pioneros', cantidad: 22 },
      { nombre: 'Rovers', cantidad: 10 }
    ])

    const aprobadosNivelII = ref([
      { nombre: 'Lobatos', cantidad: 35 },
      { nombre: 'Exploradores', cantidad: 28 },
      { nombre: 'Pioneros', cantidad: 18 },
      { nombre: 'Rovers', cantidad: 12 }
    ])

    // Nombramientos actualizados con ambos niveles de Koodoo
    const nombramientos = ref([
      { tipo: 'Paxtu Grupo', cantidad: 60 },
      { tipo: 'Paxtu Distrito', cantidad: 40 },
      { tipo: 'Koodoo Adjunto de Formación', cantidad: 15 },
      { tipo: 'Koodoo Director', cantidad: 9 }
    ])

    // Cargar datos del usuario desde localStorage
    onMounted(() => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
      nombreResponsable.value = usuario.nombre || 'Responsable de Seguimiento'
    })

    const navegarA = (destino) => {
      rutaActiva.value = destino
      if (destino === 'inicio') {
        return
      }
      router.push(`/seguimiento/${destino}`)
    }

    const cerrarSesion = () => {
      localStorage.removeItem('usuario')
      localStorage.removeItem('token')
      router.push('/login')
    }

    return {
      nombreResponsable,
      rutaActiva,
      stats,
      aprobadosNivelII,
      aprobadosRamas,
      nombramientos,
      navegarA,
      cerrarSesion
    }
  }
}
</script>