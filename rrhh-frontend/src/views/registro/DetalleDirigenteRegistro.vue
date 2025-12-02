<!-- src/views/registro/DetalleDirigenteRegistro.vue -->
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
              @click="volverALista"
              class="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dirigente - {{ dirigente.nombreCompleto }}</h1>
              <p class="text-gray-600 mt-1">{{ dirigente.grupoScout }} • {{ dirigente.rama }}</p>
            </div>
          </div>
          
          <!-- Estado de habilitación -->
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            dirigente.estadoHabilitacion === 'habilitado' ? 'bg-green-100 text-green-800' :
            'bg-yellow-100 text-yellow-800'
          ]">
            {{ dirigente.estadoHabilitacion === 'habilitado' ? 'HABILITADO' : 'PENDIENTE RENOVACIÓN' }}
          </span>
        </div>

        <!-- Información del dirigente -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Columna izquierda - Datos personales y scout -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Datos personales -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos personales</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Nombre completo</p>
                  <p class="text-gray-900 font-medium">{{ dirigente.nombreCompleto }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Género</p>
                  <p class="text-gray-900">{{ dirigente.genero }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</p>
                  <p class="text-gray-900">{{ dirigente.fechaNacimiento }}</p>
                  <p class="text-xs text-gray-500">{{ calcularEdad(dirigente.fechaNacimiento) }} años</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Carnet de identidad</p>
                  <p class="text-gray-900">{{ dirigente.ci }}</p>
                </div>
              </div>
            </div>

            <!-- Datos scout -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos scout</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Años registrados</p>
                  <p class="text-gray-900 font-medium">{{ dirigente.anosRegistrados }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Grupo Scout</p>
                  <p class="text-gray-900">{{ dirigente.grupoScout }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Rama</p>
                  <p class="text-gray-900">{{ dirigente.rama }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Distrito</p>
                  <p class="text-gray-900">{{ dirigente.distrito }}</p>
                </div>
              </div>
            </div>

            <!-- Cargos -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Cargos</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo distrital</p>
                  <p class="text-gray-900">{{ dirigente.cargoDistrital }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo Grupo 1</p>
                  <p class="text-gray-900">{{ dirigente.cargoGrupo1 }}</p>
                </div>
                
                <div v-if="dirigente.cargoGrupo2">
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo Grupo 2</p>
                  <p class="text-gray-900">{{ dirigente.cargoGrupo2 }}</p>
                </div>
                
                <div v-if="dirigente.cargoGrupo3">
                  <p class="text-sm font-medium text-gray-700 mb-1">Cargo Grupo 3</p>
                  <p class="text-gray-900">{{ dirigente.cargoGrupo3 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha - Formación, requisitos y acciones -->
          <div class="space-y-6">
            <!-- Formación Scout -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Formación Scout</h2>
              
              <div class="space-y-4">
                <!-- Programa de jóvenes -->
                <div class="border-l-4 border-blue-500 pl-4 py-1">
                  <p class="text-sm font-medium text-gray-700 mb-1">Programa de jóvenes</p>
                  <p class="text-gray-900">{{ dirigente.programaJovenes }}</p>
                </div>
                
                <!-- Formador de líderes -->
                <div v-if="dirigente.formadorLideres" class="border-l-4 border-green-500 pl-4 py-1">
                  <p class="text-sm font-medium text-gray-700 mb-1">Formador de líderes</p>
                  <p class="text-gray-900">{{ dirigente.formadorLideres }}</p>
                </div>
                
                <!-- Gestión Institucional -->
                <div v-if="dirigente.gestionInstitucional" class="border-l-4 border-purple-500 pl-4 py-1">
                  <p class="text-sm font-medium text-gray-700 mb-1">Gestión Institucional</p>
                  <p class="text-gray-900">{{ dirigente.gestionInstitucional }}</p>
                </div>
                
                <!-- Sin formación adicional -->
                <div v-if="!dirigente.formadorLideres && !dirigente.gestionInstitucional" class="text-center py-4">
                  <p class="text-sm text-gray-500">No tiene formación adicional registrada</p>
                </div>
              </div>
            </div>

            <!-- Requisitos adjuntos -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                      <span class="text-sm text-gray-900">{{ dirigente.certificadoFormacion.nombre }}</span>
                    </div>
                    <button 
                      @click="descargarArchivo(dirigente.certificadoFormacion)"
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
                      <span class="text-sm text-gray-900">{{ dirigente.certificadoNoViolencia.nombre }}</span>
                    </div>
                    <button 
                      @click="descargarArchivo(dirigente.certificadoNoViolencia)"
                      class="text-[#009d71] hover:text-[#007a5c] text-sm font-medium"
                    >
                      Ver
                    </button>
                  </div>
                </div>

                <!-- Valoración del Perfil del Dirigente -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <p class="text-sm font-medium text-gray-700 mb-2">Valoración del Perfil del Dirigente</p>
                  <div v-if="dirigente.valoracionPerfil" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-sm text-gray-900">{{ dirigente.valoracionPerfil.nombre }}</span>
                    </div>
                    <button 
                      @click="descargarArchivo(dirigente.valoracionPerfil)"
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

            <!-- Información de habilitación -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Información de habilitación</h2>
              
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Fecha de habilitación</p>
                  <p class="text-gray-900">{{ dirigente.fechaHabilitacion }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Fecha de vencimiento</p>
                  <p class="text-gray-900">{{ dirigente.fechaVencimiento }}</p>
                </div>
                
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Estado</p>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    dirigente.estadoHabilitacion === 'habilitado' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ dirigente.estadoHabilitacion === 'habilitado' ? 'Vigente' : 'Próximo a vencer' }}
                  </span>
                </div>
                
                <div v-if="dirigente.diasParaVencer" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-sm font-medium text-yellow-800">
                      {{ dirigente.diasParaVencer }} días para renovar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Acciones</h2>
              
              <div class="space-y-3">
                <button 
                  @click="editarDirigente"
                  class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                >
                  Modificar dirigente
                </button>
                
                <button 
                  @click="deshabilitarDirigente"
                  class="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                >
                  Eliminar dirigente
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
                    @click="generarCertificado"
                    class="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
                  >
                    Generar certificado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Historial de cambios -->
        <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Historial de cambios</h2>
          
          <div class="space-y-4">
            <div v-for="cambio in historial" :key="cambio.id" class="border-l-4 border-gray-300 pl-4 py-2">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ cambio.descripcion }}</p>
                  <p class="text-xs text-gray-500">{{ cambio.detalle }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ cambio.fecha }}</span>
              </div>
            </div>
            
            <!-- Sin historial -->
            <div v-if="historial.length === 0" class="text-center py-4">
              <p class="text-sm text-gray-500">No hay historial de cambios registrado</p>
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

// Datos del dirigente (según página 24 del PDF)
const dirigente = ref({
  id: 1,
  nombreCompleto: 'Felipe Alejandro Lopez',
  genero: 'Masculino',
  fechaNacimiento: '26/05/1990',
  ci: '2065866',
  anosRegistrados: '10',
  grupoScout: 'Boliviano Israelita',
  rama: 'Exploradores',
  distrito: 'Distrito La Paz',
  cargoDistrital: 'Programa',
  cargoGrupo1: 'Programa',
  cargoGrupo2: null,
  cargoGrupo3: null,
  programaJovenes: 'Cursado Insignia de Madera Nivel II',
  formadorLideres: null,
  gestionInstitucional: null,
  certificadoFormacion: {
    nombre: 'Certificados.pdf',
    url: '/certificados/001.pdf'
  },
  certificadoNoViolencia: {
    nombre: 'CertificadoNoViolencia.pdf',
    url: '/certificados/no-violencia-001.pdf'
  },
  valoracionPerfil: null,
  fechaHabilitacion: '25/03/2025',
  fechaVencimiento: '25/03/2027',
  estadoHabilitacion: 'habilitado',
  diasParaVencer: null
})

// Historial de cambios
const historial = ref([
  {
    id: 1,
    fecha: '25/03/2025',
    descripcion: 'Habilitación aprobada',
    detalle: 'Solicitud #001 aprobada por Responsable de Registro'
  },
  {
    id: 2,
    fecha: '20/03/2025',
    descripcion: 'Solicitud recibida',
    detalle: 'Formulario de habilitación enviado por el dirigente'
  }
])

// Cargar datos del usuario
onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'
  
  // Cargar datos del dirigente según ID de la ruta
  const dirigenteId = route.params.id
  if (dirigenteId) {
    console.log(`Cargando datos del dirigente ${dirigenteId}`)
    // Aquí iría la lógica para cargar el dirigente específico de la API
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

const volverALista = () => {
  router.push('/registro/dirigentes-habilitados')
}

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento.split('/').reverse().join('-'))
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  
  return edad
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
  alert('Descargando todos los archivos del dirigente...')
  // Aquí iría la lógica para comprimir y descargar todos los archivos
}

const generarCertificado = () => {
  alert('Generando certificado de habilitación...')
}

const editarDirigente = () => {
  router.push(`/registro/dirigente/${dirigente.value.id}/editar`)
}

const deshabilitarDirigente = () => {
  if (confirm(`¿Está seguro de eliminar al dirigente ${dirigente.value.nombreCompleto}? Esta acción no se puede deshacer.`)) {
    alert('Dirigente eliminado exitosamente')
    router.push('/registro/dirigentes-habilitados')
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}
</script>
