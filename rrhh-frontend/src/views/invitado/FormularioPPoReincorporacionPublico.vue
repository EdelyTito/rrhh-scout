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
              <p class="text-white opacity-90 mt-1">Complete el formulario para registrar uno o varios dirigentes en periodo de prueba o reincorporación</p>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="p-6">
          <form @submit.prevent="enviarFormulario" class="space-y-10">

            <!-- Grupo -->
            <div class="border-b pb-8">
              <h3 class="text-lg font-semibold mb-4">Grupo Scout</h3>
              <select
                v-model="formulario.grupoScout"
                required
                class="w-full border rounded-lg px-3 py-2"
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

            <!-- DIRIGENTES -->
            <div
              v-for="(d, index) in formulario.dirigentes"
              :key="index"
              class="border rounded-lg p-6 space-y-6 bg-gray-50"
            >
              <h3 class="text-lg font-semibold">
                Dirigente {{ index + 1 }}
              </h3>

              <!-- Nombre -->
              <input
                v-model="d.nombre"
                type="text"
                placeholder="Nombre completo *"
                required
                class="w-full border rounded-lg px-3 py-2"
              />

              <!-- CI -->
              <input
                v-model="d.ci"
                type="text"
                placeholder="Carnet de identidad *"
                required
                class="w-full border rounded-lg px-3 py-2"
              />

              <!-- Teléfono -->
              <input
                v-model="d.telefono"
                type="tel"
                placeholder="Teléfono *"
                required
                class="w-full border rounded-lg px-3 py-2"
              />

              <!-- Correo -->
              <input
                v-model="d.correo"
                type="email"
                placeholder="Correo electrónico *"
                required
                class="w-full border rounded-lg px-3 py-2"
              />

              <!-- Tipo -->
              <div>
                <label class="font-medium">Tipo de registro *</label>
                <div class="flex gap-4 mt-2">
                  <label>
                    <input type="radio" value="periodo de prueba" v-model="d.tipo" required />
                    Periodo de prueba
                  </label>
                  <label>
                    <input type="radio" value="reincorporacion" v-model="d.tipo" required />
                    Reincorporación
                  </label>
                </div>
              </div>

              <!-- Fechas -->
              <div class="grid md:grid-cols-2 gap-4">
                Fecha inicio
                <input
                  v-model="d.fechaInicio"
                  type="date"
                  required
                  class="border rounded-lg px-3 py-2"
                />

                Fecha finalización
                <input
                  v-if="d.tipo === 'periodo de prueba'"
                  v-model="d.fechaFin"
                  type="date"
                  class="border rounded-lg px-3 py-2"
                />
              </div>

              <!-- Motivo / Observaciones -->
              <div>
                <label class="font-medium">
                  Observaciones (opcional)
                </label>
                <textarea
                  v-model="d.motivo"
                  rows="3"
                  placeholder="Ej: No tiene fecha de finalización porque..."
                  class="w-full border rounded-lg px-3 py-2 mt-1"
                ></textarea>
              </div>

              <!-- Archivos -->
              <div class="space-y-3">
                <div>
                  <label class="font-medium">CI (PDF o imagen) *</label>
                  <br>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="e => d.archivos.carnetIdentidad = e.target.files[0]"
                    required
                  />
                </div>

                <div>
                  <label class="font-medium">Carta de respaldo (PDF) *</label>
                  <br>
                  <input
                    type="file"
                    accept=".pdf"
                    @change="e => d.archivos.cartaRespaldo = e.target.files[0]"
                    required
                  />
                </div>
              </div>

              <!-- Eliminar dirigente -->
              <button
                v-if="formulario.dirigentes.length > 1"
                type="button"
                @click="eliminarDirigente(index)"
                class="text-red-600 text-sm"
              >
                Eliminar dirigente
              </button>
            </div>

            <!-- Agregar -->
            <button
              type="button"
              @click="agregarDirigente"
              class="text-[#009d71] font-medium"
            >
              + Agregar dirigente
            </button>

            <!-- Enviar -->
            <div class="text-center">
              <button
                type="submit"
                :disabled="enviando"
                class="bg-[#009d71] text-white px-8 py-3 rounded-lg"
              >
                {{ enviando ? 'Enviando…' : 'Enviar formulario' }}
              </button>
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

<script setup>

import { ref } from 'vue'
import { seguimientoService } from '../../services/api'

const enviando = ref(false)

const crearDirigente = () => ({
  nombre: '',
  ci: '',
  telefono: '',
  correo: '',
  tipo: '',
  fechaInicio: '',
  fechaFin: '',
  motivo: '',
  archivos: {
    carnetIdentidad: null,
    cartaRespaldo: null
  }
})

const formulario = ref({
  grupoScout: '',
  dirigentes: [crearDirigente()]
})

const agregarDirigente = () => {
  formulario.value.dirigentes.push(crearDirigente())
}

const eliminarDirigente = (index) => {
  formulario.value.dirigentes.splice(index, 1)
}

const enviarFormulario = async () => {
  enviando.value = true
  try {
    for (const d of formulario.value.dirigentes) {
      const res = await seguimientoService.crearPeriodoPrueba({
        nombre: d.nombre,
        ci: d.ci,
        grupo: formulario.value.grupoScout,
        tipo: d.tipo,
        fecha_inicio: d.fechaInicio,
        fecha_fin: d.tipo === 'periodo de prueba' ? d.fechaFin : null,
        motivo: d.motivo || null,
        telefono: d.telefono,
        correo: d.correo
      })

      const { periodo_id } = res.data

      await subirArchivo(periodo_id, d.archivos.carnetIdentidad, 'carnet')
      await subirArchivo(periodo_id, d.archivos.cartaRespaldo, 'carta_respaldo')
    }

    alert('Formulario enviado correctamente')
  } catch (e) {
    console.error(e)
    alert('Error al enviar formulario')
  } finally {
    enviando.value = false
  }
}

const subirArchivo = async (periodo_id, file, tipo) => {
  if (!file) return
  const base64 = await toBase64(file)
  await seguimientoService.subirArchivoPeriodo({
    periodo_id,
    tipo_documento: tipo,
    nombre_archivo: file.name,
    mime_type: file.type,
    archivo_base64: base64
  })
}

const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }

    reader.onerror = (error) => reject(error)
  })
}

</script>
