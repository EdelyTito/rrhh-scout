<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-8">

        <button
          @click="$emit('navegar', 'inicio-formacion')"
          :class="clase('inicio-formacion')"
        >
          Inicio
        </button>

        <button
          @click="$emit('navegar', 'lista-cursos')"
          :class="clase('lista-cursos')"
        >
          Lista de cursos
        </button>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  rutaActiva: {
    type: String,
    required: true
  }
})

const clase = (ruta) => [
  'py-4 px-2 border-b-2 font-medium text-sm transition duration-200',
  props.rutaActiva === ruta
    ? 'border-[#009d71] text-[#009d71]'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
]


</script>
