import { collection, doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore'
import { firebaseClient } from './firebase'
import { mergeProgress } from './progressMerge'
import { parseBackup } from './backup'
import { normalizeSlice, type GameSlice } from '@/store/slice'
import { useCompanionStore as store } from '@/store/useCompanionStore'

type Games = Record<string, GameSlice>
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const key = (uid: string) => `finder-account-v1:${uid}`
function read(uid: string): { base: Games; local: Games } | null {
  try { const raw = localStorage.getItem(key(uid)); return raw ? JSON.parse(raw) : null } catch { return null }
}
function save(uid: string, base: Games, local: Games) {
  try { localStorage.setItem(key(uid), JSON.stringify({ base, local })) } catch { /* Primary IndexedDB save still remains available. */ }
}
export type SyncStatus = 'local' | 'syncing' | 'saved' | 'offline' | 'error'
export function startProgressSync(uid: string | null, status: (value: SyncStatus) => void) {
  let stopped = false, suppress = false, ready = false, busy = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let base: Games = {}, local: Games = {}
  let unsubscribeStore = () => {}, unsubscribeRemote = () => {}
  const owner = uid ?? 'guest'
  const apply = () => { suppress = true; store.setState({ byGame: local }); suppress = false }
  const persist = () => save(owner, base, local)
  const flush = async () => {
    if (!uid || !ready || stopped || busy) return
    if (!navigator.onLine) { status('offline'); return }
    busy = true
    status('syncing')
    try {
      for (const slug of new Set([...Object.keys(local), ...Object.keys(base)])) {
        if (stopped) return
        const before = base[slug] ?? normalizeSlice(), edited = local[slug] ?? normalizeSlice()
        if (equal(before, edited)) continue
        const reference = doc(firebaseClient().db, 'users', uid, 'games', slug)
        const committed = await runTransaction(firebaseClient().db, async (transaction) => {
          const snapshot = await transaction.get(reference)
          const remote = snapshot.exists() ? normalizeSlice(snapshot.data().slice) : normalizeSlice()
          const slice = normalizeSlice(mergeProgress(before, edited, remote) as GameSlice)
          transaction.set(reference, { version: 1, slice: JSON.parse(JSON.stringify(slice)), updatedAt: serverTimestamp() })
          return slice
        })
        if (stopped) return
        local = { ...local, [slug]: normalizeSlice(mergeProgress(edited, local[slug] ?? normalizeSlice(), committed) as GameSlice) }
        base = { ...base, [slug]: committed }
        persist(); apply()
      }
      status(equal(base, local) ? 'saved' : 'syncing')
    } catch { status(navigator.onLine ? 'error' : 'offline') }
    finally { busy = false }
    if (!stopped && !equal(base, local)) timer = setTimeout(flush, 5000)
  }
  const schedule = () => { if (timer) clearTimeout(timer); timer = setTimeout(flush, 800) }
  const initialize = () => {
    if (stopped) return
    const previous = localStorage.getItem('finder-progress-owner')
    if (previous) {
      const previousSave = read(previous)
      save(previous, previousSave?.base ?? {}, store.getState().byGame)
    }
    const cached = read(owner)
    local = cached?.local ?? (previous && previous !== 'guest' ? {} : store.getState().byGame)
    base = cached?.base ?? Object.fromEntries(Object.keys(local).map((slug) => [slug, normalizeSlice()]))
    localStorage.setItem('finder-progress-owner', owner)
    apply(); persist()
    unsubscribeStore = store.subscribe((state, old) => {
      if (suppress || state.byGame === old.byGame) return
      local = state.byGame; persist(); if (uid) { status('syncing'); schedule() }
    })
    if (!uid) { status('local'); return }
    status('syncing')
    unsubscribeRemote = onSnapshot(collection(firebaseClient().db, 'users', uid, 'games'), { includeMetadataChanges: true }, (snapshot) => {
      if (stopped || snapshot.metadata.hasPendingWrites || snapshot.metadata.fromCache) return
      try {
        const raw = Object.fromEntries(snapshot.docs.map((item) => [item.id, item.data().slice]))
        const remote = Object.keys(raw).length ? parseBackup(JSON.stringify({ app: 'finder', version: 1, games: raw })) : {}
        local = mergeProgress(base, local, remote) as Games
        base = remote
        ready = true; persist(); apply()
        if (equal(base, local)) status('saved'); else schedule()
      } catch { status('error') }
    }, () => status(navigator.onLine ? 'error' : 'offline'))
  }
  const offHydrate = store.persist.onFinishHydration(initialize)
  if (store.persist.hasHydrated()) initialize()
  const online = () => { if (uid) schedule() }
  const offline = () => { if (uid) status('offline') }
  window.addEventListener('online', online); window.addEventListener('offline', offline)
  return () => { stopped = true; offHydrate(); unsubscribeStore(); unsubscribeRemote(); if (timer) clearTimeout(timer); window.removeEventListener('online', online); window.removeEventListener('offline', offline) }
}
