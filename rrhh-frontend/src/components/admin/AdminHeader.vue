<template>
  <header class="bg-[#009d71] shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <img 
            src="/images/rraa.png" 
            alt="Logo Distrito Scout"
            class="h-10 w-auto"
          >
          <h1 class="text-2xl font-bold text-white">
            Sistema RRHH - Distrito Scout
          </h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-white">¡Hola {{ nombreResponsable }}!</span>
          <button 
            @click="$emit('logout')"
            class="bg-white text-[#009d71] px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-200 font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  nombreResponsable: {
    type: String,
    required: true
  }
})

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
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}
</style>