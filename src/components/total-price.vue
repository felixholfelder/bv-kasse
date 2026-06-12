<template>
  <div>
    <v-card
      class="py-4"
      color="surface-variant"
      rounded="lg"
      variant="tonal"
      @click="resetPrice"
    >
      <template #prepend>
        <v-avatar class="ml-2 mr-4" icon="mdi-currency-eur" size="60" variant="tonal" />
      </template>

      <template #title>
        <div class="my-title my-uppercase text-headline-medium font-weight-bold">
          Gesamt: {{ formatPrice(totalPrice) }}
        </div>
      </template>
    </v-card>
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
