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
    <main class="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título y navegación -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Registro de Asistencias</h1>
              <div class="text-gray-600 mt-1">
                <p>Módulo: {{ modulo.nombre }}</p>
                <p class="text-sm">Curso: {{ modulo.cursoNombre }}</p>
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
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input 
                v-model="fechaAsistencia"
                type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
              <input 
                v-model="horaInicio"
                type="time"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
              <input 
                v-model="horaFin"
                type="time"
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

        <!-- Lista de asistentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">Lista de asistentes</h2>
              <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600">
                  {{ asistentesPresentes }} presentes / {{ asistentes.length }} total
                </span>
                <button 
                  @click="marcarTodosPresentes"
                  class="text-sm text-[#009d71] hover:text-[#007a5c] font-medium"
                >
                  Marcar todos presentes
                </button>
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
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="asistente in asistentes" :key="asistente.id" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">{{ asistente.iniciales }}</span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ asistente.nombre }}</div>
                        <div class="text-xs text-gray-500">{{ asistente.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ asistente.grupo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-4">
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          :value="true"
                          v-model="asistente.presente"
                          class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                        >
                        <span class="ml-2 text-sm text-gray-700">Presente</span>
                      </label>
                      <label class="flex items-center">
                        <input 
                          type="radio" 
                          :value="false"
                          v-model="asistente.presente"
                          class="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300"
                        >
                        <span class="ml-2 text-sm text-gray-700">Ausente</span>
                      </label>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input 
                      v-model="asistente.observaciones"
                      type="text"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                      placeholder="Observaciones..."
                    >
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
          
          <div class="flex space-x-4">
            <button 
              @click="limpiarRegistro"
              class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
            >
              Limpiar
            </button>
            
            <button 
              @click="guardarAsistencias"
              :disabled="guardando"
              class="bg-[#009d71] text-white px-8 py-3 rounded-lg hover:bg-[#007a5c] transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="guardando">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
              <span v-else>
                Guardar Asistencias
              </span>
            </button>
          </div>
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
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('registro-asistencias')
const guardando = ref(false)

// Fecha actual por defecto
const hoy = new Date()
const fechaAsistencia = ref(hoy.toISOString().split('T')[0])
const horaInicio = ref('09:00')
const horaFin = ref('12:00')

// Datos del módulo (simulados)
const modulo = ref({
  id: 1,
  nombre: 'Liderazgo Scout',
  cursoNombre: 'Introductorio 2025',
  cursoId: 1
})

// Lista de asistentes (simulados)
const asistentes = ref([
  {
    id: 1,
    nombre: 'Juan Pérez López',
    iniciales: 'JP',
    email: 'juan.perez@email.com',
    grupo: 'Boliviano Israelita',
    presente: true,
    observaciones: ''
  },
  {
    id: 2,
    nombre: 'María Gómez Rodríguez',
    iniciales: 'MG',
    email: 'maria.gomez@email.com',
    grupo: 'Amerinst 301',
    presente: true,
    observaciones: ''
  },
  {
    id: 3,
    nombre: 'Carlos Martínez Fernández',
    iniciales: 'CM',
    email: 'carlos.martinez@email.com',
    grupo: 'San Calixto',
    presente: false,
    observaciones: 'Justificada - Enfermedad'
  },
  {
    id: 4,
    nombre: 'Ana Rodríguez Vargas',
    iniciales: 'AR',
    email: 'ana.rodriguez@email.com',
    grupo: 'Kantutani',
    presente: true,
    observaciones: ''
  },
  {
    id: 5,
    nombre: 'Luis Fernández Castro',
    iniciales: 'LF',
    email: 'luis.fernandez@email.com',
    grupo: 'Illimani',
    presente: true,
    observaciones: 'Llegó tarde - 10:15'
  }
])

// Computed properties
const totalAsistentes = computed(() => asistentes.value.length)
const asistentesPresentes = computed(() => 
  asistentes.value.filter(a => a.presente).length
)

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'
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

const volverAModulos = () => {
  router.push(`/formacion/curso/${modulo.value.cursoId}/modulos`)
}

const marcarTodosPresentes = () => {
  asistentes.value.forEach(asistente => {
    asistente.presente = true
  })
}

const guardarAsistencias = async () => {
  guardando.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const datosGuardar = {
      moduloId: modulo.value.id,
      fecha: fechaAsistencia.value,
      horaInicio: horaInicio.value,
      horaFin: horaFin.value,
      asistencias: asistentes.value.map(a => ({
        asistenteId: a.id,
        presente: a.presente,
        observaciones: a.observaciones
      }))
    }
    
    console.log('Asistencias guardadas:', datosGuardar)
    alert('¡Asistencias guardadas exitosamente!')
    
  } catch (error) {
    console.error('Error:', error)
    alert('Error al guardar asistencias')
  } finally {
    guardando.value = false
  }
}

const limpiarRegistro = () => {
  if (confirm('¿Limpiar todos los registros de asistencia?')) {
    asistentes.value.forEach(asistente => {
      asistente.presente = false
      asistente.observaciones = ''
    })
  }
}

// Agrega esta función al final del script de RegistroAsistencias.vue
const generarReporte = () => {
  const reporte = {
    modulo: modulo.value.nombre,
    curso: modulo.value.cursoNombre,
    fecha: fechaAsistencia.value,
    horaInicio: horaInicio.value,
    horaFin: horaFin.value,
    totalAsistentes: totalAsistentes.value,
    presentes: asistentesPresentes.value,
    ausentes: totalAsistentes.value - asistentesPresentes.value,
    porcentajeAsistencia: Math.round((asistentesPresentes.value / totalAsistentes.value) * 100),
    detalle: asistentes.value.map(a => ({
      nombre: a.nombre,
      grupo: a.grupo,
      presente: a.presente ? 'Presente' : 'Ausente',
      observaciones: a.observaciones
    }))
  }
  
  console.log('Reporte generado:', reporte)
  
  // En una implementación real, aquí se generaría un PDF o Excel
  alert(`Reporte generado:\n\nTotal: ${reporte.totalAsistentes}\nPresentes: ${reporte.presentes}\nAusentes: ${reporte.ausentes}\nAsistencia: ${reporte.porcentajeAsistencia}%`)
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}

</script>