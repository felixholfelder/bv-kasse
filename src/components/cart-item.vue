<template>
  <div>
    <v-card
      class="py-4"
      rel="noopener noreferrer"
      rounded="lg"
      :style="{ 'background-color': item.color, color: 'white' }"
      :subtitle="formatPrice(item.price)"
      target="_blank"
      :title="item.title"
      variant="tonal"
      @click="addItem(item)"
    >
      <template v-if="amountInCart || amountInCart > 0" #prepend>
        <v-icon-btn icon="mdi-minus-circle-outline" @click.stop="removeItemFromCart" />
      </template>

      <template v-if="amountInCart || amountInCart > 0" #append>
        <v-badge color="white" :content="amountInCart" dot-size="16" inline />
      </template>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/types/cartItem.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  defineProps<{
    item: CartItem
    amountInCart: number
  }>()

  const emit = defineEmits(['add-item', 'remove-item'])

  function addItem (item: CartItem) {
    emit('add-item', item)
  }

  function removeItemFromCart (item: CartItem) {
    emit('remove-item', item)
  }
</script>
<style>
.v-card-subtitle {
  font-size: 16px;
}
</style>
