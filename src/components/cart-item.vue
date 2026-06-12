<template>
  <div>
    <v-card
      class="py-4"
      rel="noopener noreferrer"
      rounded="lg"
      :style="{ 'background-color': item.color }"
      :subtitle="formatPrice(item.price)"
      target="_blank"
      :title="item.title"
      variant="tonal"
      @click="addItem(item)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/types/cartItem.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  defineProps<{
    item: CartItem
  }>()

  const emit = defineEmits(['add-item'])

  function addItem (item: CartItem) {
    emit('add-item', item)
  }
</script>
<style>
.v-card-subtitle {
  font-size: 16px;
}
</style>
