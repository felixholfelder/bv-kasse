import type { Timestamp } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

export class Event {
  documentId = ''
  id: string = uuidv4()
  name = ''
  enabled = false
  date: Timestamp

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.name = data.name
    this.enabled = data.enabled
    this.date = data.date
  }
}
