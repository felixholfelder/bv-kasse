import {
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase'
import { Event as EventModel } from '@/types/event.ts'
import { EventRegister } from '@/types/event_register.ts'
import { EventRegisterProduct } from '@/types/event_register_product.ts'

export function useFirestore () {
  const event = 'event'
  const event_register = 'event_register'
  const event_register_product = 'event_register_product'

  async function increaseCounter (documentId: string) {
    await updateDoc(doc(db, event_register_product, documentId), {
      count: increment(1),
    })
  }

  async function decreaseCounter (documentId: string) {
    await updateDoc(doc(db, event_register_product, documentId), {
      count: increment(-1),
    })
  }

  async function getEvents () {
    const q = query(collection(db, event), orderBy('date', 'desc'))

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => new EventModel(doc.id, doc.data()))
  }

  async function getEvent (id: string) {
    const q = query(collection(db, event), where('id', '==', id))

    const snapshot = await getDocs(q)
    if (snapshot.docs.length > 1) {
      throw new Error(`More than one document was found with eventId ${id}.`)
    }

    return new EventModel(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  async function disableEvent (eventId: string) {
    const item = await getEvent(eventId)
    await updateDoc(doc(db, event, item.documentId), {
      enabled: false,
    })
  }

  async function enableEvent (eventId: string) {
    const item = await getEvent(eventId)
    await updateDoc(doc(db, event, item.documentId), {
      enabled: true,
    })
  }

  async function getEventRegistersByEventId (eventId: string) {
    const q = query(collection(db, event_register), where('eventId', '==', eventId))
    const snapshot = await getDocs(q)

    const docs = snapshot.docs

    return docs.map(doc => new EventRegister(doc.id, doc.data()))
  }

  async function getEventRegisterById (eventRegisterId: string) {
    const q = query(collection(db, event_register), where('id', '==', eventRegisterId))
    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 1) {
      throw new Error(`More than one document was found with eventRegisterId ${eventRegisterId}.`)
    }

    return new EventRegister(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  async function getEventRegisterProductsByEventRegisterId (eventRegisterId: string) {
    const q = query(
      collection(db, event_register_product),
      where('eventRegisterId', '==', eventRegisterId),
    )
    const snapshot = await getDocs(q)

    return snapshot.docs
      .map(doc => new EventRegisterProduct(doc.id, doc.data()))
      .sort((itemA, itemB) => itemA.priority - itemB.priority) // eslint-disable-line
  }

  async function getCurrentActiveEvent () {
    const q = query(collection(db, event), where('enabled', '==', true))
    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 1) {
      throw new Error(`More than active event found: ${snapshot.docs.length}!`)
    }

    if (snapshot.docs.length === 0) {
      throw new Error(`Keine aktiven Veranstaltungen!`)
    }

    return new EventModel(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  return {
    increaseCounter,
    decreaseCounter,
    getEvents,
    getEvent,
    enableEvent,
    disableEvent,
    getEventRegistersByEventId,
    getEventRegisterById,
    getEventRegisterProductsByEventRegisterId,
    getCurrentActiveEvent,
  }
}
