'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/i18n/provider'

export function HudSelect({
  value,
  onChange,
  options,
  label,
  compact = false,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  label: string
  compact?: boolean
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()
  const current = options.find((option) => option.value === value) ?? options[0]
  const visible = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    return () => window.removeEventListener('pointerdown', onPointer)
  }, [open])

  function choose(next: string) {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  function onKey(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        setActive(Math.max(0, visible.findIndex((option) => option.value === value)))
        return
      }
      setActive((index) => {
        const step = event.key === 'ArrowDown' ? 1 : -1
        return (index + step + visible.length) % Math.max(visible.length, 1)
      })
    } else if (event.key === 'Home' && open) {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End' && open) {
      event.preventDefault()
      setActive(Math.max(0, visible.length - 1))
    } else if (event.key === 'Enter' && open) {
      event.preventDefault()
      const option = visible[active]
      if (option) choose(option.value)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={root} className={`relative ${compact ? 'min-w-0' : 'min-w-56'}`} onKeyDown={onKey}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && visible[active] ? `${listId}-${visible[active].value}` : undefined}
        aria-label={label}
        className={`flex w-full items-center justify-between gap-3 border border-white/15 bg-[#0A0B0E] text-left text-[#f3efe6] hover:border-[#10B981] ${compact ? 'h-8 px-2 text-xs' : 'h-10 px-3 text-sm'}`}
        onClick={() => {
          setOpen((currentOpen) => !currentOpen)
          setQuery('')
          setActive(Math.max(0, options.findIndex((option) => option.value === value)))
        }}
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown className={`size-4 shrink-0 text-[#10B981] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div className="absolute z-50 mt-1 w-full min-w-40 rounded-lg border border-white/15 bg-[#12141A] p-1 shadow-2xl">
          {options.length > 20 ? (
            <input
              autoFocus
              aria-label={label}
              placeholder={t.search}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              className="mb-1 h-10 w-full rounded border border-white/15 bg-black/20 px-2 text-sm"
            />
          ) : null}
          <ul id={listId} role="listbox" aria-label={label} className="max-h-60 overflow-y-auto">
            {visible.map((option, index) => {
              const selected = option.value === value
              return (
                <li key={option.value} role="presentation">
                  <button
                    id={`${listId}-${option.value}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`block w-full px-3 text-left ${compact ? 'py-1.5 text-xs' : 'py-2 text-sm'} ${index === active ? 'outline outline-1 outline-[#10B981]' : ''} ${selected ? 'bg-[#10B981] text-[#04140e]' : 'text-[#f3efe6] hover:bg-white/5'}`}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => choose(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })}
          </ul>
          {visible.length === 0 ? <p className="p-3 text-sm text-slate-400">{t.noMatches}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
