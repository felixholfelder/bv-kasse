<template>
  <div>
    <v-card
      class="py-3"
      :color="item.color"
      rounded="lg"
      :subtitle="formatPrice(item.price)"
      :title="item.name"
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
        <v-badge
          color="white"
          :content="amountInCart"
          height="36"
          inline
          width="36"
        />
      </template>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import type { EventRegisterProduct } from '@/types/event_register_product.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  defineProps<{
    item: EventRegisterProduct
    amountInCart: number
  }>()

  const emit = defineEmits(['add-item', 'remove-item'])

  function addItem (item: EventRegisterProduct) {
    emit('add-item', item)
  }

  function removeItemFromCart (item: EventRegisterProduct) {
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
