<script setup lang="ts">
  import type { ShoppingListEntry } from '@/types/shopping_list_entry.ts'
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    modelValue: boolean
    item?: ShoppingListEntry | null
  }>()

  const emit = defineEmits(['submit', 'update:model-value'])

  const isEditing = computed(() => !!props.item)
  const title = computed(() =>
    isEditing.value ? 'Einkaufslisteneintrag bearbeiten' : 'Einkaufslisteneintrag erstellen',
  )

  const name = ref('')
  const stock = ref('')
  const amount = ref('')

  watch(
    () => props.item,
    newItem => {
      name.value = newItem?.name ?? ''
      stock.value = newItem?.stock ?? ''
      amount.value = newItem?.amount ?? ''
    },
    { immediate: true },
  )

  function submit () {
    const payload = isEditing.value
      ? { ...props.item, name: name.value, stock: stock.value, amount: amount.value }
      : { name: name.value, stock: stock.value, amount: amount.value }

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
      <v-text-field v-model="stock" label="Bestand" variant="outlined" />
      <v-text-field v-model="amount" label="Menge" variant="outlined" />

      <template #actions>
        <v-btn text="Abbrechen" @click="close" />
        <v-spacer />
        <v-btn :text="isEditing ? 'Speichern' : 'Erstellen'" @click="submit" />
      </template>
    </v-card>
  </v-dialog>
</template>
