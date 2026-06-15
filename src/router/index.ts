import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/pages/admin/index.vue'
import AdminLogin from '@/pages/admin/login.vue'
import Checkout from '@/pages/checkout.vue'
import Drinks from '@/pages/drinks.vue'
import Food from '@/pages/food.vue'
import Index from '@/pages/index.vue'
import SchnappsBar from '@/pages/schnapps-bar.vue'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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
      component: AdminLogin,
    },
    {
      path: '/admin',
      component: Admin,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('admin/login')
  } else {
    next()
  }
})

export default router
