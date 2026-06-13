<template>
  <div>
    <v-container class="fill-height d-flex flex-column" max-width="1100">
      <div>
        <v-row>
          <v-app-bar title="Essen">
            <template #prepend>
              <v-icon-btn icon="mdi-arrow-left" @click="$router.push('/')" />
            </template>

            <template #append>
              <v-icon-btn icon="mdi-trash-can-outline" @click="resetPrice" />
            </template>
          </v-app-bar>
        </v-row>

        <v-divider />

        <v-row class="mt-16" style="margin-bottom: 80px">
          <v-col
            v-for="item in foodItems.filter((value) => value.enabled)"
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

        <total-price :cart="cart" @reset-price="resetPrice" />
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
      enabled: true,
    },
    {
      title: 'Käswürste',
      price: 4.5,
      color: '#ff4d00',
      enabled: true,
    },
    {
      title: 'Steak',
      price: 4.5,
      color: '#9f4f00',
      enabled: true,
    },
    {
      title: 'Pommes',
      price: 3,
      color: '#dfc000',
      enabled: true,
    },
    {
      title: 'Knacker',
      price: 4.5,
      color: '#81817b',
      enabled: false,
    },
    {
      title: 'Breze m. Käse',
      price: 3,
      color: '#7b7b00',
      enabled: true,
    },
    {
      title: 'Breze',
      price: 2,
      color: '#371700',
      enabled: true,
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
    const index = cart.value.findIndex(cartItem => cartItem.title === item.title)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  function resetPrice () {
    cart.value = []
  }
</script>
