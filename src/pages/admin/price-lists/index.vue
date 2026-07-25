<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import PriceListDialog from '@/components/dialogs/price-list-dialog.vue'
  import { usePriceLists } from '@/composable/usePriceLists.ts'
  import { PriceList } from '@/types/price_list.ts'

  const { getPriceLists, createPriceList, updatePriceList } = usePriceLists()

  const items = ref<PriceList[]>([])
  const router = useRouter()

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<PriceList | null>(null)

  onMounted(async () => {
    items.value = await getPriceLists()
  })

  function openEditDialog (item: PriceList | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  function openProducts (item: PriceList) {
    router.push({ name: 'adminPriceListEntries', params: { priceListId: item.id } })
  }

  async function saveItem (item: {
    documentId: string | undefined
    id: string | undefined
    name: string
    title: string
    presetPriceListId: string | null
  }) {
    const newList = new PriceList(null, item.id || '', item.name, item.title)
    if (item.id === undefined) {
      newList.id = uuidv4()

      await createPriceList(newList, item.presetPriceListId)
    } else {
      await updatePriceList(item as PriceList)
    }

    items.value = await getPriceLists()
  }
</script>

<template>
  <div>
    <price-list-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Preislisten">
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
          <th class="text-left">Name</th>
          <th />
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="openEditDialog(item)">
          <td>{{ item.name }}</td>

          <td class="text-right">
            <v-icon-btn icon="mdi-arrow-right" @click="openProducts(item)" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
