import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase.ts'
import AdminEventsDetailView from '@/pages/admin/events/[eventId]/index.vue'
import AdminEventRegisterDetailView from '@/pages/admin/events/[eventId]/registers/[eventRegisterId]/index.vue'
import AdminEventRegisterProducts from '@/pages/admin/events/[eventId]/registers/[eventRegisterId]/products.vue'
import AdminEventRegisters from '@/pages/admin/events/[eventId]/registers/index.vue'
import AdminEvents from '@/pages/admin/events/index.vue'
import Admin from '@/pages/admin/index.vue'
import AdminLogin from '@/pages/admin/login.vue'
import AdminProducts from '@/pages/admin/products.vue'
import AdminRegisters from '@/pages/admin/registers.vue'
import Checkout from '@/pages/checkout.vue'
import EventRegister from '@/pages/events/[eventRegisterId].vue'
import Index from '@/pages/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Index,
  },
  {
    path: '/checkout',
    component: Checkout,
  },
  {
    path: '/events/:eventRegisterId',
    name: 'eventRegister',
    component: EventRegister,
  },
  {
    path: '/admin/login',
    name: 'adminLogin',
    component: AdminLogin,
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/kassen',
    name: 'adminRegisters',
    component: AdminRegisters,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/produkte',
    name: 'adminProducts',
    component: AdminProducts,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/events',
    name: 'adminEvents',
    component: AdminEvents,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/events/:eventId',
    name: 'adminEventsDetailView',
    component: AdminEventsDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/events/:eventId/registers',
    name: 'adminEventRegisters',
    component: AdminEventRegisters,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/events/:eventId/registers/:eventRegisterId',
    name: 'adminEventRegisterDetailView',
    component: AdminEventRegisterDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/events/:eventId/registers/:eventRegisterId/products',
    name: 'adminEventRegisterProducts',
    component: AdminEventRegisterProducts,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async to => {
  await new Promise<void>(resolve => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      unsubscribe()
      resolve()
    })
  })

  const user = auth.currentUser

  if (to.meta.requiresAuth && !user) {
    return { name: 'adminLogin' }
  }
  if (to.meta.requiresGuest && user) {
    return { name: 'home' }
  }
})

export default router
