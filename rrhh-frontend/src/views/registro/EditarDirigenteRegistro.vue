<!-- src/views/registro/EditarDirigenteRegistro.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header específico para Registro y Habilitación -->
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

    <!-- Navigation específica para Registro y Habilitación -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            @click="navegarA('inicio-registro')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'inicio-registro' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Inicio
          </button>
          
          <button 
            @click="navegarA('solicitudes-pendientes-registro')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'solicitudes-pendientes-registro' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Solicitudes pendientes
          </button>
          
          <button 
            @click="navegarA('lista-dirigentes-habilitados')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'lista-dirigentes-habilitados' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Dirigentes habilitados
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Título y botón volver -->
        <div class="mb-8 flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <button 
              @click="volverADetalle"
              class="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Formulario de edición de dirigentes</h1>
              <p class="text-gray-600 mt-1">Actualización de datos del dirigente</p>
            </div>
          </div>
          
          <!-- Estado del formulario -->
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            EDITANDO
          </span>
        </div>

        <!-- Formulario de edición -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <!-- Grupo Scout -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Grupo Scout</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Seleccione grupo scout *</label>
                <select 
                  v-model="formulario.grupoScout"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un grupo</option>
                  <option value="Boliviano Israelita">Boliviano Israelita</option>
                  <option value="Amerinst 301">Amerinst 301</option>
                  <option value="San Calixto">San Calixto</option>
                  <option value="Santa María">Santa María</option>
                  <option value="San Ignacio">San Ignacio</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Datos personales -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos personales</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input 
                  v-model="formulario.nombreCompleto"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                  placeholder="Felipe Alejandro Lopez"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                <select 
                  v-model="formulario.genero"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento *</label>
                <input 
                  v-model="formulario.fechaNacimiento"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Carnet de identidad *</label>
                <input 
                  v-model="formulario.ci"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                  placeholder="2065866"
                >
              </div>
            </div>
          </div>

          <!-- Datos Scout -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos Scout</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Años registrados *</label>
                <input 
                  v-model="formulario.anosRegistrados"
                  type="number"
                  min="0"
                  max="50"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                  placeholder="10"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rama *</label>
                <select 
                  v-model="formulario.rama"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                >
                  <option value="">Seleccione rama</option>
                  <option value="Lobatos">Lobatos</option>
                  <option value="Exploradores">Exploradores</option>
                  <option value="Pioneros">Pioneros</option>
                  <option value="Rovers">Rovers</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cargo distrital *</label>
                <input 
                  v-model="formulario.cargoDistrital"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                  placeholder="Programa"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
                <input 
                  v-model="formulario.distrito"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                  placeholder="Distrito La Paz"
                >
              </div>
            </div>
          </div>

          <!-- Cargos de Grupo -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Cargos de Grupo</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cargo Grupo 1 *</label>
                <input 
                  v-model="formulario.cargoGrupo1"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  required
                  placeholder="Programa"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cargo Grupo 2</label>
                <input 
                  v-model="formulario.cargoGrupo2"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Administración"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cargo Grupo 3</label>
                <input 
                  v-model="formulario.cargoGrupo3"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Logística"
                >
              </div>
            </div>
          </div>

          <!-- Formación Scout -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Formación Scout</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Programa de jóvenes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Programa de jóvenes</label>
                <select 
                  v-model="formulario.programaJovenes"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione nivel</option>
                  <option value="Cursado - Curso Informativo">Cursado - Curso Informativo</option>
                  <option value="Cursado - Insignia de Madera Nivel II">Cursado - Insignia de Madera Nivel II</option>
                  <option value="Aprobado - Insignia de Madera Nivel II">Aprobado - Insignia de Madera Nivel II</option>
                  <option value="Cursado - Insignia de Madera Nivel III">Cursado - Insignia de Madera Nivel III</option>
                  <option value="Aprobado - Insignia de Madera Nivel III">Aprobado - Insignia de Madera Nivel III</option>
                </select>
              </div>
              
              <!-- Formador de líderes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Formador de líderes</label>
                <select 
                  v-model="formulario.formadorLideres"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione nivel</option>
                  <option value="Cursado - Asesores personales">Cursado - Asesores personales</option>
                  <option value="Cursado y aprobado - Adjunto de formación">Cursado y aprobado - Adjunto de formación</option>
                  <option value="Cursado y aprobado - Director de formación">Cursado y aprobado - Director de formación</option>
                </select>
              </div>
              
              <!-- Gestión Institucional -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gestión Institucional</label>
                <select 
                  v-model="formulario.gestionInstitucional"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione nivel</option>
                  <option value="Cursado - Paxtu Nivel Grupo">Cursado - Paxtu Nivel Grupo</option>
                  <option value="Aprobado - Paxtu Nivel Grupo">Aprobado - Paxtu Nivel Grupo</option>
                  <option value="Cursado - Paxtu Nivel Distrito">Cursado - Paxtu Nivel Distrito</option>
                  <option value="Aprobado - Paxtu Nivel Distrito">Aprobado - Paxtu Nivel Distrito</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Requisitos -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Requisitos</h2>
            
            <!-- Certificados de formación scout -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Certificados de formación scout</label>
              <div class="border border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-900">{{ formulario.certificadoFormacion.nombre || 'No hay archivo cargado' }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      v-if="formulario.certificadoFormacion.url"
                      @click="verArchivo(formulario.certificadoFormacion)"
                      type="button"
                      class="text-sm text-[#009d71] hover:text-[#007a5c] font-medium"
                    >
                      Ver
                    </button>
                    <button 
                      @click="abrirSubirArchivo('certificadoFormacion')"
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {{ formulario.certificadoFormacion.url ? 'Reemplazar' : 'Agregar archivo' }}
                    </button>
                  </div>
                </div>
                <input 
                  type="file"
                  ref="certificadoFormacionInput"
                  class="hidden"
                  @change="manejarSubidaArchivo($event, 'certificadoFormacion')"
                  accept=".pdf,.jpg,.jpeg,.png"
                >
              </div>
            </div>

            <!-- Certificado de No Violencia -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Certificado de No Violencia *</label>
              <div class="border border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-900">{{ formulario.certificadoNoViolencia.nombre || 'No hay archivo cargado' }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      v-if="formulario.certificadoNoViolencia.url"
                      @click="verArchivo(formulario.certificadoNoViolencia)"
                      type="button"
                      class="text-sm text-[#009d71] hover:text-[#007a5c] font-medium"
                    >
                      Ver
                    </button>
                    <button 
                      @click="abrirSubirArchivo('certificadoNoViolencia')"
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {{ formulario.certificadoNoViolencia.url ? 'Reemplazar' : 'Agregar archivo' }}
                    </button>
                  </div>
                </div>
                <input 
                  type="file"
                  ref="certificadoNoViolenciaInput"
                  class="hidden"
                  @change="manejarSubidaArchivo($event, 'certificadoNoViolencia')"
                  accept=".pdf,.jpg,.jpeg,.png"
                >
              </div>
            </div>

            <!-- Valoración del Perfil del Dirigente Scout -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Valoración del Perfil del Dirigente Scout</label>
              <div class="border border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-900">{{ formulario.valoracionPerfil?.nombre || 'No hay archivo cargado' }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      v-if="formulario.valoracionPerfil?.url"
                      @click="verArchivo(formulario.valoracionPerfil)"
                      type="button"
                      class="text-sm text-[#009d71] hover:text-[#007a5c] font-medium"
                    >
                      Ver
                    </button>
                    <button 
                      @click="abrirSubirArchivo('valoracionPerfil')"
                      type="button"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {{ formulario.valoracionPerfil?.url ? 'Reemplazar' : 'Agregar archivo' }}
                    </button>
                  </div>
                </div>
                <input 
                  type="file"
                  ref="valoracionPerfilInput"
                  class="hidden"
                  @change="manejarSubidaArchivo($event, 'valoracionPerfil')"
                  accept=".pdf,.jpg,.jpeg,.png"
                >
                <p class="text-xs text-gray-500 mt-2">
                  (solo para dirigentes que hayan finalizado su periodo de prueba)
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button 
              @click="cancelarEdicion"
              type="button"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
            >
              Cancelar
            </button>
            
            <button 
              @click="guardarCambios"
              type="button"
              class="px-6 py-3 bg-[#009d71] text-white rounded-lg hover:bg-[#007a5c] transition duration-200 font-medium"
            >
              Guardar dirigente
            </button>
          </div>
        </div>

        <!-- Información del sistema -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div class="flex items-start">
            <svg class="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-blue-900 mb-2">Información importante sobre la edición</h3>
              <ul class="text-sm text-blue-800 space-y-1">
                <li>• Los campos marcados con * son obligatorios</li>
                <li>• Los archivos deben estar en formato PDF, JPG o PNG</li>
                <li>• El tamaño máximo por archivo es de 5MB</li>
                <li>• La información actualizada será visible inmediatamente en el sistema</li>
                <li>• Se registrará un historial de cambios con la fecha y responsable</li>
              </ul>
            </div>
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
const nombreResponsable = ref('Responsable de Registro')
const rutaActiva = ref('lista-dirigentes-habilitados')

// Referencias para inputs de archivo
const certificadoFormacionInput = ref(null)
const certificadoNoViolenciaInput = ref(null)
const valoracionPerfilInput = ref(null)

// Datos del formulario (según página 25 del PDF)
const formulario = ref({
  // Grupo Scout
  grupoScout: 'Boliviano Israelita',
  
  // Datos personales
  nombreCompleto: 'Felipe Alejandro Lopez',
  genero: 'Masculino',
  fechaNacimiento: '1990-05-26',
  ci: '2065866',
  
  // Datos Scout
  anosRegistrados: '10',
  rama: 'Exploradores',
  cargoDistrital: 'Programa',
  distrito: 'Distrito La Paz',
  
  // Cargos de Grupo
  cargoGrupo1: 'Administración',
  cargoGrupo2: null,
  cargoGrupo3: null,
  
  // Formación Scout
  programaJovenes: 'Cursado - Insignia de Madera Nivel II',
  formadorLideres: '',
  gestionInstitucional: '',
  
  // Archivos
  certificadoFormacion: {
    nombre: 'Certificados.pdf',
    url: '/certificados/001.pdf'
  },
  certificadoNoViolencia: {
    nombre: 'CertificadoNoViolencia.pdf',
    url: '/certificados/no-violencia-001.pdf'
  },
  valoracionPerfil: null
})

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'
  
  // Cargar datos del dirigente según ID de la ruta
  const dirigenteId = route.params.id
  if (dirigenteId) {
    console.log(`Cargando datos del dirigente ${dirigenteId} para edición`)
    // Aquí iría la lógica para cargar los datos del dirigente de la API
  }
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  
  switch(destino) {
    case 'inicio-registro':
      router.push('/registro')
      break
    case 'solicitudes-pendientes-registro':
      router.push('/registro/solicitudes-pendientes')
      break
    case 'lista-dirigentes-habilitados':
      router.push('/registro/dirigentes-habilitados')
      break
  }
}

const volverADetalle = () => {
  const dirigenteId = route.params.id
  router.push(`/registro/dirigente/${dirigenteId}`)
}

const abrirSubirArchivo = (tipoArchivo) => {
  switch(tipoArchivo) {
    case 'certificadoFormacion':
      certificadoFormacionInput.value.click()
      break
    case 'certificadoNoViolencia':
      certificadoNoViolenciaInput.value.click()
      break
    case 'valoracionPerfil':
      valoracionPerfilInput.value.click()
      break
  }
}

const manejarSubidaArchivo = (event, tipoArchivo) => {
  const archivo = event.target.files[0]
  if (archivo) {
    // Validar tamaño (5MB máximo)
    if (archivo.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.')
      return
    }
    
    // Validar tipo de archivo
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!tiposPermitidos.includes(archivo.type)) {
      alert('Formato de archivo no permitido. Solo se aceptan PDF, JPG y PNG.')
      return
    }
    
    // Actualizar el formulario
    switch(tipoArchivo) {
      case 'certificadoFormacion':
        formulario.value.certificadoFormacion = {
          nombre: archivo.name,
          url: URL.createObjectURL(archivo)
        }
        break
      case 'certificadoNoViolencia':
        formulario.value.certificadoNoViolencia = {
          nombre: archivo.name,
          url: URL.createObjectURL(archivo)
        }
        break
      case 'valoracionPerfil':
        formulario.value.valoracionPerfil = {
          nombre: archivo.name,
          url: URL.createObjectURL(archivo)
        }
        break
    }
    
    alert(`Archivo "${archivo.name}" cargado exitosamente.`)
  }
}

const verArchivo = (archivo) => {
  if (archivo && archivo.url) {
    // Abrir en nueva pestaña o descargar
    window.open(archivo.url, '_blank')
  } else {
    alert('Archivo no disponible')
  }
}

const validarFormulario = () => {
  const camposRequeridos = [
    'grupoScout',
    'nombreCompleto', 
    'genero',
    'fechaNacimiento',
    'ci',
    'anosRegistrados',
    'rama',
    'cargoDistrital',
    'distrito',
    'cargoGrupo1'
  ]
  
  for (const campo of camposRequeridos) {
    if (!formulario.value[campo] || formulario.value[campo].toString().trim() === '') {
      alert(`El campo "${campo.replace(/([A-Z])/g, ' $1').toLowerCase()}" es requerido.`)
      return false
    }
  }
  
  // Validar archivos
  if (!formulario.value.certificadoNoViolencia.url) {
    alert('El Certificado de No Violencia es requerido.')
    return false
  }
  
  return true
}

const guardarCambios = () => {
  if (!validarFormulario()) {
    return
  }
  
  if (confirm('¿Está seguro de guardar los cambios realizados?')) {
    console.log('Guardando cambios:', formulario.value)
    alert('Cambios guardados exitosamente')
    
    // Redirigir al detalle del dirigente
    const dirigenteId = route.params.id
    router.push(`/registro/dirigente/${dirigenteId}`)
  }
}

const cancelarEdicion = () => {
  if (confirm('¿Está seguro de cancelar la edición? Los cambios no guardados se perderán.')) {
    volverADetalle()
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>
