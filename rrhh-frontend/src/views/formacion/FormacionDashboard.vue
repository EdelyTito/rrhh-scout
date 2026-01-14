<template>
  <div class="min-h-screen bg-gray-50">

    <FormacionHeader
      :nombreResponsable="nombreResponsable"
      @cerrar-sesion="cerrarSesion"
    />

    <FormacionNav
      :rutaActiva="rutaActiva"
      @navegar="navegarA"
    />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Bienvenida -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Bienvenido a Formación</h1>
        </div>

        <!-- Contenido en dos columnas -->
          <!-- Columna izquierda: Cursos existentes (SOLO CONTADOR) -->
          <div class="mb-12 flex justify-center">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-3xl">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-800">Cursos existentes</h2>
                <div class="bg-[#009d71] text-white rounded-full h-16 w-16 flex items-center justify-center">
                  <span class="text-2xl font-bold">{{ totalCursos }}</span>
                </div>
              </div>

              <!-- SOLO CONTADOR - NO LISTA -->
              <div class="mt-8 text-center">
                <p class="text-gray-600 mb-4">Total de cursos registrados en el sistema</p>
                <div class="flex justify-center space-x-4">
                  <div class="text-center">
                    <div class="bg-green-100 text-green-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                      <span class="font-bold">{{ cursosActivos }}</span>
                    </div>
                    <p class="text-xs text-gray-600">Activos</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-blue-100 text-blue-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                      <span class="font-bold">{{ cursosPlanificados }}</span>
                    </div>
                    <p class="text-xs text-gray-600">Planificados</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-gray-100 text-gray-800 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                      <span class="font-bold">{{ cursosFinalizados }}</span>
                    </div>
                    <p class="text-xs text-gray-600">Finalizados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dirigentes que pueden dar cursos -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">
                Dirigentes que pueden dar algún módulo
              </h2>

              <button
                @click="abrirNuevoFormador"
                class="text-sm bg-[#009d71] text-white px-3 py-1 rounded hover:bg-[#007a5c]"
              >
                + Nuevo
              </button>
            </div>

            <!-- Lista numerada de dirigentes -->
            <div class="overflow-x-auto">
              <table class="min-w-full border text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border px-3 py-2 leading-snug text-left">Nombre</th>
                    <th class="border px-3 py-2 leading-snug text-left">Contacto</th>
                    <th class="border px-3 py-2 leading-snug text-left">Formación</th>
                    <th class="border px-3 py-2 leading-snug text-left">Estado</th>
                    <th class="border px-3 py-2 leading-snug text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="f in dirigentes" :key="f.id" class="hover:bg-gray-50">
                    <td class="border px-3 py-2 leading-snug font-medium">
                      {{ f.nombre }}
                    </td>

                    <td class="border px-3 py-2 leading-snug">
                      <div v-if="f.telefono">📞 {{ f.telefono }}</div>
                      <div v-if="f.email">✉️ {{ f.email }}</div>
                      <span v-if="!f.telefono && !f.email" class="text-gray-400">—</span>
                    </td>

                    <td class="border px-3 py-2 leading-snug">
                      <div><b>Programa:</b> {{ f.nivel_programa }}</div>
                      <div><b>Formador:</b> {{ f.nivel_formador }}</div>
                      <div><b>Gestión:</b> {{ f.nivel_gestion }}</div>
                    </td>

                    <td class="border px-3 py-2 leading-snug text-center">
                      <span
                        v-if="f.activo"
                        class="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                      >
                        Activo
                      </span>
                      <span
                        v-else
                        class="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
                      >
                        Inactivo
                      </span>
                    </td>

                    <td class="border px-3 py-2 leading-snug text-center space-x-2">
                      <button
                        class="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                        @click="abrirVerFormador(f)"
                      >
                        Ver
                      </button>
                      <button
                        class="px-2 py-1 text-xs bg-[#009d71] text-white rounded hover:bg-[#007a5c]"
                        @click="abrirEditarFormador(f)"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>

        <!-- Footer del módulo -->
        <footer class="mt-8 text-center">
          <p class="text-gray-500 text-sm">
            Desarrollado por Edely Tito - GSA • Distrito Scout La Paz
          </p>
        </footer>
      </div>
    </main>
  </div>

  <!-- ====MODAL FORMADOR======== -->
  <div
    v-if="mostrarModalFormador"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">

      <h2 class="text-xl font-semibold mb-4">
        {{ formadorEditando ? 'Editar formador' : 'Nuevo formador' }}
      </h2>

      <form @submit.prevent="guardarFormador">

        <!-- Nombre -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Nombre</label>
          <input
            v-model="formadorForm.nombre"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <!-- Programa -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Programa de jóvenes</label>
          <select v-model="formadorForm.nivel_programa" class="w-full border rounded px-3 py-2">
            <option>Ninguno</option>
            <option>Cursado - Curso Informativo</option>
            <option>Cursado - Insignia de madera Nivel II</option>
            <option>Aprobado - Insignia de madera Nivel II</option>
            <option>Cursado - Insignia de madera Nivel III</option>
            <option>Aprobado - Insignia de madera Nivel III</option>
          </select>
        </div>

        <!-- Formador -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Formador de líderes</label>
          <select v-model="formadorForm.nivel_formador" class="w-full border rounded px-3 py-2">
            <option>Ninguno</option>
            <option>Cursado - Asesores personales</option>
            <option>Cursado y aprobado - Adjunto de formación</option>
            <option>Cursado y aprobado - Director de formación</option>
          </select>
        </div>

        <!-- Gestión -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Gestión institucional</label>
          <select v-model="formadorForm.nivel_gestion" class="w-full border rounded px-3 py-2">
            <option>Ninguno</option>
            <option>Cursado - Paxtu Nivel Grupo</option>
            <option>Aprobado - Paxtu Nivel Grupo</option>
            <option>Cursado - Paxtu Nivel Distrito</option>
            <option>Aprobado - Paxtu Nivel Distrito</option>
          </select>
        </div>

        <!-- Contacto -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <input
            v-model="formadorForm.telefono"
            placeholder="Teléfono"
            class="border rounded px-3 py-2"
          />
          <input
            v-model="formadorForm.email"
            placeholder="Correo"
            class="border rounded px-3 py-2"
          />
        </div>

        <!-- Estado -->
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Estado</label>
          <select v-model="formadorForm.activo" class="w-full border rounded px-3 py-2">
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">
            Módulos que puede dictar
          </label>

          <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
            <label
              v-for="m in tiposModulo"
              :key="m.id"
              class="flex items-center space-x-2 text-sm"
            >
              <input
                type="checkbox"
                :value="m.id"
                v-model="formadorForm.modulos"
              />
              <span>{{ m.nombre }}</span>
            </label>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="mostrarModalFormador = false"
            class="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[#009d71] text-white rounded"
          >
            Guardar
          </button>
        </div>

      </form>
    </div>
  </div>

  <!-- ===== MODAL VER FORMADOR ===== -->
  <div
    v-if="mostrarModalVerFormador"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-xl font-semibold mb-4">Detalle del formador</h2>

      <p><b>Nombre:</b> {{ formadorVer.nombre }}</p>
      <p><b>Teléfono:</b> {{ formadorVer.telefono || '—' }}</p>
      <p><b>Email:</b> {{ formadorVer.email || '—' }}</p>

      <hr class="my-3">

      <p class="font-semibold">Módulos que puede dictar:</p>

      <ul class="list-disc list-inside mt-2">
        <li v-for="m in formadorVer.modulos" :key="m.id">
          {{ m.nombre }}
        </li>
        <li v-if="formadorVer.modulos.length === 0" class="text-gray-400">
          No tiene módulos asignados
        </li>
      </ul>

      <p><b>Programa:</b> {{ formadorVer.nivel_programa }}</p>
      <p><b>Formador:</b> {{ formadorVer.nivel_formador }}</p>
      <p><b>Gestión:</b> {{ formadorVer.nivel_gestion }}</p>

      <p class="mt-2">
        <b>Estado:</b>
        <span
          v-if="formadorVer.activo"
          class="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
        >
          Activo
        </span>
        <span
          v-else
          class="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700"
        >
          Inactivo
        </span>
      </p>

      <div class="flex justify-end mt-4">
        <button
          class="px-4 py-2 border rounded"
          @click="mostrarModalVerFormador = false"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import FormacionHeader from '../../components/formacion/FormacionHeader.vue'
import FormacionNav from '../../components/formacion/FormacionNav.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formacionService} from '../../services/api'

const mostrarModalFormador = ref(false)
const formadorEditando = ref(null)
const mostrarModalVerFormador = ref(false)
const formadorVer = ref(null)
const tiposModulo = ref([])

const router = useRouter()
const nombreResponsable = ref('Responsable de Formación')
const rutaActiva = ref('inicio-formacion')

const estadisticasCursos = ref({
  total: 0,
  activos: 0,
  planificados: 0,
  finalizados: 0,
})

const dirigentes = ref([])

const totalCursos = computed(() => estadisticasCursos.value.total)
const cursosActivos = computed(() => estadisticasCursos.value.activos)
const cursosPlanificados = computed(() => estadisticasCursos.value.planificados)
const cursosFinalizados = computed(() => estadisticasCursos.value.finalizados)

const cargarCursos = async () => {
  try {
    const res = await formacionService.getCursos()
    const cursos = Array.isArray(res.data) ? res.data : []

    estadisticasCursos.value.total = cursos.length

    estadisticasCursos.value.activos = cursos.filter(c => c.estado === 'activo').length
    estadisticasCursos.value.planificados = cursos.filter(c => c.estado === 'planificado').length
    estadisticasCursos.value.finalizados = cursos.filter(c => c.estado === 'finalizado').length

  } catch (err) {
    console.error('Error cargando cursos en dashboard formación:', err)
  }
}

const cargarDirigentes = async () => {
  try {
    const res = await formacionService.getFormadores()
    const formadores = Array.isArray(res.data) ? res.data : []

    dirigentes.value = formadores.map(f => ({
      id: f.id,
      nombre: f.nombre,
      telefono: f.telefono,
      email: f.email,
      nivel_programa: f.nivel_programa || 'Ninguno',
      nivel_formador: f.nivel_formador || 'Ninguno',
      nivel_gestion: f.nivel_gestion || 'Ninguno',
      activo: f.activo
    }))
  } catch (err) {
    console.error('Error cargando formadores:', err)
    dirigentes.value = []
  }
}

const cargarTiposModulo = async () => {
  const res = await formacionService.getTiposModulo()
  tiposModulo.value = res.data
}

const formadorForm = ref({
  nombre: '',
  nivel_programa: 'Ninguno',
  nivel_formador: 'Ninguno',
  nivel_gestion: 'Ninguno',
  telefono: '',
  email: '',
  activo: true
})

const abrirNuevoFormador = () => {
  formadorEditando.value = null
  formadorForm.value = {
    nombre: '',
    nivel_programa: 'Ninguno',
    nivel_formador: 'Ninguno',
    nivel_gestion: 'Ninguno',
    telefono: '',
    email: ''
  }
  mostrarModalFormador.value = true
}

const abrirEditarFormador = async (f) => {
  formadorEditando.value = f

  const res = await formacionService.getModulosFormador(f.id)

  formadorForm.value = {
    nombre: f.nombre,
    nivel_programa: f.nivel_programa,
    nivel_formador: f.nivel_formador,
    nivel_gestion: f.nivel_gestion,
    telefono: f.telefono,
    email: f.email,
    activo: f.activo,
    modulos: res.data.map(m => m.id)
  }

  mostrarModalFormador.value = true
}

const guardarFormador = async () => {
  try {
    if (formadorEditando.value?.id) {
      await formacionService.updateFormador(
        formadorEditando.value.id,
        formadorForm.value
      )

      await formacionService.updateModulosFormador(
        formadorEditando.value.id,
        { tipos_modulo: formadorForm.value.modulos }
      )
    } else {
      const res = await formacionService.createFormador(formadorForm.value)

      await formacionService.updateModulosFormador(
        res.data.id,
        { tipos_modulo: formadorForm.value.modulos }
      )
    }

    mostrarModalFormador.value = false
    await cargarDirigentes()
  } catch (err) {
    console.error('Error guardando formador:', err)
  }
}

const abrirVerFormador = async (f) => {
  formadorVer.value = { ...f, modulos: [] }

  const res = await formacionService.getModulosFormador(f.id)
  formadorVer.value.modulos = res.data

  mostrarModalVerFormador.value = true
}

onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  nombreResponsable.value = usuario.nombre || 'Responsable de Formación'

  cargarCursos()
  cargarDirigentes()
  cargarTiposModulo()
})

const navegarA = (destino) => {
  rutaActiva.value = destino
  switch (destino) {
    case 'inicio-formacion':
      router.push('/formacion')
      break
    case 'lista-cursos':
      router.push('/formacion/lista-cursos')
      break
  }
}

const cerrarSesion = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
