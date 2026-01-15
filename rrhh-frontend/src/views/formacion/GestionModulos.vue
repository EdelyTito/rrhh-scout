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
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título y navegación -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Gestión de Módulos</h1>
              <p class="text-gray-600 mt-1">Curso: {{ curso.nombre }}</p>
            </div>
            <button 
              @click="volverAlCurso"
              class="text-[#009d71] hover:text-[#007a5c] font-medium flex items-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver al curso</span>
            </button>
          </div>
        </div>

        <!-- Lista de módulos existentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-gray-800">Módulos del curso</h2>
            <span class="text-sm text-gray-500">{{ modulos.length }} módulos</span>
          </div>

          <!-- Tabla de módulos -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del módulo
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formador responsable
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(modulo, index) in modulos" :key="modulo.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ index + 1 }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ modulo.nombre }}</div>
                    <div class="text-xs text-gray-500">{{ modulo.descripcion }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ modulo.formador }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ modulo.duracion }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="editarModulo(modulo.id)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button 
                      @click="registrarAsistencias(modulo.id)"
                      class="text-[#009d71] hover:text-[#007a5c] mr-3"
                    >
                      Asistencias
                    </button>
                    <button 
                      @click="eliminarModulo(modulo.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje si no hay módulos -->
          <div v-if="modulos.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="mt-2 text-gray-500">No hay módulos registrados para este curso.</p>
          </div>
        </div>

        <!-- Formulario para agregar módulo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">
            Agregar nuevo módulo
          </h2>
          
          <form @submit.prevent="guardarModulo" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del módulo *
                </label>
                <input 
                  v-model="formularioNuevo.nombre"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  placeholder="Ej: Liderazgo Scout"
                >
              </div>

              <!-- Tipo de módulo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de módulo *
                </label>
                <select
                  v-model="formularioNuevo.tipo_modulo_id"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                >
                  <option value="">Seleccione tipo de módulo</option>
                  <option v-for="t in tiposModulo" :key="t.id" :value="t.id">
                    {{ t.nombre }}
                  </option>
                </select>
              </div>

            </div>
            
            <!-- Formador -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Formador responsable *
              </label>

              <select
                v-model="formularioNuevo.formador_id"
                required
                :disabled="!formularioNuevo.tipo_modulo_id || cargandoFormadores"
                class="w-full border border-gray-300 rounded-lg px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#009d71]
                      disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {{ !formularioNuevo.tipo_modulo_id
                    ? 'Seleccione primero el tipo de módulo'
                    : cargandoFormadores
                      ? 'Cargando formadores...'
                      : 'Seleccione formador'
                  }}
                </option>

                <option
                  v-for="f in formadoresFiltrados"
                  :key="f.id"
                  :value="f.id"
                >
                  {{ f.nombre }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea 
                v-model="formularioNuevo.descripcion"
                rows="2"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                placeholder="Describa el contenido del módulo..."
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Duración (horas) *
                </label>
                <input 
                  v-model="formularioNuevo.duracion"
                  type="number" 
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  placeholder="Ej: 2"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-4 pt-4">

              
              <button 
                type="submit"
                :disabled="guardando"
                class="bg-[#009d71] text-white px-6 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="guardando">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
                <span>
                  Agregar módulo
                </span>
              </button>
            </div>
          </form>
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

  <!-- Modal Editar Módulo -->
  <div
    v-if="mostrarModalEdicion"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-2xl p-6">

      <h3 class="text-lg font-semibold mb-6">
        Editar Módulo
      </h3>

      <form @submit.prevent="guardarModulo" class="space-y-4">

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre del módulo *
          </label>
          <input
            v-model="formularioEdicion.nombre"
            required
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Tipo de módulo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tipo de módulo *
          </label>
          <select
            v-model="formularioEdicion.tipo_modulo_id"
            required
            class="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Seleccione tipo</option>
            <option v-for="t in tiposModulo" :key="t.id" :value="t.id">
              {{ t.nombre }}
            </option>
          </select>
        </div>

        <!-- Formador -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Formador responsable *
          </label>
          <select
            v-model="formularioEdicion.formador_id"
            required
            :disabled="!formularioEdicion.tipo_modulo_id || cargandoFormadores"
            class="w-full border rounded-lg px-3 py-2 disabled:bg-gray-100"
          >
            <option value="">
              {{ cargandoFormadores ? 'Cargando...' : 'Seleccione formador' }}
            </option>
            <option v-for="f in formadoresFiltrados" :key="f.id" :value="f.id">
              {{ f.nombre }}
            </option>
          </select>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            v-model="formularioEdicion.descripcion"
            rows="3"
            required
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Duración -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Duración (horas) *
          </label>
          <input
            v-model="formularioEdicion.duracion"
            type="number"
            min="1"
            required
            class="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Acciones -->
        <div class="flex justify-end gap-3 pt-6">
          <button
            type="button"
            @click="cancelarEdicion"
            class="px-4 py-2 text-gray-700"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="bg-[#009d71] text-white px-5 py-2 rounded-lg"
          >
            Guardar cambios
          </button>
        </div>

      </form>
    </div>
  </div>

</template>

<script setup>
import FormacionHeader from '../../components/formacion/FormacionHeader.vue'
import FormacionNav from '../../components/formacion/FormacionNav.vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formacionService } from '../../services/api'
import { watch } from 'vue'

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

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('gestion-modulos')

const curso = ref({ id: null, nombre: '', modulos: [] })
const modulos = ref([])
const cargando = ref(false)
const error = ref('')
const guardando = ref(false)
const mostrarModalEdicion = ref(false)

const moduloEditandoId = ref(null)

const formadores = ref([])
const tiposModulo = ref([])

const formadoresFiltrados = ref([])
const cargandoFormadores = ref(false)

const cargarCatalogos = async () => {
  const [fRes, tRes] = await Promise.all([
    formacionService.getFormadores(),
    formacionService.getTiposModulo()
  ])
  formadores.value = fRes.data
  tiposModulo.value = tRes.data
}

const formularioNuevo = ref({
  nombre: '',
  descripcion: '',
  duracion: '',
  tipo_modulo_id: '',
  formador_id: ''
})

const formularioEdicion = ref({
  nombre: '',
  descripcion: '',
  duracion: '',
  tipo_modulo_id: '',
  formador_id: ''
})

const cursoId = computed(() => route.params.cursoId || route.params.id) 

function mapModuloBackendToUI(m) {
  return {
    id: m.id,
    nombre: m.titulo,
    descripcion: m.descripcion,
    duracion: `${m.duracion_horas} h`,
    tipo: m.tipo_modulo,
    formador: m.formador
  }
}

const cargarDatos = async () => {
  cargando.value = true
  error.value = ''
  try {
    const [cursoRes, modRes] = await Promise.all([
      formacionService.getCurso(cursoId.value),
      formacionService.getModulos(cursoId.value)
    ])

    curso.value = cursoRes?.data ? { ...cursoRes.data, modulos: [] } : { id: cursoId.value, nombre: '', modulos: [] }

    const rawMods = Array.isArray(modRes?.data) ? modRes.data : []
    modulos.value = rawMods.map(mapModuloBackendToUI)

    curso.value.modulos = modulos.value
  } catch (err) {
    console.error('Error cargando módulos:', err)
    error.value = 'No se pudo cargar la información del curso.'
    curso.value = { id: cursoId.value, nombre: '', modulos: [] }
    modulos.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  cargarDatos()
  cargarCatalogos()
})

const guardarModulo = async () => {
  const form = moduloEditandoId.value
    ? formularioEdicion.value
    : formularioNuevo.value

  if (
    !form.nombre ||
    !form.duracion ||
    !form.tipo_modulo_id ||
    !form.formador_id
  ) {
    alert('Complete todos los campos obligatorios')
    return
  }

  guardando.value = true

  const payload = {
    titulo: form.nombre,
    descripcion: form.descripcion || '',
    duracion_horas: Number(form.duracion),
    tipo_modulo_id: Number(form.tipo_modulo_id),
    formador_id: Number(form.formador_id)
  }

  try {
    let res

    if (moduloEditandoId.value) {
      res = await formacionService.updateModulo(
        moduloEditandoId.value,
        payload
      )

      const idx = modulos.value.findIndex(
        m => m.id === moduloEditandoId.value
      )
      if (idx !== -1) {
        modulos.value[idx] = mapModuloBackendToUI(res.data.modulo)
      }

    } else {
      res = await formacionService.createModulo(cursoId.value, payload)
      modulos.value.push(mapModuloBackendToUI(res.data))
    }

    cancelarEdicion()

  } catch (err) {
    console.error(err)
    alert(err.response?.data?.error || 'Error guardando módulo')
  } finally {
    guardando.value = false
  }
}

const cargarFormadoresPorTipo = async (tipoModuloId) => {
  if (!tipoModuloId) {
    formadoresFiltrados.value = []

    if (moduloEditandoId.value) {
      formularioEdicion.value.formador_id = ''
    } else {
      formularioNuevo.value.formador_id = ''
    }
    return
  }

  cargandoFormadores.value = true

  if (moduloEditandoId.value) {
    formularioEdicion.value.formador_id = ''
  } else {
    formularioNuevo.value.formador_id = ''
  }

  try {
    const res = await formacionService.getFormadoresPorTipoModulo(tipoModuloId)
    formadoresFiltrados.value = res.data
  } catch (err) {
    console.error('Error cargando formadores por tipo:', err)
    formadoresFiltrados.value = []
  } finally {
    cargandoFormadores.value = false
  }
}

const editarModulo = async (moduloId) => {
  const m = modulos.value.find(x => x.id === moduloId)
  if (!m) return

  formularioEdicion.value = {
    nombre: m.nombre,
    descripcion: m.descripcion,
    duracion: parseInt(m.duracion),
    tipo_modulo_id: tiposModulo.value.find(t => t.nombre === m.tipo)?.id || '',
    formador_id: ''
  }

  await cargarFormadoresPorTipo(formularioEdicion.value.tipo_modulo_id)

  formularioEdicion.value.formador_id =
    formadoresFiltrados.value.find(f => f.nombre === m.formador)?.id || ''

  moduloEditandoId.value = moduloId
  mostrarModalEdicion.value = true
}

const cancelarEdicion = () => {
  moduloEditandoId.value = null
  mostrarModalEdicion.value = false
  formularioEdicion.value = {
    nombre: '',
    descripcion: '',
    duracion: '',
    tipo_modulo_id: '',
    formador_id: ''
  }
}

const eliminarModulo = async (moduloId) => {
  if (!confirm('¿Seguro que desea eliminar este módulo?')) return

  try {
    await formacionService.deleteModulo(moduloId)
    modulos.value = modulos.value.filter(m => m.id !== moduloId)
  } catch (err) {
    console.error(err)
    alert(err.response?.data?.error || 'Error eliminando módulo')
  }
}

const registrarAsistencias = (moduloId) => {
  router.push(`${baseRuta.value}/modulo/${moduloId}/asistencias`)
}

const volverAlCurso = () => {
  router.push(`${baseRuta.value}/detalle-curso/${cursoId.value}`)
}

const navegarA = (destino) => {
  rutaActiva.value = destino

  if (destino === 'detalle-curso') {
    router.push(`${baseRuta.value}/detalle-curso/${cursoId.value}`)
  }

  if (destino === 'lista-cursos') {
    router.push(`${baseRuta.value}/lista-cursos`)
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}

watch(
  () => formularioNuevo.value.tipo_modulo_id,
  (nuevoTipo) => {
    cargarFormadoresPorTipo(nuevoTipo)
    formularioNuevo.value.formador_id = ''
  }
)

watch(
  () => formularioEdicion.value.tipo_modulo_id,
  (nuevoTipo) => {
    if (moduloEditandoId.value) {
      cargarFormadoresPorTipo(nuevoTipo)
      formularioEdicion.value.formador_id = ''
    }
  }
)


</script>
