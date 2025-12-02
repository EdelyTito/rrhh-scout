<!-- DetalleCurso.vue - Versión corregida -->
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
        <!-- Título y botones de acción -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Curso - {{ curso.nombre }}</h1>
            <p class="text-gray-600 mt-1">{{ curso.tipo }}</p>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="editarCurso"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Editar Curso</span>
            </button>
            
            <button 
              @click="gestionarModulos"
              class="bg-[#009d71] text-white px-4 py-2 rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium flex items-center space-x-2"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Gestionar Módulos</span>
            </button>
          </div>
        </div>

        <!-- Información del curso -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <!-- Estadísticas rápidas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Total de módulos</p>
              <p class="text-2xl font-bold text-gray-900">{{ curso.modulos.length }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Estado</p>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                curso.estado === 'activo' ? 'bg-green-100 text-green-800' :
                curso.estado === 'finalizado' ? 'bg-gray-100 text-gray-800' :
                'bg-blue-100 text-blue-800'
              ]">
                {{ curso.estado === 'activo' ? 'Activo' : curso.estado === 'finalizado' ? 'Finalizado' : 'Planificado' }}
              </span>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700 mb-1">Fecha</p>
              <p class="text-sm text-gray-900">{{ curso.fecha || 'Por definir' }}</p>
            </div>
          </div>

          <!-- Descripción del curso -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Descripción del curso</h2>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p class="text-gray-700">{{ curso.descripcion }}</p>
            </div>
          </div>

          <!-- Separador -->
          <div class="my-6 border-t border-gray-300"></div>

          <!-- Lista de módulos y dirigentes -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">Lista de módulos y dirigentes</h2>
              <span class="text-sm text-gray-500">{{ curso.modulos.length }} módulos</span>
            </div>
            
            <div class="space-y-4">
              <div v-for="(modulo, index) in curso.modulos" :key="index"
                   class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-150">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3">
                      <div class="bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">{{ index + 1 }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">{{ modulo.nombre }}</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ modulo.descripcion }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-gray-900">{{ modulo.dirigente }}</p>
                    <p class="text-xs text-gray-500">{{ modulo.duracion }}</p>
                    <div class="mt-2 flex justify-end space-x-2">
                      <button 
                        @click="verAsistenciasModulo(modulo.id)"
                        class="text-xs text-[#009d71] hover:text-[#007a5c] font-medium"
                      >
                        Ver asistencias
                      </button>
                      <span class="text-xs text-gray-400">•</span>
                      <button 
                        @click="editarModulo(modulo.id)"
                        class="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mensaje si no hay módulos -->
            <div v-if="curso.modulos.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="mt-2 text-gray-500">No hay módulos registrados para este curso.</p>
              <button 
                @click="gestionarModulos"
                class="mt-4 text-[#009d71] hover:text-[#007a5c] font-medium"
              >
                Agregar módulos
              </button>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-between">
          <button 
            @click="volverALista"
            class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-200 font-medium flex items-center space-x-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Volver a lista</span>
          </button>
          
          <div class="flex space-x-3">
            <button 
              @click="eliminarCurso"
              class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
            >
              Eliminar Curso
            </button>
          </div>
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
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('detalle-curso')

// Datos del curso (simulados según página 19 del Figma)
const curso = ref({
  id: 1,
  nombre: 'Introductorio 2025',
  tipo: 'Curso Introductorio',
  estado: 'finalizado',
  fecha: '20 y 21 de febrero',
  descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  modulos: [
    {
      id: 1,
      nombre: 'Liderazgo Scout',
      descripcion: 'Fundamentos del liderazgo en el escultismo',
      dirigente: 'Juan Pérez',
      duracion: '2 horas'
    },
    {
      id: 2,
      nombre: 'Metodología Scout',
      descripcion: 'Sistema de patrullas y progresión personal',
      dirigente: 'María Gómez',
      duracion: '3 horas'
    },
    {
      id: 3,
      nombre: 'Seguridad Scout',
      descripcion: 'Protocolos de seguridad y primeros auxilios',
      dirigente: 'Carlos Rodríguez',
      duracion: '4 horas'
    }
  ]
})

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
  
  // Simular carga de datos del curso según ID de la ruta
  const cursoId = route.params.id
  if (cursoId) {
    console.log(`Cargando datos del curso ${cursoId}`)
    // Aquí iría la lógica para cargar el curso específico
  }
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

const editarCurso = () => {
  router.push(`/formacion/editar-curso/${curso.value.id}`)
}

const gestionarModulos = () => {
  router.push(`/formacion/curso/${curso.value.id}/modulos`)
}

const verAsistenciasModulo = (moduloId) => {
  router.push(`/formacion/modulo/${moduloId}/asistencias`)
}

const editarModulo = (moduloId) => {
  // Esto ya está manejado en GestionModulos.vue
  router.push(`/formacion/curso/${curso.value.id}/modulos`)
}

const volverALista = () => {
  router.push('/formacion/lista-cursos')
}

const eliminarCurso = () => {
  if (confirm('¿Está seguro de eliminar este curso? Esta acción no se puede deshacer.')) {
    // Lógica para eliminar el curso
    console.log(`Curso ${curso.value.id} eliminado`)
    router.push('/formacion/lista-cursos')
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>