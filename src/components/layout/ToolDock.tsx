import {
  ArrowIcon,
  CircleIcon,
  HandIcon,
  ImageIcon,
  LineIcon,
  MotifIcon,
  NoteIcon,
  PenIcon,
  SelectIcon,
  SquareIcon,
  TextIcon,
} from '../icons/StudioIcons'
import { toolbarTools } from '../../data/studio'
import { PremiumPanel } from '../ui/PremiumPanel'

type ToolDockProps = {
  activeToolId: string
  onToolChange: (toolId: string) => void
  mobile?: boolean
}

const desktopTools = [
  { id: 'select', label: 'Selecionar', icon: SelectIcon },
  { id: 'hand', label: 'Mão', icon: HandIcon },
  { id: 'shape', label: 'Forma', icon: SquareIcon },
  { id: 'circle', label: 'Círculo', icon: CircleIcon },
  { id: 'line', label: 'Linha', icon: LineIcon },
  { id: 'arrow', label: 'Seta', icon: ArrowIcon },
  { id: 'text', label: 'Texto', icon: TextIcon },
  { id: 'draw', label: 'Desenho', icon: PenIcon },
  { id: 'note', label: 'Notas', icon: NoteIcon },
  { id: 'image', label: 'Imagens', icon: ImageIcon },
]

export function ToolDock({ activeToolId, onToolChange, mobile = false }: ToolDockProps) {
  if (mobile) {
    return (
      <PremiumPanel className="rounded-[24px] border-[#eae3d7] bg-white/55 p-0 shadow-none">
        <div className="mb-4 grid grid-cols-2 border-b border-[#eae3d7] text-sm font-extrabold">
          <button type="button" className="border-b-2 border-[#c78e2b] pb-3 text-[#c78e2b]">
            Básico
          </button>
          <button type="button" className="pb-3 text-[#0f1b2e]">
            Avançado
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {toolbarTools.map((tool) => {
            const Icon = tool.icon
            const active = tool.id === activeToolId

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onToolChange(tool.id)}
                className={`group flex min-h-[4.45rem] flex-col items-center justify-center rounded-[12px] border bg-white text-center shadow-[0_8px_18px_rgba(15,27,46,0.04)] ${
                  active
                    ? 'border-[#c78e2b] bg-[#fff7e8] text-[#0f1b2e]'
                    : 'border-[#e2e8f0] text-[#0f1b2e]'
                }`}
              >
                <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-[11px] bg-[#fffdf7]">
                  <Icon size={23} className={active ? 'text-[#c78e2b]' : 'text-[#0f1b2e]'} />
                </div>
                <p className="text-[0.68rem] font-extrabold leading-tight">
                  {tool.label}
                </p>
              </button>
            )
          })}
        </div>
      </PremiumPanel>
    )
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex h-20 max-w-full items-center gap-5 rounded-[28px] border border-[#e2e8f0] bg-white/92 px-4 shadow-[0_18px_38px_rgba(15,27,46,0.12)] backdrop-blur-xl">
        <div className="scrollbar-hidden flex items-center gap-2 overflow-x-auto">
          {desktopTools.map((tool, index) => {
            const Icon = tool.icon
            const active = tool.id === activeToolId

            return (
              <div key={tool.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToolChange(tool.id)}
                  className={`group flex h-14 min-w-[60px] flex-col items-center justify-center rounded-[12px] px-2 ${
                    active
                      ? 'ws-btn-secondary text-[#0f1b2e]'
                      : 'ws-btn-ghost text-[#0f1b2e]'
                  }`}
                  aria-label={tool.label}
                  title={tool.label}
                >
                  <Icon size={22} strokeWidth={1.8} className={active ? 'text-[#c78e2b]' : 'text-[#0f1b2e]'} />
                  <span className={`mt-1 text-[0.62rem] font-extrabold leading-none ${active ? 'text-[#0f1b2e]' : 'text-[#0f1b2e]'}`}>
                    {tool.label}
                  </span>
                </button>

                {index < desktopTools.length - 1 && <span className="h-8 w-px bg-[#e2e8f0]" />}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onToolChange('motif')}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] border border-[#183150] bg-[#0f1b2e] text-[#d4af37] shadow-[0_12px_24px_rgba(15,27,46,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-[#d4af37] hover:bg-[#142847] hover:shadow-[0_16px_30px_rgba(15,27,46,0.28),0_0_0_4px_rgba(212,175,55,0.12)] active:scale-95 ${
            activeToolId === 'motif'
              ? 'ring-2 ring-[#d4af37]/30'
              : ''
          }`}
          aria-label="Motif"
          title="Motif"
        >
          <MotifIcon size={36} strokeWidth={1.85} className="text-[#d4af37]" />
        </button>
      </div>
    </div>
  )
}
