import { v4 as uuidv4 } from 'uuid'

export class EventRegister {
  documentId = ''
  id: string = uuidv4()
  name = ''
  enabled = false
  eventId: string = uuidv4()

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.name = data.name
    this.enabled = data.enabled
    this.eventId = data.eventId
  }
}
