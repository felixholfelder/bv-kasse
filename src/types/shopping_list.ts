import { v4 as uuidv4 } from 'uuid'

export class ShoppingList {
  documentId = ''
  id: string = uuidv4()
  name = ''

  constructor (documentId: any, id: string, name: string) {
    this.documentId = documentId
    this.id = id
    this.name = name
  }

  static fromData (documentId: any, data: any) {
    return new ShoppingList(documentId, data.id, data.name)
  }
}
