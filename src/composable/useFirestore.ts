import type { ProductCounterItem } from '@/types/counter_product.ts'
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/firebase'

export function useFirestore () {
  const counter_product = 'counter_product'
  const event = 'event'

  async function createCounterItem (counterItem: ProductCounterItem) {
    await addDoc(collection(db, counter_product), {
      id: counterItem.id,
      eventId: counterItem.eventId,
      productId: counterItem.productId,
      amount: 0,
    })
  }

  async function updateCounterItem (counterItem: ProductCounterItem) {
    const item = await getCounterItem(counterItem.eventId, counterItem.productId)
    await updateDoc(doc(db, counter_product, item.documentId), {
      amount: item.amount + counterItem.amount,
    })
  }

  async function getCounterItem (eventId: string, productId: string) {
    const q = query(
      collection(db, counter_product),
      where('eventId', '==', eventId),
      where('productId', '==', productId),
    )

    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 0) {
      throw new Error(
        `More than one document was found with eventId ${eventId} and productId ${productId}.`,
      )
    }

    const doc = snapshot.docs[0]
    return {
      documentId: doc.id,
      ...doc.data(),
    }
  }

  async function getEvents () {
    const q = query(collection(db, event))

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      documentId: doc.id,
      ...doc.data(),
    }))
  }

  return {
    updateCounterItem,
    getEvents,
    createCounterItem,
  }
}
