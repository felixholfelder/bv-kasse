<template>
  <div>
    <register-view :items="items" :route="route.path" />
  </div>
</template>

<script setup lang="ts">
  import type { Product } from '@/types/product.ts'
  import { useRoute } from 'vue-router'
  import RegisterView from '@/components/register-view.vue'

  const route = useRoute()

  const items: Product[] = [
    {
      name: 'Gespritzer',
      price: 3.5,
      color: '#FF0000',
      enabled: true,
    },
    {
      name: 'Kurzer',
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
