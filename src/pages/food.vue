<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-row>
        <v-col cols="12">
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
                Gesamtpreis: €
              </div>
            </template>
          </v-card>
        </v-col>

        <v-col v-for="item in items" :key="item.title" cols="6">
          <v-card
            class="py-4"
            :color="item.color"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="`${item.price} €`"
            target="_blank"
            :title="item.title"
            variant="tonal"
            @click="addItem(item)"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import type { Item } from '@/types/item.ts'
  import { ref } from 'vue'

  const items: Item[] = [
    {
      title: 'Bratwurstsemmel',
      price: 3.5,
      color: '#FF0000',
    },
    {
      title: 'Steaksemmel',
      price: 4.5,
      color: '#FF0000',
    },
    {
      title: 'Breze mit Käse',
      price: 3,
      color: '#FF0000',
    },
    {
      title: 'Lecker Bierchen',
      price: 3.5,
      color: '#FF0000',
    },
  ]

  const cart = ref<Item[]>([])

  function addItem (item: Item) {
    cart.value.push(item)
  }

  function resetPrice () {
    cart.value = []
  }
</script>
