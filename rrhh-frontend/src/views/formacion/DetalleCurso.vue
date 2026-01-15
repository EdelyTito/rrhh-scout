<template>
  <div class="min-h-screen bg-gray-50">
    
    <FormacionHeader
      v-if="!embebido"
      :nombreResponsable="nombreResponsable"
      @cerrar-sesion="cerrarSesion"
    />

    <FormacionNav
      v-if="!embebido"
      :rutaActiva="rutaActiva"
      @navegar="navegarA"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título y botones de acción -->
        <div class="mb-8 flex justify-between items-center">
          <div class="flex items-start gap-5">
          <!-- Flecha volver -->
          <div class="flex justify-between">
          <button 
            @click="volverALista"
            class="px-6 py-3 rounded-lg transition duration-200 font-medium flex items-center space-x-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Volver a lista</span>
          </button>
        </div>

          <!-- Título -->
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Curso - {{ curso.nombre }}
            </h1>
            <p class="text-gray-600 mt-1">{{ curso.tipo }}</p>
          </div>

        </div>

          <div class="flex space-x-3">
            <button 
              @click="editarCurso"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Editar Curso</span>
            </button>
          </div>
        </div>

        <!-- Información del curso -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <!-- Estadísticas rápidas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Total de módulos</p>
              <p class="text-2xl font-bold text-gray-900">{{ curso.modulos.length }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Estado</p>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                curso.estado === 'activo' ? 'bg-green-100 text-green-800' :
                curso.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              ]">
                {{ curso.estado === 'activo' ? 'Activo' : curso.estado === 'finalizado' ? 'Finalizado' : 'Planificado' }}
              </span>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Fecha</p>
              <p class="text-sm text-gray-900">{{ fechaCurso }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p class="text-sm font-medium text-gray-700">Modalidad</p>
              <p class="text-gray-900 capitalize">
                {{ curso.modalidad || 'Por definir' }}
              </p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">Lugar</p>
              <p class="text-gray-900">
                {{ curso.lugar || 'Por definir' }}
              </p>
            </div>
          </div>

          <!-- Descripción del curso -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Descripción del curso</h2>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p class="text-gray-700">{{ curso.descripcion }}</p>
            </div>
          </div>

          <!-- Separador -->
          <div class="my-6 border-t border-gray-300"></div>

          <!-- Lista de módulos y dirigentes -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">Lista de módulos y dirigentes</h2>
              <span class="text-sm text-gray-500">{{ curso.modulos.length }} módulos</span>
            </div>
            
            <div class="space-y-4">
              <div v-for="(modulo, index) in curso.modulos" :key="index"
                   class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-150">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <div class="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">{{ index + 1 }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">{{ modulo.titulo }}</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ modulo.descripcion }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ modulo.dirigente }}</p>
                    <p class="text-xs text-gray-500">{{ modulo.duracion }}</p>
                    <div class="mt-2 flex justify-end space-x-2">
                      <button 
                        @click="verAsistenciasModulo(modulo.id)"
                        class="text-xs text-[#009d71] hover:text-[#007a5c] font-medium"
                      >
                        Ver asistencias
                      </button>
                      <span class="text-xs text-gray-400">•</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                @click="gestionarModulos"
                class="bg-[#009d71] text-white px-4 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium flex items-center space-x-2"
              >
                <span>Gestionar Módulos</span>
              </button>
            </div>

            <!-- Mensaje si no hay módulos -->
            <div v-if="curso.modulos.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="mt-2 text-gray-500">No hay módulos registrados para este curso.</p>
              <button 
                @click="gestionarModulos"
                class="mt-4 text-[#009d71] hover:text-[#007a5c] font-medium"
              >
                Agregar módulos
              </button>
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
import FormacionHeader from '../../components/formacion/FormacionHeader.vue'
import FormacionNav from '../../components/formacion/FormacionNav.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formacionService } from '../../services/api'

const props = defineProps({
  embebido: {
    type: Boolean,
    default: false
  }
})

const baseRuta = computed(() =>
  props.embebido ? '/admin/formacion' : '/formacion'
)

const esAdmin = computed(() => props.embebido === true)

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('detalle-curso')

const curso = ref({ modulos: [] })
const cargando = ref(false)
const error = ref('')

const cursoId = computed(() => route.params.id)

const cargarDatos = async () => {
  cargando.value = true
  error.value = ''
  try {
    const [cursoRes, modRes] = await Promise.all([
      formacionService.getCurso(cursoId.value),
      formacionService.getModulos(cursoId.value),
    ])

    curso.value = cursoRes.data || { modulos: [] }

    const modulosData = Array.isArray(modRes.data) ? modRes.data : []
    curso.value.modulos = modulosData

  } catch (err) {
    console.error('Error cargando detalle de curso:', err)
    error.value = 'No se pudo cargar el curso. Intenta nuevamente.'
    curso.value = { modulos: [] }
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  cargarDatos()
})

const navegarA = (destino) => {
  rutaActiva.value = destino

  if (destino === 'lista-cursos')
    router.push(baseRuta.value)

  if (destino === 'inicio-formacion')
    router.push(baseRuta.value)
}

const editarCurso = () => {
  router.push(`${baseRuta.value}/editar-curso/${cursoId.value}`)
}

const gestionarModulos = () => {
  router.push(`${baseRuta.value}/curso/${cursoId.value}/modulos`)
}

const verAsistenciasModulo = (moduloId) => {
  router.push(`${baseRuta.value}/modulo/${moduloId}/asistencias`)
}

const volverALista = () => {
  router.push(`${baseRuta.value}`)
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}

const fechaCurso = computed(() => {
  if (!curso.value.fecha_inicio && !curso.value.fecha_fin) return 'Por definir'
  if (curso.value.fecha_inicio && !curso.value.fecha_fin)
    return formatISODate(curso.value.fecha_inicio)
  if (!curso.value.fecha_inicio && curso.value.fecha_fin)
    return formatISODate(curso.value.fecha_fin)
  return `${formatISODate(curso.value.fecha_inicio)} al ${formatISODate(curso.value.fecha_fin)}`
})

const formatISODate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}


</script>

