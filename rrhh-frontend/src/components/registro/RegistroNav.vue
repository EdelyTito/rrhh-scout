<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-8">
        <button
          @click="navegar('/registro')"
          :class="navClass('/registro')"
        >
          Inicio
        </button>

        <button
          @click="navegar('/registro/solicitudes-pendientes')"
          :class="navClass('solicitudes-pendientes', true)"
        >
          Solicitudes pendientes
        </button>

        <button
          @click="navegar('/registro/solicitudes-rechazadas')"
          :class="navClass('solicitudes-rechazadas', true)"
        >
          Solicitudes rechazadas
        </button>

        <button
          @click="navegar('/registro/dirigentes-habilitados')"
          :class="navClass('dirigentes-habilitados', true)"
        >
          Dirigentes habilitados
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  navClass: {
    type: Function,
    required: true
  },
  navegar: {
    type: Function,
    required: true
  }
})
</script>
