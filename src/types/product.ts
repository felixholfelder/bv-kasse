import { v4 as uuidv4 } from 'uuid'

export class Product {
  id: string = uuidv4()
  name = ''
  price = 0
  color = ''
  registerId: string = uuidv4()
  enabled = true
}
