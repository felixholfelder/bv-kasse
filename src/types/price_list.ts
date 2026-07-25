import { v4 as uuidv4 } from 'uuid'

export class PriceList {
  documentId = ''
  id: string = uuidv4()
  name = ''
  title = ''

  constructor (documentId: any, id: string, name: string, title: string) {
    this.documentId = documentId
    this.id = id
    this.name = name
    this.title = title
  }

  static fromData (documentId: any, data: any) {
    return new PriceList(documentId, data.id, data.name, data.title)
  }
}
