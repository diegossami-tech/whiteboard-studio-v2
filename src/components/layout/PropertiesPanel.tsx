import { useState } from 'react'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ChevronsRightIcon,
  CopyIcon,
  GridIcon,
  LockIcon,
  MinusIcon,
  MoveDownIcon,
  MoveUpIcon,
  PlusIcon,
  TrashIcon,
} from '../icons/StudioIcons'
import { PremiumPanel } from '../ui/PremiumPanel'

type PropertiesPanelProps = {
  mobile?: boolean
}

const colors = [
  { id: 'navy', value: '#0F1B2E' },
  { id: 'gold', value: '#C78E2B' },
  { id: 'green', value: '#0F6A54' },
  { id: 'brown', value: '#6B5A4A' },
]

export function PropertiesPanel({ mobile = false }: PropertiesPanelProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0].id)
  const [strokeStyle, setStrokeStyle] = useState('solid')
  const [thickness, setThickness] = useState(2)
  const [opacity, setOpacity] = useState(100)
  const [layerAction, setLayerAction] = useState('forward')
  const [alignment, setAlignment] = useState('left')
  const [locked, setLocked] = useState(false)
  const [grouped, setGrouped] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <PremiumPanel
      className={`${
        mobile
          ? 'p-0 shadow-none'
          : 'flex h-full flex-col overflow-hidden rounded-[12px] border-[#e2e8f0] bg-[#fffdf7] p-0 shadow-[0_20px_44px_rgba(15,27,46,0.08)]'
      }`}
    >
      <div className={mobile ? '' : 'scrollbar-hidden flex h-full flex-col overflow-y-auto px-6 py-6'}>
        {!mobile && (
          <header className="mb-6 flex items-center justify-between">
            <h2 className="text-[1.2rem] font-extrabold leading-none text-[#0f1b2e]">Propriedades</h2>
            <button
              type="button"
              onClick={() => setCollapsed((isCollapsed) => !isCollapsed)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#0f1b2e] transition hover:bg-white hover:text-[#c78e2b]"
              aria-label={collapsed ? 'Expandir painel' : 'Recolher painel'}
              title={collapsed ? 'Expandir painel' : 'Recolher painel'}
            >
              <ChevronsRightIcon size={18} className={collapsed ? 'rotate-180 transition' : 'transition'} />
            </button>
          </header>
        )}

        {collapsed && (
          <div className="mb-5 rounded-[8px] border border-[#f1e6d1] bg-[#fff7e8] px-3 py-2 text-xs font-bold text-[#c78e2b]">
            Painel recolhido
          </div>
        )}

        <PanelSection title="Aparencia">
          <div className="flex items-center gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColor(color.id)}
                className={`h-7 w-7 rounded-full border border-white shadow-[0_8px_18px_rgba(15,27,46,0.12)] transition ${
                  selectedColor === color.id ? 'ring-2 ring-[#e2e8f0] ring-offset-2 ring-offset-[#fffdf7]' : ''
                }`}
                style={{ backgroundColor: color.value }}
                aria-label={`Selecionar cor ${color.id}`}
              />
            ))}
            <button
              type="button"
              onClick={() => setSelectedColor('custom')}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                selectedColor === 'custom'
                  ? 'ws-btn-secondary'
                  : 'ws-icon-button'
              }`}
              aria-label="Adicionar cor"
            >
              <PlusIcon size={15} />
            </button>
          </div>
        </PanelSection>

        <PanelSection title="Traco">
          <div className="grid grid-cols-3 gap-3">
            <StrokeButton id="solid" active={strokeStyle === 'solid'} onClick={setStrokeStyle} />
            <StrokeButton id="dash" active={strokeStyle === 'dash'} onClick={setStrokeStyle} />
            <StrokeButton id="dot" active={strokeStyle === 'dot'} onClick={setStrokeStyle} />
          </div>
        </PanelSection>

        <PanelSection title="Espessura">
          <div className="flex h-9 items-center overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white">
            <SegmentButton icon={MinusIcon} label="Reduzir espessura" onClick={() => setThickness((value) => Math.max(1, value - 1))} />
            <div className="h-5 w-px bg-[#e2e8f0]" />
            <div className="flex-1 text-center text-sm font-extrabold text-[#0f1b2e]">{thickness} px</div>
            <div className="h-5 w-px bg-[#e2e8f0]" />
            <SegmentButton icon={PlusIcon} label="Aumentar espessura" onClick={() => setThickness((value) => Math.min(12, value + 1))} />
          </div>
        </PanelSection>

        <PanelSection title="Opacidade">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#0f1b2e]">Opacidade</span>
              <span className="text-sm font-bold text-[#0f1b2e]">{opacity}%</span>
            </div>
            <div className="relative h-5">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#e2e8f0]" />
              <div
                className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#c78e2b]"
                style={{ width: `${opacity}%` }}
              />
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(event) => setOpacity(Number(event.target.value))}
                className="absolute inset-0 h-5 w-full cursor-pointer opacity-0"
                aria-label="Opacidade"
              />
              <span
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c78e2b] shadow-[0_3px_8px_rgba(199,142,43,0.32)]"
                style={{ left: `${opacity}%` }}
              />
            </div>
          </div>
        </PanelSection>

        <PanelSection title="Camadas">
          <div className="grid grid-cols-4 gap-3">
            <IconSquare icon={MoveUpIcon} label="Trazer para frente" active={layerAction === 'forward'} onClick={() => setLayerAction('forward')} />
            <IconSquare icon={MoveDownIcon} label="Enviar para tras" active={layerAction === 'backward'} onClick={() => setLayerAction('backward')} />
            <IconSquare icon={CopyIcon} label="Duplicar" active={layerAction === 'duplicate'} onClick={() => setLayerAction('duplicate')} />
            <IconSquare icon={TrashIcon} label="Excluir" active={layerAction === 'delete'} onClick={() => setLayerAction('delete')} />
          </div>
        </PanelSection>

        <PanelSection title="Alinhamento">
          <div className="flex h-9 overflow-hidden rounded-[8px] border border-[#e2e8f0] bg-white">
            <AlignButton icon={AlignLeftIcon} label="Alinhar a esquerda" active={alignment === 'left'} onClick={() => setAlignment('left')} />
            <AlignButton icon={AlignCenterIcon} label="Alinhar ao centro" active={alignment === 'center'} onClick={() => setAlignment('center')} />
            <AlignButton icon={GridIcon} label="Distribuir" active={alignment === 'distribute'} onClick={() => setAlignment('distribute')} />
            <AlignButton icon={AlignRightIcon} label="Alinhar a direita" active={alignment === 'right'} onClick={() => setAlignment('right')} />
          </div>
        </PanelSection>

        <PanelSection title="Acoes" isLast>
          <div className="grid grid-cols-2 gap-3">
            <ActionButton icon={LockIcon} label={locked ? 'Bloqueado' : 'Bloquear'} active={locked} onClick={() => setLocked((isLocked) => !isLocked)} />
            <ActionButton icon={GridIcon} label={grouped ? 'Agrupado' : 'Agrupar'} active={grouped} onClick={() => setGrouped((isGrouped) => !isGrouped)} />
          </div>
        </PanelSection>
      </div>
    </PremiumPanel>
  )
}

type PanelSectionProps = {
  title: string
  children: React.ReactNode
  isLast?: boolean
}

function PanelSection({ title, children, isLast = false }: PanelSectionProps) {
  return (
    <section className={`${isLast ? 'pb-1' : 'border-b border-[#e2e8f0] pb-4'} mb-4`}>
      <h3 className="mb-3 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#0f1b2e]">
        {title}
      </h3>
      {children}
    </section>
  )
}

type StrokeButtonProps = {
  id: string
  active: boolean
  onClick: (id: string) => void
}

function StrokeButton({ id, active, onClick }: StrokeButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`flex h-9 items-center justify-center rounded-[8px] ${
        active ? 'ws-btn-secondary' : 'ws-icon-button'
      }`}
      aria-label={`Traco ${id}`}
    >
      <span
        className={`h-px w-9 border-t-2 border-[#0f1b2e] ${
          id === 'dash' ? 'border-dashed' : id === 'dot' ? 'border-dotted' : 'border-solid'
        }`}
      />
    </button>
  )
}

type IconButtonProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  active?: boolean
  onClick: () => void
}

function SegmentButton({ icon: Icon, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ws-btn-ghost flex h-full w-10 items-center justify-center"
      aria-label={label}
      title={label}
    >
      <Icon size={15} />
    </button>
  )
}

function IconSquare({ icon: Icon, label, active = false, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-full items-center justify-center rounded-[8px] ${
        active
          ? 'ws-btn-secondary'
          : 'ws-icon-button'
      }`}
      aria-label={label}
      title={label}
    >
      <Icon size={17} />
    </button>
  )
}

function AlignButton({ icon: Icon, label, active = false, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center border-r border-[#e2e8f0] last:border-r-0 ${
        active ? 'ws-control-active' : 'ws-btn-ghost'
      }`}
      aria-label={label}
      title={label}
    >
      <Icon size={16} />
    </button>
  )
}

function ActionButton({ icon: Icon, label, active = false, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center justify-center gap-2 rounded-[8px] px-3 text-sm font-bold ${
        active
          ? 'ws-btn-primary'
          : 'ws-btn-secondary'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  )
}
