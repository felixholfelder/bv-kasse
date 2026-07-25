<script setup lang="ts">
  import type { PriceList } from '@/types/price_list.ts'
  import type { PriceListEntry } from '@/types/price_list_entry.ts'
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PriceListEntryDialog from '@/components/dialogs/price-list-entry-dialog.vue'
  import { usePriceListPdf } from '@/composable/usePriceListPdf.ts'
  import { usePriceLists } from '@/composable/usePriceLists.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const {
    getPriceList,
    getPriceListEntries,
    createPriceListEntry,
    updatePriceListEntry,
    deletePriceListEntry,
    disablePriceListEntry,
    enablePriceListEntry,
  } = usePriceLists()

  const route = useRoute()

  const items = ref<PriceListEntry[]>([])

  const list = ref<PriceList>()

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<PriceListEntry | null>(null)

  const { printPriceList } = usePriceListPdf()

  onMounted(async () => {
    await refreshList()
    list.value = await getPriceList(route.params.shoppingListId as string)
  })

  async function refreshList () {
    items.value = await getPriceListEntries(route.params.priceListId as string)
  }

  function handlePrint () {
    printPriceList(items.value, list.value?.name)
  }

  function openEditDialog (item: PriceListEntry | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  async function saveItem (item: PriceListEntry) {
    if (item.id === undefined) {
      item.id = uuidv4()
      item.priceListId = route.params.priceListId as string
      item.enabled = true
      await createPriceListEntry(item)
    } else {
      await updatePriceListEntry(item)
    }

    await refreshList()
  }

  async function deleteItem (item: PriceListEntry) {
    await deletePriceListEntry(item)
    await refreshList()
  }

  async function onToggleEvent (toggle: boolean, item: any) {
    await (toggle ? enablePriceListEntry(item.id) : disablePriceListEntry(item.id))
    await refreshList()
  }
</script>

<template>
  <div>
    <price-list-entry-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Preisliste">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>

      <template #append>
        <v-btn icon @click="handlePrint">
          <v-icon>mdi-printer</v-icon>
          <v-tooltip activator="parent">Preisliste drucken</v-tooltip>
        </v-btn>

        <v-btn icon="mdi-plus" @click="openEditDialog()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Titel</th>
          <th class="text-left">Preis</th>
          <th class="text-left">Aktiviert</th>
          <th class="text-left">Löschen</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="openEditDialog(item)">
          <td>
            <p>{{ item.title }}</p>
            <p>{{ item.subtitle }}</p>
          </td>

          <td>{{ formatPrice(item.price) }}</td>

          <td @click.stop="onToggleEvent(!item.enabled, item)">
            <v-checkbox :model-value="item.enabled" />
          </td>

          <td>
            <v-icon-btn icon="mdi-delete" @click.stop="deleteItem(item)" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
