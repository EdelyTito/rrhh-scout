<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header específico para Formación (responsable) -->
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
                    <div class="text-sm text-gray-900">{{ curso.fecha }}</div>
                  </td>

                  <!-- ACCIONES -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="verCurso(curso.id)"
                      class="text-[#009d71] hover:text-[#007a5c] mr-3"
                    >
                      Ver
                    </button>

                    <button 
                      @click="editarCurso(curso.id)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>

                    <button 
                      @click="eliminarCurso(curso.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formacionService } from '../../services/api'

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
      const fecha = formatRangoFechas(curso.fecha_inicio, curso.fecha_fin)

      return {
        id:        curso.id,
        nombre:    curso.nombre,
        tipo:      curso.modalidad || 'Curso',
        fecha,
        estadoFecha: curso.estado || 'Sin estado',
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

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  cargarCursos()
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  switch (destino) {
    case 'inicio-formacion':
      router.push('/formacion')
      break
    case 'lista-cursos':
      // ya estamos aquí
      break
  }
}

const verCurso = (id) => {
  router.push(`/formacion/detalle-curso/${id}`)
}

const editarCurso = (id) => {
  router.push(`/formacion/editar-curso/${id}`)
}

const eliminarCurso = async (id) => {
  if (!confirm('¿Está seguro de eliminar este curso? Esta acción no se puede deshacer.')) return
  cursos.value = cursos.value.filter(curso => curso.id !== id)
  console.log(`Curso ${id} eliminado (solo en frontend)`)
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
