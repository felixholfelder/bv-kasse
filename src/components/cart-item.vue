<template>
  <div>
    <v-card
      class="py-4"
      rel="noopener noreferrer"
      rounded="lg"
      :subtitle="formatPrice(item.price)"
      target="_blank"
      :title="item.title"
      variant="tonal"
      @click="addItem(item)"
      :style="{ 'background-color': item.color }"
    />
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types/cartItem.ts'
import { computed } from 'vue'
import { formatPrice } from '@/composable/usePriceUtils.ts'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits(['addItem'])

const totalPrice = computed(() => {
  return 12.0
})

function addItem(item: CartItem) {
  emit('addItem', item)
}
</script>
<style>
.v-card-subtitle {
  font-size: 16px;
}
</style>
