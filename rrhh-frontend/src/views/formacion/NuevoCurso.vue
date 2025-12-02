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
        <!-- Título con saludo -->
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

            <!-- Tipo de curso -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de curso
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

            <!-- Cantidad de módulos y paralelos -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de módulos y paralelos
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input 
                    v-model="formulario.cantidadModulos"
                    type="number" 
                    min="1"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ej: 10"
                  >
                  <p class="text-xs text-gray-500 mt-1">Cantidad de módulos</p>
                </div>
                <div>
                  <input 
                    v-model="formulario.cantidadParalelos"
                    type="number" 
                    min="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ej: 2"
                  >
                  <p class="text-xs text-gray-500 mt-1">Cantidad de paralelos (opcional)</p>
                </div>
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

            <!-- Lista de módulos y dirigentes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lista de módulos y de dirigentes que los darán
              </label>
              <div class="space-y-4">
                <!-- Módulo 1 -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-medium text-gray-800">Módulo 1</h3>
                    <button 
                      type="button"
                      @click="eliminarModulo(0)"
                      class="text-red-600 hover:text-red-800 text-sm"
                      v-if="formulario.modulos.length > 1"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        v-model="formulario.modulos[0].nombre"
                        type="text" 
                        required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                        placeholder="Nombre del módulo"
                      >
                    </div>
                    <div>
                      <input 
                        v-model="formulario.modulos[0].dirigente"
                        type="text" 
                        required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                        placeholder="Dirigente responsable"
                      >
                    </div>
                  </div>
                </div>

                <!-- Módulos adicionales -->
                <div v-for="(modulo, index) in formulario.modulos.slice(1)" :key="index" 
                     class="border border-gray-200 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-medium text-gray-800">Módulo {{ index + 2 }}</h3>
                    <button 
                      type="button"
                      @click="eliminarModulo(index + 1)"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        v-model="formulario.modulos[index + 1].nombre"
                        type="text" 
                        required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                        placeholder="Nombre del módulo"
                      >
                    </div>
                    <div>
                      <input 
                        v-model="formulario.modulos[index + 1].dirigente"
                        type="text" 
                        required
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                        placeholder="Dirigente responsable"
                      >
                    </div>
                  </div>
                </div>

                <!-- Botón para agregar más módulos -->
                <button 
                  type="button"
                  @click="agregarModulo"
                  class="flex items-center space-x-2 text-[#009d71] hover:text-[#007a5c] font-medium"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>Agregar módulo</span>
                </button>
              </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('nuevo-curso')
const guardando = ref(false)

// Datos del formulario
const formulario = ref({
  nombre: '',
  tipo: '',
  cantidadModulos: '',
  cantidadParalelos: '',
  descripcion: '',
  modulos: [
    { nombre: '', dirigente: '' }
  ]
})

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  
  switch(destino) {
    case 'inicio-formacion':
      router.push('/formacion')
      break
    case 'lista-cursos':
      router.push('/formacion/lista-cursos')
      break
  }
}

const agregarModulo = () => {
  formulario.value.modulos.push({ nombre: '', dirigente: '' })
}

const eliminarModulo = (index) => {
  if (formulario.value.modulos.length > 1) {
    formulario.value.modulos.splice(index, 1)
  }
}

const validarFormulario = () => {
  if (!formulario.value.nombre.trim()) {
    alert('Por favor ingrese el nombre del curso')
    return false
  }
  
  if (!formulario.value.tipo) {
    alert('Por favor seleccione el tipo de curso')
    return false
  }
  
  if (!formulario.value.cantidadModulos || parseInt(formulario.value.cantidadModulos) < 1) {
    alert('Por favor ingrese una cantidad válida de módulos')
    return false
  }
  
  if (!formulario.value.descripcion.trim()) {
    alert('Por favor ingrese la descripción del curso')
    return false
  }
  
  // Validar que todos los módulos tengan nombre y dirigente
  for (let i = 0; i < formulario.value.modulos.length; i++) {
    const modulo = formulario.value.modulos[i]
    if (!modulo.nombre.trim() || !modulo.dirigente.trim()) {
      alert(`Por favor complete todos los campos del Módulo ${i + 1}`)
      return false
    }
  }
  
  return true
}

const guardarCurso = async () => {
  if (!validarFormulario()) return
  
  guardando.value = true

  try {
    // Simular guardado en la API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Preparar datos para enviar
    const cursoData = {
      ...formulario.value,
      id: Date.now(), // ID temporal
      fechaCreacion: new Date().toISOString(),
      estado: 'planificado'
    }
    
    console.log('Curso guardado:', cursoData)
    
    // Mostrar confirmación
    alert('¡Curso creado exitosamente!')
    
    // Redirigir a la lista de cursos
    router.push('/formacion/lista-cursos')
    
  } catch (error) {
    console.error('Error al guardar el curso:', error)
    alert('Error al guardar el curso. Por favor intente nuevamente.')
  } finally {
    guardando.value = false
  }
}

const cancelar = () => {
  if (confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.')) {
    router.push('/formacion/lista-cursos')
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>