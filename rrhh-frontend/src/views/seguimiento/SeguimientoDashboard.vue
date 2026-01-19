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
      <!-- Welcome Section -->
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Hola {{ nombreResponsable }}!</h2>
          <p class="text-gray-600">Bienvenido a Seguimiento</p>
        </div>

        <!-- Statistics Cards - SEGUIMIENTO -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          <div class="bg-white rounded-lg p-6 border-2 border-blue-500 shadow-lg">
            <h3 class="text-lg font-bold mb-4">IM Nivel II</h3>
            <p class="text-4xl font-bold">{{ stats.im2 }}</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-blue-500 shadow-lg">
            <h3 class="text-lg font-bold mb-4">IM Nivel III</h3>
            <p class="text-4xl font-bold">{{ stats.im3 }}</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-green-600 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Paxtu Grupo</h3>
            <p class="text-4xl font-bold">{{ stats.paxtuGrupo }}</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-green-600 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Paxtu Distrito</h3>
            <p class="text-4xl font-bold">{{ stats.paxtuDistrito }}</p>
          </div>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          <div class="bg-white rounded-lg p-6 border-2 border-purple-600 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Koodoo Adjunto</h3>
            <p class="text-4xl font-bold">{{ stats.koodooAdjunto }}</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-purple-600 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Koodoo Director</h3>
            <p class="text-4xl font-bold">{{ stats.koodooDirector }}</p>
          </div>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          <div class="bg-white rounded-lg p-6 border-2 border-yellow-500 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Períodos de Prueba</h3>
            <p class="text-4xl font-bold">{{ stats.periodosPrueba }}</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-orange-500 shadow-lg">
            <h3 class="text-lg font-bold mb-4">Reincorporaciones</h3>
            <p class="text-4xl font-bold">{{ stats.reincorporaciones }}</p>
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
import SeguimientoHeader from '../../components/seguimiento/SeguimientoHeader.vue';
import SeguimientoNav from '../../components/seguimiento/SeguimientoNav.vue';
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'

    const props = defineProps({
      embebido: {
        type: Boolean,
        default: false
      }
    })

    const esAdmin = computed(() => props.embebido === true)

    const router = useRouter()
    const nombreResponsable = ref('Responsable de Seguimiento')
    const rutaActiva = ref('inicio')
  
    const stats = ref({
      im2: 0,
      im3: 0,
      paxtuGrupo: 0,
      paxtuDistrito: 0,
      koodooAdjunto: 0,
      koodooDirector: 0,
      periodosPrueba: 0,
      reincorporaciones: 0
    })

    const cargarDatosDashboard = async () => {
      try {
        const { data } = await seguimientoService.getEstadisticas()

        console.log('Dashboard recibido:', data)

        if (data?.stats) {
          stats.value = {
            im2: data.stats.im2,
            im3: data.stats.im3,
            paxtuGrupo: data.stats.paxtuGrupo,
            paxtuDistrito: data.stats.paxtuDistrito,
            koodooAdjunto: data.stats.koodooAdjunto,
            koodooDirector: data.stats.koodooDirector,
            periodosPrueba: data.stats.periodosPrueba,
            reincorporaciones: data.stats.reincorporaciones
          }
        }
      } catch (err) {
        console.error('Error dashboard:', err)
      }
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
      localStorage.clear()
      router.push('/')
    }
    
    onMounted(() => {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
      nombreResponsable.value = usuario.nombre || 'Responsable de Seguimiento'
      
      cargarDatosDashboard()
    })

</script>

