<script setup lang="ts">
  import type { EventRegister } from '@/types/event_register.ts'

  defineProps<{
    modelValue: EventRegister
  }>()
</script>

<template>
  <div>
    <v-card
      class="py-4"
      color="surface-variant"
      prepend-icon="mdi-cash-register"
      rounded="lg"
      :title="modelValue.name"
      variant="tonal"
    />
  </div>
</template>

<style scoped></style>
