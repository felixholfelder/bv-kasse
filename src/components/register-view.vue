<template>
  <div>
    <v-container class="fill-height d-flex flex-column" max-width="1100">
      <div>
        <v-row>
          <v-app-bar>
            <template #prepend>
              <v-btn icon="mdi-arrow-left" @click="$router.back()" />
            </template>

            <template #append>
              <v-btn icon="mdi-trash-can-outline" @click="resetPrice" />
            </template>
          </v-app-bar>
        </v-row>

        <v-divider />

        <v-row class="mt-16" style="margin-bottom: 80px">
          <v-col
            v-for="item in items.filter((value) => value.enabled)"
            :key="item.name"
            cols="12"
            md="6"
            sm="12"
          >
            <cart-item-card
              :amount-in-cart="getAmountInCart(item)"
              :item="item"
              @add-item="addItem"
              @remove-item="removeItem"
            />
          </v-col>
        </v-row>

        <total-price :cart="cart" @reset-price="resetPrice" />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { EventRegisterProduct } from '@/types/event_register_product.ts'
  import { ref } from 'vue'
  import CartItemCard from '@/components/cart-item.vue'
  import TotalPrice from '@/components/total-price.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  defineProps<{
    items: EventRegisterProduct[]
  }>()

  const { increaseCounter, decreaseCounter } = useFirestore()

  const cart = ref<EventRegisterProduct[]>([])

  function getAmountInCart (item: EventRegisterProduct) {
    let count = 0
    for (const cartItem of cart.value) {
      if (item.id === cartItem.id) count++
    }

    return count
  }

  async function addItem (item: EventRegisterProduct) {
    await increaseCounter(item.documentId)
    cart.value.push(item)
  }

  async function removeItem (item: EventRegisterProduct) {
    const index = cart.value.findIndex(cartItem => cartItem.name === item.name)
    if (index !== -1) {
      cart.value.splice(index, 1)
      await decreaseCounter(item.documentId)
    }
  }

  function resetPrice () {
    cart.value = []
  }
</script>
