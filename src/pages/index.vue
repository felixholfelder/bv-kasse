<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <v-app-bar title="Kassensystem BV Altenstadt">
        <template #append>
          <v-btn color="surface-variant" icon="mdi-cog" @click="$router.push('/admin/login')" />
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
          <v-card
            class="py-4"
            color="surface-variant"
            rel="noopener noreferrer"
            rounded="lg"
            target="_blank"
            :title="item.name"
            variant="tonal"
            @click="$router.push({ name: 'eventRegister', params: { eventRegisterId: item.id } })"
          />
        </v-col>

        <p v-if="showError">{{ errorMessage }}</p>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEventRegistersByEventId, getCurrentActiveEvent } = useFirestore()
  const items = ref([])
  const showError = ref(false)
  const errorMessage = ref('')

  onMounted(async () => {
    showError.value = false
    errorMessage.value = ''

    try {
      const currentActiveEvent = await getCurrentActiveEvent()
      items.value = await getEventRegistersByEventId(currentActiveEvent.id)
    } catch (error: any) {
      showError.value = true
      errorMessage.value = error.message
    }
  })
</script>
