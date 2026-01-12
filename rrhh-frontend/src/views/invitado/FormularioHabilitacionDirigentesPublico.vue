<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content -->
    <main class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="enviarFormulario" class="p-6 space-y-8">
          <!-- Pregunta ASB -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">
              ¿Usted llenó el formulario de habilitación de la ASB?
              <span class="text-red-500 font-semibold">*</span>
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
                  Nombre completo (NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2)
                  <span class="text-red-500 font-semibold">*</span>
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
                  Género
                  <span class="text-red-500 font-semibold">*</span>
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
                  Fecha de nacimiento
                  <span class="text-red-500 font-semibold">*</span>
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
                  Carnet de identidad
                  <span class="text-red-500 font-semibold">*</span>
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
                  Años registrados en la oficina Nacional
                  <span class="text-red-500 font-semibold">*</span>
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
                  Grupo Scout
                  <span class="text-red-500 font-semibold">*</span>
                </label>
                <select 
                  v-model="formulario.grupoScout"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione su grupo</option>
                  <option value="Amerinst 301">Amerinst 301</option>
                  <option value="Boliviano Israelita">Boliviano Israelita</option>
                  <option value="IMPEESA">IMPEESA</option>
                  <option value="Los Pinos">Los Pinos</option>
                  <option value="Los Robles">Los Robles</option>
                  <option value="Loyola San Calixto">Loyola San Calixto</option>
                  <option value="Loyola San Ignacio">Loyola San Ignacio</option>
                  <option value="Naval Crux UENHDP">Naval Crux UENHDP</option>
                  <option value="Hans Philippsberg Saint Andrews">Hans Philippsberg Saint Andrews</option>
                  <option value="Naval Almte Mihuel Grau S.">Naval Almte Mihuel Grau S.</option>
                  <option value="Equipo Distrital">Equipo Distrital</option>
                </select>
              </div>

              <!-- Rama que dirige -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rama que dirige
                  <span class="text-red-500 font-semibold">*</span>
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
                  <option value="Institucional">Institucional</option>
                  <option value="Distrital">Distrital</option>
                </select>
              </div>

              <!-- Cargo Distrital -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Distrital
                  <span class="text-red-500 font-semibold">*</span>
                </label>
                <select 
                  v-model="formulario.cargoDistrital"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione cargo distrital</option>
                  <option value="Director Distrital">Director Distrital</option>
                  <option value="Coordinador de Programa de Jóvenes">Coordinador de Programa de Jóvenes</option>
                  <option value="Comisionado de Rama Lobatos">Comisionado de Rama Lobatos</option>
                  <option value="Comisionado de Rama Exploradores">Comisionado de Rama Exploradores</option>
                  <option value="Comisionado de Rama Pioneros">Comisionado de Rama Pioneros</option>
                  <option value="Comisionado de Rama Rovers">Comisionado de Rama Rovers</option>
                  <option value="Coordinador de Recursos Adultos">Coordinador de Recursos Adultos</option>
                  <option value="Comisionado de Registro y Habilitación">Comisionado de Registro y Habilitación</option>
                  <option value="Comisionado de Seguimiento">Comisionado de Seguimiento</option>
                  <option value="Comisionado de Formación">Comisionado de Formación</option>
                  <option value="Coordinador de Gestión Institucional">Coordinador de Gestión Institucional</option>
                  <option value="Comisionado de Tienda e Inscripción">Comisionado de Tienda e Inscripción</option>
                  <option value="Comisionado de CSC">Comisionado de CSC</option>
                  <option value="Sub comisionado de CSC">Sub comisionado de CSC</option>
                  <option value="Comisionado de Crecimiento">Comisionado de Crecimiento</option>
                  <option value="Comisionado de Relaciones Interinstitucionales">Comisionado de Relaciones Interinstitucionales</option>
                  <option value="Comisionado de Amistades">Comisionado de Amistades</option>
                  <option value="Coordinador de Asuntos de Desarrollo">Coordinador de Asuntos de Desarrollo</option>
                  <option value="Comisionado de Proyectos de Desarrollo">Comisionado de Proyectos de Desarrollo</option>
                  <option value="Comisionado de Actividades de Desarrollo">Comisionado de Actividades de Desarrollo</option>
                  <option value="Coordinador de Comunicación">Coordinador de Comunicación</option>
                  <option value="Comisionado de Diseño Gráfico">Comisionado de Diseño Gráfico</option>
                  <option value="Comisionado de Redes Sociales">Comisionado de Redes Sociales</option>
                  <option value="Sub comisionado de Redes Sociales">Sub comisionado de Redes Sociales</option>
                </select>
              </div>

              <!-- Cargo Grupo 1 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Grupo 1
                  <span class="text-red-500 font-semibold">*</span>
                </label>
                <select 
                  v-model="formulario.cargoGrupo1"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione cargo de grupo 1</option>
                  <option value="Responsable de Grupo">Responsable de Grupo</option>
                  <option value="Responsable de Adultos">Responsable de Adultos</option>
                  <option value="Responsable de Programa">Responsable de Programa</option>
                  <option value="Responsable de Administración y Finanzas">Responsable de Administración y Finanzas</option>
                  <option value="Animador de la Fe">Animador de la Fe</option>
                  <option value="Presidente del Comité de Grupo">Presidente del Comité de Grupo</option>
                  <option value="Tesorero del Comité de Grupo">Tesorero del Comité de Grupo</option>
                  <option value="Secretario del Comité de Grupo">Secretario del Comité de Grupo</option>
                  <option value="Miembro del Comité de Grupo">Miembro del Comité de Grupo</option>
                  <option value="Responsable de Manada">Responsable de Manada</option>
                  <option value="Asistente de Manada">Asistente de Manada</option>
                  <option value="Responsable de Tropa">Responsable de Tropa</option>
                  <option value="Asistente de Tropa">Asistente de Tropa</option>
                  <option value="Responsable de Unidad Pionera">Responsable de Unidad Pionera</option>
                  <option value="Asistente de Unidad Pionera">Asistente de Unidad Pionera</option>
                  <option value="Responsable de Clan">Responsable de Clan</option>
                  <option value="Asistente de Clan">Asistente de Clan</option>
                  <option value="Responsable de Asuntos de desarrollo">Responsable de Asuntos de desarrollo</option>
                  <option value="Responsable de Comunicaciones">Responsable de Comunicaciones</option>
                  <option value="Colaborador de grupo">Colaborador de grupo</option>
                  <option value="Sin cargo">Sin cargo</option>
                </select>
              </div>

              <!-- Cargo Grupo 2 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Grupo 2
                </label>
                <select 
                  v-model="formulario.cargoGrupo2"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione cargo de grupo 2</option>
                  <option value="Responsable de Grupo">Responsable de Grupo</option>
                  <option value="Responsable de Adultos">Responsable de Adultos</option>
                  <option value="Responsable de Programa">Responsable de Programa</option>
                  <option value="Responsable de Administración y Finanzas">Responsable de Administración y Finanzas</option>
                  <option value="Animador de la Fe">Animador de la Fe</option>
                  <option value="Presidente del Comité de Grupo">Presidente del Comité de Grupo</option>
                  <option value="Tesorero del Comité de Grupo">Tesorero del Comité de Grupo</option>
                  <option value="Secretario del Comité de Grupo">Secretario del Comité de Grupo</option>
                  <option value="Miembro del Comité de Grupo">Miembro del Comité de Grupo</option>
                  <option value="Responsable de Manada">Responsable de Manada</option>
                  <option value="Asistente de Manada">Asistente de Manada</option>
                  <option value="Responsable de Tropa">Responsable de Tropa</option>
                  <option value="Asistente de Tropa">Asistente de Tropa</option>
                  <option value="Responsable de Unidad Pionera">Responsable de Unidad Pionera</option>
                  <option value="Asistente de Unidad Pionera">Asistente de Unidad Pionera</option>
                  <option value="Responsable de Clan">Responsable de Clan</option>
                  <option value="Asistente de Clan">Asistente de Clan</option>
                  <option value="Responsable de Asuntos de desarrollo">Responsable de Asuntos de desarrollo</option>
                  <option value="Responsable de Comunicaciones">Responsable de Comunicaciones</option>
                  <option value="Colaborador de grupo">Colaborador de grupo</option>
                  <option value="Sin cargo">Sin cargo</option>
                </select>
              </div>

              <!-- Cargo Grupo 3 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Grupo 3
                </label>
                <select 
                  v-model="formulario.cargoGrupo3"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione cargo de grupo 3</option>
                  <option value="Responsable de Grupo">Responsable de Grupo</option>
                  <option value="Responsable de Adultos">Responsable de Adultos</option>
                  <option value="Responsable de Programa">Responsable de Programa</option>
                  <option value="Responsable de Administración y Finanzas">Responsable de Administración y Finanzas</option>
                  <option value="Animador de la Fe">Animador de la Fe</option>
                  <option value="Presidente del Comité de Grupo">Presidente del Comité de Grupo</option>
                  <option value="Tesorero del Comité de Grupo">Tesorero del Comité de Grupo</option>
                  <option value="Secretario del Comité de Grupo">Secretario del Comité de Grupo</option>
                  <option value="Miembro del Comité de Grupo">Miembro del Comité de Grupo</option>
                  <option value="Responsable de Manada">Responsable de Manada</option>
                  <option value="Asistente de Manada">Asistente de Manada</option>
                  <option value="Responsable de Tropa">Responsable de Tropa</option>
                  <option value="Asistente de Tropa">Asistente de Tropa</option>
                  <option value="Responsable de Unidad Pionera">Responsable de Unidad Pionera</option>
                  <option value="Asistente de Unidad Pionera">Asistente de Unidad Pionera</option>
                  <option value="Responsable de Clan">Responsable de Clan</option>
                  <option value="Asistente de Clan">Asistente de Clan</option>
                  <option value="Responsable de Asuntos de desarrollo">Responsable de Asuntos de desarrollo</option>
                  <option value="Responsable de Comunicaciones">Responsable de Comunicaciones</option>
                  <option value="Colaborador de grupo">Colaborador de grupo</option>
                  <option value="Sin cargo">Sin cargo</option>
                </select>
              </div>
            </div>
          </div>

          <!-- FORMACIÓN SCOUT -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-6">FORMACIÓN SCOUT</h2>
            <p class="mb-4">Seleccione el nivel más alto de cada línea de formación</p>
            <div class="mt-4"></div>
            
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
                    <span class="text-sm text-gray-700 font-medium">
                      Archivos cargados
                    </span>
                  </div>
                  
                  <button 
                    type="button"
                    @click="abrirSubirArchivo('certificadosFormacion')"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Agregar archivo
                  </button>
                </div>

                <ul
                  v-if="archivos.certificadosFormacion.length"
                  class="space-y-1 text-sm text-gray-700"
                >
                  <li
                    v-for="(file, index) in archivos.certificadosFormacion"
                    :key="index"
                    class="flex items-center justify-between bg-gray-50 px-3 py-1 rounded"
                  >
                    <span class="truncate">{{ file.name }}</span>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-700 text-xs"
                      @click="archivos.certificadosFormacion.splice(index, 1)"
                    >
                      Quitar
                    </button>
                  </li>
                </ul>

                <p v-else class="text-sm text-gray-400">
                  No hay archivos cargados
                </p>

                <input 
                  type="file"
                  multiple
                  ref="certificadosFormacionInput"
                  class="hidden"
                  @change="manejarArchivos($event, 'certificadosFormacion')"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p class="text-xs text-gray-500 mt-2">Puede subir múltiples archivos en un ZIP si es necesario</p>
              </div>
            </div>

            <!-- Certificado de No Violencia -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Certificado de No Violencia
                <span class="text-red-500 font-semibold">*</span>
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
                  @change="manejarArchivos($event, 'certificadoNoViolencia')"
                  accept=".pdf,.jpg,.jpeg,.png"
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
                  @change="manejarArchivos($event, 'valoracionPerfil')"
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
import { registroService } from '../../services/api'

const enviando = ref(false)

const certificadosFormacionInput = ref(null)
const certificadoNoViolenciaInput = ref(null)
const valoracionPerfilInput = ref(null)

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

const archivos = ref({
  certificadosFormacion: [],
  certificadoNoViolencia: null,
  valoracionPerfil: null
})

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

const manejarArchivos = (event, tipo) => {
  const files = Array.from(event.target.files)

  if (tipo === 'certificadosFormacion') {
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`El archivo ${file.name} supera los 5MB`)
        return
      }
      archivos.value.certificadosFormacion.push(file)
    })
  } else {
    const file = files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert(`El archivo ${file.name} supera los 5MB`)
      return
    }

    archivos.value[tipo] = file
  }
}

const validarFormulario = () => {
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
    // 1️⃣ Crear solicitud (SIN archivos)
    const payload = {
      formulario_asb: formulario.value.formularioASB === 'SI',
      nombre_completo: formulario.value.nombreCompleto,
      genero: formulario.value.genero,
      fecha_nacimiento: formulario.value.fechaNacimiento,
      ci: formulario.value.ci,
      anios_registrados: formulario.value.anosRegistrados,
      grupo: formulario.value.grupoScout,
      rama: formulario.value.rama,
      cargo_distrital: formulario.value.cargoDistrital,
      cargo_grupo_1: formulario.value.cargoGrupo1,
      cargo_grupo_2: formulario.value.cargoGrupo2 || null,
      cargo_grupo_3: formulario.value.cargoGrupo3 || null,
      programa_jovenes: formulario.value.programaJovenes,
      formador_lideres: formulario.value.formadorLideres,
      gestion_institucional: formulario.value.gestionInstitucional
    }

    const res = await registroService.enviarSolicitudPublica(payload)
    const solicitudId = res.data.solicitud_id

    await subirArchivo(solicitudId, 'CERTIFICADO_NO_VIOLENCIA', archivos.value.certificadoNoViolencia)

    if (archivos.value.certificadosFormacion) {
      for (const file of archivos.value.certificadosFormacion) {
        await subirArchivo(solicitudId, 'CERTIFICADOS_FORMACION', file)
      }
    }

    if (archivos.value.valoracionPerfil) {
      await subirArchivo(solicitudId, 'VALORACION_PERFIL', archivos.value.valoracionPerfil)
    }

    alert('¡Formulario enviado con éxito!')
    limpiarFormulario()

  } catch (err) {
    console.error(err)
    alert('Error al enviar el formulario')
  } finally {
    enviando.value = false
  }
}

const subirArchivo = async (solicitudId, tipoDocumento, archivo) => {
  const formData = new FormData()
  formData.append('solicitud_id', solicitudId)
  formData.append('tipo', tipoDocumento)
  formData.append('archivo', archivo)

  await registroService.subirDocumento(formData)
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
    certificadosFormacion: [],
    certificadoNoViolencia: null,
    valoracionPerfil: null
  }
  
  if (certificadosFormacionInput.value) certificadosFormacionInput.value.value = ''
  if (certificadoNoViolenciaInput.value) certificadoNoViolenciaInput.value.value = ''
  if (valoracionPerfilInput.value) valoracionPerfilInput.value.value = ''
}
</script>