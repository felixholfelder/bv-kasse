<template>
  <div>
    <v-bottom-navigation
      class="text-center d-flex align-center"
      height="80"
      @click="emit('reset-price')"
    >
      <v-avatar class="ml-4 mr-4" icon="mdi-check" size="60" variant="tonal" />

      <v-spacer />

      <div class="text-headline-medium font-weight-bold align-self-center mr-6">
        {{ formatPrice(totalPrice) }}
      </div>
    </v-bottom-navigation>
  </div>
</template>

<script setup lang="ts">
  import type { EventRegisterProduct } from '@/types/event_register_product.ts'
  import { computed } from 'vue'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const props = defineProps<{
    cart: EventRegisterProduct[]
  }>()

  const emit = defineEmits(['reset-price'])

  const totalPrice = computed(() => {
    let price = 0
    for (const item of props.cart) {
      price += item.price
    }

    return price
  })
</script>
