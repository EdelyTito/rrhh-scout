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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('editar-curso')
const guardando = ref(false)

// Datos del formulario
const formulario = ref({
  nombre: '',
  tipo: '',
  estado: '',
  fecha: '',
  descripcion: ''
})

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  
  // Cargar datos del curso según ID
  const cursoId = route.params.id
  cargarCurso(cursoId)
})

const cargarCurso = (id) => {
  // Simular carga de datos (en producción sería una API)
  const cursosEjemplo = [
    {
      id: 1,
      nombre: 'Introductorio 2025',
      tipo: 'Curso Introductorio',
      estado: 'finalizado',
      fecha: '20 y 21 de febrero',
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
    }
  ]
  
  const curso = cursosEjemplo.find(c => c.id == id)
  if (curso) {
    formulario.value = { ...curso }
  }
}

const navegarA = (destino) => {
  switch(destino) {
    case 'inicio-formacion':
      router.push('/formacion')
      break
    case 'lista-cursos':
      router.push('/formacion/lista-cursos')
      break
  }
}

const volverAlDetalle = () => {
  router.push(`/formacion/detalle-curso/${route.params.id}`)
}

const guardarCambios = async () => {
  // Validación básica
  if (!formulario.value.nombre || !formulario.value.tipo || 
      !formulario.value.estado || !formulario.value.descripcion) {
    alert('Por favor complete todos los campos obligatorios')
    return
  }

  guardando.value = true

  try {
    // Simular guardado en API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Curso actualizado:', formulario.value)
    alert('¡Curso actualizado exitosamente!')
    
    // Redirigir al detalle
    router.push(`/formacion/detalle-curso/${route.params.id}`)
    
  } catch (error) {
    console.error('Error:', error)
    alert('Error al actualizar el curso')
  } finally {
    guardando.value = false
  }
}

const eliminarCurso = () => {
  if (confirm('¿Está seguro de eliminar este curso? Esta acción no se puede deshacer.')) {
    console.log(`Curso ${route.params.id} eliminado`)
    router.push('/formacion/lista-cursos')
  }
}

const cancelar = () => {
  if (confirm('¿Cancelar cambios? Los cambios no guardados se perderán.')) {
    router.push(`/formacion/detalle-curso/${route.params.id}`)
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>