import { v4 as uuidv4 } from 'uuid'

export class EventRegisterProduct {
  documentId = ''
  id: string = uuidv4()
  name = ''
  enabled = false
  eventRegisterId: string = uuidv4()
  count = 0
  price = 0
  color = ''
  priority = 0

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.name = data.name
    this.enabled = data.enabled
    this.eventRegisterId = data.eventRegisterId
    this.count = data.count
    this.price = data.price
    this.color = data.color
    this.priority = data.priority
  }
}
