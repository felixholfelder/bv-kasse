import { v4 as uuidv4 } from 'uuid'

export class Product {
  documentId: string
  id: string = uuidv4()
  name = ''
  price = 0
  color = ''
  registerId: string = uuidv4()

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.color = data.color
    this.registerId = data.registerId
  }
}
