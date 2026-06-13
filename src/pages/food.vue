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
      title: 'Bratwürste',
      price: 4,
      color: '#FF0000',
      enabled: true,
    },
    {
      title: 'Käswürste',
      price: 4.5,
      color: '#ff4d00',
      enabled: true,
    },
    {
      title: 'Steak',
      price: 4.5,
      color: '#9f4f00',
      enabled: true,
    },
    {
      title: 'Pommes',
      price: 3,
      color: '#dfc000',
      enabled: true,
    },
    {
      title: 'Burger',
      price: 3,
      color: '#00FF00',
      enabled: true,
    },
    {
      title: 'Knacker',
      price: 4.5,
      color: '#81817b',
      enabled: false,
    },
    {
      title: 'Breze m. Käse',
      price: 3,
      color: '#7b7b00',
      enabled: true,
    },
    {
      title: 'Breze',
      price: 2,
      color: '#371700',
      enabled: true,
    },
  ]
</script>
