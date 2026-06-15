<template>
  <div>
    <v-container class="fill-height d-flex flex-column" max-width="1100">
      <div>
        <v-row>
          <v-app-bar :title="appBarTitle">
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
  import type { Product } from '@/types/product.ts'
  import { computed, ref } from 'vue'
  import CartItemCard from '@/components/cart-item.vue'
  import TotalPrice from '@/components/total-price.vue'

  const props = defineProps<{
    items: Product[]
    route: string
  }>()

  const cart = ref<Product[]>([])

  function getAmountInCart (item: Product) {
    let count = 0
    for (const cartItem of cart.value) {
      if (item.name === cartItem.name) count++
    }

    return count
  }

  function addItem (item: Product) {
    cart.value.push(item)
  }

  function removeItem (item: Product) {
    const index = cart.value.findIndex(cartItem => cartItem.name === item.name)
    if (index !== -1) {
      cart.value.splice(index, 1)
    }
  }

  function resetPrice () {
    cart.value = []
  }

  const appBarTitle = computed(() => {
    const name = props.route.replace('/', '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  })
</script>
