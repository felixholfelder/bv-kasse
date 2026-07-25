<script setup lang="ts">
  import type { PriceList } from '@/types/price_list.ts'
  import { computed, onMounted, ref, watch } from 'vue'
  import { usePriceLists } from '@/composable/usePriceLists.ts'

  const props = defineProps<{
    modelValue: boolean
    item?: PriceList | null
  }>()

  const { getPriceLists } = usePriceLists()

  const emit = defineEmits(['submit', 'update:model-value'])

  const isEditing = computed(() => !!props.item)
  const dialogTitle = computed(() =>
    isEditing.value ? 'Preisliste bearbeiten' : 'Preisliste erstellen',
  )

  const name = ref('')
  const title = ref('')

  const priceLists = ref<PriceList[]>()

  const selectedPresetPriceList = ref<PriceList>()

  onMounted(async () => {
    priceLists.value = await getPriceLists()
  })

  watch(
    () => props.item,
    newItem => {
      name.value = newItem?.name ?? ''
      title.value = newItem?.title ?? ''
    },
    { immediate: true },
  )

  function submit () {
    const payload = isEditing.value
      ? { ...props.item, name: name.value, presetShoppingListId: selectedPresetPriceList.value }
      : { name: name.value, presetShoppingListId: selectedPresetPriceList.value }

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
      <v-text-field v-model="name" label="Name" variant="outlined" />
      <v-text-field v-model="title" label="Titel" variant="outlined" />

      <v-select
        v-if="!isEditing"
        v-model="selectedPresetPriceList"
        clearable
        item-title="name"
        item-value="id"
        :items="priceLists"
        label="Vorlage"
      />

      <template #actions>
        <v-btn text="Abbrechen" @click="close" />
        <v-spacer />
        <v-btn :text="isEditing ? 'Speichern' : 'Erstellen'" @click="submit" />
      </template>
    </v-card>
  </v-dialog>
</template>
