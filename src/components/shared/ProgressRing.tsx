'use client'

export function ProgressRing({
  value,
  label,
  color = '#10B981',
  readout,
  caption,
}: {
  value: number
  label: string
  color?: string
  readout?: string
  caption?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = 28
  const dash = 2 * Math.PI * radius
  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label={label}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * dash} ${dash}`}
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="40" textAnchor="middle" fill="#f3efe6" fontSize={readout && readout.length > 2 ? 12 : 14} fontFamily="Rajdhani, sans-serif">
          {readout ?? Math.round(clamped)}
        </text>
      </svg>
      <div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-[#a39c90]">{label}</div>
        <div className="font-display text-2xl leading-none">{caption ?? `${Math.round(clamped)}%`}</div>
      </div>
    </div>
  )
}
