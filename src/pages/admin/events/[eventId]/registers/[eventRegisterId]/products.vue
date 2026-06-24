<template>
  <div>
    <v-app-bar title="Produkte">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" @click="$router.back()" />
      </template>
    </v-app-bar>

    <v-table class="mt-16">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Preis</th>
          <th class="text-left">Verkäufe</th>
          <th class="text-left">Aktiviert</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id">
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
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const { getEventRegisterProductsByEventRegisterId } = useFirestore()
  const route = useRoute()
  const items = ref<EventRegisterProduct[]>()

  const { enableEventRegisterProduct, disableEventRegisterProduct } = useFirestore()

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
</script>
