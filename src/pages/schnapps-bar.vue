<template>
  <div>
    <register-view :items="items" :route="route.path" />
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/types/cartItem.ts'
  import { useRoute } from 'vue-router'
  import RegisterView from '@/components/register-view.vue'

  const route = useRoute()

  const items: CartItem[] = [
    {
      title: 'Gespritzer',
      price: 3.5,
      color: '#FF0000',
      enabled: true,
    },
    {
      title: 'Kurzer',
      price: 2,
      color: '#0000FF',
      enabled: true,
    },
    {
      title: 'Klopfer',
      price: 1.5,
      color: '#ebeb0c',
      enabled: true,
    },
  ]
</script>
