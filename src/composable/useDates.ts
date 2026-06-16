export function useShortDate () {
  return new Date()
    .toLocaleDateString('de', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll('.', '')
}
