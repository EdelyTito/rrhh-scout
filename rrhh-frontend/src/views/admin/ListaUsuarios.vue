<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-[#009d71] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
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

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button 
            @click="navegarA('admin')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'admin' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Inicio
          </button>
          
          <!-- Dropdown Comisiones -->
          <div class="relative">
            <button 
              @click="toggleComisiones"
              :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200 flex items-center', 
                      comisionesAbierto 
                      ? 'border-[#009d71] text-[#009d71]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
              Comisiones
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-if="comisionesAbierto" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button 
                  @click="navegarAComision('seguimiento')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Seguimiento</div>
                </button>
                
                <button 
                  @click="navegarAComision('formacion')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Formación</div>
                </button>
                
                <button 
                  @click="navegarAComision('registro')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div class="font-medium">Registro y Habilitación</div>
                </button>
              </div>
            </div>
          </div>

          <button 
            @click="navegarA('admin/lista-usuarios')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'admin/lista-usuarios' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Lista de usuarios
          </button>
          
          <button 
            @click="navegarA('admin/logs')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200', 
                    rutaActiva === 'admin/logs' 
                    ? 'border-[#009d71] text-[#009d71]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
          >
            Logs del sistema
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header de la página -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Lista de Usuarios</h1>
            <p class="text-gray-600">Gestión de usuarios del sistema</p>
          </div>
          <button 
            @click="abrirModalCrear"
            class="bg-[#009d71] text-white px-4 py-2 rounded-lg hover:bg-[#008060] transition duration-200 font-semibold"
          >
            + Nuevo Usuario
          </button>
        </div>

        <!-- Filtros y Búsqueda -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                v-model="filtroBusqueda"
                type="text"
                placeholder="Buscar por nombre, correo o cargo..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
            </div>
            <div class="sm:w-48">
              <select 
                v-model="filtroRol"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="responsable_registro">Responsable Registro</option>
                <option value="responsable_formation">Responsable Formación</option>
                <option value="responsable_seguimiento">Responsable Seguimiento</option>
                <option value="subcomisionado_registro">Subcomisionado Registro</option>
                <option value="subcomisionado_formation">Subcomisionado Formación</option>
                <option value="subcomisionado_seguimiento">Subcomisionado Seguimiento</option>
                <option value="invitado">Invitado</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#009d71]"></div>
          <p class="text-gray-600 mt-2">Cargando usuarios...</p>
        </div>

        <!-- Tabla de Usuarios -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="usuario in usuariosFiltrados" 
                  :key="usuario.id"
                  class="hover:bg-gray-50 transition duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ usuario.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ usuario.nombre }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ usuario.correo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ usuario.cargo || 'Sin cargo asignado' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="getBadgeClasses(usuario.rol_nombre)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ formatRolNombre(usuario.rol_nombre) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="editarUsuario(usuario)"
                      class="text-blue-600 hover:text-blue-900 mr-3 transition duration-200"
                    >
                      Editar
                    </button>
                    <button 
                      v-if="usuario.rol_nombre !== 'admin'"
                      @click="eliminarUsuario(usuario)"
                      class="text-red-600 hover:text-red-900 transition duration-200"
                    >
                      Eliminar
                    </button>
                    <span v-else class="text-gray-400 text-xs">No eliminable</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="usuariosFiltrados.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
            <p class="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
          </div>
        </div>

        <!-- Contador -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ usuariosFiltrados.length }}</span> de 
            <span class="font-medium">{{ usuarios.length }}</span> usuarios
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          Desarrollado por Edely Tito - GSA
        </p>
      </div>
    </footer>

    <!-- Modal Crear Usuario -->
    <div v-if="mostrarModalCrear" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <!-- Header del Modal -->
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium text-gray-900">Crear Nuevo Usuario</h3>
                <button 
                    @click="cerrarModal"
                    class="text-gray-400 hover:text-gray-600 transition duration-200"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="crearUsuario" class="space-y-4">
                <!-- Nombre -->
                <div>
                    <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                    </label>
                    <input
                        id="nombre"
                        v-model="nuevoUsuario.nombre"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                        placeholder="Ej: Juan Pérez García"
                    >
                </div>

                <!-- Correo -->
                <div>
                    <label for="correo" class="block text-sm font-medium text-gray-700 mb-1">
                        Correo Electrónico *
                    </label>
                    <input
                        id="correo"
                        v-model="nuevoUsuario.correo"
                        type="email"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                        placeholder="Ej: usuario@scout.com"
                    >
                </div>

                <!-- Contraseña -->
                <div>
                    <label for="contrasena" class="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña *
                    </label>
                    <input
                        id="contrasena"
                        v-model="nuevoUsuario.contrasena"
                        type="password"
                        required
                        minlength="6"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                        placeholder="Mínimo 6 caracteres"
                    >
                    <p class="text-xs text-gray-500 mt-1">La contraseña debe tener al menos 6 caracteres</p>
                </div>

                <!-- Cargo -->
                <div>
                    <label for="cargo" class="block text-sm font-medium text-gray-700 mb-1">
                        Cargo
                    </label>
                    <input
                        id="cargo"
                        v-model="nuevoUsuario.cargo"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                        placeholder="Ej: Comisionado de Formación"
                    >
                </div>

                <!-- Rol -->
                <div>
                    <label for="rol_id" class="block text-sm font-medium text-gray-700 mb-1">
                        Rol *
                    </label>
                    <select
                        id="rol_id"
                        v-model="nuevoUsuario.rol_id"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Responsable Registro</option>
                        <option value="3">Responsable Formación</option>
                        <option value="4">Responsable Seguimiento</option>
                        <option value="5">Subcomisionado Registro</option>
                        <option value="6">Subcomisionado Formación</option>
                        <option value="7">Subcomisionado Seguimiento</option>
                        <option value="8">Invitado</option>
                    </select>
                </div>

                <!-- Mensajes de Error -->
                <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {{ errorMessage }}
                </div>

                <!-- Mensaje de Éxito -->
                <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                    {{ successMessage }}
                </div>

                <!-- Botones -->
                <div class="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        @click="cerrarModal"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009d71] transition duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        :disabled="creandoUsuario"
                        class="px-4 py-2 text-sm font-medium text-white bg-[#009d71] border border-transparent rounded-md hover:bg-[#008060] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009d71] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        <span v-if="creandoUsuario">
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creando...
                        </span>
                        <span v-else>
                            Crear Usuario
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Modal Editar Usuario -->
    <div v-if="mostrarModalEditar" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <!-- Header del Modal -->
        <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Editar Usuario</h3>
        <button 
            @click="cerrarModalEditar"
            class="text-gray-400 hover:text-gray-600 transition duration-200"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </button>
        </div>

        <!-- Formulario de Edición -->
        <form @submit.prevent="actualizarUsuario" class="space-y-4">
        <!-- ID (solo lectura) -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
            ID Usuario
            </label>
            <input
            :value="usuarioEditando.id"
            type="text"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            >
        </div>

        <!-- Nombre -->
        <div>
            <label for="editNombre" class="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo *
            </label>
            <input
            id="editNombre"
            v-model="usuarioEditando.nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
            placeholder="Ej: Juan Pérez García"
            >
        </div>

        <!-- Correo -->
        <div>
            <label for="editCorreo" class="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico *
            </label>
            <input
            id="editCorreo"
            v-model="usuarioEditando.correo"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
            placeholder="Ej: usuario@scout.com"
            >
        </div>

        <!-- Cargo -->
        <div>
            <label for="editCargo" class="block text-sm font-medium text-gray-700 mb-1">
            Cargo
            </label>
            <input
            id="editCargo"
            v-model="usuarioEditando.cargo"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
            placeholder="Ej: Comisionado de Formación"
            >
        </div>

        <!-- Rol -->
        <div>
            <label for="editRol_id" class="block text-sm font-medium text-gray-700 mb-1">
            Rol *
            </label>
            <select
            id="editRol_id"
            v-model="usuarioEditando.rol_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent"
            >
            <option value="">Selecciona un rol</option>
            <option value="1">Administrador</option>
            <option value="2">Responsable Registro</option>
            <option value="3">Responsable Formación</option>
            <option value="4">Responsable Seguimiento</option>
            <option value="5">Subcomisionado Registro</option>
            <option value="6">Subcomisionado Formación</option>
            <option value="7">Subcomisionado Seguimiento</option>
            <option value="8">Invitado</option>
            </select>
        </div>

        <!-- Resetear Contraseña -->
        <div class="border-t pt-4 mt-4">
            <div class="flex items-center justify-between">
            <div>
                <h4 class="text-sm font-medium text-gray-700">Contraseña</h4>
                <p class="text-xs text-gray-500">Resetear la contraseña del usuario</p>
            </div>
            <button
                type="button"
                @click="mostrarResetPassword = !mostrarResetPassword"
                class="text-sm text-[#009d71] hover:text-[#008060] font-medium"
            >
                {{ mostrarResetPassword ? 'Cancelar' : 'Resetear' }}
            </button>
            </div>

            <div v-if="mostrarResetPassword" class="mt-3 space-y-3">
            <div>
                <label for="nuevaContrasena" class="block text-xs font-medium text-gray-700 mb-1">
                Nueva Contraseña *
                </label>
                <input
                id="nuevaContrasena"
                v-model="nuevaContrasena"
                type="password"
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent text-sm"
                placeholder="Mínimo 6 caracteres"
                >
            </div>
            <div>
                <label for="confirmarContrasena" class="block text-xs font-medium text-gray-700 mb-1">
                Confirmar Contraseña *
                </label>
                <input
                id="confirmarContrasena"
                v-model="confirmarContrasena"
                type="password"
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009d71] focus:border-transparent text-sm"
                placeholder="Repite la contraseña"
                >
            </div>
            <div v-if="nuevaContrasena && confirmarContrasena && nuevaContrasena !== confirmarContrasena" 
                class="text-xs text-red-600 bg-red-50 p-2 rounded">
                Las contraseñas no coinciden
            </div>
            </div>
        </div>

        <!-- Mensajes de Error -->
        <div v-if="errorMessageEditar" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {{ errorMessageEditar }}
        </div>

        <!-- Mensaje de Éxito -->
        <div v-if="successMessageEditar" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
            {{ successMessageEditar }}
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-4">
            <button
            type="button"
            @click="cerrarModalEditar"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009d71] transition duration-200"
            >
            Cancelar
            </button>
            <button
            type="submit"
            :disabled="editandoUsuario"
            class="px-4 py-2 text-sm font-medium text-white bg-[#009d71] border border-transparent rounded-md hover:bg-[#008060] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#009d71] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
            <span v-if="editandoUsuario">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
            </span>
            <span v-else>
                Guardar Cambios
            </span>
            </button>
        </div>
        </form>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('admin/lista-usuarios')
const comisionesAbierto = ref(false)
const loading = ref(false)
const mostrarModalCrear = ref(false)
const creandoUsuario = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const filtroBusqueda = ref('')
const filtroRol = ref('')
const mostrarModalEditar = ref(false)
const editandoUsuario = ref(false)
const errorMessageEditar = ref('')
const successMessageEditar = ref('')
const mostrarResetPassword = ref(false)
const nuevaContrasena = ref('')
const confirmarContrasena = ref('')


const usuarioEditando = ref({
  id: '',
  nombre: '',
  correo: '',
  cargo: '',
  rol_id: ''
})

// Mapeo de roles nombre -> id para la edición
const mapeoRoles = {
  'admin': '1',
  'responsable_registro': '2',
  'responsable_formation': '3',
  'responsable_seguimiento': '4',
  'subcomisionado_registro': '5',
  'subcomisionado_formation': '6',
  'subcomisionado_seguimiento': '7',
  'invitado': '8'
}

const editarUsuario = (usuario) => {
  // Preparar datos para edición
  usuarioEditando.value = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    cargo: usuario.cargo || '',
    rol_id: mapeoRoles[usuario.rol_nombre] || ''
  }
  
  // Resetear estados
  mostrarResetPassword.value = false
  nuevaContrasena.value = ''
  confirmarContrasena.value = ''
  errorMessageEditar.value = ''
  successMessageEditar.value = ''
  
  mostrarModalEditar.value = true
}

const cerrarModalEditar = () => {
  mostrarModalEditar.value = false
  usuarioEditando.value = {
    id: '',
    nombre: '',
    correo: '',
    cargo: '',
    rol_id: ''
  }
  mostrarResetPassword.value = false
  nuevaContrasena.value = ''
  confirmarContrasena.value = ''
  errorMessageEditar.value = ''
  successMessageEditar.value = ''
}

const actualizarUsuario = async () => {
  // Validaciones básicas
  if (!usuarioEditando.value.nombre || !usuarioEditando.value.correo || !usuarioEditando.value.rol_id) {
    errorMessageEditar.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  // Validar contraseña si se está reseteando
  if (mostrarResetPassword.value) {
    if (!nuevaContrasena.value || !confirmarContrasena.value) {
      errorMessageEditar.value = 'Ambos campos de contraseña son obligatorios para resetear'
      return
    }
    if (nuevaContrasena.value.length < 6) {
      errorMessageEditar.value = 'La contraseña debe tener al menos 6 caracteres'
      return
    }
    if (nuevaContrasena.value !== confirmarContrasena.value) {
      errorMessageEditar.value = 'Las contraseñas no coinciden'
      return
    }
  }

  editandoUsuario.value = true
  errorMessageEditar.value = ''
  successMessageEditar.value = ''

  try {
    // Simulación de actualización - después reemplazar con API real
    await simularActualizacionUsuario()
    
    successMessageEditar.value = 'Usuario actualizado exitosamente'
    
    // Esperar un momento antes de cerrar el modal
    setTimeout(() => {
      cerrarModalEditar()
      // Recargar la lista de usuarios
      cargarUsuarios()
    }, 1500)
    
  } catch (error) {
    errorMessageEditar.value = error.message || 'Error al actualizar el usuario'
  } finally {
    editandoUsuario.value = false
  }
}

const simularActualizacionUsuario = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular validación de correo único (excluyendo el usuario actual)
      const correoExistente = usuarios.value.find(u => 
        u.correo === usuarioEditando.value.correo && u.id !== usuarioEditando.value.id
      )
      if (correoExistente) {
        reject(new Error('El correo electrónico ya está registrado por otro usuario'))
        return
      }

      // Actualizar usuario en la lista
      const index = usuarios.value.findIndex(u => u.id === usuarioEditando.value.id)
      if (index !== -1) {
        const rolNombre = obtenerNombreRol(usuarioEditando.value.rol_id)
        
        usuarios.value[index] = {
          ...usuarios.value[index],
          nombre: usuarioEditando.value.nombre,
          correo: usuarioEditando.value.correo,
          cargo: usuarioEditando.value.cargo,
          rol_nombre: rolNombre
        }
        
        // Simular que la contraseña fue actualizada si se solicitó
        if (mostrarResetPassword.value) {
          console.log(`Contraseña actualizada para usuario ${usuarioEditando.value.id}`)
        }
        
        resolve(usuarios.value[index])
      } else {
        reject(new Error('Usuario no encontrado'))
      }
    }, 1000)
  })
}


const nuevoUsuario = ref({
  nombre: '',
  correo: '',
  contrasena: '',
  cargo: '',
  rol_id: ''
})

// Agrega estas funciones
const abrirModalCrear = () => {
  mostrarModalCrear.value = true
  resetearFormulario()
}

const cerrarModal = () => {
  mostrarModalCrear.value = false
  resetearFormulario()
}

const resetearFormulario = () => {
  nuevoUsuario.value = {
    nombre: '',
    correo: '',
    contrasena: '',
    cargo: '',
    rol_id: ''
  }
  errorMessage.value = ''
  successMessage.value = ''
}

const crearUsuario = async () => {
  // Validaciones básicas
  if (!nuevoUsuario.value.nombre || !nuevoUsuario.value.correo || !nuevoUsuario.value.contrasena || !nuevoUsuario.value.rol_id) {
    errorMessage.value = 'Por favor completa todos los campos obligatorios'
    return
  }

  if (nuevoUsuario.value.contrasena.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  creandoUsuario.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Simulación de creación - después reemplazar con API real
    await simularCreacionUsuario()
    
    successMessage.value = 'Usuario creado exitosamente'
    
    // Esperar un momento antes de cerrar el modal
    setTimeout(() => {
      cerrarModal()
      // Recargar la lista de usuarios
      cargarUsuarios()
    }, 1500)
    
  } catch (error) {
    errorMessage.value = error.message || 'Error al crear el usuario'
  } finally {
    creandoUsuario.value = false
  }
}

const simularCreacionUsuario = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular validación de correo único
      const correoExistente = usuarios.value.find(u => u.correo === nuevoUsuario.value.correo)
      if (correoExistente) {
        reject(new Error('El correo electrónico ya está registrado'))
        return
      }

      // Crear nuevo usuario
      const nuevoId = Math.max(...usuarios.value.map(u => u.id)) + 1
      const rolNombre = obtenerNombreRol(nuevoUsuario.value.rol_id)
      
      const usuarioCreado = {
        id: nuevoId,
        nombre: nuevoUsuario.value.nombre,
        correo: nuevoUsuario.value.correo,
        cargo: nuevoUsuario.value.cargo,
        rol_nombre: rolNombre
      }

      usuarios.value.unshift(usuarioCreado)
      resolve(usuarioCreado)
    }, 1000)
  })
}

const obtenerNombreRol = (rolId) => {
  const roles = {
    '1': 'admin',
    '2': 'responsable_registro',
    '3': 'responsable_formation',
    '4': 'responsable_seguimiento',
    '5': 'subcomisionado_registro',
    '6': 'subcomisionado_formation',
    '7': 'subcomisionado_seguimiento',
    '8': 'invitado'
  }
  return roles[rolId] || 'invitado'
}

const cargarUsuarios = () => {
  // Esta función simula cargar usuarios - después se reemplazará con API real
  console.log('Recargando lista de usuarios...')
}



// Datos de ejemplo basados en tu estructura
const usuarios = ref([
  {
    id: 1,
    nombre: 'Administrador Principal',
    correo: 'admin@scout.com',
    cargo: 'Administrador del Sistema',
    rol_nombre: 'admin'
  },
  {
    id: 2,
    nombre: 'María García López',
    correo: 'registro@scout.com', 
    cargo: 'Comisionado de Registro y Habilitación',
    rol_nombre: 'responsable_registro'
  },
  {
    id: 3,
    nombre: 'Carlos Rodríguez',
    correo: 'formacion@scout.com',
    cargo: 'Comisionado de Formación',
    rol_nombre: 'responsable_formation'
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    correo: 'seguimiento@scout.com',
    cargo: 'Comisionado de Seguimiento',
    rol_nombre: 'responsable_seguimiento'
  },
  {
    id: 5,
    nombre: 'Pedro Sánchez',
    correo: 'subregistro@scout.com',
    cargo: 'Subcomisionado de Registro',
    rol_nombre: 'subcomisionado_registro'
  }
])

// Computed para usuarios filtrados
const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(usuario => {
    const coincideBusqueda = !filtroBusqueda.value || 
      usuario.nombre.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(filtroBusqueda.value.toLowerCase()) ||
      (usuario.cargo && usuario.cargo.toLowerCase().includes(filtroBusqueda.value.toLowerCase()))
    
    const coincideRol = !filtroRol.value || usuario.rol_nombre === filtroRol.value
    
    return coincideBusqueda && coincideRol
  })
})

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'
})

// Función para formatear nombres de rol
const formatRolNombre = (rol) => {
  const nombres = {
    'admin': 'Administrador',
    'responsable_registro': 'Responsable Registro',
    'responsable_formation': 'Responsable Formación',
    'responsable_seguimiento': 'Responsable Seguimiento',
    'subcomisionado_registro': 'Subcomisionado Registro',
    'subcomisionado_formation': 'Subcomisionado Formación',
    'subcomisionado_seguimiento': 'Subcomisionado Seguimiento',
    'invitado': 'Invitado'
  }
  return nombres[rol] || rol
}

// Función para colores de badges según el rol
const getBadgeClasses = (rol) => {
  const clases = {
    'admin': 'bg-red-100 text-red-800',
    'responsable_registro': 'bg-blue-100 text-blue-800',
    'responsable_formation': 'bg-green-100 text-green-800', 
    'responsable_seguimiento': 'bg-purple-100 text-purple-800',
    'subcomisionado_registro': 'bg-blue-50 text-blue-700',
    'subcomisionado_formation': 'bg-green-50 text-green-700',
    'subcomisionado_seguimiento': 'bg-purple-50 text-purple-700',
    'invitado': 'bg-gray-100 text-gray-800'
  }
  return clases[rol] || 'bg-gray-100 text-gray-800'
}

const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false
  
  // Manejar todas las rutas correctamente
  if (destino === 'admin') {
    router.push('/admin')
  } else if (destino === 'admin/lista-usuarios') {
    // Ya estamos aquí, no hacer nada
    return
  } else if (destino === 'admin/logs') {
    router.push('/admin/logs')
  }
  // Para otras rutas que no existen aún, mantenemos en la misma página
}

const navegarAComision = (comision) => {
  comisionesAbierto.value = false
  rutaActiva.value = comision
  router.push(`/${comision}`)
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/')
}

const eliminarUsuario = async (usuario) => {
  if (usuario.rol_nombre === 'admin') {
    alert('No se puede eliminar un usuario administrador')
    return
  }

  if (!confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?\nEsta acción no se puede deshacer.`)) {
    return
  }

  try {
    // Simulación de eliminación - después reemplazar con API real
    await simularEliminacionUsuario(usuario.id)
    
    // Recargar lista
    cargarUsuarios()
    
    alert(`Usuario ${usuario.nombre} eliminado exitosamente`)
    
  } catch (error) {
    alert(`Error al eliminar usuario: ${error.message}`)
  }
}

const simularEliminacionUsuario = (usuarioId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = usuarios.value.findIndex(u => u.id === usuarioId)
      if (index !== -1) {
        usuarios.value.splice(index, 1)
        resolve()
      } else {
        reject(new Error('Usuario no encontrado'))
      }
    }, 800)
  })
}

// Manejar click fuera del dropdown
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    comisionesAbierto.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
</script>