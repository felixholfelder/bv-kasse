<script setup lang="ts">
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import ShoppingListDialog from '@/components/dialogs/shopping-list-dialog.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { ShoppingList } from '@/types/shopping_list.ts'

  const { getShoppingLists, createShoppingList, updateShoppingList } = useFirestore()

  const items = ref<ShoppingList[]>([])
  const router = useRouter()

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<ShoppingList | null>(null)

  onMounted(async () => {
    items.value = await getShoppingLists()
    console.log(items)
  })

  function openEditDialog (item: ShoppingList | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  function openProducts (item: ShoppingList) {
    router.push({ name: 'adminShoppingListDetailView', params: { shoppingListId: item.id } })
  }

  async function saveItem (item: {
    id: string | undefined
    name: string
    presetShoppingListId: string | null
  }) {
    const newList = new ShoppingList(null, item.name, item.name)
    if (item.id === undefined) {
      newList.id = uuidv4()

      await createShoppingList(newList, item.presetShoppingListId)
    } else {
      await updateShoppingList(newList)
    }

    items.value = await getShoppingLists()
  }
</script>

<template>
  <div>
    <shopping-list-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Einkaufslisten">
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
