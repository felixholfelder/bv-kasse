<script setup lang="ts">
  import type { Product } from '@/types/product.ts'
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ProductDialog from '@/components/dialogs/product-dialog.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'
  import { useSortableList } from '@/composable/useSortableList.ts'

  const { getProductsByRegisterId, createProduct, updateProduct } = useFirestore()

  const route = useRoute()

  const items = ref<Product[]>([])

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<Product | null>(null)
  const tbodyRef = ref<HTMLElement | null>(null)

  useSortableList({
    items,
    container: tbodyRef,
    sortKey: 'priority',
    persist: changed => Promise.all(changed.map(element => updateProduct(element))),
  })

  onMounted(refreshList)

  async function refreshList () {
    const fetched = await getProductsByRegisterId(route.params.registerId as string)
  items.value = [...fetched].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)) // eslint-disable-line
  }

  function openEditDialog (item: Product | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  async function saveItem (item: Product) {
    if (item.id === undefined) {
      item.id = uuidv4()
      item.registerId = route.params.registerId as string
      const maxPriority = Math.max(0, ...items.value.map(i => i.priority ?? 0))
      item.priority = maxPriority + 1
      await createProduct(item)
    } else {
      await updateProduct(item)
    }

    await refreshList()
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
          <th style="width: 40px" />
          <th />
          <th class="text-left">Name</th>
          <th class="text-left">Preis</th>
        </tr>
      </thead>

      <tbody ref="tbodyRef">
        <tr v-for="item in items" :key="item.id" :data-id="item.id" @click="openEditDialog(item)">
          <td class="drag-handle" style="cursor: grab; width: 40px" @click.stop>
            <v-icon>mdi-drag</v-icon>
          </td>

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
