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

          <!-- Formulario ASB -->
          <div class="mb-8 bg-white border rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Formulario ASB
            </label>

            <div class="flex space-x-6">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  :value="true"
                  v-model="formulario.formulario_asb"
                />
                <span>Sí presentado</span>
              </label>

              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  :value="false"
                  v-model="formulario.formulario_asb"
                />
                <span>No presentado</span>
              </label>
            </div>
          </div>

          <!-- Grupo Scout -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium text-gray-700">
                Grupo Scout
              </label>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Seleccione grupo scout</label>
                <select 
                  v-model="formulario.grupo"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione grupo</option>
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
            </div>
          </div>

          <!-- Datos personales -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos personales</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1 ">Nombre completo</label>
                <input 
                  v-model="formulario.nombreCompleto"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  
                >
              </div>
              
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Género
                  </label>
                </div>
                <select 
                  v-model="formulario.genero"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 ">Fecha de nacimiento</label>
                <input 
                  v-model="formulario.fechaNacimiento"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 ">Carnet de identidad</label>
                <input 
                  v-model="formulario.ci"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  
                >
              </div>
            </div>
          </div>

          <!-- Datos Scout -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Datos Scout</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 ">Años registrados</label>
                <input 
                  v-model="formulario.anios_servicio"
                  type="number"
                  min="0"
                  max="50"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                  
                >
              </div>
              
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Rama
                  </label>
                </div>
                <select 
                  v-model="formulario.rama"
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
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 ">Cargo distrital</label>
                <select
                  v-model="formulario.cargoDistrital"
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
                  <option value="Sin cargo">Sin cargo</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1 ">Distrito</label>
                <input 
                  v-model="formulario.distrito"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
              </div>
            </div>
          </div>

          <!-- Cargos de Grupo -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Cargos de Grupo</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Cargo Grupo 1
                  </label>
                </div>
                <select
                  v-model="formulario.cargoGrupo1"
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
              
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Cargo Grupo 2
                  </label>
                </div>
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
              
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Cargo Grupo 3
                  </label>
                </div>
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

          <!-- Formación Scout -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Formación Scout</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Programa de jóvenes -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Programa de jóvenes
                  </label>
                </div>
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
                  <option value="Ninguno">Ninguno</option>
                </select>
              </div>
              
              <!-- Formador de líderes -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Formador de líderes
                  </label>
                </div>
                <select 
                  v-model="formulario.formadorLideres"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione nivel</option>
                  <option value="Cursado - Asesores personales">Cursado - Asesores personales</option>
                  <option value="Cursado y aprobado - Adjunto de formación">Cursado y aprobado - Adjunto de formación</option>
                  <option value="Cursado y aprobado - Director de formación">Cursado y aprobado - Director de formación</option>
                  <option value="Ninguno">Ninguno</option>
                </select>
              </div>
              
              <!-- Gestión Institucional -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-sm font-medium text-gray-700">
                    Gestión Institucional
                  </label>
                </div>
                <select 
                  v-model="formulario.gestionInstitucional"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                >
                  <option value="">Seleccione nivel</option>
                  <option value="Cursado - Paxtu Nivel Grupo">Cursado - Paxtu Nivel Grupo</option>
                  <option value="Aprobado - Paxtu Nivel Grupo">Aprobado - Paxtu Nivel Grupo</option>
                  <option value="Cursado - Paxtu Nivel Distrito">Cursado - Paxtu Nivel Distrito</option>
                  <option value="Aprobado - Paxtu Nivel Distrito">Aprobado - Paxtu Nivel Distrito</option>
                  <option value="Ninguno">Ninguno</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Requisitos -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Requisitos</h2>
            
            <!-- Certificados de formación scout -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Certificados de formación scout
              </label>

              <div class="border border-gray-300 rounded-lg p-4">
                <!-- Header -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>

                    <span v-if="formulario.certificadosFormacion.length">
                      {{ formulario.certificadosFormacion.length }} archivo(s) cargado(s)
                    </span>
                    <span v-else>No hay archivos cargados</span>
                  </div>

                  <button
                    @click="abrirSubirArchivo('certificadoFormacion')"
                    type="button"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Agregar archivo
                  </button>
                </div>

                <!-- LISTADO -->
                <div
                  v-if="formulario.certificadosFormacion.length"
                  class="space-y-2 mt-3"
                >
                  <div
                    v-for="(cert, index) in formulario.certificadosFormacion"
                    :key="index"
                    class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span class="text-sm text-gray-800">
                      {{ cert.nombre || 'No hay archivo cargado' }}
                    </span>

                    <div class="flex space-x-2">
                      <button
                        @click="verArchivo(cert)"
                        class="text-sm text-[#009d71] hover:text-[#007a5c] font-medium"
                      >
                        Ver
                      </button>

                      <button
                        @click="formulario.certificadosFormacion.splice(index, 1)"
                        class="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="text-sm text-gray-500 mt-2">
                  No hay archivos cargados
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
              <label class="block text-sm font-medium text-gray-700 mb-2 ">Certificado de No Violencia</label>
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

            <div class="mb-8">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">
                Documentación administrativa (Registro)
              </h2>

              <!-- Dirección -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Dirección de domicilio
                </label>
                <input
                  v-model="formulario.direccionDomicilio"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Ej: Av. Arce #123"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  v-model="formulario.telefono"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  v-model="formulario.correo"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Grupo anterior
                </label>
                <input
                  v-model="formulario.grupoAnterior"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de ingreso
                </label>
                <input
                  v-model="formulario.fechaIngreso"
                  type="date"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <p class="mt-6 mb-4 text-gray-700 font-medium">
                Documentos para el registro:
              </p>
              <!-- CI Anverso -->
              <ArchivoRegistro
                label="CI - Anverso"
                tipo="CI_ANVERSO"
                :archivo="documentosRegistro.ciAnverso"
                @subir="subirDocumentoRegistro"
              />

              <!-- CI Reverso -->
              <ArchivoRegistro
                label="CI - Reverso"
                tipo="CI_REVERSO"
                :archivo="documentosRegistro.ciReverso"
                @subir="subirDocumentoRegistro"
              />

              <!-- Croquis -->
              <ArchivoRegistro
                label="Croquis de domicilio"
                tipo="CROQUIS_DOMICILIO"
                :archivo="documentosRegistro.croquis"
                @subir="subirDocumentoRegistro"
              />

              <!-- Safe from Harm -->
              <ArchivoRegistro
                label="Safe from Harm"
                tipo="SAFE_FROM_HARM"
                :archivo="documentosRegistro.safeFromHarm"
                @subir="subirDocumentoRegistro"
              />

              <!-- Código de conducta -->
              <ArchivoRegistro
                label="Código de conducta"
                tipo="CODIGO_CONDUCTA"
                :archivo="documentosRegistro.codigoConducta"
                @subir="subirDocumentoRegistro"
              />
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
import { registroService } from '../../services/api'
import ArchivoRegistro from '../../components/registro/ArchivoRegistro.vue'

const router = useRouter()
const route = useRoute()
const nombreResponsable = ref('Responsable de Registro')

const certificadoFormacionInput = ref(null)
const certificadoNoViolenciaInput = ref(null)
const valoracionPerfilInput = ref(null)

const formulario = ref({
  grupo: '',
  nombreCompleto: '',
  genero: '',
  fechaNacimiento: '',
  ci: '',

  anios_servicio: '',
  rama: '',
  cargoDistrital: '',
  distrito: 'Distrito La Paz',

  cargoGrupo1: '',
  cargoGrupo2: null,
  cargoGrupo3: null,

  programaJovenes: '',
  formadorLideres: '',
  gestionInstitucional: '',

  certificadosFormacion: [],

  certificadoNoViolencia: {
    nombre: '',
    url: null
  },

  valoracionPerfil: {
    nombre: '',
    url: null
  },

  estado: 'Activo',
  fechaHabilitacion: null,
  fechaVencimiento: null,

  telefono: '',
  correo: '',
  grupoAnterior: '',
  fechaIngreso: '',
  direccionDomicilio: '',
  formulario_asb: false,
})

const mapearDirigenteAFormulario = (d, documentos = []) => {
  const certNoViolencia = documentos.find(
    doc => doc.tipo_documento === 'CERTIFICADO_NO_VIOLENCIA'
  )

  const certificadosFormacion = documentos
    .filter(doc => doc.tipo_documento === 'CERTIFICADO_FORMACION')
    .map(doc => ({ 
      id: doc.id,
      nombre: doc.nombre_archivo,
      url: `${import.meta.env.VITE_API_BASE_URL}/documentos/${doc.id}/descargar`
    }))

  const valoracionPerfil = documentos.find(
    doc => doc.tipo_documento === 'VALORACION_PERFIL'
  )

  return {
    grupo: d.grupo ?? '',
    nombreCompleto: d.nombre_completo ?? '',
    genero: d.genero ?? '',
    fechaNacimiento: d.fecha_nacimiento
      ? d.fecha_nacimiento.substring(0, 10)
      : '',
    ci: d.ci ?? '',

    anios_servicio: d.anios_servicio ?? '',
    rama: d.rama ?? '',
    cargoDistrital: d.cargo_distrital ?? '',
    distrito: d.distrito ?? '',

    cargoGrupo1: d.cargo_grupo_1 ?? '',
    cargoGrupo2: d.cargo_grupo_2 ?? null,
    cargoGrupo3: d.cargo_grupo_3 ?? null,

    programaJovenes: d.programa_jovenes ?? '',
    formadorLideres: d.formador_lideres ?? '',
    gestionInstitucional: d.gestion_institucional ?? '',

    certificadosFormacion,

    certificadoNoViolencia: certNoViolencia
      ? {
          nombre: certNoViolencia.nombre_archivo,
          url: `${import.meta.env.VITE_API_BASE_URL}/documentos/${certNoViolencia.id}/descargar`
        }
      : { nombre: '', url: null },

    valoracionPerfil: valoracionPerfil
      ? { 
          nombre: valoracionPerfil.nombre_archivo, 
          url: `${import.meta.env.VITE_API_BASE_URL}/documentos/${valoracionPerfil.id}/descargar`
        }
      : { nombre: '', url: null },

    estado: d.estado ?? 'Activo',

    telefono: d.telefono ?? '',
    correo: d.correo ?? '',
    grupoAnterior: d.grupo_anterior ?? '',
    fechaIngreso: d.fecha_ingreso
      ? d.fecha_ingreso.substring(0, 10)
      : '',
    direccionDomicilio: d.direccion_domicilio ?? '',
    formulario_asb: d.formulario_asb ?? false,
  }
}

const subirDocumentoRegistro = async ({ tipo, archivo }) => {
  const fd = new FormData()
  fd.append('dirigente_id', route.params.id)
  fd.append('tipo_documento', tipo)
  fd.append('archivo', archivo)

  await registroService.subirDocumento(fd)

  const { data } = await registroService.getDirigenteDetalle(route.params.id)
  documentosRegistro.value = mapearDocumentosRegistro(data.documentos)

  alert('Archivo subido correctamente')
}

const documentosRegistro = ref({
  ciAnverso: null,
  ciReverso: null,
  croquis: null,
  safeFromHarm: null,
  codigoConducta: null
})

onMounted(async () => {
  const id = route.params.id
  const { data } = await registroService.getDirigenteDetalle(id)

  const mapeado = mapearDirigenteAFormulario(
    data.dirigente,
    data.documentos
  )

  documentosRegistro.value = mapearDocumentosRegistro(data.documentos)

  formulario.value = {
    ...formulario.value,
    ...mapeado,
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

const volverADetalle = () => {
  const dirigenteId = route.params.id
  router.push(`/registro/dirigente/${dirigenteId}`)
}

const mapearDocumentosRegistro = (documentos = []) => {
  const porTipo = (tipo) =>
    documentos.find(d => d.tipo_documento === tipo) || null

  return {
    ciAnverso: porTipo('CI_ANVERSO'),
    ciReverso: porTipo('CI_REVERSO'),
    croquis: porTipo('CROQUIS_DOMICILIO'),
    safeFromHarm: porTipo('SAFE_FROM_HARM'),
    codigoConducta: porTipo('CODIGO_CONDUCTA')
  }
}

const abrirSubirArchivo = (tipoArchivo) => {
  switch (tipoArchivo) {
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
    if (archivo.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 5MB.')
      return
    }
    
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!tiposPermitidos.includes(archivo.type)) {
      alert('Formato de archivo no permitido. Solo se aceptan PDF, JPG y PNG.')
      return
    }
    
    switch(tipoArchivo) {
      case 'certificadoFormacion':
        formulario.value.certificadosFormacion.push({
          nombre: archivo.name,
          url: URL.createObjectURL(archivo),
          archivo
        })
        break
      case 'certificadoNoViolencia':
        formulario.value.certificadoNoViolencia = {
          nombre: archivo.name,
          url: URL.createObjectURL(archivo),
          archivo
        }
        break
      case 'valoracionPerfil':
        formulario.value.valoracionPerfil = {
          nombre: archivo.name,
          url: URL.createObjectURL(archivo),
          archivo
        }
        break
    }
    
    alert(`Archivo "${archivo.name}" cargado exitosamente.`)
  }
}

const verArchivo = (archivo) => {
  if (archivo && archivo.url) {
    window.open(archivo.url, '_blank')
  } else {
    alert('Archivo no disponible')
  }
}

const guardarCambios = async () => {

  if (!confirm('¿Está seguro de guardar los cambios realizados?')) return

  try {
    const payload = {}

    if (formulario.value.nombreCompleto)
      payload.nombre_completo = formulario.value.nombreCompleto
    if (formulario.value.ci)
      payload.ci = formulario.value.ci
    if (formulario.value.fechaNacimiento)
      payload.fecha_nacimiento = formulario.value.fechaNacimiento
    if (formulario.value.genero)
      payload.genero = formulario.value.genero
    if (formulario.value.direccionDomicilio)
      payload.direccion_domicilio = formulario.value.direccionDomicilio
    if (formulario.value.distrito)
      payload.distrito = formulario.value.distrito
    if (formulario.value.grupo)
      payload.grupo = formulario.value.grupo
    if (formulario.value.anios_servicio)
      payload.anios_servicio = formulario.value.anios_servicio
    if (formulario.value.rama)
      payload.rama = formulario.value.rama
    if (formulario.value.cargoDistrital)
      payload.cargo_distrital = formulario.value.cargoDistrital
    if (formulario.value.cargoGrupo1)
      payload.cargo_grupo_1 = formulario.value.cargoGrupo1
    if (formulario.value.cargoGrupo2)
      payload.cargo_grupo_2 = formulario.value.cargoGrupo2
    if (formulario.value.cargoGrupo3)
      payload.cargo_grupo_3 = formulario.value.cargoGrupo3
    if (formulario.value.programaJovenes)
      payload.programa_jovenes = formulario.value.programaJovenes
    if (formulario.value.formadorLideres)
      payload.formador_lideres = formulario.value.formadorLideres
    if (formulario.value.gestionInstitucional) 
      payload.gestion_institucional = formulario.value.gestionInstitucional
    if (formulario.value.estado)
      payload.estado = formulario.value.estado
    if (formulario.value.telefono)
      payload.telefono = formulario.value.telefono
    if (formulario.value.correo)
      payload.correo = formulario.value.correo
    if (formulario.value.grupoAnterior)
      payload.grupo_anterior = formulario.value.grupoAnterior
    if (formulario.value.fechaIngreso)
      payload.fecha_ingreso = formulario.value.fechaIngreso
    if (formulario.value.formulario_asb !== undefined)
      payload.formulario_asb = formulario.value.formulario_asb

    await registroService.actualizarDirigente(
      route.params.id,
      payload
    )

    await subirDocumentosNuevos()

    const { data } = await registroService.getDirigenteDetalle(route.params.id)
    documentosRegistro.value = mapearDocumentosRegistro(data.documentos)
    alert('Cambios guardados correctamente')
    volverADetalle()
  } catch (error) {
    console.error(error)
    alert('Error al guardar los cambios')
  }
}

const subirDocumentosNuevos = async () => {
  // Certificados de formación
  for (const cert of formulario.value.certificadosFormacion) {
    if (cert.archivo) {
      const fd = new FormData()
      fd.append('dirigente_id', route.params.id)
      fd.append('tipo_documento', 'CERTIFICADO_FORMACION')
      fd.append('archivo', cert.archivo)

      await registroService.subirDocumento(fd)
    }
  }

  // Certificado de No Violencia
  if (formulario.value.certificadoNoViolencia.archivo) {
    const fd = new FormData()
    fd.append('dirigente_id', route.params.id)
    fd.append('tipo_documento', 'CERTIFICADO_NO_VIOLENCIA')
    fd.append('archivo', formulario.value.certificadoNoViolencia.archivo)

    await registroService.subirDocumento(fd)
  }

  // Valoración de perfil
  if (formulario.value.valoracionPerfil.archivo) {
    const fd = new FormData()
    fd.append('dirigente_id', route.params.id)
    fd.append('tipo_documento', 'VALORACION_PERFIL')
    fd.append('archivo', formulario.value.valoracionPerfil.archivo)

    await registroService.subirDocumento(fd)
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
