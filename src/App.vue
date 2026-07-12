<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted } from 'vue'
  import { useCounterStore } from '@/stores/useCounter.ts'

  const counterStore = useCounterStore()

  let intervalId: number | undefined

  function handleOnline () {
    counterStore.processQueue()
  }

  onMounted(() => {
    counterStore.processQueue()
    window.addEventListener('online', handleOnline)

    intervalId = window.setInterval(() => {
      counterStore.processQueue()
    }, 30_000)
  })

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline)
    clearInterval(intervalId)
  })
</script>
