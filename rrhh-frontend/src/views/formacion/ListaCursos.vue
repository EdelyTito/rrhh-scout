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
        <!-- Título con saludo -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Lista de cursos</h1>
        </div>

        <!-- Tabla de cursos -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          <!-- Tabla -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del curso
                  </th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de curso
                  </th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha del curso
                  </th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" class="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="curso in cursos" :key="curso.id" class="hover:bg-gray-50 transition duration-150">
                  
                  <!-- NOMBRE -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ curso.nombre }}</div>
                  </td>

                  <!-- TIPO -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ curso.tipo }}</div>
                  </td>

                  <!-- FECHA -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ mostrarRangoFechas(curso) }}
                    </div>
                  </td>

                  <!-- ESTADO -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        curso.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : curso.estado === 'finalizado'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ 
                        curso.estado === 'activo'
                          ? 'Activo'
                          : curso.estado === 'finalizado'
                          ? 'Finalizado'
                          : 'Planificado'
                      }}
                    </span>
                  </td>

                  <!-- ACCIONES -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-3">

                      <button
                        @click="verCurso(curso.id)"
                        class="text-[#009d71] hover:underline"
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer de la tabla -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-gray-500">
                Mostrando {{ cursos.length }} cursos
              </div>
              <button 
                @click="crearNuevoCurso"
                class="bg-[#009d71] text-white px-4 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium flex items-center space-x-2"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Crear nuevo curso</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Separador -->
        <div class="my-8 border-t border-gray-300"></div>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formacionService } from '../../services/api'

const props = defineProps({
  embebido: {
    type: Boolean,
    default: false
  }
})

const esAdmin = computed(() => props.embebido === true)

const baseRuta = computed(() =>
  props.embebido ? '/admin/formacion' : '/formacion'
)

const router = useRouter()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('lista-cursos')

const cursos = ref([])
const cargando = ref(false)
const error = ref('')

const formatISODate = (iso, withTime = false) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  if (withTime) {
    const datePart = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timePart = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return `${datePart} ${timePart}`
  }
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatRangoFechas = (fi, ff) => {
  if (!fi && !ff) return 'Por definir'
  if (fi && !ff) return formatISODate(fi)
  if (!fi && ff) return formatISODate(ff)
  return `${formatISODate(fi)} al ${formatISODate(ff)}`
}

const cargarCursos = async () => {
  cargando.value = true
  error.value = ''
  try {
    const res = await formacionService.getCursos()
    const data = Array.isArray(res.data) ? res.data : []

    cursos.value = data.map(curso => {
      return {
        id: curso.id,
        nombre: curso.nombre,
        tipo: curso.modalidad || 'Curso',
        fecha_inicio: curso.fecha_inicio,
        fecha_fin: curso.fecha_fin,
        estado: curso.estado,
      }
    })
  } catch (err) {
    console.error('Error cargando cursos:', err)
    error.value = 'No se pudieron cargar los cursos. Intenta nuevamente.'
    cursos.value = []
  } finally {
    cargando.value = false
  }
}

const mostrarRangoFechas = (curso) => {
  if (!curso.fecha_inicio && !curso.fecha_fin) return 'Por definir'
  if (curso.fecha_inicio && !curso.fecha_fin)
    return formatISODate(curso.fecha_inicio)
  if (!curso.fecha_inicio && curso.fecha_fin)
    return formatISODate(curso.fecha_fin)
  return `${formatISODate(curso.fecha_inicio)} al ${formatISODate(curso.fecha_fin)}`
}


onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  cargarCursos()
})

const navegarA = (destino) => {
  rutaActiva.value = destino

  if (destino === 'inicio-formacion') {
    router.push(baseRuta.value)
  }

  if (destino === 'lista-cursos') {
    router.push(`${baseRuta.value}/lista-cursos`)
  }
}

const verCurso = (id) => {
  router.push(`${baseRuta.value}/detalle-curso/${id}`)
}

const crearNuevoCurso = () => {
  router.push(`${baseRuta.value}/nuevo-curso`)
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
