import type { ReactNode } from 'react'
import { CloseIcon } from '../icons/StudioIcons'
import { cn } from '../../lib/cn'

type BottomSheetProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export function BottomSheet({ open, title, onClose, children, className }: BottomSheetProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed bottom-0 left-4 right-8 z-40 pb-24 transition duration-300',
        open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto w-full max-w-xl rounded-t-[30px] rounded-b-[22px] border border-[#eae3d7] bg-[#fffdf7]/95 p-5 shadow-[0_-18px_42px_rgba(15,27,46,0.12)] backdrop-blur-xl',
          className,
        )}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#e2e8f0]" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--ws-gold)]">
              Whiteboard Studio
            </p>
            <h3 className="text-xl font-extrabold text-[var(--ws-navy)]">{title}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ws-icon-button flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--ws-navy)]"
            aria-label={`Fechar ${title}`}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
