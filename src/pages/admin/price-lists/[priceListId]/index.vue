<script setup lang="ts">
  import type { PriceList } from '@/types/price_list.ts'
  import type { PriceListEntry } from '@/types/price_list_entry.ts'
  import Sortable from 'sortablejs'
  import { v4 as uuidv4 } from 'uuid'
  import { nextTick, onMounted, ref, watch } from 'vue'
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

  const tbodyRef = ref<HTMLElement | null>(null)
  let sortableInstance: Sortable | null = null

  onMounted(async () => {
    await refreshList()
    list.value = await getPriceList(route.params.priceListId as string)
    await nextTick()
    initSortable()
  })

  function initSortable () {
    if (!tbodyRef.value) return

    sortableInstance?.destroy()

    sortableInstance = Sortable.create(tbodyRef.value, {
      handle: '.drag-handle',
      animation: 150,
      onEnd: onDragEnd,
    })
  }

  async function refreshList () {
    const fetched = await getPriceListEntries(route.params.priceListId as string)
    items.value = [...fetched].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }

  function handlePrint () {
    printPriceList(items.value, list.value)
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
      const maxSortOrder = Math.max(0, ...items.value.map(i => i.sortOrder ?? 0))
      item.sortOrder = maxSortOrder + 1
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

  // SortableJS manipuliert das DOM direkt (ohne Vue), daher lesen wir
  // nach dem Drop die neue Reihenfolge aus dem DOM aus und synchronisieren
  // damit den Vue-State + die Backend-Daten.
  async function onDragEnd (event: Sortable.SortableEvent) {
    const { oldIndex, newIndex } = event
    if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return

    const moved = items.value.splice(oldIndex, 1)[0]
    items.value.splice(newIndex, 0, moved)

    const updates = items.value.map((item, index) => ({ ...item, sortOrder: index + 1 }))
    items.value = updates

    await Promise.all(updates.map(item => updatePriceListEntry(item)))
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
          <th style="width: 40px" />
          <th class="text-left">Titel</th>
          <th class="text-left">Preis</th>
          <th class="text-left">Aktiviert</th>
          <th class="text-left">Löschen</th>
        </tr>
      </thead>

      <tbody ref="tbodyRef">
        <tr v-for="item in items" :key="item.id" :data-id="item.id" @click="openEditDialog(item)">
          <td class="drag-handle" style="cursor: grab; width: 40px" @click.stop>
            <v-icon>mdi-drag</v-icon>
          </td>

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
