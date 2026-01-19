<template>
  <div class="min-h-screen bg-gray-50">

    <SeguimientoHeader
      :nombre="nombreResponsable"
      @logout="cerrarSesion"
    />

    <SeguimientoNav
      :ruta-activa="rutaActiva"
      @navegar="navegarA"
    />

    <main class="max-w-6xl mx-auto py-6 px-4">

      <!-- Volver -->
      <nav class="bg-white shadow-sm px-6 py-3 mb-4">
        <button
          @click="volver"
          class="text-[#009d71] font-medium flex items-center gap-1"
        >
          ← Volver a lista
        </button>
      </nav>

      <div v-if="loading" class="text-center text-gray-500 py-12">
        Cargando registro...
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else class="space-y-6">

        <!-- INFO PRINCIPAL -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ registro.nombre }}
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>CI:</strong> {{ registro.ci }}</p>
            <p><strong>Grupo:</strong> {{ registro.grupo }}</p>
            <p><strong>Tipo:</strong> {{ tipoTexto(registro.tipo) }}</p>
            <p><strong>Teléfono:</strong> {{ registro.telefono || '-' }}</p>
            <p><strong>Correo:</strong> {{ registro.correo || '-' }}</p>
            <p><strong>Fecha inicio:</strong> {{ formatFecha(registro.fecha_inicio) }}</p>
            <p v-if="registro.fecha_fin">
              <strong>Fecha fin:</strong> {{ formatFecha(registro.fecha_fin) }}
            </p>
          </div>

          <div v-if="registro.motivo" class="mt-4">
            <p class="font-semibold">Motivo / Observaciones:</p>
            <p class="text-gray-700 mt-1">{{ registro.motivo }}</p>
          </div>
        </div>

        <!-- DOCUMENTOS -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">
            Documentos adjuntos
          </h3>

          <div v-if="archivos.length === 0" class="text-gray-500 text-sm">
            No hay documentos adjuntos
          </div>

          <ul v-else class="space-y-2">
            <li
              v-for="archivo in archivos"
              :key="archivo.id"
              class="flex justify-between items-center border rounded-lg px-4 py-2"
            >
              <span class="text-sm">
                {{ archivo.tipo }} — {{ archivo.nombre_archivo }}
              </span>

              <button
                @click="abrirArchivo(archivo)"
                class="px-3 py-1 rounded-md text-xs font-semibold
                        bg-gray-100 hover:bg-gray-200"
              >
                {{ accionArchivo(archivo) }}
              </button>
            </li>
          </ul>
        </div>

      </div>
    </main>

    <footer class="text-center text-gray-500 text-sm py-6">
      Desarrollado por Edely Tito - GSA
    </footer>
  </div>
</template>

<script setup>
import SeguimientoHeader from '../../components/seguimiento/SeguimientoHeader.vue'
import SeguimientoNav from '../../components/seguimiento/SeguimientoNav.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Seguimiento')
const rutaActiva = ref('periodo-prueba')

const registro = ref({})
const archivos = ref([])
const loading = ref(false)
const error = ref(null)

const fetchDetalle = async () => {
  loading.value = true
  try {
    const { data } = await seguimientoService.getPeriodoPruebaDetalle(route.params.id)
    registro.value = data.registro
    archivos.value = data.archivos
  } catch (e) {
    error.value = 'No se pudo cargar el registro'
  } finally {
    loading.value = false
  }
}

const volver = () => {
  router.push('/seguimiento/periodo-prueba')
}

const abrirArchivo = async (archivo) => {
  const response = await seguimientoService.descargarDocumentoPP(archivo.id)

  const blob = new Blob([response.data], {
    type: archivo.mime_type
  })

  const url = URL.createObjectURL(blob)

  if (esPDF(archivo)) {
    window.open(url, '_blank')
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = archivo.nombre_archivo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/')
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  router.push(destino === 'inicio'
    ? '/seguimiento'
    : `/seguimiento/${destino}`
  )
}

const tipoTexto = (t) => ({
  'periodo de prueba': 'Período de Prueba',
  'reincorporacion': 'Reincorporación'
}[t] || t)

const esPDF = (archivo) => {
  return archivo.mime_type === 'application/pdf'
}

const accionArchivo = (archivo) => {
  return esPDF(archivo) ? 'Ver' : 'Descargar'
}


const estadoTexto = (e) => ({
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  completado: 'Completado'
}[e] || e)

const estadoBadgeClass = (e) => ({
  pendiente: 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm',
  aprobado: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
  rechazado: 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm',
  completado: 'bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm'
}[e] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm')

const formatFecha = (f) =>
  f ? new Date(f).toLocaleDateString('es-BO') : '-'

onMounted(() => {
  const u = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = u.nombre || nombreResponsable.value
  fetchDetalle()
})
</script>
