import type { Timestamp } from 'firebase/firestore'
import { toRaw } from 'vue'

export function useShortDate () {
  return new Date()
    .toLocaleDateString('de', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll('.', '')
}

export function formatTimestamp (timestamp: Timestamp): string {
  const date = toRaw(timestamp).toDate()
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
