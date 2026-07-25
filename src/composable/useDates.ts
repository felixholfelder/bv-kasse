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

export function formatTimestamp (timestamp: Timestamp, lang = 'de-DE'): string {
  if (!timestamp) {
    return ''
  }
  const date = toRaw(timestamp).toDate()
  return new Date(date).toLocaleDateString(lang, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function getDateFromTimestamp (timestamp: Timestamp): Date {
  return timestamp.toDate()
}
