import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type PremiumPanelProps = {
  children: ReactNode
  className?: string
}

export function PremiumPanel({ children, className }: PremiumPanelProps) {
  return <section className={cn('studio-panel rounded-[28px]', className)}>{children}</section>
}
