<template>
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const INACTIVITY_LIMIT = 15 * 60 * 1000 // 15 minutos

let inactivityTimer = null

const cerrarSesionPorInactividad = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')

  alert('La sesión se cerró por inactividad')

  router.push('/')
}

const resetInactivityTimer = () => {
  if (!localStorage.getItem('token')) return

  if (inactivityTimer) clearTimeout(inactivityTimer)

  inactivityTimer = setTimeout(() => {
    cerrarSesionPorInactividad()
  }, INACTIVITY_LIMIT)
}

const eventos = ['mousemove', 'keydown', 'click', 'scroll']

onMounted(() => {
  eventos.forEach(evento => {
    window.addEventListener(evento, resetInactivityTimer)
  })

  resetInactivityTimer()
})

onBeforeUnmount(() => {
  eventos.forEach(evento => {
    window.removeEventListener(evento, resetInactivityTimer)
  })

  if (inactivityTimer) clearTimeout(inactivityTimer)
})
</script>
