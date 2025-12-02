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
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del curso
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de curso
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad de módulos
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha del curso
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="curso in cursos" :key="curso.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ curso.nombre }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ curso.tipo }}</div>
                    <div class="text-xs text-gray-500">{{ curso.subtipo }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ curso.modulos }}</div>
                    <div v-if="curso.paralelos" class="text-xs text-gray-500">{{ curso.paralelos }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ curso.fecha }}</div>
                    <div class="text-xs text-gray-500">{{ curso.estadoFecha }}</div>
                  </td>
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

const router = useRouter()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('lista-cursos')

// Lista de cursos (según página 17 del Figma)
const cursos = ref([
  {
    id: 1,
    nombre: 'Batería 1-2025',
    tipo: 'Batería de módulos',
    subtipo: '',
    modulos: '10 módulos',
    paralelos: 'y 2 paralelos',
    fecha: '13 de abril al 16 de abril',
    estadoFecha: 'Programado'
  },
  {
    id: 2,
    nombre: 'Introductorio 2025',
    tipo: 'Curso Introductorio',
    subtipo: '',
    modulos: '8 módulos',
    paralelos: '',
    fecha: '20 y 21 de febrero',
    estadoFecha: 'Finalizado'
  },
  {
    id: 3,
    nombre: 'IMs Nivel II Lobatos',
    tipo: 'IMs Nivel II',
    subtipo: '',
    modulos: '12 módulos',
    paralelos: 'y 2 paralelos',
    fecha: 'por definir',
    estadoFecha: 'Por programar'
  },
  {
    id: 4,
    nombre: 'IMs Nivel III Exploradores',
    tipo: 'IMs Nivel III',
    subtipo: '',
    modulos: '15 módulos',
    paralelos: 'y 3 paralelos',
    fecha: '15 de junio al 20 de junio',
    estadoFecha: 'Programado'
  },
  {
    id: 5,
    nombre: 'Paxtu Nivel Grupo',
    tipo: 'Paxtu Nivel Grupo',
    subtipo: 'Gestión Institucional',
    modulos: '10 módulos',
    paralelos: '',
    fecha: '5 de mayo al 10 de mayo',
    estadoFecha: 'Programado'
  },
  {
    id: 6,
    nombre: 'Koodoo Adjunto',
    tipo: 'Koodoo Adjunto',
    subtipo: 'Formación de Formadores',
    modulos: '14 módulos',
    paralelos: '',
    fecha: 'por definir',
    estadoFecha: 'Por programar'
  }
])

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
      // Ya estamos aquí
      break
  }
}

const verCurso = (id) => {
  // Navegar a vista detalle del curso
  router.push(`/formacion/detalle-curso/${id}`)
}

const editarCurso = (id) => {
  router.push(`/formacion/editar-curso/${id}`)
}

const eliminarCurso = (id) => {
  if (confirm('¿Está seguro de eliminar este curso? Esta acción no se puede deshacer.')) {
    // Lógica para eliminar curso
    cursos.value = cursos.value.filter(curso => curso.id !== id)
    console.log(`Curso ${id} eliminado`)
  }
}

const crearNuevoCurso = () => {
  // Navegar a la vista de creación de cursos (página 18)
  router.push('/formacion/nuevo-curso')
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>