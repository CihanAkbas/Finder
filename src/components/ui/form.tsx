import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-[#f3efe6] outline-none placeholder:text-[#7d776e] focus:border-[var(--game-accent)]',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full resize-y border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f3efe6] outline-none placeholder:text-[#7d776e] focus:border-[var(--game-accent)]',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a39c90]', className)} {...props} />
}

export function Badge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('inline-flex items-center border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]', className)}
      {...props}
    />
  )
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const width = Math.max(0, Math.min(100, value))
  return (
    <div
      className="h-1.5 overflow-hidden bg-white/10"
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn('h-full transition-[width] duration-300', width >= 100 ? 'bg-emerald-400' : 'bg-[var(--game-accent)]')} style={{ width: `${width}%` }} />
    </div>
  )
}
