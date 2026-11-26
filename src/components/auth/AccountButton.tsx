'use client'
import { useState, type FormEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { UserRound, X } from 'lucide-react'
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { firebaseClient } from '@/lib/firebase'
import { useAuth } from './AuthProvider'
import { useI18n } from '@/i18n/provider'
export function AccountButton() {
  const { locale } = useI18n(), tr = locale === 'tr'
  const { user, loading, status } = useAuth()
  const [open, setOpen] = useState(false), [register, setRegister] = useState(false)
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('')
  const copy = (a: string, b: string) => tr ? a : b
  async function run(action: () => Promise<unknown>, success?: string) {
    setBusy(true); setMessage('')
    try { await action(); if (success) setMessage(success); else setOpen(false) }
    catch (error) {
      const code = error instanceof FirebaseError ? error.code : ''
      const errors: Record<string, string> = {
        'auth/invalid-credential': copy('E-posta veya şifre hatalı.', 'Email or password is incorrect.'),
        'auth/email-already-in-use': copy('Bu e-posta zaten kayıtlı. Giriş yapmayı dene.', 'This email is already registered. Try signing in.'),
        'auth/weak-password': copy('En az 6 karakterli bir şifre kullan.', 'Use a password with at least 6 characters.'),
        'auth/popup-closed-by-user': copy('Google giriş penceresi kapatıldı.', 'Google sign-in was closed.'),
        'auth/popup-blocked': copy('Tarayıcı giriş penceresini engelledi. Bu site için açılır pencerelere izin ver.', 'Allow popups for this site to sign in.'),
        'auth/unauthorized-domain': copy('Bu site adresi Firebase giriş ayarlarına henüz eklenmemiş.', 'This domain has not been authorized in Firebase yet.'),
        'auth/configuration-not-found': copy('Firebase giriş kurulumu henüz tamamlanmadı. İlerlemen bu cihazda saklanıyor.', 'Firebase sign-in setup is not finished. Progress stays on this device.'),
        'auth/operation-not-allowed': copy('Bu giriş yöntemi henüz etkinleştirilmemiş.', 'This sign-in method is not enabled yet.'),
        'auth/too-many-requests': copy('Çok fazla deneme yapıldı. Biraz sonra tekrar dene.', 'Too many attempts. Try again later.'),
        'auth/network-request-failed': copy('Bağlantı kurulamadı. İnternet bağlantını kontrol et.', 'Check your internet connection.'),
      }
      setMessage(errors[code] ?? copy('İşlem tamamlanamadı. Tekrar dene.', 'Could not finish. Please try again.'))
    } finally { setBusy(false) }
  }
  function submit(event: FormEvent) { event.preventDefault(); void run(() => register ? createUserWithEmailAndPassword(firebaseClient().auth, email, password) : signInWithEmailAndPassword(firebaseClient().auth, email, password)) }
  const statuses = { local: copy('Bu cihazda saklanıyor', 'Saved on this device'), syncing: copy('Eşitleniyor…', 'Syncing…'), saved: copy('Hesabına kaydedildi', 'Saved to your account'), offline: copy('Çevrimdışı · Bağlanınca eşitlenecek', 'Offline · Will sync when connected'), error: copy('Eşitleme bekliyor · Yerel kaydın korunuyor', 'Sync pending · Local save is preserved') }
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Trigger asChild><button type="button" aria-label={user ? copy('Hesabım', 'My account') : copy('Giriş yap', 'Sign in')} disabled={loading} className="relative grid size-9 shrink-0 place-items-center rounded-lg border border-white/15 text-emerald-300 sm:flex sm:w-auto sm:gap-2 sm:px-3"><UserRound className="size-4" /><span className="hidden text-xs sm:inline">{user ? copy('Hesabım', 'Account') : copy('Giriş yap', 'Sign in')}</span>{user ? <span className={`absolute right-1 top-1 size-1.5 rounded-full ${status === 'saved' ? 'bg-emerald-300' : 'bg-amber-300'}`} /> : null}</button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[100] bg-black/75" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[101] max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-white/15 bg-[#10171d] p-6 text-[#f3efe6] shadow-2xl">
      <Dialog.Title className="pr-6 font-display text-2xl">{user ? copy('Hesabım', 'My account') : register ? copy('Hesap oluştur', 'Create account') : copy('İlerlemeni yanında taşı', 'Take your progress with you')}</Dialog.Title>
      <Dialog.Description className="mt-2 text-sm leading-6 text-slate-400">{user ? statuses[status] : copy('PC ve telefonda aynı hesapla giriş yap. Bulduğun konumlar, görevlerin ve favorilerin eşitlensin.', 'Sign in with the same account on PC and phone to sync locations, missions and favorites.')}</Dialog.Description>
      <Dialog.Close aria-label={copy('Kapat', 'Close')} className="absolute right-4 top-4 p-1"><X className="size-5" /></Dialog.Close>
      {user ? <div className="mt-5 space-y-4"><p className="break-all text-sm">{user.email}</p><button disabled={busy} className="w-full rounded-lg border border-white/20 p-3" onClick={() => void run(() => signOut(firebaseClient().auth))}>{copy('Çıkış yap', 'Sign out')}</button><p className="text-xs text-slate-400">{copy('Çıkış yaptığında hesabındaki kayıtlar korunur. Misafir ilerlemesi ayrı tutulur.', 'Your account save stays safe after signing out. Guest progress is kept separately.')}</p></div> : <>
        <button disabled={busy} type="button" className="mt-5 w-full rounded-lg bg-white p-3 text-sm font-semibold text-black" onClick={() => void run(() => signInWithPopup(firebaseClient().auth, new GoogleAuthProvider()))}>{copy('Google ile devam et', 'Continue with Google')}</button>
        <div className="my-4 text-center text-xs text-slate-500">{copy('veya e-posta ile', 'or use email')}</div>
        <form onSubmit={submit} className="space-y-3"><label className="block text-sm">{copy('E-posta', 'Email')}<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border border-white/15 bg-black/25 p-3" /></label><label className="block text-sm">{copy('Şifre', 'Password')}<input required type="password" minLength={6} autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded border border-white/15 bg-black/25 p-3" /></label><button disabled={busy} className="w-full rounded-lg bg-emerald-300 p-3 font-semibold text-black">{busy ? copy('Bekle…', 'Please wait…') : register ? copy('Hesap oluştur', 'Create account') : copy('Giriş yap', 'Sign in')}</button></form>
        <div className="mt-4 flex flex-wrap justify-between gap-3 text-xs text-emerald-300"><button disabled={busy} onClick={() => { setRegister(!register); setMessage('') }}>{register ? copy('Zaten hesabım var', 'I have an account') : copy('Hesap oluştur', 'Create account')}</button><button disabled={busy} onClick={() => { if (!email) { setMessage(copy('Önce e-posta adresini yaz.', 'Enter your email first.')); return } void run(() => sendPasswordResetEmail(firebaseClient().auth, email), copy('Adres kayıtlıysa şifre yenileme e-postası gönderildi.', 'If registered, a reset email has been sent.')) }}>{copy('Şifremi unuttum', 'Forgot password')}</button></div>
      </>}{message ? <p role="status" className="mt-4 text-sm leading-6 text-amber-200">{message}</p> : null}
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
