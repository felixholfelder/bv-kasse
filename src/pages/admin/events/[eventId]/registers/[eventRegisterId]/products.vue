<template>
  <div>
    <product-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Produkte">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>

      <v-btn icon="mdi-plus" @click="openEditDialog()" />
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Priorität</th>
          <th class="text-left">Name</th>
          <th class="text-left">Preis</th>
          <th class="text-left">Verkäufe</th>
          <th class="text-left">Aktiviert</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="openEditDialog(item)">
          <td>{{ item.priority }}</td>
          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>
          <td>{{ item.count }}</td>

          <td @click.stop="onToggleEvent(!item.enabled, item)">
            <v-checkbox :model-value="item.enabled" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
  import type { EventRegisterProduct } from '@/types/event_register_product.ts'
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ProductDialog from '@/components/dialogs/product-dialog.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const route = useRoute()
  const items = ref<EventRegisterProduct[]>()

  const {
    getEventRegisterProductsByEventRegisterId,
    enableEventRegisterProduct,
    disableEventRegisterProduct,
    createEventRegisterProduct,
    updateEventRegisterProduct,
  } = useFirestore()

  const selectedItem = ref<EventRegisterProduct | null>(null)
  const isEditDialogOpen = ref(false)

  function openEditDialog (item: EventRegisterProduct | null = null) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  onMounted(async () => {
    items.value = await getEventRegisterProductsByEventRegisterId(
      route.params.eventRegisterId as string,
    )
  })

  async function onToggleEvent (toggle: boolean, item: any) {
    await (toggle ? enableEventRegisterProduct(item.id) : disableEventRegisterProduct(item.id))

    items.value = await getEventRegisterProductsByEventRegisterId(
      route.params.eventRegisterId as string,
    )
  }

  async function saveItem (item: EventRegisterProduct) {
    if (item.id === undefined) {
      item.id = uuidv4()
      item.eventRegisterId = route.params.eventRegisterId as string
      await createEventRegisterProduct(item)
    } else {
      await updateEventRegisterProduct(item)
    }

    items.value = await getEventRegisterProductsByEventRegisterId(
      route.params.eventRegisterId as string,
    )
  }
</script>
