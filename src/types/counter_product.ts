import { v4 as uuidv4 } from 'uuid'

export class ProductCounterItem {
  id: string = uuidv4()
  productId: string = uuidv4()
  eventId: string = uuidv4()
  amount = 0
}
