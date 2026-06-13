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
      price: 4,
      color: '#ff0000',
      enabled: true,
    },
    {
      title: 'Spezi/Wasser/Limo',
      price: 3.5,
      color: '#371700',
      enabled: true,
    },
  ]
</script>
