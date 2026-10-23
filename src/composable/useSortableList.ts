import type { Ref } from 'vue'
import Sortable from 'sortablejs'
import { onBeforeUnmount, onMounted } from 'vue'

interface Options<T> {
  items: Ref<T[]>
  container: Ref<HTMLElement | null>
  sortKey: keyof T
  persist: (changed: T[]) => Promise<unknown>
  handle?: string
}

export function useSortableList<T extends object> (options: Options<T>) {
  const { items, container, sortKey, persist, handle = '.drag-handle' } = options
  let instance: Sortable | null = null

  onMounted(() => {
    if (!container.value) {
      return
    }

    instance = Sortable.create(container.value, {
      handle,
      animation: 150,
      onEnd,
    })
  })

  onBeforeUnmount(() => instance?.destroy())

  async function onEnd (event: Sortable.SortableEvent) {
    const { oldIndex, newIndex, item, from } = event
    if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
      return
    }

    // SortableJS hat das DOM schon verschoben. Wir machen das rückgängig,
    // damit Vue die Zeilen über den State als Einziger verwaltet.
    item.remove()
    from.insertBefore(item, from.children[oldIndex] ?? null)

    const reordered = [...items.value]
    reordered.splice(newIndex, 0, reordered.splice(oldIndex, 1)[0])

    const withNewOrder = reordered.map((entry, index) => ({ ...entry, [sortKey]: index + 1 }))
    const changed = withNewOrder.filter(
      (entry, index) => entry[sortKey] !== reordered[index][sortKey],
    )

    items.value = withNewOrder
    await persist(changed)
  }
}
