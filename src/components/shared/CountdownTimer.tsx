'use client'

import { useClock } from '@/lib/clock'
import { formatRemaining } from '@/lib/resets'

export function CountdownTimer({ target, label }: { target: Date; label: string }) {
  const now = useClock()
  return (
    <div className="border border-white/10 bg-[#12141A] px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">{label}</div>
      <div suppressHydrationWarning className="mt-1 font-mono text-2xl text-[#f3efe6]">
        {formatRemaining(target, now)}
      </div>
    </div>
  )
}
