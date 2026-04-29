import { cn } from '../../lib/cn'

type OrnamentCornerProps = {
  className?: string
  mirrored?: boolean
}

export function OrnamentCorner({ className, mirrored = false }: OrnamentCornerProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={cn('text-[#d6a04c]', mirrored && 'scale-x-[-1] scale-y-[-1]', className)}
      style={{ opacity: 0.35 }}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.1">
        {[42, 74, 106, 138].map((radius) => (
          <circle key={radius} cx="0" cy="0" r={radius} />
        ))}
        <path d="M0 138C34 138 62 110 62 76M0 106C18 106 34 90 34 72" />
        <path d="M138 0C138 34 110 62 76 62M106 0C106 18 90 34 72 34" />
      </g>
    </svg>
  )
}
