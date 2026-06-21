<script setup lang="ts">
  import type { Register } from '@/types/register.ts'
  import { onMounted, ref } from 'vue'
  import RegisterDialog from '@/components/dialogs/register-dialog.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getRegisters } = useFirestore()

  const items = ref<Register[]>([])

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<Register | null>(null)

  onMounted(async () => {
    items.value = await getRegisters()
  })

  function openEditDialog (item: Register | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  function saveItem (item: Register) {
    if (item.id === undefined) {
    // TODO - save new register
    } else {
    // TODO - update existing register
    }
  }
</script>

<template>
  <div>
    <register-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Kassen">
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
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="openEditDialog(item)">
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
