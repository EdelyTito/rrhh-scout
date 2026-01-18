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

    

    <!-- Main -->
    <main class="max-w-6xl mx-auto py-6 px-4">

        <!-- Volver -->
        <nav class="bg-white shadow-sm px-6 py-3">
            <button @click="volver"
                class="text-[#009d71] font-medium flex items-center gap-1 py-4">
                ← Volver a solicitudes
            </button>
        </nav>

      <div v-if="loading" class="text-center text-gray-500 py-12">
        Cargando seguimiento...
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 p-4 rounded-lg">
        {{ error }}
      </div>

      <div v-else class="space-y-6">
        <!-- Info principal -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ seguimiento.nombre_participante }}
            </h2>
            <span
            :class="estadoBadgeClass(estadoLogico)">
            {{ estadoTexto(estadoLogico) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><strong>Correo:</strong> {{ seguimiento.correo || '-' }}</p>
            <p><strong>Grupo:</strong> {{ seguimiento.grupo || '-' }}</p>

            <p><strong>Rama:</strong> {{ ramaTexto(seguimiento.rama_scout) }}</p>
            <p><strong>Tipo aprobación:</strong> {{ nivelTexto(seguimiento.tipo_im) }}</p>

            <p><strong>Fecha creación:</strong> {{ formatFecha(seguimiento.fecha_creacion) }}</p>
            <p><strong>Última actualización:</strong> {{ formatFecha(seguimiento.fecha_actualizacion) }}</p>

            <p v-if="seguimiento.fecha_entrevista">
                <strong>Fecha entrevista:</strong> {{ formatFecha(seguimiento.fecha_entrevista) }}
            </p>

        </div>
        </div>


        <!-- Acciones finales -->
        <div
            v-if="puedeMostrarAcciones && puedePasarAEntrevista"
            class="bg-white p-6 rounded-lg shadow border flex justify-end gap-3"
        >
            <button
                @click="noPasaEntrevista"
                class="px-5 py-2 rounded-lg text-sm font-medium
                    bg-red-100 text-red-700 hover:bg-red-200"
            >
                No pasa a entrevista
            </button>

            <button
                @click="pasarAEntrevista"
                class="px-5 py-2 rounded-lg text-sm font-semibold
                    bg-blue-600 text-white hover:bg-blue-700"
            >
                Pasar a entrevista
            </button>
        </div>

        <div
        v-if="puedeMostrarAcciones && puedeAprobar"
        class="bg-white p-6 rounded-lg shadow border flex justify-end gap-3"
        >
            <button
                @click="finalizar('no aprobó')"
                 class="px-5 py-2 rounded-lg text-sm font-medium
                bg-red-600 text-white hover:bg-red-700"
            >
            No aprobó
            </button>

            <button
                @click="finalizar('aprobado')"
                class="px-5 py-2 rounded-lg text-sm font-semibold
                bg-green-600 text-white hover:bg-green-700"
            >
            Aprobar
            </button>
        </div>


        <!-- Historial -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold mb-4 border-b pb-2">
            Historial de entregas
          </h3>


          <ul class="space-y-3">
            <li v-for="entrega in entregas" :key="entrega.id"
              class="border border-gray-200 rounded-lg p-4">
              <p class="font-medium text-gray-800">{{ entrega.observaciones || 'Sin observaciones' }}</p>
              <p class="text-sm text-gray-600">
                {{ formatFecha(entrega.fecha) }}
              </p>

              <div v-if="entrega.archivos.length" class="mt-3 space-y-1">
                <p class="font-semibold text-sm">Documentos:</p>

                <ul class="list-disc ml-5 text-sm">
                    <li
                    v-for="archivo in entrega.archivos"
                    :key="archivo.id"
                    class="flex items-center justify-between"
                    >
                    <span>
                        {{ archivo.tipo }} — {{ archivo.nombre }}
                    </span>

                    <button
                        @click="verArchivo(archivo)"
                        class="px-3 py-1 rounded-md text-xs font-bold
                            bg-green-100 text-gray-700 hover:bg-gray-200"
                    >
                        {{ archivo.mime.includes('pdf') ? 'Ver' : 'Descargar' }}
                    </button>
                    </li>
                </ul>
            </div>
            </li>
          </ul>
        </div>

        <div
        v-if="puedeDevolver"
        class="bg-white p-6 rounded-lg shadow border"
        >
        <h3 class="font-semibold text-gray-800 mb-2">
            Enviar observaciones al dirigente
        </h3>

        <textarea
            v-model="textoObservaciones"
            rows="4"
            placeholder="Escriba las observaciones..."
            class="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#009d71]"
        />

        <input
            type="file"
            multiple
            @change="onArchivosObservados"
            class="mt-2 text-sm"
        />

        <div class="mt-3 flex justify-end">
            <button
            @click="enviarObservaciones"
            class="bg-[#009d71] text-white px-5 py-2 rounded-lg hover:bg-[#007a5c]"
            >
            Enviar observaciones
            </button>
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
import SeguimientoHeader from '../../components/seguimiento/SeguimientoHeader.vue';
import SeguimientoNav from '../../components/seguimiento/SeguimientoNav.vue';
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'

const props = defineProps({
  embebido: {
    type: Boolean,
    default: false
  }
})

const esAdmin = computed(() => props.embebido === true)

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Seguimiento')
const seguimiento = ref({})
const entregas = ref([])
const loading = ref(false)
const error = ref(null)
const rutaActiva = ref('solicitudes-pendientes')

const textoObservaciones = ref('')

const archivosObservados = ref([])

const fetchDetalle = async () => {
  loading.value = true
  try {
    const { data } = await seguimientoService.getDetalleCompleto(route.params.id)
    seguimiento.value = data.seguimiento
    entregas.value = data.entregas
  } catch (e) {
    error.value = 'No se pudo cargar el seguimiento'
  } finally {
    loading.value = false
  }
}

const finalizar = async (resultado) => {
  if (!confirm('¿Confirmar resultado final?')) return

  await seguimientoService.actualizarResultado(route.params.id, {
    resultado_final: resultado
  })

  seguimiento.value.resultado_final = resultado
  seguimiento.value.estado = resultado === 'aprobado' ? 'aprobado' : 'no aprobó'
}


const volver = () => {
  router.push('/seguimiento/solicitudes-pendientes')
}

const esUltimaEntrega = computed(() => {
  if (!entregas.value.length) return false
  const ultima = entregas.value[entregas.value.length - 1]
  return ultima.etapa === 'entrega final'
})

const puedePasarAEntrevista = computed(() =>
  seguimiento.value.estado === 'entrega final'
)

const puedeAprobar = computed(() =>
  seguimiento.value.estado === 'en entrevista'
)

const puedeMostrarAcciones = computed(() => {
  return entregas.value.length > 0
})

const estadoLogico = computed(() => {
  return seguimiento.value.estado || '—'
})

const pasarAEntrevista = async () => {
  await seguimientoService.cambiarEstado(route.params.id, {
    estado: 'en entrevista'
  })
  seguimiento.value.estado = 'en entrevista'
}

const noPasaEntrevista = async () => {
  if (!confirm('¿Marcar como no aprobado?')) return

  await seguimientoService.actualizarResultado(route.params.id, {
    resultado_final: 'no aprobó'
  })

  seguimiento.value.estado = 'no aprobó'
}

const puedeDevolver = computed(() =>
  ['primera entrega', 'segunda entrega'].includes(seguimiento.value.estado)
)

const enviarObservaciones = async () => {
  if (!textoObservaciones.value.trim()) {
    alert('Debe escribir observaciones')
    return
  }

  const formData = new FormData()
  formData.append('observaciones', textoObservaciones.value)

  archivosObservados.value.forEach(file => {
    formData.append('archivos', file)
  })

  await seguimientoService.devolverSeguimiento(
    route.params.id,
    formData
  )

  textoObservaciones.value = ''
  archivosObservados.value = []
  await fetchDetalle()

  alert('Observaciones enviadas correctamente')
}

const onArchivosObservados = (e) => {
  archivosObservados.value = Array.from(e.target.files)
}

const verArchivo = async (archivo) => {
  try {
    const response = await seguimientoService.descargarArchivo(archivo.id)

    const blob = new Blob([response.data], { type: archivo.mime })
    const url = window.URL.createObjectURL(blob)

    // Si es PDF o imagen → abrir
    if (
      archivo.mime.includes('pdf') ||
      archivo.mime.includes('image')
    ) {
      window.open(url, '_blank')
    } 
    // Si es Word / Excel → descargar
    else {
      const a = document.createElement('a')
      a.href = url
      a.download = archivo.nombre
      a.click()
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    alert('No se pudo abrir el archivo')
  }
}

const ramaTexto = (r) => ({
  lobatos: 'Lobatos',
  exploradores: 'Exploradores',
  pioneros: 'Pioneros',
  rovers: 'Rovers'
}[r] || r || '—')

const cerrarSesion = () => {
  localStorage.clear()
  router.push('/')
}

const nivelTexto = (v) => ({
  IM2: 'IM Nivel II',
  IM3: 'IM Nivel III',
  'Paxtu Grupo': 'Paxtu Grupo',
  'Paxtu Distrito': 'Paxtu Distrito',
  'Koodoo Formación': 'Koodoo Formación',
  'Koodoo Director': 'Koodoo Director'
}[v] || v)

const estadoTexto = (e) => ({
  'primera entrega': 'Primera entrega',
  'devolución 1': 'Observaciones (1)',
  'segunda entrega': 'Segunda entrega',
  'devolución 2': 'Observaciones (2)',
  'entrega final': 'Entrega final',
  'en entrevista': 'En entrevista',
  'aprobado': 'Aprobado',
  'no aprobó': 'No aprobó'
}[e] || e)

const estadoBadgeClass = (e) => ({
  'primera entrega': 'bg-yellow-100 text-yellow-800',
  'devolución 1': 'bg-orange-100 text-orange-800',
  'segunda entrega': 'bg-yellow-100 text-yellow-800',
  'devolución 2': 'bg-orange-100 text-orange-800',
  'entrega final': 'bg-indigo-100 text-indigo-800',
  'en entrevista': 'bg-blue-100 text-blue-800',
  'aprobado': 'bg-green-100 text-green-800',
  'no aprobó': 'bg-red-100 text-red-800'
}[e] || 'bg-gray-100 text-gray-800')

const formatFecha = (f) =>
  f ? new Date(f).toLocaleDateString('es-ES') : '-'

onMounted(() => {
  const u = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = u.nombre || nombreResponsable.value
  fetchDetalle()
})

const navegarA = (destino) => {
    rutaActiva.value = destino
    if (destino === 'inicio') {
        router.push('/seguimiento')
    } else {
        router.push(`/seguimiento/${destino}`)
    }
}


</script>
