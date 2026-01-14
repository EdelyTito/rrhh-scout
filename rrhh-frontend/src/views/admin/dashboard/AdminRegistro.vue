<template>
  <div>
    <div class="mb-6 border-b flex gap-6">
      <button
        v-for="item in tabs"
        :key="item.key"
        @click="irA(item.path)"
        :class="tabClass(item.path)"
      >
        {{ item.label }}
      </button>
    </div>
    <router-view/>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { label: 'Resumen', path: '/admin/registro' },
  { label: 'Solicitudes pendientes', path: '/admin/registro/solicitudes-pendientes' },
  { label: 'Solicitudes rechazadas', path: '/admin/registro/solicitudes-rechazadas' },
  { label: 'Dirigentes habilitados', path: '/admin/registro/dirigentes-habilitados' },
]

const irA = (path) => {
  router.push(path)
}

const tabClass = (path) => {
  const base = 'pb-2 font-medium transition'

  if (path === '/admin/registro') {
    return route.path === '/admin/registro'
      ? `${base} border-b-2 border-[#009d71] text-[#009d71]`
      : `${base} text-gray-500 hover:text-gray-700`
  }

  return route.path === path || route.path.startsWith(path + '/')
    ? `${base} border-b-2 border-[#009d71] text-[#009d71]`
    : `${base} text-gray-500 hover:text-gray-700`
}


</script>
