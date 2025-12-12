<template>
  <div class="min-h-screen bg-gray-50">
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

    <!-- Navigation específica para Formación -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            @click="navegarA('inicio-formacion')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'inicio-formacion' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Inicio
          </button>
          
          <button 
            @click="navegarA('lista-cursos')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'lista-cursos' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Lista de cursos
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Bienvenida -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Bienvenido a Formación</h1>
        </div>

        <!-- Contenido en dos columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Columna izquierda: Cursos existentes (SOLO CONTADOR) -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-800">Cursos existentes</h2>
              <div class="bg-[#009d71] text-white rounded-full h-16 w-16 flex items-center justify-center">
                <span class="text-2xl font-bold">{{ totalCursos }}</span>
              </div>
            </div>

            <!-- SOLO CONTADOR - NO LISTA -->
            <div class="mt-8 text-center">
              <p class="text-gray-600 mb-4">Total de cursos registrados en el sistema</p>
              <div class="flex justify-center space-x-4">
                <div class="text-center">
                  <div class="bg-green-100 text-green-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <span class="font-bold">{{ cursosActivos }}</span>
                  </div>
                  <p class="text-xs text-gray-600">Activos</p>
                </div>
                <div class="text-center">
                  <div class="bg-blue-100 text-blue-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <span class="font-bold">{{ cursosPlanificados }}</span>
                  </div>
                  <p class="text-xs text-gray-600">Planificados</p>
                </div>
                <div class="text-center">
                  <div class="bg-gray-100 text-gray-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                    <span class="font-bold">{{ cursosFinalizados }}</span>
                  </div>
                  <p class="text-xs text-gray-600">Finalizados</p>
                </div>
              </div>
            </div>

            <!-- Botón Crear nuevo curso -->
            <button 
              @click="crearNuevoCurso"
              class="mt-8 w-full bg-[#009d71] text-white px-4 py-3 rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Crear nuevo curso</span>
            </button>
          </div>

          <!-- Columna derecha: Dirigentes que pueden dar cursos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">Dirigentes que pueden dar algún curso</h2>
            
            <!-- Lista numerada de dirigentes -->
            <div class="space-y-3">
              <div v-for="(dirigente, index) in dirigentes" :key="dirigente.id"
                   class="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                <div class="flex-shrink-0 bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">{{ index + 1 }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ dirigente.nombre }}</h3>
                  <p class="text-sm text-gray-600">{{ dirigente.especialidad }}</p>
                </div>
                <div class="flex-shrink-0">
                  <span class="text-xs text-gray-500">{{ dirigente.nivel }}</span>
                </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formacionService, dirigentesService } from '../../services/api'

const router = useRouter()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('inicio-formacion')

const estadisticasCursos = ref({
  total: 0,
  activos: 0,
  planificados: 0,
  finalizados: 0,
})

const dirigentes = ref([])

const totalCursos = computed(() => estadisticasCursos.value.total)
const cursosActivos = computed(() => estadisticasCursos.value.activos)
const cursosPlanificados = computed(() => estadisticasCursos.value.planificados)
const cursosFinalizados = computed(() => estadisticasCursos.value.finalizados)

const cargarCursos = async () => {
  try {
    const res = await formacionService.getCursos()
    const cursos = Array.isArray(res.data) ? res.data : []

    estadisticasCursos.value.total = cursos.length

    estadisticasCursos.value.activos = cursos.filter(c => c.estado === 'activo').length
    estadisticasCursos.value.planificados = cursos.filter(c => c.estado === 'planificado').length
    estadisticasCursos.value.finalizados = cursos.filter(c => c.estado === 'finalizado').length

  } catch (err) {
    console.error('❌ Error cargando cursos en dashboard formación:', err)
  }
}

/*const cargarDirigentes = async () => {
  try {
    const res = await dirigentesService.getDirigentes()
    const todos = Array.isArray(res.data) ? res.data : []

    // Si tu backend tiene un flag tipo puede_dar_curso, aquí lo filtras.
    // Por ahora, mostramos los primeros 6 como ejemplo.
    dirigentes.value = todos.slice(0, 6).map(d => ({
      id: d.id,
      nombre: d.nombre,
      especialidad: d.especialidad || 'Dirigente',
      nivel: d.nivel_formacion || '—',
    }))
  } catch (err) {
    console.error('❌ Error cargando dirigentes para formación:', err)
    // Si falla, podrías dejar unos de ejemplo si quieres.
  }
}*/


const USE_FAKE_DIRIGENTES = true 

const FAKE_DIRIGENTES = [
  { id: 'f-01', nombre: 'María Gonzales', especialidad: 'Liderazgo Scout', nivel_formacion: 'Nivel 3' },
  { id: 'f-02', nombre: 'Carlos Huanca', especialidad: 'Primeros Auxilios', nivel_formacion: 'Nivel 2' },
  { id: 'f-03', nombre: 'Ana López', especialidad: 'Técnicas de Patrulla', nivel_formacion: 'Nivel 4' },
  { id: 'f-04', nombre: 'Jorge Mamani', especialidad: 'Orientación y Campismo', nivel_formacion: 'Nivel 3' },
  { id: 'f-05', nombre: 'Sofía Pacheco', especialidad: 'Formación de Monitores', nivel_formacion: 'Nivel 2' },
  { id: 'f-06', nombre: 'Andrés Quispe', especialidad: 'Animación y Juegos', nivel_formacion: 'Nivel 1' },
]

const cargarDirigentes = async () => {
  try {
    const res = await dirigentesService.getDirigentes()
    const todos = Array.isArray(res.data) ? res.data : []

    if (todos.length > 0) {
      dirigentes.value = todos.slice(0, 6).map(d => ({
        id: d.id ?? `s-${Math.random().toString(36).slice(2,8)}`,
        nombre: d.nombre ?? (d.nombre_completo ?? 'Nombre desconocido'),
        especialidad: d.especialidad ?? d.area ?? 'Dirigente',
        nivel: d.nivel_formacion ?? d.nivel ?? '—',
      }))
      return
    }

    if (USE_FAKE_DIRIGENTES) {
      dirigentes.value = FAKE_DIRIGENTES.slice(0, 6)
      console.warn('Usando dirigentes falsos para desarrollo (cargarDirigentes fallback).')
      return
    }

    dirigentes.value = []
  } catch (err) {
    console.error('Error cargando dirigentes para formación:', err)
    if (USE_FAKE_DIRIGENTES) {
      dirigentes.value = FAKE_DIRIGENTES.slice(0, 6)
      console.warn('Usando dirigentes falsos por error de conexión al backend.')
    } else {
      dirigentes.value = []
    }
  }
}



onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'

  cargarCursos()
  cargarDirigentes()
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  switch (destino) {
    case 'inicio-formacion':
      break
    case 'lista-cursos':
      router.push('/formacion/lista-cursos')
      break
  }
}

const crearNuevoCurso = () => {
  router.push('/formacion/nuevo-curso')
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
