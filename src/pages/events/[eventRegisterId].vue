<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import RegisterView from '@/components/register-view.vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const { getEventRegisterProductsByEventRegisterId } = useFirestore()
  const route = useRoute()
  const items = ref([])

  onMounted(async () => {
    items.value = await getEventRegisterProductsByEventRegisterId(route.params.eventRegisterId)
  })
</script>

<template>
  <div>
    <register-view :items="items" />
  </div>
</template>

<style scoped></style>
