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
            @click="navegarA('/registro')"
            :class="navClass('/registro')"
          >
            Inicio
          </button>

          <button
            @click="navegarA('/registro/solicitudes-pendientes')"
            :class="navClass('solicitudes-pendientes', true)"
          >
            Solicitudes pendientes
          </button>

          <button
            @click="navegarA('/registro/solicitudes-rechazadas')"
            :class="navClass('solicitudes-rechazadas', true)"
          >
            Solicitudes rechazadas
          </button>

          <button
            @click="navegarA('/registro/dirigentes-habilitados')"
            :class="navClass('dirigentes-habilitados', true)"
          >
            Dirigentes habilitados
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div v-if="solicitud">
        <div v-if="cargando" class="text-center py-20">
          <p class="text-gray-500">Cargando solicitud...</p>
        </div>
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
              <h1 v-if="solicitud" class="text-2xl font-bold text-gray-900">
                Solicitud #{{ solicitud.id }}
              </h1>
            </div>
            
            <!-- Estado de la solicitud -->
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              solicitud.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
              solicitud.estado === 'habilitado' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            ]">
              {{ solicitud.estado === 'pendiente' ? 'PENDIENTE' : solicitud.estado === 'habilitado' ? 'HABILITADA' : 'RECHAZADA' }}
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
                    <p class="text-sm font-medium text-gray-700 mb-2">
                      Certificados de formación scout
                    </p>

                    <ul
                      v-if="documentos.CERTIFICADOS_FORMACION.length"
                      class="space-y-2"
                    >
                      <li
                        v-for="doc in documentos.CERTIFICADOS_FORMACION"
                        :key="doc.id"
                        class="flex items-center justify-between"
                      >
                        <div class="flex items-center">
                          <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          <span class="text-sm text-gray-900">{{ doc.url.split('/').pop() }}</span>
                        </div>

                        <button
                          @click="descargarArchivo(doc)"
                          class="text-[#009d71] hover:text-[#007a5c] text-sm font-medium"
                        >
                          Ver
                        </button>
                      </li>
                    </ul>

                    <p v-else class="text-sm text-gray-500 text-center">
                      No se adjuntaron certificados
                    </p>
                  </div>

                  <!-- Certificado de No Violencia -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">Certificado de No Violencia</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span class="text-sm text-gray-900">
                          {{ documentos.CERTIFICADO_NO_VIOLENCIA?.url.split('/').pop() || 'No adjuntado' }}
                        </span>
                      </div>
                      <button
                        v-if="documentos.CERTIFICADO_NO_VIOLENCIA"
                        @click="descargarArchivo(documentos.CERTIFICADO_NO_VIOLENCIA)"
                      >
                        Ver
                      </button>
                    </div>
                  </div>

                  <!-- Valoración del Perfil del Dirigente -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <p class="text-sm font-medium text-gray-700 mb-2">
                      Valoración del Perfil del Dirigente
                    </p>

                    <div v-if="documentos.VALORACION_PERFIL" class="flex items-center justify-between">
                      <div class="flex items-center">
                        <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span class="text-sm text-gray-900">
                          {{ documentos.VALORACION_PERFIL.url.split('/').pop() }}
                        </span>
                      </div>

                      <button
                        @click="descargarArchivo(documentos.VALORACION_PERFIL)"
                        class="text-[#009d71] hover:text-[#007a5c] text-sm font-medium"
                      >
                        Ver
                      </button>
                    </div>

                    <p v-else class="text-sm text-gray-500 text-center">
                      No adjuntado
                    </p>
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { registroService } from '../../services/api'

const router = useRouter()
const route = useRoute()

const nombreResponsable = ref('Responsable de Registro')

const solicitud = ref(null)
const cargando = ref(true)

onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Registro'

  const solicitudId = route.params.id
  if (!solicitudId) {
    alert('ID de solicitud inválido')
    return
  }

  try {
    // 1️⃣ Solicitud
    const { data } = await registroService.getSolicitudById(solicitudId)

    solicitud.value = {
      id: data.id,
      estado: data.estado,
      formularioASB: data.formulario_asb ? 'SI' : 'NO',

      nombreCompleto: data.nombre_completo,
      genero: data.genero,
      fechaNacimiento: data.fecha_nacimiento,
      ci: data.ci,

      anosRegistrados: data.anios_registrados,
      grupoScout: data.grupo,
      rama: data.rama,

      programaJovenes: data.programa_jovenes,
      formadorLideres: data.formador_lideres,
      gestionInstitucional: data.gestion_institucional,

      cargoDistrital: data.cargo_distrital,
      cargoGrupo1: data.cargo_grupo_1,
      cargoGrupo2: data.cargo_grupo_2,
      cargoGrupo3: data.cargo_grupo_3
    }

    // 2️⃣ Documentos
    const docs = await registroService.getDocumentosPorSolicitud(solicitudId)

    docs.data.forEach(doc => {
      if (doc.tipo_documento === 'CERTIFICADOS_FORMACION') {
        documentos.value.CERTIFICADOS_FORMACION.push(doc)
      } else if (doc.tipo_documento === 'CERTIFICADO_NO_VIOLENCIA') {
        documentos.value.CERTIFICADO_NO_VIOLENCIA = doc
      } else if (doc.tipo_documento === 'VALORACION_PERFIL') {
        documentos.value.VALORACION_PERFIL = doc
      }
    })

  } catch (error) {
    console.error(error)
    alert('No se pudo cargar la solicitud')
  } finally {
    cargando.value = false
  }
})

const navClass = (pathExacto, incluye = false) => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200'
  const activo = incluye
    ? route.path.includes(pathExacto)
    : route.path === pathExacto

  return activo
    ? `${base} border-[#009d71] text-[#009d71]`
    : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

const navegarA = (path) => {
  router.push(path)
}

const volverASolicitudes = () => {
  router.push('/registro/solicitudes-pendientes')
}

const aprobarSolicitud = async () => {
  if (!confirm('¿Aprobar esta solicitud?')) return

  try {
    await registroService.actualizarSolicitud(solicitud.value.id, {
      estado: 'habilitado',
      observaciones: ''
    })

    solicitud.value.estado = 'habilitado'
    alert('Solicitud aprobada correctamente')
  } catch (error) {
    console.error(error)
    alert('Error al aprobar la solicitud')
  }
}

const rechazarSolicitud = async () => {
  const motivo = prompt('Ingrese el motivo del rechazo:')
  if (!motivo) return

  try {
    await registroService.actualizarSolicitud(solicitud.value.id, {
      estado: 'rechazado',
      observaciones: motivo
    })

    solicitud.value.estado = 'rechazado'
    alert('Solicitud rechazada correctamente')
  } catch (error) {
    console.error(error)
    alert('Error al rechazar la solicitud')
  }
}

const documentos = ref({
  CERTIFICADO_NO_VIOLENCIA: null,
  CERTIFICADOS_FORMACION: [],
  VALORACION_PERFIL: null
})

const descargarArchivo = (doc) => {
  if (!doc?.url) {
    alert('Archivo no disponible')
    return
  }

  const link = document.createElement('a')
  link.href = doc.url
  link.target = '_blank'
  link.click()
}

const descargarTodo = () => {
  alert('Descargando todos los archivos de la solicitud...')
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