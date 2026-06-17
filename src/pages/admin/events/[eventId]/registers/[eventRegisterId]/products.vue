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
          <!-- <th class="text-left">Aktiviert</th> -->
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in items" :key="item.id" @click="$router.push(`/admin/events/${item.id}`)">
          <td>{{ item.name }}</td>
          <td>{{ formatPrice(item.price) }}</td>

          <!-- TODO - make products toggling -->
          <!--          <td @click.stop="onToggleEvent(!item.enabled, item)">-->
          <!--            <v-switch :model-value="item.enabled" />-->
          <!--          </td>-->
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useFirestore } from '@/composable/useFirestore.ts'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const { getEventRegisterProductsByEventRegisterId } = useFirestore()
  const route = useRoute()
  const items = ref([])

  onMounted(async () => {
    items.value = await getEventRegisterProductsByEventRegisterId(route.params.eventRegisterId)
  })
</script>
