import { v4 as uuidv4 } from 'uuid'

export class EventRegister {
  documentId = ''
  id: string = uuidv4()
  name = ''
  enabled = false
  eventId: string = uuidv4()

  constructor (documentId: string, id: string, name: string, enabled: boolean, eventId: string) {
    this.documentId = documentId
    this.id = id
    this.name = name
    this.enabled = enabled
    this.eventId = eventId
  }

  static fromData (documentId: any, data: any) {
    return new EventRegister(documentId, data.id, data.name, data.enabled, data.eventId)
  }
}
