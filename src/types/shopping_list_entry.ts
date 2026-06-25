import { v4 as uuidv4 } from 'uuid'

export class ShoppingListEntry {
  documentId = ''
  id: string = uuidv4()
  shoppingListId: string = uuidv4()
  name = ''
  amount = ''
  stock = ''

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.shoppingListId = data.shoppingListId
    this.name = data.name
    this.amount = data.amount
    this.stock = data.stock
  }
}
