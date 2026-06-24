<template>
  <div>
    <v-app-bar title="Kassen">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Aktiviert</th>
          <th />
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>

          <td @click.stop="onToggleEvent(!item.enabled, item)">
            <v-checkbox :model-value="item.enabled" />
          </td>

          <td class="text-right">
            <v-icon-btn icon="mdi-arrow-right" @click="openProducts(item)" />
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
  import type { EventRegister } from '@/types/event_register.ts'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEventRegistersByEventId, enableEventRegister, disableEventRegister } = useFirestore()
  const route = useRoute()
  const router = useRouter()
  const items = ref<EventRegister[]>([])

  onMounted(async () => {
    items.value = await getEventRegistersByEventId(route.params.eventId as string)
  })

  function openProducts (item: EventRegister) {
    router.push({
      name: 'adminEventRegisterProducts',
      params: { eventId: route.params.eventId as string, eventRegisterId: item.id },
    })
  }

  async function onToggleEvent (toggle: boolean, item: any) {
    await (toggle ? enableEventRegister(item.id) : disableEventRegister(item.id))

    items.value = await getEventRegistersByEventId(route.params.eventId as string)
  }
</script>
