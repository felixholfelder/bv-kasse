import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase.ts'
import AdminEvents from '@/pages/admin/events.vue'
import Admin from '@/pages/admin/index.vue'
import AdminLogin from '@/pages/admin/login.vue'
import AdminProducts from '@/pages/admin/products.vue'
import AdminRegisters from '@/pages/admin/registers.vue'
import Checkout from '@/pages/checkout.vue'
import Drinks from '@/pages/drinks.vue'
import Food from '@/pages/food.vue'
import Index from '@/pages/index.vue'
import SchnappsBar from '@/pages/schnapps-bar.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Index,
  },
  {
    path: '/essen',
    component: Food,
  },
  {
    path: '/ausschank',
    component: Drinks,
  },
  {
    path: '/schnaps-bar',
    component: SchnappsBar,
  },
  {
    path: '/checkout',
    component: Checkout,
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
