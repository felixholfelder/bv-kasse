import { createRouter, createWebHistory } from 'vue-router'
import Checkout from '@/pages/checkout.vue'
import Drinks from '@/pages/drinks.vue'
import Food from '@/pages/food.vue'
import Index from '@/pages/index.vue'
import SchnappsBar from '@/pages/schnapps-bar.vue'

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
  ],
})

export default router
