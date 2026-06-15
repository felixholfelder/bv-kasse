<script setup lang="ts">
  import { ref } from 'vue'
  import { useShortDate } from '@/composable/useDates.ts'

  const events = ref([
    {
      name: 'Johannisfeuer 2026',
      date: useShortDate(),
      activated: true,
    },
    {
      name: 'Waldweihnacht 2025',
      date: useShortDate(),
      activated: false,
    },
  ])
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
        <tr v-for="item in events" :key="item.name">
          <td>{{ item.name }}</td>
          <td>{{ item.date }}</td>

          <td>
            <v-switch :value="item.activated" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
