<script setup lang="ts">
  import type { EventRegisterProduct } from '@/types/event_register_product.ts'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import RegisterView from '@/components/register-view.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEventRegisterProductsByEventRegisterId } = useFirestore()
  const route = useRoute()
  const items = ref<EventRegisterProduct[]>([])

  onMounted(async () => {
    items.value = await getEventRegisterProductsByEventRegisterId(
      route.params.eventRegisterId as string,
    )
  })
</script>

<template>
  <div>
    <register-view :items="items" />
  </div>
</template>

<style scoped></style>
