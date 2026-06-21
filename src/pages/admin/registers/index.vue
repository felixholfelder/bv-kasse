<script setup lang="ts">
  import type { Register } from '@/types/register.ts'
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import RegisterDialog from '@/components/dialogs/register-dialog.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getRegisters, createRegister, updateRegister } = useFirestore()

  const items = ref<Register[]>([])
  const router = useRouter()

  const isEditDialogOpen = ref(false)
  const selectedItem = ref<Register | null>(null)

  onMounted(async () => {
    items.value = await getRegisters()
  })

  function openEditDialog (item: Register | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  function openProducts (item: Register) {
    router.push({ name: 'adminProducts', params: { registerId: item.id } })
  }

  async function saveItem (item: Register) {
    if (item.id === undefined) {
      item.id = uuidv4()
      await createRegister(item)
    } else {
      await updateRegister(item)
    }

    items.value = await getRegisters()
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

          <td>
            <v-btn icon="mdi-arrow-right" @click="openProducts(item)" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
