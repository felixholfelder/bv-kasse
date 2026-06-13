<template>
  <div>
    <v-bottom-navigation class="text-center d-flex align-center" height="80" @click="resetPrice">
      <v-avatar class="ml-4 mr-4" icon="mdi-currency-eur" size="60" variant="tonal" />

      <v-spacer />

      <div class="text-headline-medium font-weight-bold align-self-center mr-6">
        {{ formatPrice(totalPrice) }}
      </div>
    </v-bottom-navigation>
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/types/cartItem.ts'
  import { computed } from 'vue'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const props = defineProps<{
    cart: CartItem[]
  }>()

  const emit = defineEmits(['reset-price'])

  const totalPrice = computed(() => {
    let price = 0
    for (const item of props.cart) {
      price += item.price
    }

    return price
  })

  function resetPrice () {
    emit('reset-price')
  }
</script>
