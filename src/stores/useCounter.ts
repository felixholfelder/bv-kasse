import type { ProductCounterEvent } from '@/types/counter_product.ts'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFirestore } from '@/composable/useFirestore.ts'

const { increaseCounter, decreaseCounter } = useFirestore()

export const useCounterStore = defineStore('counter', () => {
  const queue = ref<ProductCounterEvent[]>([])

  function addQueueItem (item: ProductCounterEvent) {
    queue.value.push(item)
  }

  function removeItem (item: ProductCounterEvent) {
    queue.value = queue.value.filter(i => i.documentId !== item.documentId)
  }

  async function processQueue () {
    if (!navigator.onLine) {
      return
    }

    for (const item of queue.value) {
      try {
        await (item.increase ? increaseCounter(item.documentId) : decreaseCounter(item.documentId))
        removeItem(item)
      } catch (error: any) {
        console.error(error)
      }
    }
  }

  return {
    queue,
    addQueueItem,
    processQueue,
  }
})
