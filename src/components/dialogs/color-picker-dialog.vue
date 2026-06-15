<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = defineProps<{
    modelValue: boolean
    color: string
  }>()

  const emit = defineEmits(['submit', 'update:model-value'])

  const updatedColor = ref(props.color)

  watch(
    () => props.color,
    newColor => {
      updatedColor.value = newColor
    },
  )

  function submit () {
    emit('submit', updatedColor.value)
    emit('update:model-value', false)
  }

  function close () {
    emit('update:model-value', false)
  }
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="close">
    <v-card class="pa-6" max-width="400" title="Farbe">
      <v-color-picker v-model="updatedColor" hide-inputs />

      <template #actions>
        <v-btn text="Abbrechen" @click="close" />
        <v-spacer />
        <v-btn text="Speichern" @click="submit" />
      </template>
    </v-card>
  </v-dialog>
</template>
