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
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const apiBlob = axios.create({
  baseURL: API_URL,
  responseType: 'blob',
  timeout: 60000 // 60 segundos
})

apiBlob.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
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
  reactivarUser: (id) => api.patch(`/auth/${id}/reactivar`),
  getUltimoLogin: () => api.get('/auth/ultimo-login')
}

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard')
}

export const logsService = {
  getLogs: (filters = {}) => {
    return api.get('/logs', {
      params: {
        tabla: filters.tabla,
        usuario_id: filters.usuario_id,
        desde: filters.desde,
        hasta: filters.hasta,
        limit: filters.limit,
        offset: filters.offset,
        exportar: filters.exportar
      }
    })
  },

  getTablasLogs: () => {
    return api.get('/logs/tablas')
  }
}

export const dirigentesService = {
  getDirigentes: () => api.get('/dirigentes'),
  createDirigente: (data) => api.post('/dirigentes', data),
  updateDirigente: (id, data) => api.put(`/dirigentes/${id}`, data),
  deleteDirigente: (id) => api.delete(`/dirigentes/${id}`),
}

export const formacionService = {
  // CURSOS
  getCursos: () => api.get('/formacion/cursos'),
  getCurso: (id) => api.get(`/formacion/cursos/${id}`),
  createCurso: (data) => api.post('/formacion/cursos', data),
  updateCurso: (id, data) => api.put(`/formacion/cursos/${id}`, data),
  updateEstadoCurso: (id, estado) => api.patch(`/formacion/cursos/${id}/estado`, { estado }),

  // MÓDULOS
  getModulos: (cursoId) =>
    api.get(`/formacion/cursos/${cursoId}/modulos`),

  createModulo: (cursoId, data) =>
    api.post(`/formacion/cursos/${cursoId}/modulos`, data),

  updateModulo: (moduloId, data) =>
    api.put(`/formacion/modulos/${moduloId}`, data),

  deleteModulo: (moduloId) =>
    api.delete(`/formacion/modulos/${moduloId}`),

  // ASISTENCIAS
  getAsistencias: (moduloId) =>
    api.get(`/formacion/modulos/${moduloId}/asistencias`),

  registrarAsistencia: (data) =>
    api.post('/formacion/asistencias', data),

  // FORMADORES
  getFormadores: () =>
    api.get('/formacion/formadores'),

  createFormador: (data) =>
    api.post('/formacion/formadores', data),

  updateFormador: (id, data) =>
    api.put(`/formacion/formadores/${id}`, data),

  // FORMADORES - MÓDULOS
  getModulosFormador: (id) =>
    api.get(`/formacion/formadores/${id}/modulos`),

  updateModulosFormador: (id, data) =>
    api.put(`/formacion/formadores/${id}/modulos`, data),

  getTiposModulo: () =>
    api.get('/formacion/tipos-modulo'),

  // TIPOS DE MÓDULO
  getTiposModulo: () =>
    api.get('/formacion/tipos-modulo'),

  createTipoModulo: (data) =>
    api.post('/formacion/tipos-modulo', data),

  // RELACIONES
  asignarTipoModuloAFormador: (formadorId, tipoModuloId) =>
    api.post(`/formacion/formadores/${formadorId}/tipos-modulo`, {
      tipo_modulo_id: tipoModuloId
    }),

  getFormadoresPorTipoModulo: (tipoModuloId) =>
    api.get(`/formacion/tipos-modulo/${tipoModuloId}/formadores`)
}


export const seguimientoService = {
  getSeguimientos: () => api.get('/seguimiento'),

  crearSeguimiento: (data) =>
    api.post('/seguimiento/public', data),

  subirArchivo: (data) =>
    api.post('/seguimiento/archivo', data),

  actualizarResultado: (id, data) =>
    api.put(`/seguimiento/${id}/resultado`, data),

  cambiarEstado: (id, data) =>
    api.put(`/seguimiento/${id}/estado`, data),

  // Periodo de prueba / reincorporaciones
  getReincorporaciones() {
    return api.get('/seguimiento/periodos-prueba-reincorporaciones')
  },

  getPeriodoPruebaDetalle(id) {
    return api.get(`/seguimiento/periodos-prueba-reincorporaciones/${id}`)
  },

  descargarDocumentoPP(id) {
    return apiBlob.get(
      `/seguimiento/periodos-prueba-reincorporaciones/archivo/${id}`
    )
  },

  getEstadisticas: () =>
    api.get('/seguimiento/estadisticas'),

  getDetalleCompleto: (id) =>
    api.get(`/seguimiento/${id}/detalle-completo`),

  descargarArchivo(id) {
    return api.get(`/seguimiento/archivo/${id}`, {
      responseType: 'blob'
    })
  },

  devolverSeguimiento: (id, data) =>
    apiFormData.post(`/seguimiento/${id}/devolver`, data),

  crearPeriodoPrueba: (data) =>
    api.post(
      '/seguimiento/periodos-prueba-reincorporaciones/public',
      data
    ),

  subirArchivoPeriodo: (data) =>
    api.post(
      '/seguimiento/periodos-prueba-reincorporaciones/archivo',
      data
    ),

}

export const registroService = {
  // SOLICITUDES
  getSolicitudesPendientes: () => api.get('/registro'),
  getTodasSolicitudes: () => api.get('/registro/todas'),

  // DETALLE
  getSolicitudById: (id) => api.get(`/registro/${id}`),

  // ACCIONES
  actualizarSolicitud: (id, data) => api.put(`/registro/${id}`, data),
  eliminarSolicitud: (id) => api.delete(`/registro/${id}`),

  // RECHAZO (endpoint específico)
  rechazarSolicitud: (id, data) =>
    api.put(`/registro/${id}`, {
      estado: 'rechazado',
      observaciones: data.observaciones
    }),

  // DIRIGENTES
  getDirigentesHabilitados: () =>
    api.get('/registro/dirigentes-habilitados'),

  actualizarDirigente: (id, data) =>
    api.put(`/registro/dirigente/${id}`, data),

  actualizarEstadoDirigente: (id, data) =>
    api.put(`/dirigentes/${id}`, data),

  getDirigentePorId: (id) =>
    api.get(`/registro/dirigente/${id}`),
  
  getDirigenteDetalle: (id) =>
    api.get(`/registro/dirigente/${id}/detalle`,{
      timeout: 30000
    }),

  // DASHBOARD
  getEstadisticas: () => api.get('/registro/estadisticas'),

  // PÚBLICO
  enviarSolicitudPublica: (data) => api.post('/registro/public', data),
  subirDocumento: (formData) =>
    api.post('/documentos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 80000
    }),
  getDocumentosPorSolicitud: (solicitudId) =>
    api.get(`/documentos/solicitud/${solicitudId}`),
}



export default api
