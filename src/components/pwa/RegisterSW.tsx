'use client'

import { useEffect } from 'react'

export function RegisterSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const local = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (process.env.NODE_ENV !== 'production' || local) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) void registration.unregister()
      })
      if ('caches' in window) {
        void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      }
      return
    }
    const register = () => {
      void navigator.serviceWorker.register('/sw.js').catch(() => {
        // A blocked worker still leaves the app usable online.
      })
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])
  return null
}
