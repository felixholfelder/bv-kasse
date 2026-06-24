<script setup lang="ts">
  import type { Register } from '@/types/register.ts'
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    modelValue: boolean
    item?: Register | null
  }>()

  const emit = defineEmits(['submit', 'update:model-value'])

  const isEditing = computed(() => !!props.item)
  const title = computed(() => (isEditing.value ? 'Event bearbeiten' : 'Event erstellen'))

  const name = ref('')
  const date = ref(new Date())

  watch(
    () => props.item,
    newItem => {
      name.value = newItem?.name ?? ''
    },
    { immediate: true },
  )

  function submit () {
    const payload = isEditing.value
      ? { ...props.item, name: name.value, date: date.value }
      : { name: name.value, date: date.value }

    emit('submit', payload)
    emit('update:model-value', false)
  }

  function close () {
    emit('update:model-value', false)
  }
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="close">
    <v-card class="pa-6" :title="title">
      <v-text-field v-model="name" label="Name" variant="outlined" />
      <v-date-picker v-model="date" first-day-of-week="1" title="Datum" />

      <template #actions>
        <v-btn text="Abbrechen" @click="close" />
        <v-spacer />
        <v-btn :text="isEditing ? 'Speichern' : 'Erstellen'" @click="submit" />
      </template>
    </v-card>
  </v-dialog>
</template>
