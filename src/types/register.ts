import { v4 as uuidv4 } from 'uuid'

export class Register {
  documentId: string
  id: string = uuidv4()
  name = ''

  constructor (documentId: any, data: any) {
    this.documentId = documentId
    this.id = data.id
    this.name = data.name
  }
}
