<template>
  <div>
    <v-container class="fill-height d-flex flex-column" max-width="1100">
      <div>
        <v-row class="position-sticky top-0 mb-4" style="z-index: 10">
          <v-col cols="12">
            <total-price :cart="cart" @reset-price="resetPrice" />
          </v-col>
        </v-row>

        <v-divider />

        <v-row class="mt-4">
          <v-col
            v-for="item in foodItems"
            :key="item.title"
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

        <v-spacer />
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import type { CartItem } from '@/types/cartItem.ts'
  import { ref } from 'vue'
  import CartItemCard from '@/components/cart-item.vue'
  import TotalPrice from '@/components/total-price.vue'

  const foodItems: CartItem[] = [
    {
      title: 'Bratwürste',
      price: 4,
      color: '#FF0000',
    },
    {
      title: 'Käswürste',
      price: 4.5,
      color: '#ff4d00',
    },
    {
      title: 'Steak',
      price: 4.5,
      color: '#783b00',
    },
    {
      title: 'Knacker',
      price: 4.5,
      color: '#81817b',
    },
    {
      title: 'Breze m. Käse',
      price: 3,
      color: '#7b7b00',
    },
    {
      title: 'Breze',
      price: 2,
      color: '#371700',
    },
  ]

  const cart = ref<CartItem[]>([])

  function getAmountInCart (item: CartItem) {
    let count = 0
    for (const cartItem of cart.value) {
      if (item.title === cartItem.title) count++
    }

    return count
  }

  function addItem (item: CartItem) {
    cart.value.push(item)
  }

  function removeItem (item: CartItem) {
    const index = cart.value.indexOf(item)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  function resetPrice () {
    cart.value = []
  }
</script>
