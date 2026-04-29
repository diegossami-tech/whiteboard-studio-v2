import { useEffect, useRef, useState, type ClipboardEvent, type PointerEvent, type WheelEvent } from 'react'
import { Grid3x3, Hand, Lock, Maximize2, Minus, MoveHorizontal, Plus, SlidersHorizontal } from 'lucide-react'
import { PremiumPanel } from '../ui/PremiumPanel'

type CanvasStageProps = {
  mobile?: boolean
  activeToolId?: string
}

type Point = {
  x: number
  y: number
}

type CanvasElement =
  | {
      id: string
      type: 'shape' | 'circle' | 'text' | 'note' | 'image' | 'motif'
      x: number
      y: number
      width: number
      height: number
      content?: string
      src?: string
    }
  | {
      id: string
      type: 'line' | 'arrow'
      x: number
      y: number
      width: number
      height: number
    }
  | {
      id: string
      type: 'draw'
      points: Point[]
    }

type Interaction =
  | { type: 'pan'; start: Point; origin: Point }
  | { type: 'move'; id: string; start: Point; origin: Point }
  | { type: 'create'; id: string; start: Point }
  | { type: 'draw'; id: string }
  | null

const WORLD_WIDTH = 6200
const WORLD_HEIGHT = 4200
const WORLD_CENTER = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }

const initialElements: CanvasElement[] = [
  {
    id: 'initial-note',
    type: 'note',
    x: WORLD_CENTER.x - 560,
    y: WORLD_CENTER.y + 330,
    width: 230,
    height: 126,
    content: 'Escolha uma ferramenta e clique ou arraste no canvas.',
  },
]

export function CanvasStage({ mobile = false, activeToolId = 'select' }: CanvasStageProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [elements, setElements] = useState<CanvasElement[]>(initialElements)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [interaction, setInteraction] = useState<Interaction>(null)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [gridVisible, setGridVisible] = useState(true)
  const [minimapVisible, setMinimapVisible] = useState(true)
  const [locked, setLocked] = useState(false)
  const [activeControl, setActiveControl] = useState('pan')
  const [status, setStatus] = useState('Pronto')

  useEffect(() => {
    centerCanvas()
  }, [mobile])

  function centerCanvas(nextZoom = zoom) {
    const bounds = viewportRef.current?.getBoundingClientRect()

    if (!bounds) {
      return
    }

    setPan({
      x: bounds.width / 2 - WORLD_CENTER.x * nextZoom,
      y: bounds.height / 2 - WORLD_CENTER.y * nextZoom,
    })
    setZoom(nextZoom)
    setStatus('Canvas centralizado')
  }

  function screenToWorld(clientX: number, clientY: number): Point {
    const bounds = viewportRef.current?.getBoundingClientRect()

    if (!bounds) {
      return WORLD_CENTER
    }

    return {
      x: (clientX - bounds.left - pan.x) / zoom,
      y: (clientY - bounds.top - pan.y) / zoom,
    }
  }

  function zoomAt(nextZoom: number, anchor?: Point) {
    if (locked) {
      return
    }

    const clampedZoom = Math.min(2.5, Math.max(0.25, nextZoom))
    const bounds = viewportRef.current?.getBoundingClientRect()
    const screenAnchor = anchor ?? (bounds ? { x: bounds.width / 2, y: bounds.height / 2 } : { x: 0, y: 0 })
    const worldAnchor = {
      x: (screenAnchor.x - pan.x) / zoom,
      y: (screenAnchor.y - pan.y) / zoom,
    }

    setZoom(clampedZoom)
    setPan({
      x: screenAnchor.x - worldAnchor.x * clampedZoom,
      y: screenAnchor.y - worldAnchor.y * clampedZoom,
    })
  }

  function addElement(type: string, point: Point, content?: string, src?: string) {
    const id = `${type}-${Date.now()}`
    const element = createCanvasElement(id, type, point, content, src)

    setElements((current) => [...current, element])
    setSelectedId(id)
    setStatus(`${getToolLabel(type)} criado`)
    return element
  }

  function updateElement(id: string, updater: (element: CanvasElement) => CanvasElement) {
    setElements((current) => current.map((element) => (element.id === id ? updater(element) : element)))
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    viewportRef.current?.focus()
    const point = screenToWorld(event.clientX, event.clientY)

    if (activeToolId === 'hand') {
      setInteraction({ type: 'pan', start: { x: event.clientX, y: event.clientY }, origin: pan })
      setStatus('Movendo canvas')
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    if (activeToolId === 'select') {
      setSelectedId(null)
      setStatus('Seleção limpa')
      return
    }

    if (activeToolId === 'draw') {
      const id = `draw-${Date.now()}`
      setElements((current) => [...current, { id, type: 'draw', points: [point] }])
      setSelectedId(id)
      setInteraction({ type: 'draw', id })
      setStatus('Desenhando')
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    const created = addElement(activeToolId, point)
    setInteraction({ type: 'create', id: created.id, start: point })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleElementPointerDown(event: PointerEvent<HTMLButtonElement>, element: CanvasElement) {
    event.stopPropagation()
    viewportRef.current?.focus()
    setSelectedId(element.id)
    setStatus(`${getToolLabel(element.type)} selecionado`)

    if (activeToolId !== 'select') {
      return
    }

    const point = screenToWorld(event.clientX, event.clientY)
    const origin = element.type === 'draw' ? { x: 0, y: 0 } : { x: element.x, y: element.y }
    setInteraction({ type: 'move', id: element.id, start: point, origin })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!interaction) {
      return
    }

    const point = screenToWorld(event.clientX, event.clientY)

    if (interaction.type === 'pan') {
      setPan({
        x: interaction.origin.x + event.clientX - interaction.start.x,
        y: interaction.origin.y + event.clientY - interaction.start.y,
      })
      return
    }

    if (interaction.type === 'draw') {
      updateElement(interaction.id, (element) =>
        element.type === 'draw' ? { ...element, points: [...element.points, point] } : element,
      )
      return
    }

    if (interaction.type === 'create') {
      updateElement(interaction.id, (element) => resizeElementFromDrag(element, interaction.start, point))
      return
    }

    if (interaction.type === 'move') {
      const dx = point.x - interaction.start.x
      const dy = point.y - interaction.start.y

      updateElement(interaction.id, (element) => {
        if (element.type === 'draw') {
          return {
            ...element,
            points: element.points.map((pathPoint) => ({ x: pathPoint.x + dx, y: pathPoint.y + dy })),
          }
        }

        return { ...element, x: interaction.origin.x + dx, y: interaction.origin.y + dy }
      })
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (interaction) {
      setInteraction(null)
      setStatus('Pronto')
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        // Pointer capture may already be released by the browser.
      }
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()

    if (event.ctrlKey || event.metaKey) {
      const bounds = viewportRef.current?.getBoundingClientRect()
      zoomAt(zoom + (event.deltaY > 0 ? -0.08 : 0.08), bounds ? { x: event.clientX - bounds.left, y: event.clientY - bounds.top } : undefined)
      return
    }

    if (activeToolId === 'hand' || event.shiftKey) {
      setPan((current) => ({ x: current.x - event.deltaX, y: current.y - event.deltaY }))
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const imageFile = Array.from(event.clipboardData.files).find((file) => file.type.startsWith('image/'))
    const text = event.clipboardData.getData('text/plain')
    const bounds = viewportRef.current?.getBoundingClientRect()
    const center = bounds
      ? screenToWorld(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
      : WORLD_CENTER

    if (imageFile) {
      event.preventDefault()
      const reader = new FileReader()
      reader.onload = () => addElement('image', center, undefined, String(reader.result))
      reader.readAsDataURL(imageFile)
      return
    }

    if (text.trim()) {
      event.preventDefault()
      addElement('text', center, text.trim().slice(0, 160))
    }
  }

  const viewportClass = mobile
    ? 'canvas-reference-grid relative h-dvh overflow-hidden rounded-none border-0 bg-[#fffdf7] shadow-none outline-none focus:ring-2 focus:ring-[#d4af37]/35'
    : `${gridVisible ? 'canvas-reference-grid' : 'bg-[#fffdf7]'} absolute inset-3 overflow-hidden rounded-[14px] border border-[#cfd7e3] outline-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.68),0_16px_34px_rgba(15,27,46,0.08)] focus:ring-2 focus:ring-[#d4af37]/35`

  const canvas = (
    <div
      ref={viewportRef}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onPaste={handlePaste}
      className={viewportClass}
      role="application"
      aria-label={mobile ? 'Canvas interativo mobile do Whiteboard Studio' : 'Canvas interativo do Whiteboard Studio'}
    >
      <div
        className="absolute left-0 top-0 h-[4200px] w-[6200px] origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          backgroundColor: '#fffdf7',
          backgroundImage: gridVisible
            ? 'radial-gradient(circle, rgba(199, 142, 43, 0.24) 1px, transparent 1px)'
            : 'none',
          backgroundSize: '24px 24px',
        }}
      >
        <CanvasOrnamentCluster className="absolute left-[2100px] top-[1180px] h-[178px] w-[214px] text-[#d4af37] opacity-[0.42]" />
        <CanvasOrnamentCluster className="absolute left-[3650px] top-[2500px] h-[260px] w-[350px] rotate-180 text-[#d4af37] opacity-[0.46]" />

        <div className="absolute h-[380px] w-[380px]" style={{ left: WORLD_CENTER.x - 190, top: WORLD_CENTER.y - 220 }}>
          <div className="absolute inset-8 border border-dashed border-[#c9d2df]" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#c9d2df]" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#c9d2df]" />
          <div className="absolute inset-8">
            <div className="absolute left-0 top-0 h-px w-full origin-left rotate-45 bg-[#d8dee8]" />
            <div className="absolute right-0 top-0 h-px w-full origin-right -rotate-45 bg-[#d8dee8]" />
          </div>
          <CanvasFlowerMark className="relative h-full w-full text-[#c78e2b]" />
        </div>

        <CanvasStaticNotes />

        {elements.map((element) => (
          <CanvasElementView
            key={element.id}
            element={element}
            selected={element.id === selectedId}
            onPointerDown={(event) => handleElementPointerDown(event, element)}
          />
        ))}
      </div>

      {!mobile && (
        <>
          <div className="absolute right-4 top-4 z-20 flex h-11 items-center rounded-[10px] border border-[#d7dee8] bg-white/94 px-2 shadow-[0_12px_26px_rgba(15,27,46,0.13)]">
            <CanvasToolButton icon={Hand} label="Mover canvas" active={activeControl === 'pan'} onClick={() => setActiveControl('pan')} />
            <ToolbarDivider />
            <CanvasToolButton icon={SlidersHorizontal} label="Ajustes de visualização" active={activeControl === 'settings'} onClick={() => setActiveControl('settings')} />
            <ToolbarDivider />
            <CanvasToolButton icon={MoveHorizontal} label="Alinhar elementos" active={activeControl === 'align'} onClick={() => setActiveControl('align')} />
            <ToolbarDivider />
            <CanvasToolButton icon={Grid3x3} label="Alternar grid" active={gridVisible} onClick={() => setGridVisible((visible) => !visible)} />
          </div>

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
            <ZoomButton icon={Minus} label="Diminuir zoom" onClick={() => zoomAt(zoom - 0.1)} />
            <div className="w-16 text-center text-sm font-extrabold text-[#0f1b2e]">{Math.round(zoom * 100)}%</div>
            <ZoomButton icon={Plus} label="Aumentar zoom" onClick={() => zoomAt(zoom + 0.1)} />
            <ToolbarDivider />
            <ZoomButton
              icon={Maximize2}
              label="Ajustar a tela"
              onClick={() => {
                centerCanvas(1)
                setMinimapVisible(true)
              }}
            />
            <ToolbarDivider />
            <ZoomButton icon={Lock} label="Bloquear zoom" active={locked} onClick={() => setLocked((isLocked) => !isLocked)} />
          </div>
        </>
      )}

      <div className={`${mobile ? 'left-4 top-[5.4rem]' : 'left-5 top-5'} absolute z-20 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[0.68rem] font-bold text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.06)]`}>
        {getToolLabel(activeToolId)} · {status}
      </div>
    </div>
  )

  if (mobile) {
    return (
      <PremiumPanel className="relative h-dvh overflow-hidden rounded-none border-0 bg-[#fffdf7] shadow-none">
        {canvas}
      </PremiumPanel>
    )
  }

  return (
    <PremiumPanel className="relative h-full overflow-hidden rounded-[16px] border-[#d7dee8] bg-[#f7f1e7] p-3 shadow-[0_20px_48px_rgba(15,27,46,0.08)]">
      {canvas}
    </PremiumPanel>
  )
}

function getToolLabel(toolId: string) {
  const labels: Record<string, string> = {
    select: 'Selecionar',
    hand: 'Mão',
    shape: 'Forma',
    circle: 'Círculo',
    line: 'Linha',
    arrow: 'Seta',
    text: 'Texto',
    draw: 'Desenho',
    note: 'Nota',
    image: 'Imagem',
    motif: 'Motif',
  }

  return labels[toolId] ?? toolId
}

function createCanvasElement(id: string, type: string, point: Point, content?: string, src?: string): CanvasElement {
  if (type === 'shape') return { id, type: 'shape', x: point.x - 60, y: point.y - 45, width: 120, height: 90 }
  if (type === 'circle') return { id, type: 'circle', x: point.x - 50, y: point.y - 50, width: 100, height: 100 }
  if (type === 'line') return { id, type: 'line', x: point.x, y: point.y, width: 160, height: 80 }
  if (type === 'arrow') return { id, type: 'arrow', x: point.x, y: point.y, width: 160, height: 80 }
  if (type === 'text') return { id, type: 'text', x: point.x - 90, y: point.y - 28, width: 180, height: 56, content: content ?? 'Texto' }
  if (type === 'note') return { id, type: 'note', x: point.x - 85, y: point.y - 60, width: 170, height: 120, content: content ?? 'Nova nota' }
  if (type === 'image') return { id, type: 'image', x: point.x - 90, y: point.y - 70, width: 180, height: 140, src }
  return { id, type: 'motif', x: point.x - 55, y: point.y - 55, width: 110, height: 110 }
}

function resizeElementFromDrag(element: CanvasElement, start: Point, end: Point): CanvasElement {
  if (element.type === 'draw') return element

  const width = Math.max(16, Math.abs(end.x - start.x))
  const height = Math.max(16, Math.abs(end.y - start.y))

  if (width < 24 && height < 24) {
    return element
  }

  return {
    ...element,
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width,
    height,
  }
}

type CanvasElementViewProps = {
  element: CanvasElement
  selected: boolean
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
}

function CanvasElementView({ element, selected, onPointerDown }: CanvasElementViewProps) {
  if (element.type === 'draw') {
    return (
      <button type="button" className="absolute inset-0 cursor-pointer bg-transparent p-0" onPointerDown={onPointerDown} aria-label="Selecionar desenho">
        <DrawPath points={element.points} selected={selected} />
      </button>
    )
  }

  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      className={`absolute cursor-move rounded-[10px] transition ${
        selected ? 'ring-2 ring-[#2563eb] ring-offset-2 ring-offset-[#fffdf7]' : 'hover:ring-2 hover:ring-[#d4af37]/35'
      }`}
      style={{ left: element.x, top: element.y, width: element.width, height: element.height }}
      aria-label={`Selecionar ${getToolLabel(element.type)}`}
    >
      <CanvasElementBody element={element} />
    </button>
  )
}

function CanvasElementBody({ element }: { element: Exclude<CanvasElement, { type: 'draw'; points: Point[] }> }) {
  if (element.type === 'shape') return <div className="h-full w-full rounded-[10px] border-2 border-[#c78e2b] bg-white/30" />
  if (element.type === 'circle') return <div className="h-full w-full rounded-full border-2 border-[#0f1b2e] bg-white/20" />

  if (element.type === 'line' || element.type === 'arrow') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" fill="none" aria-hidden="true" preserveAspectRatio="none">
        <path d="M4 92L96 8" stroke="#0f1b2e" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {element.type === 'arrow' && <path d="M76 8H96V28" stroke="#0f1b2e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
      </svg>
    )
  }

  if (element.type === 'text') {
    return <div className="flex h-full items-center justify-center whitespace-pre-wrap rounded-[8px] bg-white/70 px-2 text-center text-lg font-semibold text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.08)]">{element.content}</div>
  }

  if (element.type === 'note') {
    return <div className="flex h-full items-center justify-center rounded-[8px] border border-[#e3bd68] bg-[#fff0b8] px-3 text-center text-sm font-bold leading-5 text-[#0f1b2e] shadow-[0_10px_18px_rgba(15,27,46,0.1)]">{element.content}</div>
  }

  if (element.type === 'image') {
    return element.src ? (
      <img src={element.src} alt="Imagem colada" className="h-full w-full rounded-[8px] object-cover shadow-[0_10px_18px_rgba(15,27,46,0.1)]" />
    ) : (
      <div className="flex h-full items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-[#f3ede5] text-xs font-bold text-[#64748b]">Imagem</div>
    )
  }

  return <CanvasFlowerMark className="h-full w-full text-[#c78e2b]" />
}

function DrawPath({ points, selected = false }: { points: Point[]; selected?: boolean }) {
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`} fill="none" aria-hidden="true">
      <path d={path} stroke={selected ? '#2563eb' : '#0f1b2e'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CanvasStaticNotes() {
  return (
    <>
      <CanvasNote className="absolute" style={{ left: WORLD_CENTER.x - 1320, top: WORLD_CENTER.y + 220 }} title="Estrutura" body="Traz clareza ao que é complexo." />
      <CanvasNote className="absolute" style={{ left: WORLD_CENTER.x + 820, top: WORLD_CENTER.y - 470 }} title="Ideias" body="Nascem da conexão de pensamentos." align="right" />
      <CanvasNote className="absolute" style={{ left: WORLD_CENTER.x - 120, top: WORLD_CENTER.y + 820 }} title="Propósito" body="Transforme ideias em realidade." centered />
    </>
  )
}

type CanvasNoteProps = {
  title: string
  body: string
  className: string
  style?: React.CSSProperties
  align?: 'left' | 'right'
  centered?: boolean
}

function CanvasNote({ title, body, className, style, align = 'left', centered = false }: CanvasNoteProps) {
  return (
    <div className={`z-10 max-w-[15rem] ${className}`} style={style}>
      <p className={`text-[1.65rem] italic leading-none text-[#c78e2b] ${centered ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Segoe Print', 'Bradley Hand ITC', cursive" }}>
        {title}
      </p>
      <p className={`mt-2 text-[0.83rem] font-semibold leading-6 text-[#0f1b2e] ${centered ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`} style={{ fontFamily: "'Segoe Print', 'Bradley Hand ITC', cursive" }}>
        {body}
      </p>
    </div>
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

        {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
          <path key={rotation} d="M120 120C91 94 93 58 120 34C147 58 149 94 120 120Z" transform={`rotate(${rotation} 120 120)`} />
        ))}

        <path d="M120 101.5L127.6 112.4L140.5 120L127.6 127.6L120 138.5L112.4 127.6L99.5 120L112.4 112.4L120 101.5Z" fill="#fffdf7" strokeWidth="1.65" />
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
      </g>
    </svg>
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
    <button type="button" onClick={onClick} data-active={active} className="ws-icon-button flex h-9 w-9 items-center justify-center rounded-[8px]" aria-label={label} title={label}>
      <Icon size={18} />
    </button>
  )
}

function ZoomButton({ icon: Icon, label, active = false, onClick }: ButtonIconProps) {
  return (
    <button type="button" onClick={onClick} data-active={active} className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${active ? 'studio-button-active' : 'ws-icon-button'}`} aria-label={label} title={label}>
      <Icon size={16} />
    </button>
  )
}

function ToolbarDivider() {
  return <span className="mx-1 h-7 w-px bg-[#e2e8f0]" />
}
