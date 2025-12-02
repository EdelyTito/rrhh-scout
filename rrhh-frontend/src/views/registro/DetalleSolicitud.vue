<!-- src/views/registro/DetalleSolicitud.vue -->
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
              @click="volverASolicitudes"
              class="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver
            </button>
            <h1 class="text-2xl font-bold text-gray-900">Solicitud #{{ solicitud.id }}</h1>
          </div>
          
          <!-- Estado de la solicitud -->
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
            solicitud.estado === 'aprobada' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          ]">
            {{ solicitud.estado === 'pendiente' ? 'PENDIENTE' : solicitud.estado === 'aprobada' ? 'APROBADA' : 'RECHAZADA' }}
          </span>
        </div>

        <!-- Contenido principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Columna izquierda - Datos principales -->
          <div class="lg:col-span-2">
            <!-- Pregunta ASB -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">
                ¿Llenó el formulario de habilitación de la ASB?
              </h2>
              <div class="flex items-center space-x-4">
                <span :class="[
                  'px-4 py-2 rounded-lg font-medium',
                  solicitud.formularioASB === 'SI' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ solicitud.formularioASB }}
                </span>
                <p class="text-gray-600 text-sm">
                  {{ solicitud.formularioASB === 'SI' 
                    ? 'El dirigente ha completado el formulario oficial de la ASB.' 
                    : 'El dirigente NO ha completado el formulario oficial de la ASB.' }}
                </p>
              </div>
            </div>

            <!-- Datos personales -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-6">Datos personales</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Nombre completo</p>
                  <p class="text-gray-900 font-medium">{{ solicitud.nombreCompleto }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Género</p>
                  <p class="text-gray-900">{{ solicitud.genero }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</p>
                  <p class="text-gray-900">{{ solicitud.fechaNacimiento }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Carnet de identidad</p>
                  <p class="text-gray-900">{{ solicitud.ci }}</p>
                </div>
              </div>
            </div>

            <!-- Datos scout -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-6">Datos scout</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Años registrados</p>
                  <p class="text-gray-900 font-medium">{{ solicitud.anosRegistrados }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Grupo Scout</p>
                  <p class="text-gray-900">{{ solicitud.grupoScout }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Rama</p>
                  <p class="text-gray-900">{{ solicitud.rama }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha - Requisitos y acciones -->
          <div>
            <!-- Formación Scout -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Formación Scout</h2>
              
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Programa de jóvenes</p>
                  <p class="text-gray-900">{{ solicitud.programaJovenes }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Formador de líderes</p>
                  <p class="text-gray-900">{{ solicitud.formadorLideres || 'No aplica' }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Gestión Institucional</p>
                  <p class="text-gray-900">{{ solicitud.gestionInstitucional || 'No aplica' }}</p>
                </div>
              </div>
            </div>

            <!-- Requisitos adjuntos -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Requisitos</h2>
              
              <div class="space-y-4">
                <!-- Certificado de formación scout -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Certificado de formación scout</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-sm text-gray-900">{{ solicitud.certificadoFormacion.nombre }}</span>
                    </div>
                    <button 
                      @click="descargarArchivo(solicitud.certificadoFormacion)"
                      class="text-[#009d71] hover:text-[#007a5c] text-sm font-medium"
                    >
                      Ver
                    </button>
                  </div>
                </div>

                <!-- Certificado de No Violencia -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Certificado de No Violencia</p>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-sm text-gray-900">{{ solicitud.certificadoNoViolencia.nombre }}</span>
                    </div>
                    <button 
                      @click="descargarArchivo(solicitud.certificadoNoViolencia)"
                      class="text-[#009d71] hover:text-[#007a5c] text-sm font-medium"
                    >
                      Ver
                    </button>
                  </div>
                </div>

                <!-- Valoración del Perfil del Dirigente -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Valoración del Perfil del Dirigente</p>
                  <div v-if="solicitud.valoracionPerfil" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-sm text-gray-900">{{ solicitud.valoracionPerfil.nombre }}</span>
                    </div>
                    <button 
                      @click="descargarArchivo(solicitud.valoracionPerfil)"
                      class="text-[#009d71] hover:text-[#007a5c] text-sm font-medium"
                    >
                      Ver
                    </button>
                  </div>
                  <div v-else class="text-center py-2">
                    <span class="text-sm text-gray-500">No adjuntado</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cargos -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Cargos</h2>
              
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo distrital</p>
                  <p class="text-gray-900">{{ solicitud.cargoDistrital }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo Grupo 1</p>
                  <p class="text-gray-900">{{ solicitud.cargoGrupo1 }}</p>
                </div>
                
                <div v-if="solicitud.cargoGrupo2">
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo Grupo 2</p>
                  <p class="text-gray-900">{{ solicitud.cargoGrupo2 }}</p>
                </div>
                
                <div v-if="solicitud.cargoGrupo3">
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo Grupo 3</p>
                  <p class="text-gray-900">{{ solicitud.cargoGrupo3 }}</p>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Acciones</h2>
              
              <div class="space-y-3">
                <button 
                  @click="aprobarSolicitud"
                  :disabled="solicitud.estado !== 'pendiente'"
                  :class="[
                    'w-full py-3 px-4 rounded-lg font-medium transition duration-200',
                    solicitud.estado === 'pendiente'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-green-100 text-green-800 cursor-not-allowed'
                  ]"
                >
                  Aceptar solicitud
                </button>
                
                <button 
                  @click="rechazarSolicitud"
                  :disabled="solicitud.estado !== 'pendiente'"
                  :class="[
                    'w-full py-3 px-4 rounded-lg font-medium transition duration-200',
                    solicitud.estado === 'pendiente'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-100 text-red-800 cursor-not-allowed'
                  ]"
                >
                  Rechazar solicitud
                </button>

                <!-- Botones adicionales -->
                <div class="pt-4 border-t border-gray-200">
                  <button 
                    @click="descargarTodo"
                    class="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium mb-2"
                  >
                    Descargar todo
                  </button>
                  
                  <button 
                    @click="imprimirSolicitud"
                    class="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Imprimir solicitud
                  </button>
                </div>
              </div>
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
const rutaActiva = ref('solicitudes-pendientes-registro')

// Datos de la solicitud (según página 22 del PDF)
const solicitud = ref({
  id: '001',
  estado: 'pendiente',
  formularioASB: 'SI',
  nombreCompleto: 'Felipe Alejandro Lopez',
  genero: 'Masculino',
  fechaNacimiento: '26/05/1990',
  ci: '2065866',
  anosRegistrados: '10',
  grupoScout: 'Boliviano Israelita',
  rama: 'Exploradores',
  programaJovenes: 'Cursado Insignia de Madera Nivel II',
  formadorLideres: null,
  gestionInstitucional: null,
  cargoDistrital: 'Programa',
  cargoGrupo1: 'Programa',
  cargoGrupo2: 'Programa',
  cargoGrupo3: 'Programa',
  certificadoFormacion: {
    nombre: 'Certificados.pdf',
    url: '/certificados/001.pdf'
  },
  certificadoNoViolencia: {
    nombre: 'CertificadoNoViolencia.pdf',
    url: '/certificados/no-violencia-001.pdf'
  },
  valoracionPerfil: null,
  fechaSolicitud: '25/03/2025'
})

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'
  
  // Cargar datos de la solicitud según ID de la ruta
  const solicitudId = route.params.id
  if (solicitudId) {
    console.log(`Cargando datos de la solicitud ${solicitudId}`)
    // Aquí iría la lógica para cargar la solicitud específica de la API
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

const volverASolicitudes = () => {
  router.push('/registro/solicitudes-pendientes')
}

const aprobarSolicitud = () => {
  if (confirm('¿Está seguro de aprobar esta solicitud? El dirigente será habilitado en el sistema.')) {
    solicitud.value.estado = 'aprobada'
    alert('Solicitud aprobada exitosamente')
    // Aquí iría la lógica para actualizar el estado en la API
  }
}

const rechazarSolicitud = () => {
  const motivo = prompt('Ingrese el motivo del rechazo:')
  if (motivo && motivo.trim() !== '') {
    solicitud.value.estado = 'rechazada'
    alert(`Solicitud rechazada. Motivo: ${motivo}`)
    // Aquí iría la lógica para actualizar el estado en la API
  }
}

const descargarArchivo = (archivo) => {
  if (archivo && archivo.url) {
    // Simular descarga
    const link = document.createElement('a')
    link.href = archivo.url
    link.download = archivo.nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    console.log(`Descargando: ${archivo.nombre}`)
  } else {
    alert('Archivo no disponible')
  }
}

const descargarTodo = () => {
  alert('Descargando todos los archivos de la solicitud...')
  // Aquí iría la lógica para comprimir y descargar todos los archivos
}

const imprimirSolicitud = () => {
  window.print()
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
@media print {
  header, nav, footer, button {
    display: none !important;
  }
  
  main {
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .bg-gray-50 {
    background-color: white !important;
  }
  
  .border, .shadow-sm {
    border: 1px solid #000 !important;
    box-shadow: none !important;
  }
}
</style>