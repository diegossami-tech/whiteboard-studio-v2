import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

type PremiumPanelProps = ComponentPropsWithoutRef<'section'> & {
  className?: string
}

export const PremiumPanel = forwardRef<HTMLElement, PremiumPanelProps>(
  ({ children, className, ...props }, ref) => (
    <section ref={ref} className={cn('studio-panel rounded-[28px]', className)} {...props}>
      {children}
    </section>
  ),
)

PremiumPanel.displayName = 'PremiumPanel'
