<template>
  <div>
    <v-card
      class="py-3"
      :color="item.color"
      rounded="lg"
      :subtitle="formatPrice(item.price)"
      :title="item.title"
      @click="addItem(item)"
    >
      <template v-if="amountInCart || amountInCart > 0" #prepend>
        <v-icon-btn
          class="bg-white"
          color="black"
          icon="mdi-minus-circle-outline"
          @click.stop="removeItemFromCart(item)"
        />
      </template>

      <template v-if="amountInCart || amountInCart > 0" #append>
        <v-badge color="white" :content="amountInCart" height="36" inline width="36" />
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

function addItem(item: CartItem) {
  emit('add-item', item)
}

function removeItemFromCart(item: CartItem) {
  emit('remove-item', item)
}
</script>
<style>
.v-card-subtitle {
  font-size: 16px;
}

.v-badge__badge {
  font-size: 20px;
}
</style>
