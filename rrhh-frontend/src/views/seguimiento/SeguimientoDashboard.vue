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
import { seguimientoService } from '../../services/api'

export default {
  name: 'SeguimientoDashboard',
  setup() {
    const router = useRouter()
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('inicio')
    
    const stats = ref({
      totalSolicitudes: 0,
      aprobadosNivelII: 0,
      aprobadosNivelIII: 0,
      enProceso: 0,
      pendientes: 0
    })
    
    const aprobadosRamas = ref([])
    const aprobadosNivelII = ref([]) // ¡Asegúrate que sea "II" mayúscula!
    const nombramientos = ref([])
    
    const cargarDatosDashboard = async () => {
      try {
        console.log('Cargando estadísticas del dashboard...')
        
        const response = await seguimientoService.getEstadisticas()
        
        console.log('Datos completos recibidos:', response.data)
        
        if (response.data) {
          stats.value = {
            totalSolicitudes: response.data.totalSolicitudes || 0,
            aprobadosNivelII: response.data.aprobadosNivelII || 0,
            aprobadosNivelIII: response.data.aprobadosNivelIII || 0,
            enProceso: response.data.enProceso || 0,
            pendientes: response.data.pendientes || 0
          }
          
          if (response.data.aprobadosPorRama && response.data.aprobadosPorRama.length > 0) {
            aprobadosRamas.value = response.data.aprobadosPorRama
          } else {
            aprobadosRamas.value = [
              { nombre: 'Lobatos', cantidad: Math.floor(stats.value.totalSolicitudes * 0.4) },
              { nombre: 'Exploradores', cantidad: Math.floor(stats.value.totalSolicitudes * 0.3) },
              { nombre: 'Pioneros', cantidad: Math.floor(stats.value.totalSolicitudes * 0.2) },
              { nombre: 'Rovers', cantidad: Math.floor(stats.value.totalSolicitudes * 0.1) }
            ]
          }
          
          aprobadosNivelII.value = aprobadosRamas.value.map(rama => ({
            nombre: rama.nombre,
            cantidad: Math.floor(rama.cantidad * 0.7) // 70% de cada rama son Nivel II
          }))
          
          if (response.data.nombramientos && response.data.nombramientos.length > 0) {
            nombramientos.value = response.data.nombramientos
          } else {
            nombramientos.value = [
              { tipo: 'Paxtu Grupo', cantidad: Math.floor(stats.value.totalSolicitudes * 0.3) },
              { tipo: 'Paxtu Distrito', cantidad: Math.floor(stats.value.totalSolicitudes * 0.2) },
              { tipo: 'Koodoo Adjunto de Formación', cantidad: Math.floor(stats.value.totalSolicitudes * 0.1) },
              { tipo: 'Koodoo Director', cantidad: Math.floor(stats.value.totalSolicitudes * 0.05) }
            ]
          }
          
          console.log('Dashboard cargado exitosamente')
        }
        
      } catch (error) {
        console.error('Error:', error)
        
        if (error.response?.status === 404) {
          console.error('Endpoint /seguimiento/estadisticas no encontrado')
          console.log('Verifica que el endpoint esté definido en tu backend')
        }
        
        cargarDatosEjemplo()
      }
    }
    
    const cargarDatosAdicionales = () => {
      // Calcular datos para las gráficas basados en stats reales
      const total = stats.value.totalSolicitudes
      const aprobadosII = stats.value.aprobadosNivelII
      
      // Aprobados por rama (ejemplo - ajusta si tienes estos datos reales)
      aprobadosRamas.value = [
        { nombre: 'Lobatos', cantidad: Math.floor(total * 0.4) || 50 },
        { nombre: 'Exploradores', cantidad: Math.floor(total * 0.3) || 40 },
        { nombre: 'Pioneros', cantidad: Math.floor(total * 0.2) || 22 },
        { nombre: 'Rovers', cantidad: Math.floor(total * 0.1) || 10 }
      ]
      
      // Aprobados Nivel II por rama
      aprobadosNivelII.value = [
        { nombre: 'Lobatos', cantidad: Math.floor(aprobadosII * 0.4) || 35 },
        { nombre: 'Exploradores', cantidad: Math.floor(aprobadosII * 0.3) || 28 },
        { nombre: 'Pioneros', cantidad: Math.floor(aprobadosII * 0.2) || 18 },
        { nombre: 'Rovers', cantidad: Math.floor(aprobadosII * 0.1) || 12 }
      ]
      
      // Nombramientos (ejemplo)
      nombramientos.value = [
        { tipo: 'Paxtu Grupo', cantidad: Math.floor(total * 0.3) || 60 },
        { tipo: 'Paxtu Distrito', cantidad: Math.floor(total * 0.2) || 40 },
        { tipo: 'Koodoo Adjunto de Formación', cantidad: Math.floor(total * 0.1) || 15 },
        { tipo: 'Koodoo Director', cantidad: Math.floor(total * 0.05) || 9 }
      ]
    }
    
    const cargarDatosEjemplo = () => {
      console.log('📋 Usando datos de ejemplo...')
      
      stats.value = {
        totalSolicitudes: 10,
        aprobadosNivelII: 78,
        aprobadosNivelIII: 115,
        enProceso: 25,
        pendientes: 8
      }
      
      cargarDatosAdicionales()
    }
    
    const navegarA = (destino) => {
      rutaActiva.value = destino
      
      if (destino === 'inicio') {
        return
      }
      
      switch(destino) {
        case 'solicitudes-pendientes':
          router.push('/seguimiento/solicitudes-pendientes')
          break
        case 'lista-dirigentes':
          router.push('/seguimiento/lista-dirigentes')
          break
        case 'periodo-prueba':
          router.push('/seguimiento/periodo-prueba')
          break
        default:
          console.warn('Destino no reconocido:', destino)
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
      
      // Cargar datos reales del dashboard
      cargarDatosDashboard()
    })
    
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

