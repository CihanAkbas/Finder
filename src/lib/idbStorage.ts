import type { StateStorage } from 'zustand/middleware'

const DB_NAME = 'finder-map'
const STORE = 'kv'
const VERSION = 1
const CLOCK = '#clock'

type Copy = { value: string | null; clock: number }

/**
 * IndexedDB is the primary copy. localStorage is the fallback.
 * A missing or unreadable copy never erases a readable one.
 * When both are readable, the newer clock wins. Equal clocks keep the copy with more saved progress,
 * so a blank read cannot wipe a real save, and a newer reset is still kept.
 */

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => db.close()
      resolve(db)
    }
    request.onerror = () => reject(request.error ?? new Error('IndexedDB failed to open'))
    request.onblocked = () => reject(new Error('IndexedDB open is blocked'))
  })
}

function closeDb(db: IDBDatabase) {
  try {
    db.close()
  } catch {
    // A version change may already have closed it.
  }
}

function settle<T>(db: IDBDatabase, tx: IDBTransaction, done: () => T) {
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const fail = (error: unknown) => {
      if (settled) return
      settled = true
      closeDb(db)
      reject(error instanceof Error ? error : new Error('IndexedDB transaction failed'))
    }
    tx.oncomplete = () => {
      if (settled) return
      settled = true
      closeDb(db)
      try {
        resolve(done())
      } catch (error) {
        reject(error instanceof Error ? error : new Error('IndexedDB result was unreadable'))
      }
    }
    tx.onabort = () => fail(tx.error ?? new Error('IndexedDB transaction aborted'))
    tx.onerror = () => fail(tx.error ?? new Error('IndexedDB transaction failed'))
  })
}

function watch(request: IDBRequest, tx: IDBTransaction, onValue: (value: unknown) => void) {
  request.onsuccess = () => onValue(request.result)
  request.onerror = () => {
    try {
      tx.abort()
    } catch {
      // onabort reports the failure.
    }
  }
}

function idbRead(name: string) {
  return openDb().then((db) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    let value: unknown
    let clock: unknown
    watch(store.get(name), tx, (result) => {
      value = result
    })
    watch(store.get(`${name}${CLOCK}`), tx, (result) => {
      clock = result
    })
    return settle(db, tx, () => ({
      value: typeof value === 'string' ? value : null,
      clock: Number(clock) || 0,
    }))
  })
}

function idbWrite(name: string, value: string, clock: number) {
  return openDb().then((db) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    watch(store.put(value, name), tx, () => {})
    watch(store.put(String(clock), `${name}${CLOCK}`), tx, () => {})
    return settle(db, tx, () => true)
  })
}

function idbDelete(name: string) {
  return openDb().then((db) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    watch(store.delete(name), tx, () => {})
    watch(store.delete(`${name}${CLOCK}`), tx, () => {})
    return settle(db, tx, () => true)
  })
}

function localGet(name: string) {
  try {
    return localStorage.getItem(name)
  } catch {
    return null
  }
}

function localSet(name: string, value: string) {
  localStorage.setItem(name, value)
}

function localRemove(name: string) {
  localStorage.removeItem(name)
}

function localCopy(name: string): Copy {
  return { value: localGet(name), clock: Number(localGet(`${name}${CLOCK}`)) || 0 }
}

function readable(value: string | null): value is string {
  if (typeof value !== 'string' || value.length === 0) return false
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

function progressScore(value: string) {
  try {
    const parsed = JSON.parse(value) as { state?: { byGame?: unknown }; byGame?: unknown }
    const byGame = parsed.state?.byGame ?? parsed.byGame
    if (!byGame || typeof byGame !== 'object') return 0
    let score = 0
    for (const slice of Object.values(byGame)) {
      if (!slice || typeof slice !== 'object') continue
      score += 1
      const row = slice as Record<string, unknown>
      for (const key of ['found', 'checklistDone', 'customPins', 'objectiveDone', 'careerDone', 'ownedAssets', 'ownedVehicles', 'properties', 'favorites', 'route', 'savedFilters', 'ownedClothes', 'savedOutfits', 'customOutfits']) {
        if (Array.isArray(row[key])) score += row[key].length
      }
    }
    return score
  } catch {
    return 0
  }
}

export function chooseProgressCopy(idb: Copy, local: Copy) {
  const idbOk = readable(idb.value)
  const localOk = readable(local.value)
  if (idbOk && !localOk) return idb.value
  if (localOk && !idbOk) return local.value
  if (!readable(idb.value) || !readable(local.value)) return null
  if (idb.clock !== local.clock) return idb.clock > local.clock ? idb.value : local.value
  return progressScore(idb.value) >= progressScore(local.value) ? idb.value : local.value
}

async function heal(name: string, chosen: string, idb: Copy, local: Copy) {
  const clock = Math.max(idb.clock, local.clock) || Date.now()
  if (idb.value !== chosen) {
    try {
      await idbWrite(name, chosen, clock)
    } catch {
      // The chosen copy is still returned. The next save can try again.
    }
  }
  if (local.value !== chosen) {
    try {
      localSet(name, chosen)
      localSet(`${name}${CLOCK}`, String(clock))
    } catch {
      // localStorage can refuse a large save. IndexedDB remains the primary copy.
    }
  }
}

export function createProgressStorage(): StateStorage {
  return {
    async getItem(name) {
      if (typeof window === 'undefined') return null
      const local = localCopy(name)
      let idb: Copy = { value: null, clock: 0 }
      if (typeof indexedDB !== 'undefined') {
        try {
          idb = await idbRead(name)
        } catch {
          idb = { value: null, clock: 0 }
        }
      }
      const chosen = chooseProgressCopy(idb, local)
      if (chosen) void heal(name, chosen, idb, local)
      return chosen
    },
    async setItem(name, value) {
      const clock = Date.now()
      let stored = false
      if (typeof indexedDB !== 'undefined') {
        try {
          await idbWrite(name, value, clock)
          stored = true
        } catch {
          stored = false
        }
      }
      try {
        localSet(name, value)
        localSet(`${name}${CLOCK}`, String(clock))
        stored = true
      } catch {
        // Quota or private mode. IndexedDB may already hold this save.
      }
      if (!stored) throw new Error('Progress could not be saved.')
    },
    async removeItem(name) {
      if (typeof indexedDB !== 'undefined') {
        try {
          await idbDelete(name)
        } catch {
          // The local copy is still removed below.
        }
      }
      try {
        localRemove(name)
        localRemove(`${name}${CLOCK}`)
      } catch {
        // Private mode can refuse both stores. The in-memory session still works.
      }
    },
  }
}
