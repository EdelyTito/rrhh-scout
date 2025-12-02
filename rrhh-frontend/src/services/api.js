// src/services/api.js
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 12000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => Promise.reject(err))

// Response interceptor: maneja 401 (salir) excepto en login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login' 
    }
    return Promise.reject(error)
  }
)

// Servicios 
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/register'),
  // opcionales para más endpoints:
  getUser: (id) => api.get(`/auth/${id}`),
  updateUser: (id, data) => api.put(`/auth/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/${id}`)
}

export const logsService = {
  getLogs: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.tabla) params.append('tabla', filters.tabla)
    if (filters.usuario_id) params.append('usuario_id', filters.usuario_id)
    return api.get(`/logs?${params.toString()}`)
  }
}

export const dirigentesService = {
  getDirigentes: () => api.get('/dirigentes'),
  createDirigente: (data) => api.post('/dirigentes', data),
  updateDirigente: (id, data) => api.put(`/dirigentes/${id}`, data),
  deleteDirigente: (id) => api.delete(`/dirigentes/${id}`)
}

export const formacionService = {
  getCursos: () => api.get('/formacion/cursos'),
  createCurso: (data) => api.post('/formacion/cursos', data),
  createModulo: (cursoId, data) => api.post(`/formacion/cursos/${cursoId}/modulos`, data),
  registrarAsistencia: (data) => api.post('/formacion/asistencias', data)
}

export const seguimientoService = {
  getSeguimientos: () => api.get('/seguimiento'),
  getSeguimiento: (id) => api.get(`/seguimiento/${id}`),
  crearEntrega: (id, data) => api.post(`/seguimiento/${id}/entregas`, data),
  actualizarResultado: (id, data) => api.put(`/seguimiento/${id}/resultado`, data),
  getReincorporaciones: () => api.get('/seguimiento/reincorporacion'),
  enviarFormularioPublico: (data) => api.post('/seguimiento/public', data),
  enviarReincorporacion: (data) => api.post('/seguimiento/reincorporacion', data)
}

export const registroService = {
  getSolicitudes: () => api.get('/registro'),
  actualizarSolicitud: (id, data) => api.put(`/registro/${id}`, data),
  actualizarDirigente: (id, data) => api.put(`/registro/dirigente/${id}`, data),
  eliminarSolicitud: (id) => api.delete(`/registro/${id}`),
  enviarSolicitudPublica: (data) => api.post('/registro/public', data)
}

export const dashboardService = {
  getSummary: (params = {}) => api.get('/admin/summary', { params })
}

export default api
