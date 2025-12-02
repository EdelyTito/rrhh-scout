<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header -->
        <div class="bg-[#009d71] px-6 py-6">
          <div class="flex items-center space-x-4">
            <img 
              src="/images/rraa.png" 
              alt="Logo Distrito Scout"
              class="h-12 w-auto"
            >
            <div>
              <h2 class="text-xl font-bold text-white">Formulario de registro de dirigentes en periodo de prueba o reincorporación</h2>
              <p class="text-white opacity-90 mt-1">Complete el formulario para registrar dirigentes en periodo de prueba o reincorporación</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="p-6">
          <form @submit.prevent="enviarFormulario" class="space-y-8">
            <!-- Sección 1: Grupo Scout -->
            <div class="border-b border-gray-200 pb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Grupo Scout</h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Grupo Scout *
                </label>
                <select 
                  v-model="formulario.grupoScout"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
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
            </div>

            <!-- Sección 2: Datos Personales -->
            <div class="border-b border-gray-200 pb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">DATOS PERSONALES</h3>
              
              <div class="space-y-6">
                <!-- Nombre completo -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo dirigente (NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2) *
                  </label>
                  <input 
                    v-model="formulario.nombreCompleto"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ingrese el nombre completo del dirigente"
                  >
                </div>

                <!-- Tipo de registro -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    ¿Es periodo de prueba o reincorporación? *
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input 
                        v-model="formulario.tipoRegistro"
                        type="radio" 
                        value="periodo de prueba"
                        required
                        class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                      >
                      <span class="ml-2 text-gray-700">Periodo de prueba</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        v-model="formulario.tipoRegistro"
                        type="radio" 
                        value="reincorporacion"
                        required
                        class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300"
                      >
                      <span class="ml-2 text-gray-700">Reincorporación</span>
                    </label>
                  </div>
                </div>

                <!-- Agregar más dirigentes -->
                <div>
                  <button 
                    type="button"
                    @click="agregarDirigente"
                    class="flex items-center space-x-2 text-[#009d71] hover:text-[#007a5c] font-medium"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span>Agregar dirigente</span>
                  </button>
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
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ingrese el carnet de identidad"
                  >
                </div>
              </div>
            </div>

            <!-- Sección 3: Requisitos -->
            <div class="border-b border-gray-200 pb-8">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">REQUISITOS</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Fecha de inicio -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio *
                  </label>
                  <input 
                    v-model="formulario.fechaInicio"
                    type="date" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  >
                </div>

                <!-- Fecha de finalización -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de finalización
                  </label>
                  <input 
                    v-model="formulario.fechaFinalizacion"
                    type="date" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  >
                </div>
              </div>

              <!-- Archivos -->
              <div class="mt-6 space-y-6">
                <!-- Imagen o PDF de carnet de identidad -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Imagen o PDF de el/los carnet de identidad *
                  </label>
                  <div class="flex items-center space-x-4">
                    <input 
                      type="file" 
                      @change="manejarArchivo($event, 'carnetIdentidad')"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    >
                    <span v-if="archivos.carnetIdentidad" class="text-green-600 text-sm font-medium">
                      ✓ Subido
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Formatos: PDF, JPG, PNG (máx. 10MB)</p>
                </div>

                <!-- Carta de respaldo -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    PDF de la carta de respaldo *
                  </label>
                  <div class="flex items-center space-x-4">
                    <input 
                      type="file" 
                      @change="manejarArchivo($event, 'cartaRespaldo')"
                      accept=".pdf"
                      required
                      class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    >
                    <span v-if="archivos.cartaRespaldo" class="text-green-600 text-sm font-medium">
                      ✓ Subido
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Formato: PDF (máx. 10MB)</p>
                </div>
              </div>
            </div>

            <!-- Sección 4: Envío -->
            <div>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-yellow-800">Antes de enviar</h3>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>• Verifique que toda la información sea correcta</p>
                      <p>• Asegúrese de haber subido todos los documentos requeridos</p>
                      <p>• Recibirá un correo de confirmación al enviar el formulario</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botón de envío -->
              <div class="flex justify-center">
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
      </div>

      <!-- Footer -->
      <footer class="mt-8 text-center">
        <p class="text-gray-500 text-sm">
          Desarrollado por Edely Tito - GSA • Distrito Scout La Paz
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FormularioPeriodoPruebaReincorporacion',
  setup() {
    const enviando = ref(false)
    
    // Datos del formulario
    const formulario = ref({
      grupoScout: '',
      nombreCompleto: '',
      tipoRegistro: '',
      ci: '',
      fechaInicio: '',
      fechaFinalizacion: ''
    })

    // Archivos subidos
    const archivos = ref({
      carnetIdentidad: null,
      cartaRespaldo: null
    })

    // Lista de dirigentes adicionales
    const dirigentesAdicionales = ref([])

    // Métodos
    const agregarDirigente = () => {
      dirigentesAdicionales.value.push({
        nombreCompleto: '',
        ci: '',
        id: Date.now() // ID temporal
      })
    }

    const manejarArchivo = (event, tipo) => {
      const file = event.target.files[0]
      if (file) {
        // Validar tamaño (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
          alert('El archivo es demasiado grande. Máximo 10MB permitido.')
          event.target.value = ''
          return
        }
        
        archivos.value[tipo] = file
        console.log(`Archivo ${tipo} subido:`, file.name)
      }
    }

    const validarFormulario = () => {
      if (!formulario.value.grupoScout) {
        alert('Por favor seleccione el grupo scout')
        return false
      }
      
      if (!formulario.value.nombreCompleto) {
        alert('Por favor ingrese el nombre completo del dirigente')
        return false
      }

      if (!formulario.value.tipoRegistro) {
        alert('Por favor seleccione el tipo de registro')
        return false
      }

      if (!formulario.value.ci) {
        alert('Por favor ingrese el carnet de identidad')
        return false
      }

      if (!formulario.value.fechaInicio) {
        alert('Por favor ingrese la fecha de inicio')
        return false
      }

      if (!archivos.value.carnetIdentidad) {
        alert('Debe subir la imagen o PDF del carnet de identidad')
        return false
      }

      if (!archivos.value.cartaRespaldo) {
        alert('Debe subir la carta de respaldo en PDF')
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
          dirigentesAdicionales: dirigentesAdicionales.value,
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
        grupoScout: '',
        nombreCompleto: '',
        tipoRegistro: '',
        ci: '',
        fechaInicio: '',
        fechaFinalizacion: ''
      }
      
      archivos.value = {
        carnetIdentidad: null,
        cartaRespaldo: null
      }
      
      dirigentesAdicionales.value = []
      
      // Limpiar inputs de archivo
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach(input => input.value = '')
    }

    return {
      formulario,
      archivos,
      dirigentesAdicionales,
      enviando,
      agregarDirigente,
      manejarArchivo,
      enviarFormulario
    }
  }
}
</script>