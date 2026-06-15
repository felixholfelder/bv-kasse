<script setup lang="ts">
  import type { Product } from '@/types/product.ts'
  import type { Register } from '@/types/register.ts'
  import { computed, ref } from 'vue'
  import ProductDialog from '@/components/dialogs/product-dialog.vue'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const items = computed(() => {
    // TODO - read from database
    return ref<Product[]>([
      {
        id: '',
        name: 'Bratwürste',
        price: 4,
        color: '#FF0000',
      },
      {
        id: '',
        name: 'Käswürste',
        price: 4.5,
        color: '#ff4d00',
      },
      {
        id: '',
        name: 'Steak',
        price: 4.5,
        color: '#9f4f00',
      },
      {
        id: '',
        name: 'Pommes',
        price: 3,
        color: '#dfc000',
      },
      {
        id: '',
        name: 'Burger',
        price: 3,
        color: '#00FF00',
      },
      {
        id: '',
        name: 'Knacker',
        price: 4.5,
        color: '#81817b',
      },
      {
        id: '',
        name: 'Breze m. Käse',
        price: 3,
        color: '#7b7b00',
      },
      {
        id: '',
        name: 'Breze',
        price: 2,
        color: '#371700',
      },
    ])
  })

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<Register | null>(null)

  function openEditDialog (item: Register | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  function saveItem (item: Register) {
    console.log(item.id)
    if (item.id === undefined) {
    // TODO - save new register
    } else {
    // TODO - update existing register
    }
  }
</script>

<template>
  <div>
    <product-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Produkte">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>

      <template #append>
        <v-btn icon="mdi-plus" @click="openEditDialog()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th />
          <th class="text-left">Name</th>
          <th class="text-left">Preis</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items.value" :key="item.id" @click="openEditDialog(item)">
          <td>
            <v-badge :color="item.color" height="30" inline width="30" />
          </td>

          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
