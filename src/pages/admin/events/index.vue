<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { formatTimestamp } from '@/composable/useDates.ts'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEvents } = useFirestore()

  const events = ref([])
  onMounted(async () => {
    events.value = await getEvents()
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
          <th class="text-left">Aktiviert</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in events" :key="item.id" @click="$router.push(`/admin/events/${item.id}`)">
          <td>{{ item.name }}</td>
          <td>{{ formatTimestamp(item.date) }}</td>

          <td>
            <v-switch :model-value="item.enabled" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
