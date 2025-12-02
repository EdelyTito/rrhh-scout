<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Content - Sin header separado -->
    <main class="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <!-- Header del Formulario con Logo AL LADO DEL TEXTO -->
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
              <h2 class="text-xl font-bold text-white">Solicitud de Aprobaciones y Nombramientos</h2>
              <p class="text-white opacity-90 mt-1">Complete el formulario para solicitar su aprobación o nombramiento scout</p>
            </div>
          </div>
        </div>

        <!-- Resto del formulario se mantiene igual -->
        <div class="p-6">
          <!-- Progreso -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Progreso del formulario</span>
              <span class="text-sm text-gray-600">{{ progreso }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#009d71] h-2 rounded-full transition-all duration-300" :style="{ width: progreso + '%' }"></div>
            </div>
          </div>

          <form @submit.prevent="enviarFormulario" class="space-y-8">
            <!-- Sección 1: Grupo Scout -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">1. Información del Grupo Scout</h2>
              
              <div class="grid grid-cols-1 gap-6">
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
            </div>

            <!-- Sección 2: Datos Personales -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">2. Datos Personales</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Primer Nombre *
                  </label>
                  <input 
                    v-model="formulario.nombre1"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ingrese su primer nombre"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Segundo Nombre
                  </label>
                  <input 
                    v-model="formulario.nombre2"
                    type="text" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ingrese su segundo nombre"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Primer Apellido *
                  </label>
                  <input 
                    v-model="formulario.apellido1"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ingrese su primer apellido"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Segundo Apellido *
                  </label>
                  <input 
                    v-model="formulario.apellido2"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ingrese su segundo apellido"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select 
                    v-model="formulario.genero"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  >
                    <option value="">Seleccione su género</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input 
                    v-model="formulario.fechaNacimiento"
                    type="date" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  >
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Carnet de Identidad *
                  </label>
                  <input 
                    v-model="formulario.ci"
                    type="text" 
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                    placeholder="Ej: 1234567"
                  >
                </div>
              </div>
            </div>

            <!-- Sección 3: Nivel de Aprobación o Nombramiento -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">3. Nivel de Aprobación o Nombramiento</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Seleccione el nivel que está solicitando *
                  </label>
                  <select 
                    v-model="formulario.nivelAprobacion"
                    required
                    @change="mostrarRequisitosEspecificos"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  >
                    <option value="">Seleccione un nivel</option>
                    <optgroup label="Programa de Jóvenes">
                      <option value="IM2">Insignia de Madera Nivel II</option>
                      <option value="IM3">Insignia de Madera Nivel III</option>
                    </optgroup>
                    <optgroup label="Formador de Líderes">
                      <option value="PaxtuGrupo">Paxtu Nivel Grupo</option>
                      <option value="PaxtuDistrito">Paxtu Nivel Distrito</option>
                    </optgroup>
                    <optgroup label="Gestión Institucional">
                      <option value="KoodooAdjunto">Koodoo Adjunto de Formación</option>
                      <option value="KoodooDirector">Koodoo Director</option>
                    </optgroup>
                  </select>
                </div>

                <!-- Descripción del nivel seleccionado -->
                <div v-if="descripcionNivel" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 class="font-semibold text-blue-800 mb-2">{{ descripcionNivel.titulo }}</h3>
                  <p class="text-blue-700 text-sm">{{ descripcionNivel.descripcion }}</p>
                </div>
              </div>
            </div>

            <!-- Sección 4: Requisitos Específicos -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">4. Documentos y Requisitos</h2>
              
              <div class="space-y-6">
                <!-- Requisitos comunes -->
                <div class="space-y-4">
                  <!-- Cuadernillo de práctica supervisada -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Cuadernillo de práctica supervisada *
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'cuadernillo')"
                        accept=".pdf,.doc,.docx"
                        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                      >
                      <span v-if="archivos.cuadernillo" class="text-green-600 text-sm font-medium">
                        ✓ Subido
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Formato: PDF, Word (máx. 10MB)</p>
                  </div>

                  <!-- Requisitos específicos según el nivel -->
                  <div v-if="formulario.nivelAprobacion === 'IM2' || formulario.nivelAprobacion === 'IM3'" class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Informe de práctica supervisada (Programa de Jóvenes) *
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'informePractica')"
                        accept=".pdf,.doc,.docx"
                        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                      >
                      <span v-if="archivos.informePractica" class="text-green-600 text-sm font-medium">
                        ✓ Subido
                      </span>
                    </div>
                  </div>

                  <div v-if="formulario.nivelAprobacion === 'PaxtuGrupo' || formulario.nivelAprobacion === 'PaxtuDistrito'" class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Medios de verificación del cuadernillo (Gestión Institucional) *
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'mediosVerificacion')"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                      >
                      <span v-if="archivos.mediosVerificacion" class="text-green-600 text-sm font-medium">
                        ✓ Subido
                      </span>
                    </div>
                  </div>

                  <div v-if="formulario.nivelAprobacion === 'KoodooAdjunto' || formulario.nivelAprobacion === 'KoodooDirector'" class="space-y-4">
                    <div class="border border-gray-200 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Formulario de solicitud de nombramiento (Koodoo) *
                      </label>
                      <div class="flex items-center space-x-4">
                        <input 
                          type="file" 
                          @change="manejarArchivo($event, 'formularioKoodoo')"
                          accept=".pdf,.doc,.docx"
                          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                        >
                        <span v-if="archivos.formularioKoodoo" class="text-green-600 text-sm font-medium">
                          ✓ Subido
                        </span>
                      </div>
                    </div>

                    <div class="border border-gray-200 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Informes de cursos como director o responsable *
                      </label>
                      <div class="flex items-center space-x-4">
                        <input 
                          type="file" 
                          @change="manejarArchivo($event, 'informesCursos')"
                          accept=".pdf,.doc,.docx"
                          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                        >
                        <span v-if="archivos.informesCursos" class="text-green-600 text-sm font-medium">
                          ✓ Subido
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Requisitos comunes a todos -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Carta de respaldo del grupo *
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'cartaRespaldo')"
                        accept=".pdf,.doc,.docx"
                        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                      >
                      <span v-if="archivos.cartaRespaldo" class="text-green-600 text-sm font-medium">
                        ✓ Subido
                      </span>
                    </div>
                  </div>

                  <div class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Certificados de formación *
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'certificados')"
                        accept=".pdf,.jpg,.png"
                        class="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                      >
                      <span v-if="archivos.certificados" class="text-green-600 text-sm font-medium">
                        ✓ Subido
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Puede subir múltiples archivos en un ZIP si es necesario</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección 5: Confirmación y Envío -->
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-4">5. Confirmación y Envío</h2>
              
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

              <div class="flex items-center mb-4">
                <input 
                  v-model="formulario.aceptoTerminos"
                  type="checkbox" 
                  required
                  class="h-4 w-4 text-[#009d71] focus:ring-[#009d71] border-gray-300 rounded"
                >
                <label class="ml-2 block text-sm text-gray-900">
                  Acepto que la información proporcionada es verídica y autorizo el tratamiento de mis datos *
                </label>
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
                    Enviar Solicitud
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
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

<script>
import { ref, computed } from 'vue'

export default {
  name: 'FormularioAprobacionesPublico',
  setup() {
    const enviando = ref(false)
    
    // Datos del formulario
    const formulario = ref({
      grupoScout: '',
      nombre1: '',
      nombre2: '',
      apellido1: '',
      apellido2: '',
      genero: '',
      fechaNacimiento: '',
      ci: '',
      nivelAprobacion: '',
      aceptoTerminos: false
    })

    // Archivos subidos
    const archivos = ref({
      cuadernillo: null,
      informePractica: null,
      mediosVerificacion: null,
      formularioKoodoo: null,
      informesCursos: null,
      cartaRespaldo: null,
      certificados: null
    })

    // Descripciones de niveles
    const descripcionesNiveles = {
      'IM2': {
        titulo: 'Insignia de Madera Nivel II',
        descripcion: 'Formación intermedia para dirigentes con experiencia básica en el movimiento scout.'
      },
      'IM3': {
        titulo: 'Insignia de Madera Nivel III',
        descripcion: 'Formación avanzada para dirigentes con amplia experiencia y liderazgo scout.'
      },
      'PaxtuGrupo': {
        titulo: 'Paxtu Nivel Grupo',
        descripcion: 'Formación especializada en gestión y administración a nivel de grupo scout.'
      },
      'PaxtuDistrito': {
        titulo: 'Paxtu Nivel Distrito',
        descripcion: 'Formación especializada en gestión y administración a nivel distrital scout.'
      },
      'KoodooAdjunto': {
        titulo: 'Koodoo Adjunto de Formación',
        descripcion: 'Formación para responsables de formación en el movimiento scout.'
      },
      'KoodooDirector': {
        titulo: 'Koodoo Director',
        descripcion: 'Formación avanzada para directores de formación en el movimiento scout.'
      }
    }

    // Computed
    const descripcionNivel = computed(() => {
      return descripcionesNiveles[formulario.value.nivelAprobacion] || null
    })

    const progreso = computed(() => {
      let camposCompletados = 0
      const camposTotales = 8 // Campos obligatorios principales
      
      if (formulario.value.grupoScout) camposCompletados++
      if (formulario.value.nombre1) camposCompletados++
      if (formulario.value.apellido1) camposCompletados++
      if (formulario.value.apellido2) camposCompletados++
      if (formulario.value.genero) camposCompletados++
      if (formulario.value.fechaNacimiento) camposCompletados++
      if (formulario.value.ci) camposCompletados++
      if (formulario.value.nivelAprobacion) camposCompletados++
      
      return Math.round((camposCompletados / camposTotales) * 100)
    })

    // Métodos
    const mostrarRequisitosEspecificos = () => {
      console.log('Nivel seleccionado:', formulario.value.nivelAprobacion)
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
      // Validaciones básicas
      if (!formulario.value.grupoScout) {
        alert('Por favor seleccione su grupo scout')
        return false
      }
      
      if (!formulario.value.nivelAprobacion) {
        alert('Por favor seleccione el nivel de aprobación')
        return false
      }

      // Validar archivos requeridos
      if (!archivos.value.cuadernillo) {
        alert('Debe subir el cuadernillo de práctica supervisada')
        return false
      }

      if (!archivos.value.cartaRespaldo) {
        alert('Debe subir la carta de respaldo del grupo')
        return false
      }

      if (!archivos.value.certificados) {
        alert('Debe subir los certificados de formación')
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
        alert('¡Solicitud enviada con éxito! Recibirá un correo de confirmación pronto.')
        
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
        nombre1: '',
        nombre2: '',
        apellido1: '',
        apellido2: '',
        genero: '',
        fechaNacimiento: '',
        ci: '',
        nivelAprobacion: '',
        aceptoTerminos: false
      }
      
      archivos.value = {
        cuadernillo: null,
        informePractica: null,
        mediosVerificacion: null,
        formularioKoodoo: null,
        informesCursos: null,
        cartaRespaldo: null,
        certificados: null
      }
      
      // Limpiar inputs de archivo
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach(input => input.value = '')
    }

    return {
      formulario,
      archivos,
      descripcionNivel,
      progreso,
      enviando,
      mostrarRequisitosEspecificos,
      manejarArchivo,
      enviarFormulario,
      limpiarFormulario
    }
  }
}
</script>