<script setup lang="ts">
  import type { Register } from '@/types/register.ts'
  import { computed, ref } from 'vue'
  import RegisterDialog from '@/components/dialogs/register-dialog.vue'

  const items = computed(() => {
    // TODO - read from database
    return ref<Register[]>([
      {
        id: '1',
        name: 'Essen',
      },
      {
        id: '2',
        name: 'Ausschank',
      },
      {
        id: '3',
        name: 'Kaffee und Kuchen',
      },
      {
        id: '4',
        name: 'Schnaps-Bar',
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
        <tr v-for="item in items.value" :key="item.id" @click="openEditDialog(item)">
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
