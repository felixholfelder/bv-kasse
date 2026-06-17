<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-app-bar title="Kassen">
        <template #prepend>
          <v-btn icon="mdi-arrow-left" @click="$router.back()" />
        </template>
      </v-app-bar>

      <v-row>
        <v-col
          v-for="item in items"
          :key="item.id"
          cols="12"
          md="4"
          sm="12"
        >
          <register-card
            :model-value="item"
            @click="
              $router.push({
                name: 'adminEventRegisterDetailView',
                params: { eventRegisterId: item.id },
              })
            "
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import RegisterCard from '@/components/register-card.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEventRegistersByEventId } = useFirestore()
  const route = useRoute()
  const items = ref([])

  onMounted(async () => {
    items.value = await getEventRegistersByEventId(route.params.eventId)
  })
</script>
