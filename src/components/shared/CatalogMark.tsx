/** Original class marks. These are not screenshots or official artwork. */
export function CatalogMark({ kind, label }: { kind: string; label: string }) {
  const shape = mark(kind)
  return (
    <svg viewBox="0 0 48 32" role="img" aria-label={label} className="h-8 w-12 shrink-0 text-[#10B981]">
      <rect width="48" height="32" rx="4" className="fill-white/5" />
      {shape}
    </svg>
  )
}

function mark(kind: string) {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinejoin: 'round' as const }
  if (/plane|heli|jet/i.test(kind)) {
    return <path d="M6 20 L24 8 L42 20 L24 16 Z M24 16 V24" {...stroke} />
  }
  if (/boat|yacht/i.test(kind)) {
    return <path d="M8 18 H40 L34 24 H14 Z M24 18 V10 H32" {...stroke} />
  }
  if (/cycle|bike|motorcycle/i.test(kind)) {
    return (
      <>
        <circle cx="14" cy="22" r="5" {...stroke} />
        <circle cx="34" cy="22" r="5" {...stroke} />
        <path d="M14 22 L22 12 H30 L34 22 M22 12 L18 22" {...stroke} />
      </>
    )
  }
  if (/weapon|gun|rifle|pistol|melee|shotgun|sniper|heavy|throw/i.test(kind)) {
    return <path d="M8 14 H28 L32 18 H40 M18 14 V22 H10" {...stroke} />
  }
  if (/property|apartment|office|garage|business|house/i.test(kind)) {
    return (
      <>
        <path d="M10 26 V14 L24 8 L38 14 V26 Z" {...stroke} />
        <path d="M20 26 V18 H28 V26" {...stroke} />
      </>
    )
  }
  return (
    <>
      <path d="M6 20 H42 L36 14 H12 Z" {...stroke} />
      <circle cx="16" cy="23" r="3" {...stroke} />
      <circle cx="32" cy="23" r="3" {...stroke} />
    </>
  )
}
