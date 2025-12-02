<!-- src/views/invitado/FormularioHabilitacionDirigentes.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header del Formulario con Logo -->
        <div class="bg-[#009d71] px-6 py-6">
          <div class="flex items-center space-x-4">
            <!-- Logo -->
            <img 
              src="/images/rraa.png" 
              alt="Logo Distrito Scout"
              class="h-12 w-auto"
            >
            <!-- Texto -->
            <div>
              <h2 class="text-xl font-bold text-white">Formulario de habilitación de dirigentes</h2>
              <p class="text-white opacity-90 mt-1">Complete el formulario para solicitar su habilitación como dirigente scout</p>
            </div>
          </div>
        </div>

        <!-- Progreso -->
        <div class="px-6 pt-6">
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Progreso del formulario</span>
              <span class="text-sm text-gray-600">{{ progreso }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#009d71] h-2 rounded-full transition-all duration-300" :style="{ width: progreso + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="enviarFormulario" class="p-6 space-y-8">
          <!-- Pregunta ASB -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
              ¿Usted llenó el formulario de habilitación de la ASB? *
            </h2>
            <div class="flex space-x-6">
              <label class="flex items-center">
                <input 
                  v-model="formulario.formularioASB"
                  type="radio" 
                  value="SI"
                  required
                  class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                >
                <span class="ml-2 text-gray-700">SI</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="formulario.formularioASB"
                  type="radio" 
                  value="NO"
                  required
                  class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                >
                <span class="ml-2 text-gray-700">NO</span>
              </label>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              La ASB (Asociación de Scouts de Bolivia) requiere que todos los dirigentes completen su formulario oficial de habilitación.
            </p>
          </div>

          <!-- DATOS PERSONALES -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">DATOS PERSONALES</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nombre completo -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo (NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2) *
                </label>
                <input 
                  v-model="formulario.nombreCompleto"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Ingrese su nombre completo"
                >
              </div>

              <!-- Género -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input 
                      v-model="formulario.genero"
                      type="radio" 
                      value="Femenino"
                      required
                      class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                    >
                    <span class="ml-2 text-gray-700">Femenino</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="formulario.genero"
                      type="radio" 
                      value="Masculino"
                      required
                      class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                    >
                    <span class="ml-2 text-gray-700">Masculino</span>
                  </label>
                </div>
              </div>

              <!-- Fecha de nacimiento -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de nacimiento *
                </label>
                <input 
                  v-model="formulario.fechaNacimiento"
                  type="date" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
              </div>

              <!-- Carnet de identidad -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Carnet de identidad *
                </label>
                <input 
                  v-model="formulario.ci"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Ej: 1234567"
                >
              </div>
            </div>
          </div>

          <!-- DATOS SCOUT -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">DATOS SCOUT</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Años registrados -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Años registrados en la oficina Nacional *
                </label>
                <input 
                  v-model="formulario.anosRegistrados"
                  type="number" 
                  min="0"
                  max="50"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Ej: 5"
                >
              </div>

              <!-- Grupo Scout -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Grupo Scout *
                </label>
                <select 
                  v-model="formulario.grupoScout"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione su grupo</option>
                  <option value="Boliviano Israelita">Boliviano Israelita</option>
                  <option value="Amerinst 301">Amerinst 301</option>
                  <option value="San Calixto">San Calixto</option>
                  <option value="Kantutani">Kantutani</option>
                  <option value="Illimani">Illimani</option>
                  <option value="San Miguel">San Miguel</option>
                </select>
              </div>

              <!-- Rama que dirige -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rama que dirige *
                </label>
                <select 
                  v-model="formulario.rama"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione rama</option>
                  <option value="Lobatos">Lobatos</option>
                  <option value="Exploradores">Exploradores</option>
                  <option value="Pioneros">Pioneros</option>
                  <option value="Rovers">Rovers</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>

              <!-- Cargo Distrital -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Distrital *
                </label>
                <input 
                  v-model="formulario.cargoDistrital"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Ej: Programa, Formación, etc."
                >
              </div>

              <!-- Cargo Grupo 1 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Grupo 1 *
                </label>
                <input 
                  v-model="formulario.cargoGrupo1"
                  type="text" 
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Ej: Programa, Administración, etc."
                >
              </div>

              <!-- Cargo Grupo 2 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Grupo 2
                </label>
                <input 
                  v-model="formulario.cargoGrupo2"
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Opcional"
                >
              </div>

              <!-- Cargo Grupo 3 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Grupo 3
                </label>
                <input 
                  v-model="formulario.cargoGrupo3"
                  type="text" 
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  placeholder="Opcional"
                >
              </div>
            </div>
          </div>

          <!-- FORMACIÓN SCOUT -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">FORMACIÓN SCOUT</h2>
            
            <!-- Programa de jóvenes -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Programa de jóvenes</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="formulario.programaJovenes"
                    type="radio" 
                    value="Cursado - Curso Informativo"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado - Curso Informativo</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.programaJovenes"
                    type="radio" 
                    value="Cursado - Insignia de madera Nivel II"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado - Insignia de madera Nivel II</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.programaJovenes"
                    type="radio" 
                    value="Aprobado - Insignia de madera Nivel II"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Aprobado - Insignia de madera Nivel II</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.programaJovenes"
                    type="radio" 
                    value="Cursado - Insignia de madera Nivel III"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado - Insignia de madera Nivel III</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.programaJovenes"
                    type="radio" 
                    value="Aprobado - Insignia de madera Nivel III"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Aprobado - Insignia de madera Nivel III</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.programaJovenes"
                    type="radio" 
                    value="Ninguno"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Ninguno</span>
                </label>
              </div>
            </div>

            <!-- Formador de líderes -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Formador de líderes</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="formulario.formadorLideres"
                    type="radio" 
                    value="Cursado - Asesores personales"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado - Asesores personales</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.formadorLideres"
                    type="radio" 
                    value="Cursado y aprobado - Adjunto de formación"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado y aprobado - Adjunto de formación</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.formadorLideres"
                    type="radio" 
                    value="Cursado y aprobado - Director de formación"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado y aprobado - Director de formación</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.formadorLideres"
                    type="radio" 
                    value="Ninguno"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Ninguno</span>
                </label>
              </div>
            </div>

            <!-- Gestión Institucional -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Gestión Institucional</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="formulario.gestionInstitucional"
                    type="radio" 
                    value="Cursado - Paxtu Nivel Grupo"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado - Paxtu Nivel Grupo</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.gestionInstitucional"
                    type="radio" 
                    value="Aprobado - Paxtu Nivel Grupo"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Aprobado - Paxtu Nivel Grupo</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.gestionInstitucional"
                    type="radio" 
                    value="Cursado - Paxtu Nivel Distrito"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Cursado - Paxtu Nivel Distrito</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.gestionInstitucional"
                    type="radio" 
                    value="Aprobado - Paxtu Nivel Distrito"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Aprobado - Paxtu Nivel Distrito</span>
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="formulario.gestionInstitucional"
                    type="radio" 
                    value="Ninguno"
                    class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                  >
                  <span class="ml-2 text-gray-700">Ninguno</span>
                </label>
              </div>
            </div>
          </div>

          <!-- REQUISITOS -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">REQUISITOS</h2>
            
            <!-- Certificados de Formación Scout -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Certificados de Formación Scout
              </label>
              <div class="border border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-900">{{ archivos.certificadosFormacion?.name || 'No hay archivo cargado' }}</span>
                  </div>
                  <button 
                    type="button"
                    @click="abrirSubirArchivo('certificadosFormacion')"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Agregar archivo
                  </button>
                </div>
                <input 
                  type="file"
                  ref="certificadosFormacionInput"
                  class="hidden"
                  @change="manejarArchivo($event, 'certificadosFormacion')"
                  accept=".pdf,.jpg,.jpeg,.png"
                >
                <p class="text-xs text-gray-500 mt-2">Puede subir múltiples archivos en un ZIP si es necesario</p>
              </div>
            </div>

            <!-- Certificado de No Violencia -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Certificado de No Violencia *
              </label>
              <div class="border border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-900">{{ archivos.certificadoNoViolencia?.name || 'No hay archivo cargado' }}</span>
                  </div>
                  <button 
                    type="button"
                    @click="abrirSubirArchivo('certificadoNoViolencia')"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Agregar archivo
                  </button>
                </div>
                <input 
                  type="file"
                  ref="certificadoNoViolenciaInput"
                  class="hidden"
                  @change="manejarArchivo($event, 'certificadoNoViolencia')"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                >
                <p class="text-xs text-gray-500 mt-2">Formato: PDF, JPG, PNG (máx. 5MB)</p>
              </div>
            </div>

            <!-- Valoración del Perfil del Dirigente Scout -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Valoración del Perfil del Dirigente Scout
              </label>
              <div class="border border-gray-300 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-900">{{ archivos.valoracionPerfil?.name || 'No hay archivo cargado' }}</span>
                  </div>
                  <button 
                    type="button"
                    @click="abrirSubirArchivo('valoracionPerfil')"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Agregar archivo
                  </button>
                </div>
                <input 
                  type="file"
                  ref="valoracionPerfilInput"
                  class="hidden"
                  @change="manejarArchivo($event, 'valoracionPerfil')"
                  accept=".pdf,.jpg,.jpeg,.png"
                >
                <p class="text-xs text-gray-500 mt-2">
                  (solo para dirigentes que hayan finalizado su periodo de prueba)
                </p>
              </div>
            </div>
          </div>

          <!-- Confirmación y Envío -->
          <div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-yellow-800">Información importante</h3>
                  <div class="mt-2 text-sm text-yellow-700">
                    <p>• Los campos marcados con * son obligatorios</p>
                    <p>• Recibirá un correo de confirmación al enviar el formulario</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-between pt-6">
              <button 
                type="button"
                @click="limpiarFormulario"
                class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
              >
                Limpiar Formulario
              </button>
              
              <button 
                type="submit"
                :disabled="enviando"
                class="bg-[#009d71] text-white px-8 py-3 rounded-lg hover:bg-[#007a5c] transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="enviando">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
                <span v-else>
                  Enviar Formulario
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer público -->
      <footer class="mt-8 text-center">
        <p class="text-gray-500 text-sm">
          Desarrollado por Edely Tito - GSA • Distrito Scout La Paz
        </p>
        <p class="text-gray-400 text-xs mt-1">
          Si tiene problemas con el formulario, contacte a: rrhh@scoutslapaz.org
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const enviando = ref(false)

// Referencias para inputs de archivo
const certificadosFormacionInput = ref(null)
const certificadoNoViolenciaInput = ref(null)
const valoracionPerfilInput = ref(null)

// Datos del formulario
const formulario = ref({
  formularioASB: '',
  nombreCompleto: '',
  genero: '',
  fechaNacimiento: '',
  ci: '',
  anosRegistrados: '',
  grupoScout: '',
  rama: '',
  cargoDistrital: '',
  cargoGrupo1: '',
  cargoGrupo2: '',
  cargoGrupo3: '',
  programaJovenes: 'Ninguno',
  formadorLideres: 'Ninguno',
  gestionInstitucional: 'Ninguno'
})

// Archivos subidos
const archivos = ref({
  certificadosFormacion: null,
  certificadoNoViolencia: null,
  valoracionPerfil: null
})

// Computed: Progreso del formulario
const progreso = computed(() => {
  let camposCompletados = 0
  const camposTotales = 10 // Campos obligatorios principales
  
  if (formulario.value.formularioASB) camposCompletados++
  if (formulario.value.nombreCompleto) camposCompletados++
  if (formulario.value.genero) camposCompletados++
  if (formulario.value.fechaNacimiento) camposCompletados++
  if (formulario.value.ci) camposCompletados++
  if (formulario.value.anosRegistrados) camposCompletados++
  if (formulario.value.grupoScout) camposCompletados++
  if (formulario.value.rama) camposCompletados++
  if (formulario.value.cargoDistrital) camposCompletados++
  if (formulario.value.cargoGrupo1) camposCompletados++
  
  return Math.round((camposCompletados / camposTotales) * 100)
})

// Métodos
const abrirSubirArchivo = (tipoArchivo) => {
  switch(tipoArchivo) {
    case 'certificadosFormacion':
      certificadosFormacionInput.value.click()
      break
    case 'certificadoNoViolencia':
      certificadoNoViolenciaInput.value.click()
      break
    case 'valoracionPerfil':
      valoracionPerfilInput.value.click()
      break
  }
}

const manejarArchivo = (event, tipo) => {
  const file = event.target.files[0]
  if (file) {
    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.')
      event.target.value = ''
      return
    }
    
    // Validar tipo de archivo
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!tiposPermitidos.includes(file.type)) {
      alert('Formato de archivo no permitido. Solo se aceptan PDF, JPG y PNG.')
      event.target.value = ''
      return
    }
    
    archivos.value[tipo] = file
    console.log(`Archivo ${tipo} subido:`, file.name)
  }
}

const validarFormulario = () => {
  // Validar campos obligatorios
  const camposRequeridos = [
    'formularioASB',
    'nombreCompleto',
    'genero',
    'fechaNacimiento',
    'ci',
    'anosRegistrados',
    'grupoScout',
    'rama',
    'cargoDistrital',
    'cargoGrupo1'
  ]
  
  for (const campo of camposRequeridos) {
    if (!formulario.value[campo] || formulario.value[campo].toString().trim() === '') {
      alert(`Por favor complete el campo: ${campo.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
      return false
    }
  }
  
  // Validar archivo obligatorio
  if (!archivos.value.certificadoNoViolencia) {
    alert('Debe subir el Certificado de No Violencia')
    return false
  }
  
  return true
}

const enviarFormulario = async () => {
  if (!validarFormulario()) return

  enviando.value = true

  try {
    // Simular envío a la API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Formulario enviado:', {
      ...formulario.value,
      archivos: archivos.value
    })

    // Mostrar confirmación
    alert('¡Formulario enviado con éxito! Recibirá un correo de confirmación pronto.')
    
    // Limpiar formulario
    limpiarFormulario()
    
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    alert('Error al enviar el formulario. Por favor intente nuevamente.')
  } finally {
    enviando.value = false
  }
}

const limpiarFormulario = () => {
  formulario.value = {
    formularioASB: '',
    nombreCompleto: '',
    genero: '',
    fechaNacimiento: '',
    ci: '',
    anosRegistrados: '',
    grupoScout: '',
    rama: '',
    cargoDistrital: '',
    cargoGrupo1: '',
    cargoGrupo2: '',
    cargoGrupo3: '',
    programaJovenes: 'Ninguno',
    formadorLideres: 'Ninguno',
    gestionInstitucional: 'Ninguno'
  }
  
  archivos.value = {
    certificadosFormacion: null,
    certificadoNoViolencia: null,
    valoracionPerfil: null
  }
  
  // Limpiar inputs de archivo
  if (certificadosFormacionInput.value) certificadosFormacionInput.value.value = ''
  if (certificadoNoViolenciaInput.value) certificadoNoViolenciaInput.value.value = ''
  if (valoracionPerfilInput.value) valoracionPerfilInput.value.value = ''
}
</script>