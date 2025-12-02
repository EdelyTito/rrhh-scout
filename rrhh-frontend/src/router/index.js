import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

// Admin:
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import ListaUsuarios from '../views/admin/ListaUsuarios.vue'
import LogsSistema from '../views/admin/LogsSistema.vue'

// Formación
import FormacionDashboard from '../views/formacion/FormacionDashboard.vue'
import ListaCursos from '../views/formacion/ListaCursos.vue'
import NuevoCurso from '../views/formacion/NuevoCurso.vue'
import DetalleCurso from '../views/formacion/DetalleCurso.vue'
import GestionModulos from '../views/formacion/GestionModulos.vue'
import RegistroAsistencias from '../views/formacion/RegistroAsistencias.vue'
import EditarCurso from '../views/formacion/EditarCurso.vue'

// Seguimiento
import Seguimiento from '../views/seguimiento/SeguimientoDashboard.vue'
import SolicitudesPendientes from '../views/seguimiento/SolicitudesPendientes.vue'
import ListaDirigentes from '../views/seguimiento/ListaDirigentes.vue'
import PeriodoPruebaLista from '../views/seguimiento/PeriodoPruebaLista.vue'

// Registro y habilitación
import RegistroDashboard from '../views/registro/RegistroDashboard.vue' 
import SolicitudesPendientesRegistro from '../views/registro/SolicitudesPendientesRegistro.vue'
import DetalleSolicitud from '../views/registro/DetalleSolicitud.vue'
import ListaDirigentesHabilitados from '../views/registro/ListaDirigentesHabilitados.vue'
import DetalleDirigenteRegistro from '../views/registro/DetalleDirigenteRegistro.vue'
import EditarDirigenteRegistro from '../views/registro/EditarDirigenteRegistro.vue'

// Invitado
import FormularioAprobacionesPublico from '../views/invitado/FormularioAprobacionesPublico.vue'
import FormularioPPoReincorporacionPublico from '../views/invitado/FormularioPPoReincorporacionPublico.vue'
import FormularioHabilitacionDirigentesPublico from '../views/invitado/FormularioHabilitacionDirigentesPublico.vue'



const routes = [
  // Login
  {
    path: '/',
    name: 'Login',
    component: Login
  },

  // Admin
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/lista-usuarios',
    name: 'ListaUsuarios',
    component: ListaUsuarios
  },
  {
    path: '/admin/logs',
    name: 'LogsSistema',
    component: LogsSistema
  },

  // Seguimiento
  {
    path: '/seguimiento',
    name: 'Seguimiento',
    component: Seguimiento
  },
  {
    path: '/seguimiento/solicitudes-pendientes',
    name: 'SolicitudesPendientes',
    component: SolicitudesPendientes
  },
  {
    path: '/seguimiento/lista-dirigentes',
    name: 'ListaDirigentes',
    component: ListaDirigentes
  },
  {
    path: '/seguimiento/periodo-prueba',
    name: 'PeriodoPruebaLista',
    component: PeriodoPruebaLista
  },

  // Formación
  {
    path: '/formacion',
    name: 'Formacion',
    component: FormacionDashboard
  },
  {
    path: '/formacion/lista-cursos',
    name: 'ListaCursos',
    component: ListaCursos
  },
  {
    path: '/formacion/nuevo-curso',
    name: 'NuevoCurso',
    component: NuevoCurso
  },
  {
    path: '/formacion/detalle-curso/:id',
    name: 'DetalleCurso',
    component: DetalleCurso,
    props: true
  },
  {
    path: '/formacion/curso/:id/modulos',
    name: 'GestionModulos',
    component: GestionModulos,
    props: true
  },
  {
    path: '/formacion/modulo/:id/asistencias',
    name: 'RegistroAsistencias',
    component: RegistroAsistencias,
    props: true
  },
  {
    path: '/formacion/editar-curso/:id',
    name: 'EditarCurso',
    component: EditarCurso,
    props: true
  },

  // Registro y habilitación
  {
    path: '/registro',
    name: 'RegistroDashboard',
    component: RegistroDashboard
  },
  {
    path: '/registro/solicitudes-pendientes',
    name: 'SolicitudesPendientesRegistro',
    component: SolicitudesPendientesRegistro
  },
  {
    path: '/registro/solicitud/:id',
    name: 'DetalleSolicitud',
    component: DetalleSolicitud,
    props: true
  },
  {
    path: '/registro/dirigentes-habilitados',
    name: 'ListaDirigentesHabilitados',
    component: ListaDirigentesHabilitados
  },
  {
    path: '/registro/dirigente/:id',
    name: 'DetalleDirigenteRegistro',
    component: DetalleDirigenteRegistro,
    props: true
  },
  {
    path: '/registro/dirigente/:id/editar',
    name: 'EditarDirigenteRegistro',
    component: EditarDirigenteRegistro,
    props: true
  },
  
  // Invitado
  {
    path: '/formulario-aprobaciones',
    name: 'FormularioAprobacionesPublico',
    component: FormularioAprobacionesPublico
  },
  {
    path: '/formulario-ppreincorporacion',
    name: 'FormularioPPoReincorporacionPublico',
    component: FormularioPPoReincorporacionPublico
  },
  {
    path: '/formulario-habilitacion-dirigentes',
    name: 'FormularioHabilitacionDirigentesPublico',
    component: FormularioHabilitacionDirigentesPublico
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router