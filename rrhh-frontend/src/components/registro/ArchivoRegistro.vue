<template>
  <div class="mb-6 border border-gray-300 rounded-lg p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <label class="text-sm font-medium text-gray-700">
        {{ label }}
      </label>

      <div class="flex space-x-2">
        <button
          v-if="archivo?.url"
          @click="verArchivo"
          type="button"
          class="text-sm text-[#009d71] hover:text-[#007a5c] font-medium"
        >
          Ver
        </button>

        <button
          @click="abrirSelector"
          type="button"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {{ archivo?.url ? 'Reemplazar' : 'Agregar archivo' }}
        </button>
      </div>
    </div>

    <!-- Estado -->
    <p class="text-sm text-gray-500">
      {{ archivo?.nombre_archivo || 'No hay archivo cargado' }}
    </p>

    <!-- Input oculto -->
    <input
      ref="inputFile"
      type="file"
      class="hidden"
      accept=".pdf,.jpg,.jpeg,.png"
      @change="onFileChange"
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  tipo: { type: String, required: true },
  archivo: { type: Object, default: null }
})

const emit = defineEmits(['subir'])

const inputFile = ref(null)

const abrirSelector = () => {
  inputFile.value.click()
}

const verArchivo = () => {
  if (props.archivo?.url) {
    window.open(props.archivo.url, '_blank')
  }
}

const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validaciones
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo supera los 5MB')
    return
  }

  const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (!tiposPermitidos.includes(file.type)) {
    alert('Formato no permitido (PDF, JPG, PNG)')
    return
  }

  emit('subir', {
    tipo: props.tipo,
    archivo: file
  })
}
</script>
