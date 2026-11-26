'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseClient } from '@/lib/firebase'
import { startProgressSync, type SyncStatus } from '@/lib/progressSync'
const Context = createContext<{ user: User | null; loading: boolean; status: SyncStatus }>({ user: null, loading: true, status: 'local' })
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<SyncStatus>('local')
  useEffect(() => {
    let stop = () => {}
    const unsubscribe = onAuthStateChanged(firebaseClient().auth, (next) => {
      stop(); setUser(next); setLoading(false)
      stop = startProgressSync(next?.uid ?? null, setStatus)
    }, () => { setLoading(false); setStatus('error') })
    return () => { unsubscribe(); stop() }
  }, [])
  return <Context.Provider value={{ user, loading, status }}>{children}</Context.Provider>
}
export const useAuth = () => useContext(Context)
