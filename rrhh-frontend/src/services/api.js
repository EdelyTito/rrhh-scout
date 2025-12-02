// src/services/api.js
import axios from 'axios'

// Ajusta esta URL según tu backend
const API_URL = 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 EXCEPCIÓN: No redirigir para errores de login
    const isLoginEndpoint = error.config?.url?.includes('/auth/login')
    
    if (error.response?.status === 401 && !isLoginEndpoint) {
      // Token expirado o inválido (solo para endpoints que NO son login)
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/'
    }
    
    return Promise.reject(error)
  }
)

// Servicio de Autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/register')
}

// Servicio de Logs
export const logsService = {
  getLogs: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.tabla) params.append('tabla', filters.tabla)
    if (filters.usuario_id) params.append('usuario_id', filters.usuario_id)
    return api.get(`/logs?${params.toString()}`)
  }
}

// Servicio de Dirigentes
export const dirigentesService = {
  getDirigentes: () => api.get('/dirigentes'),
  createDirigente: (data) => api.post('/dirigentes', data),
  updateDirigente: (id, data) => api.put(`/dirigentes/${id}`, data),
  deleteDirigente: (id) => api.delete(`/dirigentes/${id}`)
}

// Servicio de Formación
export const formationService = {
  getCursos: () => api.get('/formation/cursos'),
  createCurso: (data) => api.post('/formation/cursos', data),
  createModulo: (cursoId, data) => api.post(`/formation/cursos/${cursoId}/modulos`, data),
  registrarAsistencia: (data) => api.post('/formation/asistencias', data)
}

// Servicio de Seguimiento
export const seguimientoService = {
  getSeguimientos: () => api.get('/seguimiento'),
  getSeguimiento: (id) => api.get(`/seguimiento/${id}`),
  crearEntrega: (id, data) => api.post(`/seguimiento/${id}/entregas`, data),
  actualizarResultado: (id, data) => api.put(`/seguimiento/${id}/resultado`, data),
  getReincorporaciones: () => api.get('/seguimiento/reincorporacion'),
  // Rutas públicas
  enviarFormularioPublico: (data) => api.post('/seguimiento/public', data),
  enviarReincorporacion: (data) => api.post('/seguimiento/reincorporacion', data)
}

// Servicio de Registro
export const registroService = {
  getSolicitudes: () => api.get('/registro'),
  actualizarSolicitud: (id, data) => api.put(`/registro/${id}`, data),
  actualizarDirigente: (id, data) => api.put(`/registro/dirigente/${id}`, data),
  eliminarSolicitud: (id) => api.delete(`/registro/${id}`),
  // Ruta pública
  enviarSolicitudPublica: (data) => api.post('/registro/public', data)
}

export default api