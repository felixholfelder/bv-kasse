<script setup lang="ts">
  import type { PriceListEntry } from '@/types/price_list_entry.ts'
  import { computed, ref, watch } from 'vue'
  import { VNumberInput } from 'vuetify/components'

  const props = defineProps<{
    modelValue: boolean
    item?: PriceListEntry | null
  }>()

  const emit = defineEmits(['submit', 'update:model-value'])

  const isEditing = computed(() => !!props.item)
  const dialogTitle = computed(() =>
    isEditing.value ? 'Preislisteneintrag bearbeiten' : 'Preislisteneintrag erstellen',
  )

  const title = ref('')
  const subtitle = ref('')
  const price = ref(0)

  watch(
    () => props.item,
    newItem => {
      title.value = newItem?.title ?? ''
      subtitle.value = newItem?.subtitle ?? ''
      price.value = newItem?.price ?? 0
    },
    { immediate: true },
  )

  function submit () {
    const payload = isEditing.value
      ? { ...props.item, title: title.value, subtitle: subtitle.value, price: price.value }
      : { title: title.value, subtitle: subtitle.value, price: price.value }

    emit('submit', payload)
    emit('update:model-value', false)
  }

  function close () {
    emit('update:model-value', false)
  }
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="close">
    <v-card class="pa-6" max-width="400" :title="dialogTitle">
      <v-text-field v-model="title" label="Titel" variant="outlined" />
      <v-text-field v-model="subtitle" label="Subtitel" variant="outlined" />

      <v-number-input
        v-model="price"
        decimal-separator=","
        label="Preis"
        :min="0"
        :precision="2"
        variant="outlined"
      />

      <template #actions>
        <v-btn text="Abbrechen" @click="close" />
        <v-spacer />
        <v-btn :text="isEditing ? 'Speichern' : 'Erstellen'" @click="submit" />
      </template>
    </v-card>
  </v-dialog>
</template>
