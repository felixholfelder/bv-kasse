<script setup lang="ts">
  import type { Event as EventModel } from '@/types/event.ts'
  import { onMounted, ref } from 'vue'
  import { formatTimestamp } from '@/composable/useDates.ts'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEvents } = useFirestore()

  const items = ref<EventModel[]>([])
  onMounted(async () => {
    items.value = await getEvents()
  })
</script>

<template>
  <div>
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
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="$router.push(`/admin/sales/${item.id}`)">
          <td>{{ item.name }}</td>
          <td>{{ formatTimestamp(item.date) }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
