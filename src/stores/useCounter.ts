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

  function processQueue () {
    for (const item of queue.value) {
      try {
        if (item.increase) {
          increaseCounter(item.documentId)
        } else {
          decreaseCounter(item.documentId)
        }
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
