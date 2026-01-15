<template>
  <div class="min-h-screen bg-gray-50">
    
    <FormacionHeader
      :nombreResponsable="nombreResponsable"
      @cerrar-sesion="cerrarSesion"
    />

    <FormacionNav
      :rutaActiva="rutaActiva"
      @navegar="navegarA"
    />

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título y navegación -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Registro de Asistencias</h1>
              <div class="text-gray-600 mt-1">
                <p>Módulo: {{ modulo.nombre || '—' }}</p>
                <p class="text-sm">Curso: {{ modulo.cursoNombre || '—' }}</p>
              </div>
            </div>
            <button 
              @click="volverAModulos"
              class="text-[#009d71] hover:text-[#007a5c] font-medium flex items-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver a módulos</span>
            </button>
          </div>
        </div>

        <!-- Información del módulo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input 
                v-model="fechaAsistencia"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total asistentes</label>
              <div class="text-2xl font-bold text-[#009d71]">
                {{ totalAsistentes }}
              </div>
            </div>
          </div>
        </div>

        <!-- Registrar asistencia -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 class="text-lg font-semibold mb-4">Registrar asistencia</h2>

          <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              v-model="nuevoRegistro.nombre_participante"
              placeholder="Nombre del participante"
              class="border rounded-lg px-3 py-2"
            />

            <input
              v-model="nuevoRegistro.grupo"
              placeholder="Grupo"
              class="border rounded-lg px-3 py-2"
            />

            <select v-model="nuevoRegistro.presente" class="border rounded-lg px-3 py-2">
              <option :value="true">Presente</option>
              <option :value="false">Ausente</option>
            </select>

            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="nuevoRegistro.pago_cuota" />
              <span>Pagó cuota</span>
            </label>

            <input
              v-model="nuevoRegistro.observaciones"
              placeholder="Observaciones"
              class="border rounded-lg px-3 py-2"
            />

            <button
              @click="registrarAsistencia"
              :disabled="registrando"
              class="bg-[#009d71] text-white rounded-lg px-4 py-2"
            >
              Registrar
            </button>
          </div>
        </div>

        <!-- Lista de asistentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">Lista de asistentes</h2>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">
                  {{ asistentesPresentes }} presentes / {{ totalAsistentes }} total
                </span>
              </div>
            </div>
          </div>

          <!-- Tabla de asistentes -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participante
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupo
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago cuota
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha asistencia
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="asistente in asistencias" :key="asistente.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ asistente.nombre_participante }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ asistente.grupo }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      :class="asistente.presente
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'"
                    >
                      {{ asistente.presente ? 'Presente' : 'Ausente' }}
                    </span>
                  </td>

                  <td class="px-6 py-4 text-sm">
                    <span
                      :class="asistente.pago_cuota ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ asistente.pago_cuota ? 'Sí' : 'No' }}
                    </span>
                  </td>

                  <td class="px-6 py-4 text-sm text-gray-700">
                    {{ formatearFecha(asistente.fecha_asistencia)}}
                  </td>

                  <td class="px-6 py-4 text-sm text-gray-700">
                    {{ asistente.observaciones || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="mt-8 flex justify-between">
          <button 
            @click="generarReporte"
            class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium flex items-center space-x-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Generar Reporte</span>
          </button>
        </div>

        <!-- Footer -->
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

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('registro-asistencias')

const moduloId = computed(() => route.params.moduloId || route.params.id)

const asistencias = ref([])      
const modulo = ref({ id: null, nombre: '', cursoNombre: '' }) 
const cargando = ref(false)
const error = ref('')
const guardando = ref(false)
const registrando = ref(false)

const nuevoRegistro = ref({
  nombre_participante: '',
  grupo: '',
  presente: true,
  pago_cuota: false,
  observaciones: '',
})

const totalAsistentes = computed(() => asistencias.value?.length || 0)
const asistentesPresentes = computed(() => asistencias.value.filter(a => a.presente).length)

const cargarAsistencias = async () => {
  cargando.value = true
  error.value = ''
  try {
    const res = await formacionService.getAsistencias(moduloId.value)
    asistencias.value = Array.isArray(res.data) ? res.data.map(a => ({
      ...a,
      presente: typeof a.presente === 'boolean' ? a.presente : (a.presente === 1 || a.presente === '1' ? true : false),
      observaciones: a.observaciones ?? ''
    })) : []

    modulo.value = {
      id: moduloId.value,
      nombre: res.data[0]?.modulo_nombre || '',
      cursoNombre: res.data[0]?.curso_nombre || ''
    }

  } catch (err) {
    console.error('Error cargando asistencias:', err)
    error.value = err.response?.data?.error || 'No se pudo cargar la lista de asistencias.'
    asistencias.value = []
  } finally {
    cargando.value = false
  }
}

const fechaAsistencia = ref(
  new Date().toISOString().substring(0, 10)
)

const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-BO')
}


onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  cargarAsistencias()
})

const registrarAsistencia = async () => {
  if (!nuevoRegistro.value.nombre_participante) {
    alert('Debe indicar el nombre del participante.')
    return
  }

  registrando.value = true
  try {
    const payload = {
      modulos_curso_id: Number(moduloId.value),
      nombre_participante: nuevoRegistro.value.nombre_participante,
      grupo: nuevoRegistro.value.grupo || null,
      presente: !!nuevoRegistro.value.presente,
      pago_cuota: !!nuevoRegistro.value.pago_cuota,
      observaciones: nuevoRegistro.value.observaciones || null,
    }

    const res = await formacionService.registrarAsistencia(payload)
    asistencias.value.push(res.data)
    nuevoRegistro.value = {
      nombre_participante: '',
      grupo: '',
      presente: true,
      pago_cuota: false,
      observaciones: '',
    }
  } catch (err) {
    console.error('Error registrando asistencia:', err)
    alert(err.response?.data?.error || 'Error al registrar asistencia.')
  } finally {
    registrando.value = false
  }
}

const volverAModulos = () => {
  router.back()
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  switch (destino) {
    case 'inicio-formacion':
      router.push('/formacion')
      break
    case 'lista-cursos':
      router.push('/formacion/lista-cursos')
      break
    case 'gestion-modulos':
      const cid = route.query.cursoId || route.query.cursoId || null
      if (cid) {
        router.push(`/formacion/curso/${cid}/modulos`)
      } else {
        router.back()
      }
      break
    default:
      router.back()
  }
}


</script>


