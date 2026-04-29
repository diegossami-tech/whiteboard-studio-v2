import { cn } from '../../lib/cn'

type IslamicGeometryMarkProps = {
  className?: string
}

export function IslamicGeometryMark({ className }: IslamicGeometryMarkProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={cn('text-[var(--ws-gold)]', className)}
      fill="none"
      aria-hidden="true"
    >
      <g opacity="0.18" stroke="currentColor" strokeWidth="1.25">
        <line x1="120" y1="16" x2="120" y2="224" />
        <line x1="16" y1="120" x2="224" y2="120" />
        <rect x="56" y="56" width="128" height="128" />
      </g>

      <g stroke="currentColor" strokeWidth="2.4">
        {[0, 45, 90, 135].map((angle) => (
          <ellipse
            key={angle}
            cx="120"
            cy="84"
            rx="28"
            ry="56"
            transform={`rotate(${angle} 120 120)`}
          />
        ))}

        <rect x="84" y="84" width="72" height="72" transform="rotate(45 120 120)" />
        <circle cx="120" cy="120" r="10" />
      </g>
    </svg>
  )
}
