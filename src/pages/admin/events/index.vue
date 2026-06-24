<script setup lang="ts">
  import type { Event as EventModel } from '@/types/event.ts'
  import { v4 as uuidv4 } from 'uuid'
  import { onMounted, ref } from 'vue'
  import EventDialog from '@/components/dialogs/event-dialog.vue'
  import { formatTimestamp } from '@/composable/useDates.ts'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEvents, enableEvent, disableEvent, createEvent, updateEvent } = useFirestore()

  const selectedItem = ref<EventModel | null>(null)
  const isEditDialogOpen = ref(false)

  const items = ref<EventModel[]>([])
  onMounted(async () => {
    items.value = await getEvents()
  })

  function openEditDialog (item: EventModel) {
    selectedItem.value = item
    isEditDialogOpen.value = true
  }

  async function onToggleEvent (toggle: boolean, item: any) {
    // TODO - maybe refactor this when multiple events can happen at a time
    if (toggle) {
      for (const e of items.value) {
        disableEvent(e.id)
      }
    }

    await (toggle ? enableEvent(item.id) : disableEvent(item.id))

    items.value = await getEvents()
  }

  async function saveItem (item: EventModel) {
    if (item.id === undefined) {
      item.id = uuidv4()
      await createEvent(item)
    } else {
      await updateEvent(item)
    }

    items.value = await getEvents()
  }
</script>

<template>
  <div>
    <event-dialog v-model="isEditDialogOpen" :item="selectedItem" @submit="saveItem" />

    <v-app-bar title="Events">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Datum</th>
          <th class="text-left">Aktiviert</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="$router.push(`/admin/events/${item.id}`)">
          <td>{{ item.name }}</td>
          <td>{{ formatTimestamp(item.date) }}</td>

          <td @click.stop="onToggleEvent(!item.enabled, item)">
            <v-switch :model-value="item.enabled" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
