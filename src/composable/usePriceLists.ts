import { deleteDoc } from '@firebase/firestore'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/firebase.ts'
import { PriceList } from '@/types/price_list.ts'
import { PriceListEntry } from '@/types/price_list_entry.ts'

export function usePriceLists () {
  const price_list = 'price_list'
  const price_list_entry = 'price_list_entry'

  async function getPriceLists () {
    const q = query(collection(db, price_list))

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => PriceList.fromData(doc.id, doc.data()))
  }

  async function getPriceList (priceListId: string) {
    const q = query(collection(db, price_list), where('id', '==', priceListId))
    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 1) {
      throw new Error(`More than active event found: ${snapshot.docs.length}!`)
    }

    if (snapshot.docs.length === 0) {
      throw new Error(`Keine Preislisten gefunden: ${priceListId}!`)
    }

    return PriceList.fromData(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  async function createPriceList (item: PriceList, presetPriceListId: string | null) {
    await addDoc(collection(db, price_list), {
      id: item.id,
      name: item.name,
      title: item.title,
    })

    if (presetPriceListId != null) {
      const presetPriceList = await getPriceListEntries(presetPriceListId)
      for (const entry of presetPriceList) {
        entry.id = uuidv4()
        entry.priceListId = item.id
        await createPriceListEntry(entry)
      }
    }
  }

  async function updatePriceList (item: PriceList) {
    await setDoc(doc(db, price_list, item.documentId), {
      id: item.id,
      name: item.name,
      title: item.title,
    })
  }

  async function getPriceListEntries (priceListId: string) {
    const q = query(collection(db, price_list_entry), where('priceListId', '==', priceListId))

    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => new PriceListEntry(doc.id, doc.data()))
  }

  async function getPriceListEntryById (priceListEntryId: string) {
    const q = query(collection(db, price_list_entry), where('id', '==', priceListEntryId))
    const snapshot = await getDocs(q)

    if (snapshot.docs.length > 1) {
      throw new Error(`More than active event found: ${snapshot.docs.length}!`)
    }

    if (snapshot.docs.length === 0) {
      throw new Error(`Kein Preislisteneintrag gefunden: ${priceListEntryId}!`)
    }

    return new PriceListEntry(snapshot.docs[0].id, snapshot.docs[0].data())
  }

  async function createPriceListEntry (item: PriceListEntry) {
    return await addDoc(collection(db, price_list_entry), {
      id: item.id,
      priceListId: item.priceListId,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      enabled: item.enabled,
      sortOrder: item.sortOrder,
    })
  }

  async function updatePriceListEntry (item: PriceListEntry) {
    await setDoc(doc(db, price_list_entry, item.documentId), {
      id: item.id,
      priceListId: item.priceListId,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      enabled: item.enabled,
      sortOrder: item.sortOrder,
    })
  }

  async function deletePriceListEntry (item: PriceListEntry) {
    await deleteDoc(doc(db, price_list_entry, item.documentId))
  }

  async function disablePriceListEntry (priceListEntryId: string) {
    const item = await getPriceListEntryById(priceListEntryId)
    await updateDoc(doc(db, price_list_entry, item.documentId), {
      enabled: false,
    })
  }

  async function enablePriceListEntry (priceListEntryId: string) {
    const item = await getPriceListEntryById(priceListEntryId)
    await updateDoc(doc(db, price_list_entry, item.documentId), {
      enabled: true,
    })
  }

  return {
    getPriceLists,
    getPriceList,
    createPriceList,
    updatePriceList,
    getPriceListEntries,
    createPriceListEntry,
    updatePriceListEntry,
    deletePriceListEntry,
    enablePriceListEntry,
    disablePriceListEntry,
  }
}
