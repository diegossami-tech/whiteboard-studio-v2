import { useState } from 'react'
import { Grid3x3, Hand, Lock, Maximize2, Minus, MoveHorizontal, Plus, SlidersHorizontal } from 'lucide-react'
import { IslamicGeometryMark } from '../graphics/IslamicGeometryMark'
import { OrnamentCorner } from '../graphics/OrnamentCorner'
import { PremiumPanel } from '../ui/PremiumPanel'

type CanvasStageProps = {
  mobile?: boolean
  activeToolId?: string
}

export function CanvasStage({ mobile = false, activeToolId = 'select' }: CanvasStageProps) {
  const [zoom, setZoom] = useState(100)
  const [gridVisible, setGridVisible] = useState(true)
  const [minimapVisible, setMinimapVisible] = useState(true)
  const [locked, setLocked] = useState(false)
  const [activeControl, setActiveControl] = useState('pan')

  if (mobile) {
    return <MobileCanvasStage />
  }

  const symbolScale = Math.max(0.82, Math.min(1.22, zoom / 100))

  return (
    <PremiumPanel className="relative h-full overflow-hidden rounded-[16px] border-[#d7dee8] bg-[#f7f1e7] p-3 shadow-[0_20px_48px_rgba(15,27,46,0.08)]">
      <div className={`${gridVisible ? 'canvas-reference-grid' : 'bg-[#fffdf7]'} absolute inset-3 overflow-hidden rounded-[14px] border border-[#cfd7e3] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.68),0_16px_34px_rgba(15,27,46,0.08)]`}>
        <CanvasOrnamentCluster className="absolute left-0 top-0 h-[178px] w-[214px] text-[#d4af37] opacity-[0.42]" />
        <CanvasOrnamentCluster className="absolute bottom-0 right-0 h-[260px] w-[350px] rotate-180 text-[#d4af37] opacity-[0.46]" />

        <div className="absolute right-4 top-4 z-20 flex h-11 items-center rounded-[10px] border border-[#d7dee8] bg-white/94 px-2 shadow-[0_12px_26px_rgba(15,27,46,0.13)]">
          <CanvasToolButton icon={Hand} label="Mover canvas" active={activeControl === 'pan'} onClick={() => setActiveControl('pan')} />
          <ToolbarDivider />
          <CanvasToolButton icon={SlidersHorizontal} label="Ajustes de visualizacao" active={activeControl === 'settings'} onClick={() => setActiveControl('settings')} />
          <ToolbarDivider />
          <CanvasToolButton icon={MoveHorizontal} label="Alinhar elementos" active={activeControl === 'align'} onClick={() => setActiveControl('align')} />
          <ToolbarDivider />
          <CanvasToolButton icon={Grid3x3} label="Alternar grid" active={gridVisible} onClick={() => setGridVisible((visible) => !visible)} />
        </div>

        <div className="absolute left-1/2 top-[43%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-8 border border-dashed border-[#c9d2df]" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#c9d2df]" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#c9d2df]" />
          <div className="absolute inset-8">
            <div className="absolute left-0 top-0 h-px w-full origin-left rotate-45 bg-[#d8dee8]" />
            <div className="absolute right-0 top-0 h-px w-full origin-right -rotate-45 bg-[#d8dee8]" />
          </div>
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `scale(${symbolScale})` }}
          >
            <CanvasFlowerMark className="h-full w-full text-[#c78e2b]" />
          </div>
        </div>

        <CanvasArrows />
        <CanvasNote className="left-[12%] top-[58%]" title="Estrutura" body="Traz clareza ao que e complexo." />
        <CanvasNote className="right-[13%] top-[17%]" title="Ideias" body="Nascem da conexao de pensamentos." align="right" />
        <CanvasNote className="bottom-[14%] left-1/2 -translate-x-1/2" title="Proposito" body="Transforme ideias em realidade." centered />

        {minimapVisible && (
          <button
            type="button"
            onClick={() => setMinimapVisible(false)}
          className="ws-icon-button absolute bottom-6 right-6 z-20 rounded-[12px] p-3"
            aria-label="Fechar minimapa"
            title="Fechar minimapa"
          >
            <div className="relative h-[82px] w-[118px] overflow-hidden rounded-[8px] bg-[#f8f4ed]">
              <div className="absolute left-4 top-6 h-11 w-16 bg-[#eee6da]" />
              <div className="absolute right-3 top-3 h-10 w-20 bg-[#f3ede5]" />
              <div className="absolute left-9 top-5 h-13 w-16 border border-[#c78e2b] bg-white/36" />
              <Maximize2 size={16} className="absolute bottom-2 right-2 text-[#0f1b2e]" />
            </div>
          </button>
        )}

        <div className="absolute bottom-6 left-6 z-20 flex h-11 items-center rounded-[10px] border border-[#d7dee8] bg-white/94 px-2 shadow-[0_12px_26px_rgba(15,27,46,0.1)]">
          <ZoomButton icon={Minus} label="Diminuir zoom" onClick={() => setZoom((currentZoom) => Math.max(50, currentZoom - 10))} />
          <div className="w-16 text-center text-sm font-extrabold text-[#0f1b2e]">{zoom}%</div>
          <ZoomButton icon={Plus} label="Aumentar zoom" onClick={() => setZoom((currentZoom) => Math.min(200, currentZoom + 10))} />
          <ToolbarDivider />
          <ZoomButton
            icon={Maximize2}
            label="Ajustar a tela"
            onClick={() => {
              setZoom(100)
              setMinimapVisible(true)
            }}
          />
          <ToolbarDivider />
          <ZoomButton icon={Lock} label="Bloquear zoom" active={locked} onClick={() => setLocked((isLocked) => !isLocked)} />
        </div>

        <div className="absolute left-5 top-5 z-20 rounded-full border border-white/80 bg-white/72 px-3 py-1.5 text-[0.68rem] font-bold text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.06)]">
          Modo {activeToolId}
        </div>
      </div>
    </PremiumPanel>
  )
}

function MobileCanvasStage() {
  return (
    <PremiumPanel className="canvas-reference-grid relative h-dvh overflow-hidden rounded-none border-0 bg-[#fffdf7] shadow-none">
      <OrnamentCorner className="absolute left-0 top-[4.6rem] h-32 w-32 opacity-55" />
      <OrnamentCorner mirrored className="absolute bottom-[5.6rem] right-0 h-36 w-36 opacity-45" />

      <button
        type="button"
        className="ws-icon-button absolute right-8 top-[5.4rem] z-20 flex h-14 w-14 items-center justify-center rounded-[16px]"
        aria-label="Abrir motivos"
        title="Abrir motivos"
      >
        <IslamicGeometryMark className="h-7 w-7 text-[#c78e2b]" />
      </button>

      <div className="absolute left-1/2 top-[45%] h-[min(76vw,22rem)] w-[min(76vw,22rem)] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-[13%] border border-dashed border-[#cbd5e1]" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#cbd5e1]" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#cbd5e1]" />
        <div className="absolute inset-[13%]">
          <div className="absolute left-0 top-0 h-px w-full origin-left rotate-45 bg-[#d8dee8]" />
          <div className="absolute right-0 top-0 h-px w-full origin-right -rotate-45 bg-[#d8dee8]" />
        </div>
        <CanvasFlowerMark className="relative h-full w-full text-[#c78e2b]" />
      </div>
    </PremiumPanel>
  )
}

type CanvasFlowerMarkProps = {
  className?: string
}

function CanvasFlowerMark({ className }: CanvasFlowerMarkProps) {
  return (
    <svg viewBox="0 0 240 240" className={className} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65">
        <g opacity="0.96">
          <rect x="66" y="66" width="54" height="54" />
          <rect x="120" y="66" width="54" height="54" />
          <rect x="66" y="120" width="54" height="54" />
          <rect x="120" y="120" width="54" height="54" />
        </g>

        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
            <path
              key={rotation}
              d="M120 120C91 94 93 58 120 34C147 58 149 94 120 120Z"
              transform={`rotate(${rotation} 120 120)`}
            />
          ))}
        </g>

        <path
          d="M120 101.5L127.6 112.4L140.5 120L127.6 127.6L120 138.5L112.4 127.6L99.5 120L112.4 112.4L120 101.5Z"
          fill="#fffdf7"
          strokeWidth="1.65"
        />
      </g>
    </svg>
  )
}

type CanvasOrnamentClusterProps = {
  className?: string
}

function CanvasOrnamentCluster({ className }: CanvasOrnamentClusterProps) {
  return (
    <svg viewBox="0 0 350 260" className={className} fill="none" aria-hidden="true">
      <defs>
        <clipPath id="canvas-ornament-corner">
          <path d="M0 0H350V46C304 46 275 62 246 88C215 115 181 142 132 151C87 159 53 179 24 222L0 260V0Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#canvas-ornament-corner)" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round">
        {[-44, 12, 68, 124, 180, 236, 292, 348].map((x) =>
          [-48, 8, 64, 120, 176, 232].map((y) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="31" />
              <circle cx={x + 28} cy={y + 28} r="31" />
              <path d={`M${x - 31} ${y}C${x - 10} ${y - 18} ${x + 10} ${y - 18} ${x + 31} ${y}`} />
              <path d={`M${x - 31} ${y}C${x - 10} ${y + 18} ${x + 10} ${y + 18} ${x + 31} ${y}`} />
              <path d={`M${x} ${y - 31}C${x - 18} ${y - 10} ${x - 18} ${y + 10} ${x} ${y + 31}`} />
              <path d={`M${x} ${y - 31}C${x + 18} ${y - 10} ${x + 18} ${y + 10} ${x} ${y + 31}`} />
            </g>
          )),
        )}

        <path d="M0 204C39 163 76 143 124 137C174 131 207 106 239 78C272 49 305 34 350 34" opacity="0.68" />
        <path d="M0 232C43 184 82 159 134 151C184 143 221 117 254 88C286 60 313 47 350 47" opacity="0.5" />
      </g>
    </svg>
  )
}

function CanvasArrows() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full text-[#0f1b2e]" fill="none" aria-hidden="true">
      <path d="M26% 64%C32% 66.5 36.5% 61.5 39% 56.5" stroke="currentColor" strokeWidth="1.45" opacity="0.86" />
      <path d="M38.5% 57L39% 56.5L39.8% 62" stroke="currentColor" strokeWidth="1.45" opacity="0.86" />

      <path d="M69% 23%C66% 26 65% 31 65% 35.5" stroke="currentColor" strokeWidth="1.45" opacity="0.86" />
      <path d="M65% 35.5L62.6% 30.9" stroke="currentColor" strokeWidth="1.45" opacity="0.86" />

      <path d="M49% 75%C46% 69 46.4% 63 49.2% 59" stroke="currentColor" strokeWidth="1.45" opacity="0.86" />
      <path d="M49.2% 59L44.3% 61.6" stroke="currentColor" strokeWidth="1.45" opacity="0.86" />
    </svg>
  )
}

type CanvasNoteProps = {
  title: string
  body: string
  className: string
  align?: 'left' | 'right'
  centered?: boolean
}

function CanvasNote({ title, body, className, align = 'left', centered = false }: CanvasNoteProps) {
  return (
    <div className={`absolute z-10 max-w-[15rem] ${className}`}>
      <p className={`text-[1.65rem] italic leading-none text-[#c78e2b] ${centered ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Segoe Print', 'Bradley Hand ITC', cursive" }}>
        {title}
      </p>
      <p className={`mt-2 text-[0.83rem] font-semibold leading-6 text-[#0f1b2e] ${centered ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Segoe Print', 'Bradley Hand ITC', cursive" }}>
        {body}
      </p>
    </div>
  )
}

type ButtonIconProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  active?: boolean
  onClick: () => void
}

function CanvasToolButton({ icon: Icon, label, active = false, onClick }: ButtonIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className="ws-icon-button flex h-9 w-9 items-center justify-center rounded-[8px]"
      aria-label={label}
      title={label}
    >
      <Icon size={18} />
    </button>
  )
}

function ZoomButton({ icon: Icon, label, active = false, onClick }: ButtonIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${
        active ? 'studio-button-active' : 'ws-icon-button'
      }`}
      aria-label={label}
      title={label}
    >
      <Icon size={16} />
    </button>
  )
}

function ToolbarDivider() {
  return <span className="mx-1 h-7 w-px bg-[#e2e8f0]" />
}
