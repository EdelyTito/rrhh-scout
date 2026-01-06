import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 12000
})

const apiFormData = axios.create({
  bbaseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

apiFormData.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => Promise.reject(err))

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/primer-ingreso') ||
      url.includes('/auth/forgot-password')

    if (status === 423) {
      return Promise.reject(error)
    }

    if (status === 401 && !isAuthRoute) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/'
    }

    return Promise.reject(error)
  }
)

// Servicios 
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getUsers: () => api.get('/auth/register'),
  getUser: (id) => api.get(`/auth/${id}`),
  updateUser: (id, data) => api.put(`/auth/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/${id}`),
  forgotPassword: (correo) => api.post('/auth/forgot-password', { correo }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  resetPasswordPrimerIngreso: (data) => api.post('/auth/primer-ingreso', data),
  reactivarUser: (id) => api.patch(`/auth/${id}/reactivar`)
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
  getCurso: (id) => api.get(`/formacion/cursos/${id}`),             
  updateCurso: (id, data) => api.put(`/formacion/cursos/${id}`, data),
  deleteCurso: (id) => api.delete(`/formacion/cursos/${id}`),
  getModulos: (cursoId) => api.get(`/formacion/cursos/${cursoId}/modulos`), 
  createCurso: (data) => api.post('/formacion/cursos', data),
  createModulo: (cursoId, data) => api.post(`/formacion/cursos/${cursoId}/modulos`, data),
  getAsistencias: (moduloId) => api.get(`/formacion/modulos/${moduloId}/asistencias`), 
  registrarAsistencia: (data) => api.post('/formacion/asistencias', data)
}


export const seguimientoService = {
  getSeguimientos: () => api.get('/seguimiento'),
  getSeguimiento: (id) => api.get(`/seguimiento/${id}`),
  crearEntrega: (id, data) => api.post(`/seguimiento/${id}/entregas`, data),
  actualizarResultado: (id, data) => api.put(`/seguimiento/${id}/resultado`, data),
  getReincorporaciones: () => api.get('/seguimiento/reincorporacion'),
  enviarFormularioPublico: (data) => api.post('/seguimiento/public', data),
  enviarReincorporacion: (data) => api.post('/seguimiento/reincorporacion', data),
  getEstadisticas: () => api.get('/seguimiento/estadisticas')
}

export const registroService = {
  getSolicitudes: () => api.get('/registro'),
  getSolicitudById: (id) => api.get(`/registro/${id}`),
  actualizarSolicitud: (id, data) => api.put(`/registro/${id}`, data),
  actualizarDirigente: (id, data) => api.put(`/registro/dirigente/${id}`, data),
  eliminarSolicitud: (id) => api.delete(`/registro/${id}`),
  enviarSolicitudPublica: (data) => apiFormData.post('/registro/public', data),
  getDirigentesHabilitados: () => {return api.get('/registro/dirigentes-habilitados');},
  actualizarEstadoDirigente: (id, data) => {return api.put(`/dirigentes/${id}`, data);},
  getTodasSolicitudes: () => {return api.get('/registro/todas');},
}


export default api
