import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import config from '@/config/firebase.public.json'

export function firebaseClient() {
  const app = getApps().length ? getApp() : initializeApp(config)
  return { auth: getAuth(app), db: getFirestore(app) }
}
