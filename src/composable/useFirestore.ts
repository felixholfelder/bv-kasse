import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/firebase'
import { Event as EventModel } from '@/types/event.ts'
import { EventRegister } from '@/types/event_register.ts'
import { EventRegisterProduct } from '@/types/event_register_product.ts'
import { Product } from '@/types/product.ts'
import { Register } from '@/types/register.ts'

export function useFirestore () {
  const event = 'event'
  const event_register = 'event_register'
  const event_register_product = 'event_register_product'
  const register = 'register'
  const product = 'product'

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

    return docs.map(doc => EventRegister.fromData(doc.id, doc.data()))
  }

  async function getActiveEventRegistersByEventId (eventId: string) {
    const q = query(
      collection(db, event_register),
      where('eventId', '==', eventId),
      where('enabled', '==', true),
    )
    const snapshot = await getDocs(q)

    const docs = snapshot.docs

    return docs.map(doc => EventRegister.fromData(doc.id, doc.data()))
  }

  async function getEventRegisterById (eventRegisterId: string) {
    const q = query(collection(db, event_register), where('id', '==', eventRegisterId))
    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 1) {
      throw new Error(`More than one document was found with eventRegisterId ${eventRegisterId}.`)
    }

    return EventRegister.fromData(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  async function disableEventRegister (eventRegisterId: string) {
    const item = await getEventRegisterById(eventRegisterId)
    await updateDoc(doc(db, event_register, item.documentId), {
      enabled: false,
    })
  }

  async function enableEventRegister (eventRegisterId: string) {
    const item = await getEventRegisterById(eventRegisterId)
    await updateDoc(doc(db, event_register, item.documentId), {
      enabled: true,
    })
  }

  async function getEventRegisterProductsByEventRegisterId (eventRegisterId: string) {
    const q = query(
      collection(db, event_register_product),
      where('eventRegisterId', '==', eventRegisterId),
    )
    const snapshot = await getDocs(q)

    return snapshot.docs
      .map(doc => EventRegisterProduct.fromData(doc.id, doc.data()))
      .sort((itemA, itemB) => itemA.priority - itemB.priority) // eslint-disable-line
  }

  async function getEventRegisterProductsById (eventRegisterProductId: string) {
    const q = query(
      collection(db, event_register_product),
      where('id', '==', eventRegisterProductId),
    )
    const snapshot = await getDocs(q)
    if (snapshot.docs.length > 1) {
      throw new Error(
        `More than one document was found with eventRegisterProductId ${eventRegisterProductId}.`,
      )
    }

    return EventRegisterProduct.fromData(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  async function disableEventRegisterProduct (eventRegisterProductId: string) {
    const item = await getEventRegisterProductsById(eventRegisterProductId)
    await updateDoc(doc(db, event_register_product, item.documentId), {
      enabled: false,
    })
  }

  async function enableEventRegisterProduct (eventRegisterProductId: string) {
    const item = await getEventRegisterProductsById(eventRegisterProductId)
    await updateDoc(doc(db, event_register_product, item.documentId), {
      enabled: true,
    })
  }

  async function createEventRegisterProduct (item: EventRegisterProduct) {
    const q = await addDoc(collection(db, event_register_product), {
      id: item.id,
      eventRegisterId: item.eventRegisterId,
      enabled: true,
      name: item.name,
      price: item.price,
      priority: item.priority,
      color: item.color,
      count: 0,
    })

    return q.id
  }

  async function createEventRegister (item: EventRegister) {
    const q = await addDoc(collection(db, event_register), {
      id: item.id,
      eventId: item.eventId,
      name: item.name,
      enabled: false,
    })

    return q.id
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

  async function getRegisters () {
    const q = query(collection(db, register), orderBy('name', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => new Register(doc.id, doc.data()))
  }

  async function createRegister (item: Register) {
    const q = await addDoc(collection(db, register), {
      id: item.id,
      name: item.name,
    })

    return q.id
  }

  async function updateRegister (item: Register) {
    await setDoc(doc(db, register, item.documentId), {
      id: item.id,
      name: item.name,
    })
  }

  async function createProduct (item: Product) {
    const q = await addDoc(collection(db, product), {
      id: item.id,
      name: item.name,
      color: item.color,
      price: item.price,
      priority: item.priority,
      registerId: item.registerId,
    })

    return q.id
  }

  async function updateProduct (item: Product) {
    await setDoc(doc(db, product, item.documentId), {
      id: item.id,
      name: item.name,
      color: item.color,
      price: item.price,
      priority: item.priority,
      registerId: item.registerId,
    })
  }

  async function createEvent (item: EventModel) {
    await addDoc(collection(db, event), {
      id: item.id,
      name: item.name,
      date: item.date,
    })

    const registers: Register[] = await getRegisters()

    for (const register of registers) {
      const eventRegisterId = uuidv4()
      const eventRegister = new EventRegister('', eventRegisterId, register.name, false, item.id)
      await createEventRegister(eventRegister)

      const products: Product[] = await getProductsByRegisterId(register.id)
      for (const product of products) {
        const eventRegisterProductId = uuidv4()
        const eventRegisterProduct = new EventRegisterProduct(
          '',
          eventRegisterProductId,
          product.name,
          true,
          eventRegister.id,
          0,
          product.price,
          product.color,
          product.priority,
        )
        await createEventRegisterProduct(eventRegisterProduct)
      }
    }
  }

  async function updateEvent (item: EventModel) {
    await setDoc(doc(db, event, item.documentId), {
      id: item.id,
      name: item.name,
      date: item.date,
    })
  }

  async function getProductsByRegisterId (registerId: string) {
    const q = query(collection(db, product), where('registerId', '==', registerId))
    const snapshot = await getDocs(q)

    return snapshot.docs
      .map(doc => new Product(doc.id, doc.data()))
      .sort((itemA, itemB) => itemA.priority - itemB.priority) // eslint-disable-line
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
    enableEventRegister,
    disableEventRegister,
    getEventRegisterProductsByEventRegisterId,
    enableEventRegisterProduct,
    disableEventRegisterProduct,
    getCurrentActiveEvent,
    getRegisters,
    createRegister,
    updateRegister,
    getProductsByRegisterId,
    createProduct,
    updateProduct,
    createEvent,
    updateEvent,
    getActiveEventRegistersByEventId,
  }
}
