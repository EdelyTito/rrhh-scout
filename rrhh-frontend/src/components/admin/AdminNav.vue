<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex space-x-8">

        <button @click="irA('/admin')" :class="navClass('/admin')">
          Inicio
        </button>

        <!-- Comisiones -->
        <div class="relative">
          <button
            @click="$emit('toggleComisiones')"
            :class="comisionesClass"
          >
            Comisiones
            <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="comisionesAbierto"
            class="absolute left-0 mt-1 w-64 bg-white rounded-md shadow-lg border z-10"
          >
            <button
              @click="irAComision('/admin/registro')"
              :class="dropdownClass('/admin/registro')"
            >
              Registro y Habilitación
            </button>

            <button
              @click="irAComision('/admin/formacion')"
              :class="dropdownClass('/admin/formacion')"
            >
              Formación
            </button>
            
            <button
              @click="irAComision('/admin/seguimiento')"
              :class="dropdownClass('/admin/seguimiento')"
            >
              Seguimiento
            </button>

          </div>
        </div>

        <button @click="irA('/admin/lista-usuarios')" :class="navClass('/admin/lista-usuarios')">
          Lista de usuarios
        </button>

        <button @click="irA('/admin/logs')" :class="navClass('/admin/logs')">
          Logs del sistema
        </button>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const emit = defineEmits(['toggleComisiones', 'cerrarComisiones'])

const props = defineProps({
  comisionesAbierto: Boolean
})

const router = useRouter()
const route = useRoute()

const irA = (path) => {
  router.push(path)
}

const navClass = (path) => {
  const base = 'py-4 px-2 border-b-2 font-medium text-sm transition duration-200'

  if (path === '/admin') {
    return route.path === '/admin'
      ? `${base} border-[#009d71] text-[#009d71]`
      : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
  }

  return route.path === path || route.path.startsWith(path + '/')
    ? `${base} border-[#009d71] text-[#009d71]`
    : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
}

const esRutaComision = () => {
  return (
    route.path.startsWith('/admin/seguimiento') ||
    route.path.startsWith('/admin/formacion') ||
    route.path.startsWith('/admin/registro')
  )
}

const comisionesClass = computed(() => {
  const base =
    'py-4 px-2 border-b-2 font-medium text-sm transition duration-200 flex items-center'

  return esRutaComision() || props.comisionesAbierto
    ? `${base} border-[#009d71] text-[#009d71]`
    : `${base} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
})

const dropdownClass = (path) => {
  const base = 'dropdown-item'

  return route.path === path || route.path.startsWith(path + '/')
    ? `${base} bg-[#009d71]/10 border-l-4 border-[#009d71] font-medium`
    : base
}

const irAComision = (path) => {
  emit('cerrarComisiones')
  router.push(path)
}


</script>


<style scoped>  
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  background: white;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}
</style>