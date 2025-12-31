import { createRouter, createWebHistory } from 'vue-router'

//Login
import Login from '../views/Login.vue'

// ADMIN
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import ListaUsuarios from '../views/admin/ListaUsuarios.vue'
import LogsSistema from '../views/admin/LogsSistema.vue'

// SEGUIMIENTO
import SeguimientoDashboard from '../views/seguimiento/SeguimientoDashboard.vue'
import ListaDirigentes from '../views/seguimiento/ListaDirigentes.vue'
import PeriodoPruebaLista from '../views/seguimiento/PeriodoPruebaLista.vue'
import SolicitudesPendientes from '../views/seguimiento/SolicitudesPendientes.vue'

// REGISTRO
import RegistroDashboard from '../views/registro/RegistroDashboard.vue'
import SolicitudesPendientesRegistro from '../views/registro/SolicitudesPendientesRegistro.vue'
import ListaDirigentesHabilitados from '../views/registro/ListaDirigentesHabilitados.vue'
import DetalleSolicitud from '../views/registro/DetalleSolicitud.vue'
import DetalleDirigenteRegistro from '../views/registro/DetalleDirigenteRegistro.vue'
import EditarDirigenteRegistro from '../views/registro/EditarDirigenteRegistro.vue'

// FORMACIÓN 
import FormacionDashboard from '../views/formacion/FormacionDashboard.vue'
import ListaCursos from '../views/formacion/ListaCursos.vue'
import NuevoCurso from '../views/formacion/NuevoCurso.vue'
import DetalleCurso from '../views/formacion/DetalleCurso.vue'
import EditarCurso from '../views/formacion/EditarCurso.vue'
import GestionModulos from '../views/formacion/GestionModulos.vue'
import RegistroAsistencias from '../views/formacion/RegistroAsistencias.vue'

// INVITADO (formularios públicos)
import FormularioAprobacionesPublico from '../views/invitado/FormularioAprobacionesPublico.vue'
import FormularioHabilitacionDirigentesPublico from '../views/invitado/FormularioHabilitacionDirigentesPublico.vue'
import FormularioPPoReincorporacionPublico from '../views/invitado/FormularioPPoReincorporacionPublico.vue'

const routes = [
  {
    path: '/',
    name: 'Login', 
    component: Login,
    meta: {
      public: true,
      onlyGuests: true, 
    },
  },
  // ---------- PÚBLICO / INVITADO ----------
  {
    path: '/public/aprobaciones',
    name: 'AprobacionesPublico',
    component: FormularioAprobacionesPublico,
    meta: {
      public: true,
    },
  },
  {
    path: '/public/habilitacion-dirigentes',
    name: 'HabilitacionPublico',
    component: FormularioHabilitacionDirigentesPublico,
    meta: {
      public: true,
    },
  },
  {
    path: '/public/reincorporacion',
    name: 'ReincorporacionPublico',
    component: FormularioPPoReincorporacionPublico,
    meta: {
      public: true,
    },
  },

  // ---------- ADMIN ----------
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
  },
  {
    path: '/admin/lista-usuarios',
    name: 'ListaUsuarios',
    component: ListaUsuarios,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
  },
  {
    path: '/admin/logs',
    name: 'LogsSistema',
    component: LogsSistema,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
    },
  },

  // --- SEGUIMIENTO ---
  {
    path: '/seguimiento',
    name: 'SeguimientoDashboard',
    component: SeguimientoDashboard,
    meta: { requiresAuth: true, roles: ['responsable_seguimiento', 'subcomisionado_seguimiento', 'admin'] },
  },
  {
    path: '/seguimiento/solicitudes-pendientes',
    name: 'SolicitudesPendientes',
    component: SolicitudesPendientes, // Necesitas importar este componente
    meta: { requiresAuth: true, roles: ['responsable_seguimiento', 'subcomisionado_seguimiento', 'admin'] },
  },
  {
    path: '/seguimiento/lista-dirigentes',
    name: 'ListaDirigentes',
    component: ListaDirigentes, // Necesitas importar este componente
    meta: { requiresAuth: true, roles: ['responsable_seguimiento', 'subcomisionado_seguimiento', 'admin'] },
  },
  {
    path: '/seguimiento/periodo-prueba',
    name: 'PeriodoPruebaLista',
    component: PeriodoPruebaLista, // Necesitas importar este componente
    meta: { requiresAuth: true, roles: ['responsable_seguimiento', 'subcomisionado_seguimiento', 'admin'] },
  },

  // --- REGISTRO ---
  {
    path: '/registro',
    name: 'RegistroDashboard',
    component: RegistroDashboard,
    meta: {
      requiresAuth: true,
      roles: ['responsable_registro', 'subcomisionado_registro', 'admin']
    },
  },
  {
    path: '/registro/solicitudes-pendientes',
    name: 'SolicitudesPendientesRegistro',
    component: SolicitudesPendientesRegistro,
    meta: {
      requiresAuth: true,
      roles: ['responsable_registro', 'subcomisionado_registro', 'admin']
    },
  },
  {
    path: '/registro/dirigentes-habilitados',
    name: 'ListaDirigentesHabilitados',
    component: ListaDirigentesHabilitados,
    meta: {
      requiresAuth: true,
      roles: ['responsable_registro', 'subcomisionado_registro', 'admin']
    },
  },
  {
    path: '/registro/solicitud/:id',
    name: 'DetalleSolicitud',
    component: DetalleSolicitud,
    meta: {
      requiresAuth: true,
      roles: ['responsable_registro', 'subcomisionado_registro', 'admin']
    },
  },
  {
    path: '/registro/dirigente/:id',
    name: 'DetalleDirigenteRegistro',
    component: DetalleDirigenteRegistro,
    meta: {
      requiresAuth: true,
      roles: ['responsable_registro', 'subcomisionado_registro', 'admin']
    },
  },
  {
    path: '/registro/dirigente/:id/editar',
    name: 'EditarDirigenteRegistro',
    component: EditarDirigenteRegistro,
    meta: {
      requiresAuth: true,
      roles: ['responsable_registro', 'subcomisionado_registro', 'admin']
    },
  },

  // ---------- FORMACIÓN ----------
  {
    path: '/formacion',
    name: 'FormacionDashboard',
    component: FormacionDashboard,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },
  {
    path: '/formacion/lista-cursos',
    name: 'ListaCursosFormacion',
    component: ListaCursos,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },
  {
    path: '/formacion/nuevo-curso',
    name: 'NuevoCursoFormacion',
    component: NuevoCurso,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },
  {
    path: '/formacion/detalle-curso/:id',
    name: 'DetalleCursoFormacion',
    component: DetalleCurso,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },
  {
    path: '/formacion/editar-curso/:id',
    name: 'EditarCursoFormacion',
    component: EditarCurso,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },
  {
    path: '/formacion/curso/:cursoId/modulos',
    name: 'GestionModulosFormacion',
    component: GestionModulos,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },
  {
    path: '/formacion/modulo/:moduloId/asistencias',
    name: 'RegistroAsistenciasFormacion',
    component: RegistroAsistencias,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin'],
    },
  },

  // ---------- Error 404 ----------
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

function rutaPorRol(usuario) {
  const rol = usuario?.rol_nombre

  if (!rol) return '/'

  if (rol === 'admin') return '/admin'
  if (rol.includes('seguimiento')) return '/seguimiento'
  if (rol.includes('formacion') || rol.includes('formación')) {
    return '/formacion'
  }
  if (rol.includes('registro')) return '/registro'

  return '/'
}


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  const isPublic = to.matched.some(r => r.meta.public)
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  if (isPublic) {
    if (to.matched.some(r => r.meta.onlyGuests) && token && usuario) {
      const destinoRol = rutaPorRol(usuario)

      if (to.path === destinoRol) {
        return next()
      }

      return next(destinoRol)
    }
    return next()
  }

  if (!requiresAuth) {
    return next()
  }

  if (!token || !usuario) {
    return next({
      path: '/',
      query: { redirect: to.fullPath },
    })
  }

  const requiredRoles = to.matched
    .filter(r => Array.isArray(r.meta.roles) && r.meta.roles.length)
    .flatMap(r => r.meta.roles)

  if (requiredRoles.length > 0) {
    const userRole = usuario.rol_nombre

    if (userRole === 'admin') {
      return next()
    }

    if (!requiredRoles.includes(userRole)) {
      const destino = rutaPorRol(usuario)

      if (destino === to.path) {
        return next()
      }

      return next(destino)
    }
  }

  return next()

})

export default router