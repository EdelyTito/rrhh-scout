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
          <!--
          <div class="relative">
            <button 
              @click="toggleComisiones"
              :class="comisionesButtonClass()"
            >
              Comisiones
              <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <!--
            <div v-if="comisionesAbierto" class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button 
                  @click="() => navegarAComision('seguimiento')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Seguimiento</div>
                  <div class="text-xs text-gray-500 mt-1">Gestión y monitoreo de actividades</div>
                </button>
                
                <button 
                  @click="() => navegarAComision('formacion')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition duration-200"
                >
                  <div class="font-medium">Formación</div>
                  <div class="text-xs text-gray-500 mt-1">Control de cursos y capacitaciones</div>
                </button>
                
                <button 
                  @click="() => navegarAComision('registro')"
                  class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <div class="font-medium">Registro y Habilitación</div>
                  <div class="text-xs text-gray-500 mt-1">Registro y habilitación de personal</div>
                </button>
              </div>
            </div>
          </div>
          -->

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
                <option value="responsable_formacion">Responsable Formación</option>
                <option value="responsable_seguimiento">Responsable Seguimiento</option>
                <option value="subcomisionado_registro">Subcomisionado Registro</option>
                <option value="subcomisionado_formacion">Subcomisionado Formación</option>
                <option value="subcomisionado_seguimiento">Subcomisionado Seguimiento</option>
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
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="usuario in usuariosPaginados">
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
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="usuario.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <!-- Editar -->
                    <button
                      @click="editarUsuario(usuario)"
                      class="text-blue-600 hover:text-blue-900 transition duration-200"
                    >
                      Editar
                    </button>

                    <!-- Admin -->
                    <span
                      v-if="usuario.rol_nombre === 'admin'"
                      class="text-gray-400 text-xs"
                    >
                      No desactivable
                    </span>

                    <!-- Activo -->
                    <button
                      v-else-if="usuario.activo"
                      @click="desactivarUsuario(usuario)"
                      class="text-red-600 hover:text-red-900 transition duration-200"
                    >
                      Desactivar
                    </button>

                    <!-- Inactivo -->
                    <button
                      v-else
                      @click="reactivarUsuario(usuario)"
                      class="text-green-600 hover:text-green-800 transition duration-200"
                    >
                      Reactivar
                    </button>

                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Página {{ paginaActual }} de {{ totalPaginas }}
            </p>

            <div class="flex space-x-2">
              <button
                @click="paginaActual--"
                :disabled="paginaActual === 1"
                class="px-3 py-1 rounded border text-sm
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-gray-100"
              >
                Anterior
              </button>

              <button
                v-for="p in totalPaginas"
                :key="p"
                @click="paginaActual = p"
                :class="[
                  'px-3 py-1 rounded border text-sm',
                  p === paginaActual
                    ? 'bg-[#009d71] text-white'
                    : 'hover:bg-gray-100'
                ]"
              >
                {{ p }}
              </button>

              <button
                @click="paginaActual++"
                :disabled="paginaActual === totalPaginas"
                class="px-3 py-1 rounded border text-sm
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
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

                <!-- Contraseña (generada automáticamente) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>

                  <input
                    type="text"
                    value="Se generará automáticamente"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-md
                          bg-gray-100 text-gray-500 cursor-not-allowed"
                  >

                  <p class="text-xs text-gray-500 mt-1">
                    La contraseña será generada automáticamente y enviada al correo del usuario.
                  </p>
                </div>

                <!-- Cargo -->
                <div>
                    <label for="cargo" class="block text-sm font-medium text-gray-700 mb-1">
                        Cargo
                    </label>
                    <select v-model="nuevoUsuario.cargo" required class="w-full px-3 py-2 border rounded-md">
                      <option value="">Selecciona un cargo</option>
                      <option>Coordinador de Recursos Adultos</option>
                      <option>Comisionado de Registro y Habilitación</option>
                      <option>Comisionado de Formación</option>
                      <option>Comisionado de Seguimiento</option>
                      <option>Subcomisionado de Registro y Habilitación</option>
                      <option>Subcomisionado de Formación</option>
                      <option>Subcomisionado de Seguimiento</option>
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
            <select
              v-model="usuarioEditando.cargo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-[#009d71]
                    focus:border-transparent bg-white"
              required
            >
              <option>Coordinador de Recursos Adultos</option>
              <option>Comisionado de Registro y Habilitación</option>
              <option>Comisionado de Formación</option>
              <option>Comisionado de Seguimiento</option>
              <option>Subcomisionado de Registro y Habilitación</option>
              <option>Subcomisionado de Formación</option>
              <option>Subcomisionado de Seguimiento</option>
            </select>
            <div class="text-sm text-gray-600">
              Rol asignado automáticamente:
              <strong class="text-[#009d71]">
                {{ rolAutomatico }}
              </strong>
            </div>

        </div>

        <!-- Resetear Contraseña -->
        <div class="border-t pt-4 mt-4">
          <h4 class="text-sm font-medium text-gray-700">Contraseña</h4>
          <p class="text-xs text-gray-500 mb-2">
            Se enviará un correo al usuario para que establezca una nueva contraseña.
          </p>

          <button
            type="button"
            @click="resetearContrasena"
            class="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Enviar correo de reseteo
          </button>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/api'

const router = useRouter()
const nombreResponsable = ref('Administrador')
const rutaActiva = ref('admin/lista-usuarios')
const comisionesAbierto = ref(false)
const loading = ref(false)

const mostrarModalCrear = ref(false)
const creandoUsuario = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const mostrarModalEditar = ref(false)
const editandoUsuario = ref(false)
const errorMessageEditar = ref('')
const successMessageEditar = ref('')

const usuarios = ref([])

const paginaActual = ref(1)
const filasPorPagina = 5

const filtroBusqueda = ref('')
const filtroRol = ref('')

const nuevoUsuario = ref({
  nombre: '',
  correo: '',
  cargo: ''
})

const usuarioEditando = ref({
  id: '',
  nombre: '',
  correo: '',
  cargo: '',
  rol_nombre: ''
})

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(usuario => {
    const q = filtroBusqueda.value.toLowerCase()
    const matchQ =
      !q ||
      usuario.nombre.toLowerCase().includes(q) ||
      usuario.correo.toLowerCase().includes(q) ||
      (usuario.cargo && usuario.cargo.toLowerCase().includes(q))

    const matchRol =
      !filtroRol.value || usuario.rol_nombre === filtroRol.value

    return matchQ && matchRol
  })
})

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * filasPorPagina
  const fin = inicio + filasPorPagina
  return usuariosFiltrados.value.slice(inicio, fin)
})

const totalPaginas = computed(() =>
  Math.ceil(usuariosFiltrados.value.length / filasPorPagina)
)

watch([filtroBusqueda, filtroRol], () => {
  paginaActual.value = 1
})


const resetearContrasena = async () => {
  try {
    await authService.forgotPassword(usuarioEditando.value.correo)

    alert("Correo de recuperación enviado al usuario.")
  } catch (err) {
    console.error("Error al resetear contraseña:", err)
    alert(err.response?.data?.error || "Error al enviar correo de recuperación")
  }
}

const mapeoRoles = {
  'admin': '1',
  'responsable_registro': '2',
  'responsable_formacion': '3',
  'responsable_seguimiento': '4',
  'subcomisionado_registro': '5',
  'subcomisionado_formacion': '6',
  'subcomisionado_seguimiento': '7'
}

const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false

  if (!destino) return
  if (destino === 'admin') {
    router.push('/admin')
    return
  }
  if (destino.startsWith('/')) {
    router.push(destino)
    return
  }
  router.push(`/${destino}`)
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

const getBadgeClasses = (rolNombre) => {
  const key = (rolNombre || '').toString().toLowerCase()
  switch (true) {
    case /admin|administrador/.test(key):
      return 'bg-red-100 text-red-800'
    case /responsable.*registro/.test(key):
      return 'bg-yellow-100 text-yellow-800'
    case /responsable.*formacion|responsable.*formaci[oó]n/.test(key):
      return 'bg-blue-100 text-blue-800'
    case /responsable.*seguimiento/.test(key):
      return 'bg-green-100 text-green-800'
    case /subcomisionado/.test(key):
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatRolNombre = (rolNombre) => {
  if (!rolNombre) return ''
  return rolNombre.replace(/_|-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const cargarUsuarios = async () => {
  loading.value = true
  try {
    const res = await authService.getUsers()
    usuarios.value = res.data || []
  } catch (err) {
    console.error('Error cargando usuarios:', err)
    alert('No se pudo cargar la lista de usuarios. Verifica el backend.')
  } finally {
    loading.value = false
  }
}

const cargoARolNombre = {
  "Coordinador de Recursos Adultos": "admin",
  "Comisionado de Registro y Habilitación": "responsable_registro",
  "Comisionado de Formación": "responsable_formacion",
  "Comisionado de Seguimiento": "responsable_seguimiento",
  "Subcomisionado de Registro y Habilitación": "subcomisionado_registro",
  "Subcomisionado de Formación": "subcomisionado_formacion",
  "Subcomisionado de Seguimiento": "subcomisionado_seguimiento"
}

const rolAutomatico = computed(() => {
  return cargoARolNombre[usuarioEditando.value.cargo] || ''
})


const crearUsuario = async () => {
  if (!nuevoUsuario.value.nombre || !nuevoUsuario.value.correo || !nuevoUsuario.value.cargo) {
    errorMessage.value = 'Por favor completa todos los campos obligatorios'
    return
  }
  creandoUsuario.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const payload = {
      nombre: nuevoUsuario.value.nombre,
      correo: nuevoUsuario.value.correo,
      cargo: nuevoUsuario.value.cargo
    }
    const res = await authService.register(payload)
    successMessage.value = res.data?.message || 'Usuario creado'
    await cargarUsuarios()
    setTimeout(() => {
      cerrarModal()
    }, 800)
  } catch (err) {
    console.error('Error creando usuario:', err.response?.data || err)
    errorMessage.value = err.response?.data?.error || 'Error al crear usuario'
  } finally {
    creandoUsuario.value = false
  }
}

const desactivarUsuario = async (usuario) => {
  if (usuario.rol_nombre === 'admin') {
    alert('No se puede desactivar un usuario administrador')
    return
  }

  if (!usuario.activo) {
    alert('El usuario ya está desactivado')
    return
  }

  const confirmar = confirm(
    `¿Estás segura de desactivar a ${usuario.nombre}?`
  )
  if (!confirmar) return

  try {
    const res = await authService.deleteUser(usuario.id)

    alert(res.data?.message || 'Usuario desactivado correctamente')
    await cargarUsuarios()

  } catch (err) {
    console.error('Error desactivando usuario:', err)

    const status = err.response?.status
    const data = err.response?.data

    if (status === 404) {
      alert(data?.error || 'Usuario no encontrado o ya desactivado')
    } else if (status === 401) {
      alert('Sesión expirada. Inicia sesión nuevamente.')
      localStorage.clear()
      router.push('/login')
    } else if (status === 403) {
      alert(data?.error || 'No tienes permisos para esta acción.')
    } else {
      alert(data?.error || 'Error al desactivar usuario.')
    }
  }
}

const reactivarUsuario = async (usuario) => {
  const confirmar = confirm(`¿Deseas reactivar a ${usuario.nombre}?`)
  if (!confirmar) return

  try {
    const res = await authService.reactivarUser(usuario.id)

    alert(res.data?.message || 'Usuario reactivado correctamente')
    await cargarUsuarios()
  } catch (err) {
    console.error('Error reactivando usuario:', err)

    alert(
      err.response?.data?.error ||
      'No se pudo reactivar el usuario'
    )
  }
}

const editarUsuario = (usuario) => {
  usuarioEditando.value = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    cargo: usuario.cargo || '',
    rol_nombre: usuario.rol_nombre || ''
  }
  mostrarModalEditar.value = true
}

const actualizarUsuario = async () => {
  if (!usuarioEditando.value.nombre || !usuarioEditando.value.correo) {
    errorMessageEditar.value = 'Completa los campos obligatorios'
    return
  }

  editandoUsuario.value = true
  errorMessageEditar.value = ''

  try {
    const payload = {
      nombre: usuarioEditando.value.nombre,
      correo: usuarioEditando.value.correo,
      cargo: usuarioEditando.value.cargo
    }

    await authService.updateUser(usuarioEditando.value.id, payload)

    successMessageEditar.value = 'Usuario actualizado correctamente'

    setTimeout(async () => {
      cerrarModalEditar()
      await cargarUsuarios()
    }, 600)

  } catch (err) {
    console.error('Error actualizando usuario:', err.response?.data || err)
    errorMessageEditar.value =
      err.response?.data?.error || 'No se pudo actualizar el usuario'
  } finally {
    editandoUsuario.value = false
  }
}

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
    cargo: ''
}
  errorMessage.value = ''
  successMessage.value = ''
}
const cerrarModalEditar = () => {
  mostrarModalEditar.value = false
  usuarioEditando.value = { id: '', nombre: '', correo: '', cargo: '', rol_id: '' }
  errorMessageEditar.value = ''
  successMessageEditar.value = ''
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Administrador'
  cargarUsuarios()
})
</script>
