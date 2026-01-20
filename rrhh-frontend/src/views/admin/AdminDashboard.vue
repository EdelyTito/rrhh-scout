<template>
  <div class="min-h-screen bg-gray-50">
    <AdminHeader
      :nombre-responsable="nombreResponsable"
      @logout="cerrarSesion"
    />

    <AdminNav
      :comisionesAbierto="comisionesAbierto"
      @toggleComisiones="comisionesAbierto = !comisionesAbierto"
      @cerrarComisiones="comisionesAbierto = false"
    />

    <main class="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <footer class="bg-white border-t mt-12">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <p class="text-center text-gray-500 text-sm">
          Desarrollado por Edely Tito - GSA
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AdminHeader from '../../components/admin/AdminHeader.vue'
import AdminNav from '../../components/admin/AdminNav.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminService } from '../../services/api'
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
