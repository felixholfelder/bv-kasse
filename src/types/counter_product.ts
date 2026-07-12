import { v4 as uuidv4 } from 'uuid'

export class ProductCounterEvent {
  documentId: string = uuidv4()
  increase = true

  constructor (documentId: string, increase = true) {
    this.documentId = documentId
    this.increase = increase
  }
}
