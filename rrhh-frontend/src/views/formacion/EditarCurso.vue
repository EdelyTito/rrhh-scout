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
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título y navegación -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Editar Curso</h1>
            <button 
              @click="volverAlDetalle"
              class="text-[#009d71] hover:text-[#007a5c] font-medium flex items-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver al curso</span>
            </button>
          </div>
        </div>

        <!-- Formulario de edición -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form @submit.prevent="guardarCambios" class="space-y-6">
            <!-- Nombre del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del curso *
              </label>
              <input 
                v-model="formulario.nombre"
                type="text" 
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                placeholder="Ingrese el nombre del curso"
              >
            </div>

            <!-- Tipo de curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de curso *
              </label>
              <select 
                v-model="formulario.tipo"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
                <option value="">Seleccione el tipo de curso</option>
                <option value="Batería de módulos">Batería de módulos</option>
                <option value="Curso Introductorio">Curso Introductorio</option>
                <option value="IMs Nivel II">IMs Nivel II</option>
                <option value="IMs Nivel III">IMs Nivel III</option>
                <option value="Paxtu Nivel Grupo">Paxtu Nivel Grupo</option>
                <option value="Paxtu Nivel Distrito">Paxtu Nivel Distrito</option>
                <option value="Koodoo Adjunto">Koodoo Adjunto</option>
                <option value="Koodoo Director">Koodoo Director</option>
                <option value="Asesores personales">Asesores personales</option>
              </select>
            </div>

            <!-- Estado del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Estado del curso *
              </label>
              <select 
                v-model="formulario.estado"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
                <option value="">Seleccione el estado</option>
                <option value="planificado">Planificado</option>
                <option value="activo">Activo</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <!-- Fecha del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fecha del curso
              </label>
              <input 
                v-model="formulario.fecha"
                type="text" 
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                placeholder="Ej: 20 y 21 de febrero"
              >
              <p class="text-xs text-gray-500 mt-1">Formato libre: "20 y 21 de febrero" o "por definir"</p>
            </div>

            <!-- Descripción del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción del curso *
              </label>
              <textarea 
                v-model="formulario.descripcion"
                rows="4"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                placeholder="Describa el contenido y objetivos del curso..."
              ></textarea>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-between pt-6 border-t border-gray-200">
              <button 
                type="button"
                @click="cancelar"
                class="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200 font-medium"
              >
                Cancelar
              </button>
              
              <div class="flex space-x-4">
                <button 
                  type="button"
                  @click="eliminarCurso"
                  class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                >
                  Eliminar
                </button>
                
                <button 
                  type="submit"
                  :disabled="guardando"
                  class="bg-[#009d71] text-white px-8 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="guardando">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                  <span v-else>
                    Guardar Cambios
                  </span>
                </button>
              </div>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formacionService } from '../../services/api'

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('editar-curso')
const cargando = ref(false)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')

const cursoId = computed(() => route.params.id)

const formulario = ref({
  nombre: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  modalidad: '',
  lugar: '',
  cupo: '',
})

const cargarCurso = async () => {
  cargando.value = true
  error.value = ''
  try {
    const res = await formacionService.getCurso(cursoId.value)
    const c = res.data
    formulario.value = {
      nombre: c.nombre || '',
      descripcion: c.descripcion || '',
      fecha_inicio: c.fecha_inicio ? c.fecha_inicio.substring(0, 10) : '',
      fecha_fin: c.fecha_fin ? c.fecha_fin.substring(0, 10) : '',
      modalidad: c.modalidad || '',
      lugar: c.lugar || '',
      cupo: c.cupo || '',
    }
  } catch (err) {
    console.error('Error cargando curso para edición:', err)
    error.value = 'No se pudo cargar el curso.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  cargarCurso()
})

const guardarCambios = async () => {
  if (!formulario.value.nombre || !formulario.value.descripcion) {
    error.value = 'Nombre y descripción son obligatorios.'
    return
  }

  guardando.value = true
  error.value = ''
  mensaje.value = ''

  try {
    const payload = {
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      fecha_inicio: formulario.value.fecha_inicio || null,
      fecha_fin: formulario.value.fecha_fin || null,
      modalidad: formulario.value.modalidad || null,
      lugar: formulario.value.lugar || null,
      cupo: formulario.value.cupo ? Number(formulario.value.cupo) : null,
    }

    const res = await formacionService.updateCurso(cursoId.value, payload)
    console.log('Curso actualizado:', res.data)
    mensaje.value = 'Curso actualizado correctamente.'
    setTimeout(() => {
      router.push(`/formacion/detalle-curso/${cursoId.value}`)
    }, 800)
  } catch (err) {
    console.error('Error al actualizar curso:', err)
    error.value = err.response?.data?.error || 'Error al actualizar el curso.'
  } finally {
    guardando.value = false
  }
}

const cancelar = () => {
  if (confirm('¿Cancelar los cambios? Se perderán las modificaciones no guardadas.')) {
    router.push(`/formacion/detalle-curso/${cursoId.value}`)
  }
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  if (destino === 'lista-cursos') router.push('/formacion/lista-cursos')
  if (destino === 'inicio-formacion') router.push('/formacion')
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>

