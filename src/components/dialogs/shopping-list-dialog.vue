<script setup lang="ts">
  import type { Register } from '@/types/register.ts'
  import type { ShoppingList } from '@/types/shopping_list.ts'
  import { computed, onMounted, ref, watch } from 'vue'
  import { useFirestore } from '@/composable/useFirestore.ts'

  const props = defineProps<{
    modelValue: boolean
    item?: Register | null
  }>()

  const { getShoppingLists } = useFirestore()

  const emit = defineEmits(['submit', 'update:model-value'])

  const isEditing = computed(() => !!props.item)
  const title = computed(() =>
    isEditing.value ? 'Einkaufsliste bearbeiten' : 'Einkaufsliste erstellen',
  )

  const name = ref('')

  const shoppingLists = ref<ShoppingList[]>()

  const selectedPresetShoppingList = ref<ShoppingList>()

  onMounted(async () => {
    shoppingLists.value = await getShoppingLists()
  })

  watch(
    () => props.item,
    newItem => {
      name.value = newItem?.name ?? ''
    },
    { immediate: true },
  )

  function submit () {
    const payload = isEditing.value
      ? { ...props.item, name: name.value, presetShoppingListId: selectedPresetShoppingList.value }
      : { name: name.value, presetShoppingListId: selectedPresetShoppingList.value }

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

      <v-select
        v-if="!isEditing"
        v-model="selectedPresetShoppingList"
        clearable
        item-title="name"
        item-value="id"
        :items="shoppingLists"
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
