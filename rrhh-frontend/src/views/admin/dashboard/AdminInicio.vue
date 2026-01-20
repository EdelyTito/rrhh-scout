<template>
    <div class="px-4 py-4 sm:px-0">
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
                Bienvenido Administrador
            </h2>
            <p class="text-gray-600">
              Panel de control principal del sistema de Recursos Humanos
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Último acceso registrado:
              <span class="font-medium text-gray-700">
                {{ formatFechaHora(dashboard.ultimo_login) }}
              </span>
            </p>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

            <!-- Seguimiento -->
            <div class="bg-[#009d71] rounded-lg p-8 border-2 border-black shadow-lg">
              <h3 class="text-lg font-bold text-white mb-4">Seguimiento</h3>
              <p class="text-sm text-white">Solicitudes totales</p>
              <p class="text-4xl font-bold text-white">
                {{ dashboard.seguimiento.total }}
              </p>
              <p class="text-xs text-white mt-2">
                ✔ {{ dashboard.seguimiento.aprobados }} aprobadas<br>
              </p>
            </div>

            <!-- Formación -->
            <div class="bg-white rounded-lg p-8 border-2 border-black shadow-lg">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Formación</h3>
              <p class="text-sm text-gray-600">Cursos registrados</p>
              <p class="text-4xl font-bold text-gray-900">
                {{ dashboard.formacion.total_cursos }}
              </p>
              <p class="text-xs text-gray-500 mt-2">
                {{ dashboard.formacion.cursos_activos }} activos
              </p>
            </div>

            <!-- Registro -->
            <div class="bg-[#d32d27] rounded-lg p-8 border-2 border-black shadow-lg">
              <h3 class="text-lg font-bold text-white mb-4">
                Registro y Habilitación
              </h3>
              <p class="text-sm text-white">Dirigentes habilitados</p>
              <p class="text-4xl font-bold text-white">
                {{ dashboard.registro.habilitados }}
              </p>
              <p class="text-xs text-white mt-2">
                ⏳ {{ dashboard.registro.pendientes }} pendientes
              </p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminService } from '../../../services/api'
import { watch } from 'vue'


const router = useRouter()
const route = useRoute()

const nombreResponsable = ref('Administrador')
const comisionesAbierto = ref(false)
const rutaActiva = ref('inicio')

const dashboard = ref({
  seguimiento: { total: 0, aprobados: 0, pendientes: 0 },
  formacion: { total_cursos: 0, cursos_activos: 0 },
  registro: { habilitados: 0, pendientes: 0 },
  ultimo_login: null
})

const formatFechaHora = (fecha) => {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleString('es-BO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const loadingDashboard = ref(false)

const cargarDashboard = async () => {
  loadingDashboard.value = true
  try {
    const res = await adminService.getDashboard()
    dashboard.value = res.data
  } catch (err) {
    console.error('Error cargando dashboard:', err)
  } finally {
    loadingDashboard.value = false
  }
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario?.nombre || 'Administrador'
  cargarDashboard()
})

const toggleComisiones = () => {
  comisionesAbierto.value = !comisionesAbierto.value
}

const navegarA = (destino) => {
  rutaActiva.value = destino
  comisionesAbierto.value = false

  if (destino === 'inicio') {
    vistaDashboard.value = 'inicio'
    router.push('/admin').catch(() => {})
    return
  }

  router.push(`/${destino}`).catch(() => {})
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/').catch(()=>{})
}

watch(
  () => route.query.comision,
  (comision) => {
    if (comision) {
      vistaDashboard.value = comision
    }
  },
  { immediate: true }
)

</script>
