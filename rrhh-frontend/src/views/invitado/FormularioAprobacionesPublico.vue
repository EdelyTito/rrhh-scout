<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
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
              <h2 class="text-xl font-bold text-white">Solicitud de Aprobaciones y Nombramientos</h2>
              <p class="text-white opacity-90 mt-1">Complete el formulario para solicitar su aprobación o nombramiento scout</p>
            </div>
          </div>
        </div>

        <!-- Resto del formulario se mantiene igual -->
        <div class="p-6">
          <!-- Identificación -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Identificación del dirigente
            </h2>

            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico * (Debe usar el mismo correo en las tres entregas)
            </label>
            <input
              v-model="formulario.correo"
              type="email"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-[#009d71]"
            >
          </div>
          <!-- Sección 0: Tipo de entrega -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Tipo de entrega
            </h2>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Seleccione el tipo de entrega que está realizando *
              </label>
              <select
                v-model="formulario.tipoEntrega"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#009d71]"
              >
                <option value="">Seleccione una opción</option>
                <option value="primera">Primera entrega</option>
                <option value="segunda">Segunda entrega (correcciones)</option>
                <option value="final">Entrega final</option>
              </select>

              <p class="text-xs text-gray-500 mt-2">
                Use “Primera entrega” solo si es la primera vez que envía su documentación.
              </p>
            </div>
          </div>

          <form @submit.prevent="enviarFormulario" class="space-y-8">
            <!-- Sección 1: Grupo Scout -->

            <!-- Sección 2: Datos Personales -->
            <div v-if="esPrimeraEntrega" class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">1. Datos Personales</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input 
                    v-model="formulario.nombreCompleto"
                    type="text"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2
                          focus:outline-none focus:ring-2 focus:ring-[#009d71]"
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

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Grupo Scout *
                  </label>
                  <select 
                    v-model="formulario.grupoScout"
                    required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2
                          focus:outline-none focus:ring-2 focus:ring-[#009d71]"
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

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Rama que dirige
                  </label>
                  <select
                    v-model="formulario.ramaScout"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2
                          focus:outline-none focus:ring-2 focus:ring-[#009d71]"
                  >
                    <option value="">No aplica</option>
                    <option value="Manada">Lobatos</option>
                    <option value="Unidad Scout">Exploradores</option>
                    <option value="Unidad de Caminantes">Pioneross</option>
                    <option value="Clan Rover">Rovers</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Sección 3: Nivel de Aprobación o Nombramiento -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">2. Nivel de Aprobación o Nombramiento</h2>
              
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
              </div>
            </div>

            <!-- Sección 4: Requisitos Específicos -->
            <div class="border-b border-gray-200 pb-8">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">3. Documentos y Requisitos</h2>
              
              <div class="space-y-6">
                <!-- Requisitos comunes -->
                <div class="space-y-4">
                  <!-- Cuadernillo de práctica supervisada -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Cuadernillo de práctica supervisada
                      <span v-if="esPrimeraEntrega">*</span>
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'cuadernillo')"
                        :required="esPrimeraEntrega"
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
                      Informe de práctica supervisada (Programa de Jóvenes)
                      <span v-if="esPrimeraEntrega">*</span>
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'informePractica')"
                        :required="esPrimeraEntrega"
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
                      Medios de verificación del cuadernillo (Gestión Institucional)
                      <span v-if="esPrimeraEntrega">*</span>
                    </label>
                    <div class="flex items-center space-x-4">
                      <input
                        type="file"
                        multiple
                        @change="manejarMultiplesArchivos($event, 'mediosVerificacion')"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                      />
                      <span v-if="archivos.mediosVerificacion.length > 0" class="text-green-600 text-sm font-medium">
                        ✓ Subido
                      </span>
                    </div>
                  </div>

                  <div v-if="formulario.nivelAprobacion === 'KoodooAdjunto' || formulario.nivelAprobacion === 'KoodooDirector'" class="space-y-4">
                    <div class="border border-gray-200 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Formulario de solicitud de nombramiento (Koodoo)
                        <span v-if="esPrimeraEntrega">*</span>
                      </label>
                      <div class="flex items-center space-x-4">
                        <input 
                          type="file" 
                          @change="manejarArchivo($event, 'formularioKoodoo')"
                          :required="esPrimeraEntrega"
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
                        Informes de cursos como director o responsable
                        <span v-if="esPrimeraEntrega">*</span>
                      </label>
                      <div class="flex items-center space-x-4">
                        <input
                          type="file"
                          multiple
                          @change="manejarMultiplesArchivos($event, 'informesCursos')"
                          accept=".pdf,.doc,.docx"
                        />
                        <span v-if="archivos.informesCursos.length > 0" class="text-green-600 text-sm font-medium">
                          ✓ Subido
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Requisitos comunes a todos -->
                  <div class="border border-gray-200 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Carta de respaldo del grupo
                      <span v-if="esPrimeraEntrega">*</span>
                    </label>
                    <div class="flex items-center space-x-4">
                      <input 
                        type="file" 
                        @change="manejarArchivo($event, 'cartaRespaldo')"
                        :required="esPrimeraEntrega"
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
                      Certificados de formación
                      <span v-if="esPrimeraEntrega">*</span>
                    </label>
                    <div class="flex items-center space-x-4">
                      <input
                        type="file"
                        multiple
                        @change="manejarMultiplesArchivos($event, 'certificados')"
                        accept=".pdf,.jpg,.png"
                      />
                      <span v-if="archivos.certificados.length > 0" class="text-green-600 text-sm font-medium">
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
import { seguimientoService } from '../../services/api';

export default {
  name: 'FormularioAprobacionesPublico',
  setup() {
    const enviando = ref(false)
    
    const formulario = ref({
      grupoScout: '',
      ramaScout: '',
      nombreCompleto: '',
      genero: '',
      fechaNacimiento: '',
      ci: '',
      correo: '',
      nivelAprobacion: '',
      tipoEntrega: ''
    })

    const archivos = ref({
      cuadernillo: null,
      informePractica: null,
      mediosVerificacion: [],
      formularioKoodoo: null,
      informesCursos: [],
      cartaRespaldo: null,
      certificados: []
    })

    const manejarMultiplesArchivos = (event, tipo) => {
      const files = Array.from(event.target.files)

      const archivosValidos = files.filter(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`El archivo ${file.name} supera los 10MB`)
          return false
        }
        return true
      })

      archivos.value[tipo] = archivosValidos
    }

    const esPrimeraEntrega = computed(
      () => formulario.value.tipoEntrega === 'primera'
    )

    const esCorreccion = computed(
      () => ['segunda', 'final'].includes(formulario.value.tipoEntrega)
    )

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

    const descripcionNivel = computed(() => {
      return descripcionesNiveles[formulario.value.nivelAprobacion] || null
    })

    const mostrarRequisitosEspecificos = () => {
      console.log('Nivel seleccionado:', formulario.value.nivelAprobacion)
    }

    const manejarArchivo = (event, tipo) => {
      const file = event.target.files[0]
      if (file) {
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
      if (!formulario.value.tipoEntrega) {
        alert('Seleccione el tipo de entrega')
        return false
      }

      if (esPrimeraEntrega.value && !formulario.value.grupoScout) {
        alert('Seleccione su grupo scout')
        return false
      }

      if (!formulario.value.nivelAprobacion) {
        alert('Seleccione el nivel de aprobación')
        return false
      }

      if (esPrimeraEntrega.value) {
        if (!archivos.value.cuadernillo) {
          alert('Debe subir el cuadernillo')
          return false
        }

        if (!archivos.value.cartaRespaldo) {
          alert('Debe subir la carta de respaldo')
          return false
        }

        if (archivos.value.certificados.length === 0) {
          alert('Debe subir los certificados')
          return false
        }

        if (!formulario.value.correo) {
          alert('Ingrese su correo')
          return false
        }
        if (
          ['PaxtuGrupo', 'PaxtuDistrito'].includes(formulario.value.nivelAprobacion) &&
          archivos.value.mediosVerificacion.length === 0
        ) {
          alert('Debe subir los medios de verificación')
          return false
        }
      }

      return true
    }

    const enviarFormulario = async () => {
      if (!validarFormulario()) return
      
      enviando.value = true
      
      try {
        const formData = new FormData()
        
        formData.append('nombre_participante', formulario.value.nombreCompleto)
        formData.append('grupo', formulario.value.grupoScout)
        formData.append('correo', formulario.value.correo)
        formData.append('tipo_im', formulario.value.nivelAprobacion)
        formData.append('tipo_proceso', 'aprobacion')
        formData.append('observaciones', 'Solicitud enviada desde formulario público')
        formData.append('tipo_entrega', formulario.value.tipoEntrega)
        
        if (formulario.value.ramaScout) {
          formData.append('rama_scout', formulario.value.ramaScout)
        }

        if (archivos.value.cuadernillo) {
          formData.append('cuadernillo', archivos.value.cuadernillo)
        }
        
        if (archivos.value.cartaRespaldo) {
          formData.append('cartaRespaldo', archivos.value.cartaRespaldo)
        }

        archivos.value.certificados.forEach(file => {
          formData.append('certificados', file)
        })

        archivos.value.mediosVerificacion.forEach(file => {
          formData.append('mediosVerificacion', file)
        })

        archivos.value.informesCursos.forEach(file => {
          formData.append('informesCursos', file)
        })
        
        const response = await seguimientoService.enviarFormularioPublico(formData)
        
        console.log('Respuesta del servidor:', response.data)
        alert('¡Solicitud enviada con éxito!')
        limpiarFormulario()
        
      } catch (error) {
        console.error('Error completo:', error)
        
        if (error.response?.data?.error) {
          alert(`Error del servidor: ${error.response.data.error}`)
        } else if (error.message) {
          alert(`Error de conexión: ${error.message}`)
        } else {
          alert('Error desconocido al enviar el formulario.')
        }
      } finally {
        enviando.value = false
      }
    }

    

    const limpiarFormulario = () => {
      formulario.value = {
        grupoScout: '',
        nombreCompleto: '',
        genero: '',
        fechaNacimiento: '',
        ci: '',
        correo: '',
        nivelAprobacion: '',
        tipoEntrega: ''
      }
      
      archivos.value = {
        cuadernillo: null,
        informePractica: null,
        mediosVerificacion: [],
        formularioKoodoo: null,
        informesCursos: [],
        cartaRespaldo: null,
        certificados: []
      }
      
      const fileInputs = document.querySelectorAll('input[type="file"]')
      fileInputs.forEach(input => input.value = '')
    }

    return {
      formulario,
      archivos,
      esPrimeraEntrega,
      esCorreccion,
      enviando,
      manejarArchivo,
      manejarMultiplesArchivos,
      enviarFormulario,
      limpiarFormulario,
      mostrarRequisitosEspecificos
    }
  }
}
</script>