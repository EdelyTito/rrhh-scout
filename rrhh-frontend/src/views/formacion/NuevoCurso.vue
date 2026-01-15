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
          <button 
            @click="volverALista"
            class="px-6 py-3 rounded-lg transition duration-200 font-medium flex items-center space-x-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Volver a lista</span>
          </button>
        <!-- Título -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Formulario para la creación de cursos</h1>
        </div>

        <!-- Formulario de creación de cursos -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          
          <form @submit.prevent="guardarCurso" class="space-y-6">
            <!-- Nombre del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre del curso
              </label>
              <input 
                v-model="formulario.nombre"
                type="text" 
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                placeholder="Ingrese el nombre del curso"
              >
            </div>

            <!-- Modalidad -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Modalidad *
              </label>
              <select
                v-model="formulario.modalidad"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#009d71]"
              >
                <option value="">Seleccione modalidad</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Mixto">Mixto</option>
              </select>
            </div>

            <!-- Lugar -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lugar
              </label>
              <input
                v-model="formulario.lugar"
                type="text"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#009d71]"
                placeholder="Ej: Casa Scout, Zoom, Por definir"
              />
            </div>

            <!-- Fechas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha inicio
                </label>
                <input
                  v-model="formulario.fecha_inicio"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  v-model="formulario.fecha_fin"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <!-- Descripción del curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción del curso
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
                  Guardar curso
                </span>
              </button>
            </div>
          </form>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formacionService } from '../../services/api'

const router = useRouter()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('nuevo-curso')
const guardando = ref(false)

const volverALista = () => {
  router.push('/formacion/lista-cursos')
}

const formulario = ref({
  nombre: '',
  descripcion: '',
  modalidad: '',
  lugar: '',
  fecha_inicio: '',
  fecha_fin: ''
})

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  switch (destino) {
    case 'inicio-formacion':
      router.push('/formacion')
      break
    case 'lista-cursos':
      router.push('/formacion/lista-cursos')
      break
  }
}

const guardarCurso = async () => {
  if (
    !formulario.value.nombre ||
    !formulario.value.descripcion ||
    !formulario.value.modalidad
  ) {
    alert('Nombre, descripción y modalidad son obligatorios.')
    return
  }

  guardando.value = true

  try {
    const payload = {
      nombre: formulario.value.nombre,
      descripcion: formulario.value.descripcion,
      modalidad: formulario.value.modalidad,
      lugar: formulario.value.lugar || null,
      fecha_inicio: formulario.value.fecha_inicio || null,
      fecha_fin: formulario.value.fecha_fin || null
    }

    const res = await formacionService.createCurso(payload)

    const cursoId = res.data.curso.id

    alert('Curso creado correctamente')

    router.push(`/formacion/lista-modulos/${cursoId}`)

  } catch (err) {
    console.error(err)
    alert(err.response?.data?.error || 'Error creando curso')
  } finally {
    guardando.value = false
  }
}

const cancelar = () => {
  if (confirm('¿Cancelar creación? Los datos no guardados se perderán.')) {
    router.push('/formacion/lista-cursos')
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

