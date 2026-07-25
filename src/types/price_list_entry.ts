import { v4 as uuidv4 } from 'uuid'

export class PriceListEntry {
  documentId = ''
  id: string = uuidv4()
  priceListId: string = uuidv4()
  title = ''
  subtitle = ''
  price = 0
  enabled = true
  sortOrder: 0

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.priceListId = data.priceListId
    this.title = data.title
    this.subtitle = data.subtitle
    this.price = data.price
    this.enabled = data.enabled
    this.sortOrder = data.sortOrder
  }
}
