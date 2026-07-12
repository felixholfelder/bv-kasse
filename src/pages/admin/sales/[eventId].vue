<script setup lang="ts">
  import type { EventRegisterProduct } from '@/types/event_register_product.ts'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const { getActiveEventRegisterProductsByEventId } = useFirestore()

  const route = useRoute()

  const items = ref<EventRegisterProduct[]>([])

  onMounted(async () => {
    items.value = await getActiveEventRegisterProductsByEventId(route.params.eventId as string)
  })
</script>

<template>
  <div>
    <v-app-bar title="Verkäufe">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Verkäufe</th>
          <th class="text-left">Einzelpreis</th>
          <th class="text-left">Gesamtpreis</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items.filter((item) => item.enabled)" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.count }}</td>
          <td>{{ formatPrice(item.price) }}</td>
          <td>{{ formatPrice(item.price * item.count) }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<style scoped></style>
