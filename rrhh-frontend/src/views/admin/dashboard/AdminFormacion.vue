<template>
  <div>
    <div class="mb-6 border-b flex gap-6">

      <button
        @click="irA('/admin/formacion')"
        :class="tabClass('/admin/formacion')"
      >
        Inicio
      </button>

      <button
        @click="irA('/admin/formacion/lista-cursos')"
        :class="tabClass('/admin/formacion/lista-cursos', true)"
      >
        Lista de cursos
      </button>

    </div>

    <router-view />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const irA = (path) => {
  router.push(path)
}

const tabClass = (path, startsWith = false) => {
  const base = 'pb-2 font-medium transition'

  const activo = startsWith
    ? route.path.startsWith(path)
    : route.path === path

  return activo
    ? `${base} border-b-2 border-[#009d71] text-[#009d71]`
    : `${base} text-gray-500 hover:text-gray-700`
}
</script>
