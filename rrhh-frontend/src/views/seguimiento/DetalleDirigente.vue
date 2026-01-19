<template>
  <div class="min-h-screen bg-gray-50">

    <SeguimientoHeader
      v-if="!embebido"
      :nombre="nombreResponsable"
      @logout="cerrarSesion"
    />

    <SeguimientoNav
      v-if="!embebido"
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
          ← Volver a lista de dirigentes
        </button>
      </nav>

      <div v-if="loading" class="text-center text-gray-500 py-12">
        Cargando dirigente...
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else class="space-y-6">

        <!-- INFO PRINCIPAL -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ seguimiento.nombre_participante }}
            </h2>

            <span :class="estadoBadgeClass(seguimiento.resultado_final)">
              {{ estadoTexto(seguimiento.resultado_final) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>Correo:</strong> {{ seguimiento.correo || '-' }}</p>
            <p><strong>Grupo:</strong> {{ seguimiento.grupo || '-' }}</p>
            <p><strong>Rama:</strong> {{ ramaTexto(seguimiento.rama_scout) }}</p>
            <p><strong>Tipo aprobación:</strong> {{ nivelTexto(seguimiento.tipo_im) }}</p>
            <p><strong>Fecha creación:</strong> {{ formatFecha(seguimiento.fecha_creacion) }}</p>
            <p><strong>Última actualización:</strong> {{ formatFecha(seguimiento.fecha_actualizacion) }}</p>
          </div>
        </div>

        <!-- HISTORIAL DE ENTREGAS -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">
            Historial del proceso
          </h3>

          <div
            v-for="entrega in entregas"
            :key="entrega.id"
            class="border border-gray-200 rounded-lg p-4 mb-4"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-gray-800">
                {{ estadoTexto(entrega.etapa) }}
              </h4>
              <span class="text-sm text-gray-500">
                {{ formatFecha(entrega.fecha) }}
              </span>
            </div>

            <p class="text-sm text-gray-700 mb-3">
              {{ entrega.observaciones || 'Sin observaciones' }}
            </p>

            <div v-if="entrega.archivos.length">
              <p class="font-semibold text-sm mb-1">Documentos:</p>
              <ul class="list-disc ml-5 space-y-1 text-sm">
                <li
                  v-for="archivo in entrega.archivos"
                  :key="archivo.id"
                  class="flex justify-between items-center"
                >
                  <span>{{ archivo.tipo }} — {{ archivo.nombre }}</span>

                  <button
                    @click="verArchivo(archivo)"
                    class="px-3 py-1 rounded-md text-xs font-semibold
                           bg-gray-100 hover:bg-gray-200"
                  >
                    {{ archivo.mime.includes('pdf') ? 'Ver' : 'Descargar' }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'

const props = defineProps({
  embebido: {
    type: Boolean,
    default: false
  }
})

const baseRuta = computed(() =>
  props.embebido ? '/admin/seguimiento' : '/seguimiento'
)

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Seguimiento')
const rutaActiva = ref('lista-dirigentes')

const seguimiento = ref({})
const entregas = ref([])
const loading = ref(false)
const error = ref(null)

const fetchDetalle = async () => {
  loading.value = true
  try {
    const { data } = await seguimientoService.getDetalleCompleto(route.params.id)
    seguimiento.value = data.seguimiento
    entregas.value = data.entregas
  } catch (e) {
    error.value = 'No se pudo cargar el dirigente'
  } finally {
    loading.value = false
  }
}

const volver = () => {
  router.push(`${baseRuta.value}/lista-dirigentes`)
}

const verArchivo = async (archivo) => {
  const response = await seguimientoService.descargarArchivo(archivo.id)
  const blob = new Blob([response.data], { type: archivo.mime })
  const url = URL.createObjectURL(blob)

  if (archivo.mime.includes('pdf') || archivo.mime.includes('image')) {
    window.open(url, '_blank')
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = archivo.nombre
    a.click()
  }

  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/')
}

const navegarA = (destino) => {
  rutaActiva.value = destino

  if (destino === 'inicio') {
    router.push(baseRuta.value)
  } else {
    router.push(`${baseRuta.value}/${destino}`)
  }
}

const nivelTexto = (v) => ({
  IM2: 'IM Nivel II',
  IM3: 'IM Nivel III',
  'Paxtu Grupo': 'Paxtu Grupo',
  'Paxtu Distrito': 'Paxtu Distrito',
  'Koodoo Formación': 'Koodoo Formación',
  'Koodoo Director': 'Koodoo Director'
}[v] || v)

const ramaTexto = (r) => ({
  lobatos: 'Lobatos',
  exploradores: 'Exploradores',
  pioneros: 'Pioneros',
  rovers: 'Rovers'
}[r] || '—')

const estadoTexto = (e) => ({
  'primera entrega': 'Primera entrega',
  'devolución 1': 'Observaciones (1)',
  'segunda entrega': 'Segunda entrega',
  'devolución 2': 'Observaciones (2)',
  'entrega final': 'Entrega final',
  'aprobado': 'Aprobado',
  'no aprobó': 'No aprobó'
}[e] || e)

const estadoBadgeClass = (e) => ({
  aprobado: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm',
  'no aprobó': 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm'
}[e] || 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm')

const formatFecha = (f) =>
  f ? new Date(f).toLocaleDateString('es-BO') : '-'

onMounted(() => {
  const u = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = u.nombre || nombreResponsable.value
  fetchDetalle()
})
</script>
