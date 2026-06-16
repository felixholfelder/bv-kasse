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
      title: 'Bier/Radler',
      price: 3.5,
      color: '#ff0000',
      enabled: true,
    },
    {
      title: 'Spezi/Wasser/Limo/Apfelschorle',
      price: 2.5,
      color: '#371700',
      enabled: true,
    },
    {
      title: 'Weinschorle/Lillet',
      price: 4.5,
      color: '#8e0aa6',
      enabled: true,
    },
  ]
</script>
