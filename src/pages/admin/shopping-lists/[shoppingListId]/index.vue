<script setup lang="ts">
  import type { ShoppingList } from '@/types/shopping_list.ts'
  import type { ShoppingListEntry } from '@/types/shopping_list_entry.ts'
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ShoppingListEntryDialog from '@/components/dialogs/shopping-list-entry-dialog.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { useShoppingListPdf } from '@/composable/useShoppingListPdf.ts'

  const {
    getShoppingList,
    getShoppingListEntries,
    createShoppingListEntry,
    updateShoppingListEntry,
  } = useFirestore()

  const route = useRoute()

  const items = ref<ShoppingListEntry[]>([])

  const list = ref<ShoppingList>()

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<ShoppingListEntry | null>(null)

  const { printShoppingList } = useShoppingListPdf()

  onMounted(async () => {
    items.value = await getShoppingListEntries(route.params.shoppingListId as string)
    list.value = await getShoppingList(route.params.shoppingListId as string)
  })

  function handlePrint () {
    printShoppingList(items.value, list.value?.name)
  }

  function openEditDialog (item: ShoppingListEntry | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  async function saveItem (item: ShoppingListEntry) {
    if (item.id === undefined) {
      item.id = uuidv4()
      item.shoppingListId = route.params.shoppingListId as string
      await createShoppingListEntry(item)
    } else {
      await updateShoppingListEntry(item)
    }

    items.value = await getShoppingListEntries(route.params.shoppingListId as string)
  }
</script>

<template>
  <div>
    <shopping-list-entry-dialog
      v-model="isEditDialogOpen"
      :item="selectedItem"
      @submit="saveItem"
    />

    <v-app-bar title="Einkaufsliste">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>

      <template #append>
        <v-btn icon @click="handlePrint">
          <v-icon>mdi-printer</v-icon>
          <v-tooltip activator="parent">Einkaufliste drucken</v-tooltip>
        </v-btn>

        <v-btn icon="mdi-plus" @click="openEditDialog()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Restbestand</th>
          <th class="text-left">Menge</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="openEditDialog(item)">
          <td>{{ item.name }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.amount }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
