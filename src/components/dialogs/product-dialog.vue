<script setup lang="ts">
  import type { Product } from '@/types/product.ts'
  import { computed, ref, watch } from 'vue'
  import { VNumberInput } from 'vuetify/components'
  import ColorPickerDialog from '@/components/dialogs/color-picker-dialog.vue'

  const props = defineProps<{
    modelValue: boolean
    item?: Product | null
  }>()

  const emit = defineEmits(['submit', 'update:model-value'])

  const isEditing = computed(() => !!props.item)
  const title = computed(() => (isEditing.value ? 'Produkt bearbeiten' : 'Produkt erstellen'))

  const name = ref('')
  const price = ref(0)
  const color = ref('')

  const openColorPickerDialog = ref(false)

  watch(
    () => props.item,
    newItem => {
      name.value = newItem?.name ?? ''
      price.value = newItem?.price ?? 0
      color.value = newItem?.color ?? ''
    },
    { immediate: true },
  )

  function onColorUpdate (eventColor: string) {
    color.value = eventColor
  }

  function submit () {
    const payload = isEditing.value
      ? { ...props.item, name: name.value, price: price.value, color: color.value }
      : { name: name.value, price: price.value, color: color.value }

    emit('submit', payload)
    emit('update:model-value', false)
  }

  function close () {
    emit('update:model-value', false)
  }
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="close">
    <v-card class="pa-6" max-width="400" :title="title">
      <v-text-field v-model="name" label="Name" variant="outlined" />

      <v-number-input
        v-model="price"
        decimal-separator=","
        label="Preis"
        :min="0"
        :precision="2"
        variant="outlined"
      />

      <v-btn append-icon="mdi-open-in-new" @click="openColorPickerDialog = true">
        <template #prepend>
          <v-badge :color="color" height="22" inline width="22" />
        </template>
        Öffne Farbauswahl
      </v-btn>

      <color-picker-dialog v-model="openColorPickerDialog" :color="color" @submit="onColorUpdate" />

      <template #actions>
        <v-btn text="Abbrechen" @click="close" />
        <v-spacer />
        <v-btn :text="isEditing ? 'Speichern' : 'Erstellen'" @click="submit" />
      </template>
    </v-card>
  </v-dialog>
</template>
