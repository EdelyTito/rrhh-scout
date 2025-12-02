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
                    Dirigente responsable
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
                    {{ modulo.dirigente }}
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

        <!-- Formulario para agregar/editar módulo -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">
            {{ modoEdicion ? 'Editar Módulo' : 'Agregar Nuevo Módulo' }}
          </h2>
          
          <form @submit.prevent="guardarModulo" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del módulo *
                </label>
                <input 
                  v-model="formulario.nombre"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  placeholder="Ej: Liderazgo Scout"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Dirigente responsable *
                </label>
                <input 
                  v-model="formulario.dirigente"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  placeholder="Ej: Juan Pérez"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea 
                v-model="formulario.descripcion"
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
                  v-model="formulario.duracion"
                  type="number" 
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  placeholder="Ej: 2"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Orden en el curso *
                </label>
                <input 
                  v-model="formulario.orden"
                  type="number" 
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  placeholder="Ej: 1"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-4 pt-4">
              <button 
                type="button"
                @click="cancelarEdicion"
                class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                v-if="modoEdicion"
              >
                Cancelar
              </button>
              
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
                <span v-else>
                  {{ modoEdicion ? 'Actualizar' : 'Agregar' }} Módulo
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('gestion-modulos')
const guardando = ref(false)
const modoEdicion = ref(false)
const moduloEditando = ref(null)

// Datos del curso (simulados)
const curso = ref({
  id: 1,
  nombre: 'Introductorio 2025'
})

// Lista de módulos
const modulos = ref([
  {
    id: 1,
    nombre: 'Liderazgo Scout',
    descripcion: 'Fundamentos del liderazgo en el escultismo',
    dirigente: 'Juan Pérez',
    duracion: '2 horas',
    orden: 1
  },
  {
    id: 2,
    nombre: 'Metodología Scout',
    descripcion: 'Sistema de patrullas y progresión personal',
    dirigente: 'María Gómez',
    duracion: '3 horas',
    orden: 2
  }
])

// Formulario
const formulario = ref({
  nombre: '',
  descripcion: '',
  dirigente: '',
  duracion: '',
  orden: ''
})

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  
  // Ordenar módulos por orden
  modulos.value.sort((a, b) => a.orden - b.orden)
})

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

const volverAlCurso = () => {
  router.push(`/formacion/detalle-curso/${curso.value.id}`)
}

const editarModulo = (id) => {
  const modulo = modulos.value.find(m => m.id === id)
  if (modulo) {
    formulario.value = { ...modulo }
    modoEdicion.value = true
    moduloEditando.value = id
  }
}

const registrarAsistencias = (moduloId) => {
  router.push(`/formacion/modulo/${moduloId}/asistencias`)
}

const eliminarModulo = (id) => {
  if (confirm('¿Está seguro de eliminar este módulo?')) {
    modulos.value = modulos.value.filter(m => m.id !== id)
  }
}

const guardarModulo = async () => {
  if (!formulario.value.nombre || !formulario.value.descripcion || 
      !formulario.value.dirigente || !formulario.value.duracion || 
      !formulario.value.orden) {
    alert('Por favor complete todos los campos obligatorios')
    return
  }

  guardando.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (modoEdicion.value && moduloEditando.value) {
      // Actualizar módulo existente
      const index = modulos.value.findIndex(m => m.id === moduloEditando.value)
      if (index !== -1) {
        modulos.value[index] = { ...formulario.value, id: moduloEditando.value }
      }
    } else {
      // Agregar nuevo módulo
      const nuevoModulo = {
        ...formulario.value,
        id: Date.now()
      }
      modulos.value.push(nuevoModulo)
    }
    
    // Ordenar por orden
    modulos.value.sort((a, b) => a.orden - b.orden)
    
    // Limpiar formulario
    resetFormulario()
    
  } catch (error) {
    console.error('Error:', error)
    alert('Error al guardar el módulo')
  } finally {
    guardando.value = false
  }
}

const cancelarEdicion = () => {
  resetFormulario()
}

const resetFormulario = () => {
  formulario.value = {
    nombre: '',
    descripcion: '',
    dirigente: '',
    duracion: '',
    orden: ''
  }
  modoEdicion.value = false
  moduloEditando.value = null
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>