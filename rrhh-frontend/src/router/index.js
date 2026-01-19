import { createRouter, createWebHistory } from 'vue-router'

//Login
import Login from '../views/Login.vue'
import ResetPassword from '../views/ResetPassword.vue'
import PrimerIngreso from '../views/PrimerIngreso.vue'

// ADMIN
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminRegistro from '../views/admin/dashboard/AdminRegistro.vue'
import AdminFormacion from '../views/admin/dashboard/AdminFormacion.vue'
import AdminInicio from '../views/admin/dashboard/AdminInicio.vue'

import ListaUsuarios from '../views/admin/ListaUsuarios.vue'
import LogsSistema from '../views/admin/LogsSistema.vue'

// SEGUIMIENTO
import SeguimientoDashboard from '../views/seguimiento/SeguimientoDashboard.vue'
import ListaDirigentes from '../views/seguimiento/ListaDirigentes.vue'
import PeriodoPruebaLista from '../views/seguimiento/PeriodoPruebaLista.vue'
import SolicitudesPendientes from '../views/seguimiento/SolicitudesPendientes.vue'
import DetalleSeguimiento from '../views/seguimiento/DetalleSeguimiento.vue'
import DetalleDirigente from '../views/seguimiento/DetalleDirigente.vue'
import DetallePPoReincorporacion from '../views/seguimiento/DetallePPoReincorporacion.vue'

// REGISTRO
import RegistroDashboard from '../views/registro/RegistroDashboard.vue'
import SolicitudesPendientesRegistro from '../views/registro/SolicitudesPendientesRegistro.vue'
import ListaDirigentesHabilitados from '../views/registro/ListaDirigentesHabilitados.vue'
import DetalleSolicitud from '../views/registro/DetalleSolicitud.vue'
import DetalleDirigenteRegistro from '../views/registro/DetalleDirigenteRegistro.vue'
import EditarDirigenteRegistro from '../views/registro/EditarDirigenteRegistro.vue'
import SolicitudesRechazadasRegistro from '../views/registro/SolicitudesRechazadasRegistro.vue'

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

  /* ---------- AUTH ---------- */
  {
    path: '/',
    component: Login,
    meta: { public: true, onlyGuests: true }
  },
  { path: '/reset-password', component: ResetPassword },
  { path: '/primer-ingreso', component: PrimerIngreso },

  /* ---------- PÚBLICO ---------- */
  { path: '/public/aprobaciones', component: FormularioAprobacionesPublico, meta: { public: true } },
  { path: '/public/habilitacion-dirigentes', component: FormularioHabilitacionDirigentesPublico, meta: { public: true } },
  { path: '/public/reincorporacion', component: FormularioPPoReincorporacionPublico, meta: { public: true } },

  /* ---------- ADMIN ---------- */
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [

      { path: '', component: AdminInicio },

      { path: 'lista-usuarios', component: ListaUsuarios },
      { path: 'logs', component: LogsSistema },

      /* ----- ADMIN REGISTRO ----- */
      {
        path: 'registro',
        component: AdminRegistro,
        children: [
          { path: '', component: RegistroDashboard, props: { embebido: true } },
          { path: 'solicitudes-pendientes', component: SolicitudesPendientesRegistro, props: { embebido: true } },
          { path: 'solicitudes-rechazadas', component: SolicitudesRechazadasRegistro, props: { embebido: true } },
          { path: 'dirigentes-habilitados', component: ListaDirigentesHabilitados, props: { embebido: true } },
          { path: 'solicitud/:id', component: DetalleSolicitud, props: { embebido: true } },
          { path: 'dirigente/:id', component: DetalleDirigenteRegistro, props: { embebido: true } },
          { path: 'dirigente/:id/editar', component: EditarDirigenteRegistro, props: { embebido: true } },
        ]
      },

      /* ----- ADMIN FORMACIÓN ----- */
      {
        path: 'formacion',
        component: AdminFormacion,
        children: [
          {
            path: '',
            name: 'AdminFormacionInicio',
            component: FormacionDashboard,
            props: { embebido: true }
          },
          {
            path: 'lista-cursos',
            name: 'AdminFormacionListaCursos',
            component: ListaCursos,
            props: { embebido: true }
          },
          {
            path: 'nuevo-curso',
            component: NuevoCurso,
            props: { embebido: true }
          },
          {
            path: 'detalle-curso/:id',
            component: DetalleCurso,
            props: { embebido: true }
          },
          {
            path: 'editar-curso/:id',
            component: EditarCurso,
            props: { embebido: true }
          },
          {
            path: 'curso/:cursoId/modulos',
            component: GestionModulos,
            props: { embebido: true }
          },
          {
            path: 'modulo/:moduloId/asistencias',
            component: RegistroAsistencias,
            props: { embebido: true }
          }
        ]
      },
    ]
  },

  /* ---------- FORMACIÓN ---------- */
  {
    path: '/formacion',
    component: FormacionDashboard,
    meta: {
      requiresAuth: true,
      roles: ['responsable_formacion', 'subcomisionado_formacion', 'admin']
    },
    children: [
      {
        path: '',
        name: 'FormacionInicio',
        component: FormacionDashboard
      },
      {
        path: 'lista-cursos',
        name: 'FormacionListaCursos',
        component: ListaCursos
      },
      {
        path: 'nuevo-curso',
        name: 'FormacionNuevoCurso',
        component: NuevoCurso
      },
      {
        path: 'detalle-curso/:id',
        name: 'FormacionDetalleCurso',
        component: DetalleCurso
      },
      {
        path: 'editar-curso/:id',
        name: 'FormacionEditarCurso',
        component: EditarCurso
      },
      {
        path: 'curso/:cursoId/modulos',
        name: 'FormacionGestionModulos',
        component: GestionModulos
      },
      {
        path: 'modulo/:moduloId/asistencias',
        name: 'FormacionRegistroAsistencias',
        component: RegistroAsistencias
      }
    ]
  },

  /* ---------- SEGUIMIENTO ---------- */
  { 
    path: '/seguimiento', 
    component: SeguimientoDashboard,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    } 
  },
  { 
    path: '/seguimiento/solicitudes-pendientes', 
    component: SolicitudesPendientes,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    }
  },
  { 
    path: '/seguimiento/detalle/:id',
    component: DetalleSeguimiento,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    }
  },
  { 
    path: '/seguimiento/lista-dirigentes', 
    component: ListaDirigentes,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    }
  },
  { 
    path: '/seguimiento/periodo-prueba', 
    component: PeriodoPruebaLista,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    }
  },
  { 
    path: '/seguimiento/periodos-prueba-reincorporaciones/:id',
    component: DetallePPoReincorporacion,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    }
  },
  { 
    path: '/seguimiento/dirigente/:id',
    component: DetalleDirigente,
    meta: {
      requiresAuth: true,
      roles: ['responsable_seguimiento', 'admin']
    }
  },


  /* ---------- 404 ---------- */
  { path: '/:pathMatch(.*)*', redirect: '/' }
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

  if (requiresAuth && !token) {
    return next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  }

  if (usuario?.primer_ingreso === true && to.path !== '/primer-ingreso') {
    return next('/primer-ingreso')
  }

  if (usuario?.primer_ingreso === false && to.path === '/primer-ingreso') {
    return next(rutaPorRol(usuario))
  }

  if (isPublic) {
    if (to.matched.some(r => r.meta.onlyGuests) && token && usuario) {
      return next(rutaPorRol(usuario))
    }
    return next()
  }

  const requiredRoles = to.matched
    .filter(r => Array.isArray(r.meta.roles))
    .flatMap(r => r.meta.roles)

  if (requiredRoles.length > 0) {
    const userRole = usuario?.rol_nombre

    if (!userRole) {
      return next('/')
    }

    if (userRole !== 'admin' && !requiredRoles.includes(userRole)) {
      return next(rutaPorRol(usuario))
    }
  }

  return next()
})

export default router