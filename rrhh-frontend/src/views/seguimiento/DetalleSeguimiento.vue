<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-[#009d71] shadow-sm">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <img src="/images/rraa.png" class="h-10" />
          <h1 class="text-xl font-bold text-white">Sistema RRHH - Distrito Scout</h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-white">¡Hola {{ nombreResponsable }}!</span>
          <button @click="cerrarSesion"
            class="bg-white text-[#009d71] px-4 py-2 rounded-lg font-semibold">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
            <button
            @click="navegarA('inicio')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200',
                rutaActiva === 'inicio'
                ? 'border-[#009d71] text-[#009d71]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
            Inicio
            </button>
            <button
            @click="navegarA('solicitudes')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200',
                rutaActiva === 'solicitudes'
                ? 'border-[#009d71] text-[#009d71]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
            Solicitudes Pendientes
            </button>
            <button
            @click="navegarA('lista-dirigentes')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200',
                rutaActiva === 'lista-dirigentes'
                ? 'border-[#009d71] text-[#009d71]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
            Lista de Dirigentes
            </button>
            <button
            @click="navegarA('periodo-prueba')"
            :class="['py-4 px-2 border-b-2 font-medium text-sm transition duration-200',
                rutaActiva === 'periodo-prueba'
                ? 'border-[#009d71] text-[#009d71]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            >
            Periodo de Prueba
            </button>
        </div>
        </div>
    </nav>

    <!-- Volver -->
    <nav class="bg-white shadow-sm px-6 py-3">
      <button @click="volver"
        class="text-[#009d71] font-medium flex items-center gap-1 py-4">
        ← Volver a solicitudes
      </button>
    </nav>

    <!-- Main -->
    <main class="max-w-6xl mx-auto py-6 px-4">
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
            <p><strong>Grupo:</strong> {{ seguimiento.grupo }}</p>
            <p><strong>Tipo IM:</strong> {{ nivelTexto(seguimiento.tipo_im) }}</p>
            <p><strong>Proceso:</strong> {{ seguimiento.tipo_proceso }}</p>
            <p><strong>Fecha:</strong> {{ formatFecha(seguimiento.fecha_creacion) }}</p>
            <p><strong>Resultado final:</strong> {{ seguimiento.resultado_final || '—' }}</p>
          </div>
        </div>

        <!-- Acciones finales -->
        <div
          v-if="puedeEntrevistar"
          class="bg-white p-6 rounded-lg shadow border flex gap-4">
          <button @click="finalizar('aprobado')"
            class="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
            Aprobar
          </button>
          <button @click="finalizar('rechazado')"
            class="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold">
            No aprobó
          </button>
        </div>

        <!-- Historial -->
        <div class="bg-white p-6 rounded-lg shadow border">
          <h3 class="text-lg font-semibold mb-4">Historial de entregas</h3>

          <ul class="space-y-3">
            <li v-for="entrega in entregas" :key="entrega.id"
              class="border border-gray-200 rounded-lg p-4">
              <p class="font-medium text-gray-800">{{ entrega.etapa }}</p>
              <p class="text-sm text-gray-600">
                {{ formatFecha(entrega.fecha) }}
              </p>
              <p class="text-sm mt-1">
                {{ entrega.observaciones || 'Sin observaciones' }}
              </p>
              <a v-if="entrega.documento_url"
                :href="entrega.documento_url"
                target="_blank"
                class="text-[#009d71] text-sm font-medium">
                Ver documento
              </a>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { seguimientoService } from '../../services/api'

const route = useRoute()
const router = useRouter()

const nombreResponsable = ref('Responsable de Seguimiento')
const seguimiento = ref({})
const entregas = ref([])
const loading = ref(false)
const error = ref(null)
const rutaActiva = ref('solicitudes')

const fetchDetalle = async () => {
  loading.value = true
  try {
    const { data } = await seguimientoService.getSeguimiento(route.params.id)
    seguimiento.value = data.seguimiento
    entregas.value = data.entregas
  } catch {
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

const estadoLogico = computed(() => {
  if (seguimiento.value.resultado_final === 'aprobado') return 'aprobado'
  if (seguimiento.value.resultado_final === 'no aprobó') return 'no aprobó'
  if (puedeEntrevistar.value) return 'en entrevista'
  return seguimiento.value.estado
})


const volver = () => {
  router.push('/seguimiento/solicitudes-pendientes')
}

const esUltimaEntrega = computed(() => {
  return entregas.value.some(e => e.etapa === 'entrega final')
})

const puedeEntrevistar = computed(() => {
  return (
    esUltimaEntrega.value &&
    !seguimiento.value.resultado_final
  )
})

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
  'segunda entrega': 'Segunda entrega',
  'entrega final': 'Entrega final',
  'en entrevista': 'En entrevista',
  'aprobado': 'Aprobado',
  'no aprobó': 'No aprobó'
}[e] || e)

const estadoBadgeClass = (e) => ({
  'primera entrega': 'bg-yellow-100 text-yellow-800',
  'en entrevista': 'bg-blue-100 text-blue-800',
  'aprobado': 'bg-green-100 text-green-800',
  'no aprobó': 'bg-red-100 text-red-800'
}[e] || 'bg-gray-100')

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
