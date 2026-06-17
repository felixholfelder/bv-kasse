<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-app-bar :title="event?.name">
        <template #prepend>
          <v-btn icon="mdi-arrow-left" @click="$router.back()" />
        </template>
      </v-app-bar>

      <v-row>
        <v-col cols="12" md="4" sm="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-cash-register"
            rounded="lg"
            title="Kassen"
            variant="tonal"
            @click="$router.push({ name: 'adminEventRegisters' })"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEvent } = useFirestore()
  const route = useRoute()
  const event = ref()

  onMounted(async () => {
    event.value = await getEvent(route.params.eventId)
  })
</script>
