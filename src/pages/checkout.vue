<script setup lang="ts">
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { VNumberInput } from 'vuetify/components'
  import { formatPrice } from '@/composable/usePriceUtils.ts'

  const route = useRoute()
  const params = route.query
  const defaultChangeMatrix = [1, 2, 5, 10, 20, 50, 100]

  const price = computed(() => {
    return Number.parseFloat(params.price as string)
  })

  function getDefaultChange () {
    for (const item of defaultChangeMatrix) {
      if (price.value <= item) return item
    }

    return 0
  }

  const givenAmount = ref(getDefaultChange())

  const change = computed(() => {
    return givenAmount.value - price.value
  })

  const givenAmountInput = ref<InstanceType<typeof VNumberInput> | null>(null)

  onMounted(async () => {
    await nextTick()
    const input = givenAmountInput.value?.$el.querySelector('input')
    setTimeout(() => input?.select(), 50)
  })
</script>

<template>
  <div>
    <v-row>
      <v-app-bar title="Zahlung">
        <template #prepend>
          <v-icon-btn icon="mdi-arrow-left" @click="$router.back()" />
        </template>
      </v-app-bar>
    </v-row>

    <v-container class="fill-height d-flex flex-column mt-16" max-width="1100">
      <v-card class="py-4 pa-3 mb-4 text-title-large">
        <v-row>
          <div>Gesamtpreis:</div>
          <v-spacer />
          <div>{{ formatPrice(price) }}</div>
        </v-row>
      </v-card>

      <v-card class="py-4 pa-3 mb-4 text-title-large">
        <div class="mb-4">Gegeben:</div>

        <v-number-input
          ref="givenAmountInput"
          v-model="givenAmount"
          autofocus
          decimal-separator=","
          :min="0"
          :precision="2"
          variant="outlined"
        />
      </v-card>

      <v-divider class="mb-4" />

      <v-card class="py-4 pa-3 text-title-large">
        <v-row>
          <div>Rückgeld:</div>
          <v-spacer />
          <div>{{ formatPrice(change) }}</div>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped></style>
