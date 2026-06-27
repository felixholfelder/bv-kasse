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

  constructor (
    documentId: any,
    id: string,
    name: string,
    enabled: boolean,
    eventRegisterId: string,
    count: number,
    price: number,
    color: string,
    priority: number,
  ) {
    this.documentId = documentId
    this.id = id
    this.name = name
    this.enabled = enabled
    this.eventRegisterId = eventRegisterId
    this.count = count
    this.price = price
    this.color = color
    this.priority = priority
  }

  static fromData (documentId: any, data: any) {
    return new EventRegisterProduct(
      documentId,
      data.id,
      data.name,
      data.enabled,
      data.eventRegisterId,
      data.count,
      data.price,
      data.color,
      data.priority,
    )
  }
}
