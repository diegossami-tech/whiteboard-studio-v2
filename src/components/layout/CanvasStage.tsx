import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from 'react'
import { Grid3x3, Hand, Lock, Maximize2, Minus, MoveHorizontal, Plus, SlidersHorizontal } from 'lucide-react'
import { PremiumPanel } from '../ui/PremiumPanel'

type CanvasStageProps = {
  mobile?: boolean
  activeToolId?: string
  onToolChange?: (toolId: string) => void
}

type Point = {
  x: number
  y: number
}

type CanvasElementType = 'shape' | 'circle' | 'text' | 'note' | 'image' | 'motif' | 'line' | 'arrow' | 'draw'
type StrokeStyle = 'solid' | 'dash' | 'dot'

type CanvasElement = {
  id: string
  type: CanvasElementType
  x: number
  y: number
  width: number
  height: number
  content?: string
  src?: string
  points?: Point[]
  stroke: string
  fill: string
  strokeWidth: number
  opacity: number
  strokeStyle: StrokeStyle
  locked?: boolean
  groupId?: string
}

type MoveOrigin = {
  x: number
  y: number
  points?: Point[]
}

type Interaction =
  | { type: 'pan'; start: Point; origin: Point }
  | { type: 'move'; ids: string[]; start: Point; origins: Record<string, MoveOrigin> }
  | { type: 'create'; id: string; start: Point }
  | { type: 'draw'; id: string }
  | { type: 'resize'; id: string; start: Point; origin: { x: number; y: number; width: number; height: number } }
  | { type: 'select-box'; start: Point; current: Point }
  | null

const WORLD_WIDTH = 6200
const WORLD_HEIGHT = 4200
const WORLD_CENTER = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
const GRID_SIZE = 24
const STORAGE_KEY = 'whiteboard-studio-v2.board'

const defaultStyle = {
  stroke: '#c78e2b',
  fill: 'rgba(255, 255, 255, 0.32)',
  strokeWidth: 2,
  opacity: 1,
  strokeStyle: 'solid' as StrokeStyle,
}

const initialElements: CanvasElement[] = [
  {
    id: 'initial-note',
    type: 'note',
    x: WORLD_CENTER.x - 560,
    y: WORLD_CENTER.y + 330,
    width: 230,
    height: 126,
    content: 'Escolha uma ferramenta e clique ou arraste no canvas.',
    stroke: '#c78e2b',
    fill: '#fff0b8',
    strokeWidth: 2,
    opacity: 1,
    strokeStyle: 'solid',
  },
]

export function CanvasStage({ mobile = false, activeToolId = 'select', onToolChange }: CanvasStageProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [elements, setElements] = useState<CanvasElement[]>(() => loadStoredElements() ?? initialElements)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [interaction, setInteraction] = useState<Interaction>(null)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [gridVisible, setGridVisible] = useState(true)
  const [minimapVisible, setMinimapVisible] = useState(true)
  const [viewportLocked, setViewportLocked] = useState(false)
  const [activeControl, setActiveControl] = useState('pan')
  const [status, setStatus] = useState('Pronto')
  const [clipboardElements, setClipboardElements] = useState<CanvasElement[]>([])
  const [history, setHistory] = useState<CanvasElement[][]>([])
  const [future, setFuture] = useState<CanvasElement[][]>([])

  useEffect(() => {
    centerCanvas()
  }, [mobile])

  useEffect(() => {
    const payload = JSON.stringify({ elements })
    window.localStorage.setItem(STORAGE_KEY, payload)
  }, [elements])

  useEffect(() => {
    function handleDeleteRequest() {
      deleteSelectedElements()
    }

    function handleDuplicateRequest() {
      duplicateSelectedElements()
    }

    function handleLayerRequest(event: Event) {
      const action = (event as CustomEvent<string>).detail
      moveSelectedLayer(action)
    }

    function handleAlignRequest(event: Event) {
      const action = (event as CustomEvent<string>).detail
      alignSelectedElements(action)
    }

    function handleStyleRequest(event: Event) {
      const style = (event as CustomEvent<Partial<Pick<CanvasElement, 'stroke' | 'fill' | 'strokeWidth' | 'opacity' | 'strokeStyle'>>>).detail
      applySelectedStyle(style)
    }

    function handleToggleLockRequest() {
      toggleSelectedLock()
    }

    function handleGroupRequest() {
      groupSelectedElements()
    }

    function handleUndoRequest() {
      undo()
    }

    function handleRedoRequest() {
      redo()
    }

    function handleSaveRequest() {
      saveBoard()
    }

    function handleExportJsonRequest() {
      exportJson()
    }

    function handleExportSvgRequest() {
      exportSvg()
    }

    function handleToggleGridRequest() {
      setGridVisible((visible) => !visible)
    }

    window.addEventListener('whiteboard:delete-selected', handleDeleteRequest)
    window.addEventListener('whiteboard:duplicate-selected', handleDuplicateRequest)
    window.addEventListener('whiteboard:layer-selected', handleLayerRequest)
    window.addEventListener('whiteboard:align-selected', handleAlignRequest)
    window.addEventListener('whiteboard:update-style', handleStyleRequest)
    window.addEventListener('whiteboard:toggle-lock-selected', handleToggleLockRequest)
    window.addEventListener('whiteboard:group-selected', handleGroupRequest)
    window.addEventListener('whiteboard:undo', handleUndoRequest)
    window.addEventListener('whiteboard:redo', handleRedoRequest)
    window.addEventListener('whiteboard:save', handleSaveRequest)
    window.addEventListener('whiteboard:export-json', handleExportJsonRequest)
    window.addEventListener('whiteboard:export-svg', handleExportSvgRequest)
    window.addEventListener('whiteboard:toggle-grid', handleToggleGridRequest)

    return () => {
      window.removeEventListener('whiteboard:delete-selected', handleDeleteRequest)
      window.removeEventListener('whiteboard:duplicate-selected', handleDuplicateRequest)
      window.removeEventListener('whiteboard:layer-selected', handleLayerRequest)
      window.removeEventListener('whiteboard:align-selected', handleAlignRequest)
      window.removeEventListener('whiteboard:update-style', handleStyleRequest)
      window.removeEventListener('whiteboard:toggle-lock-selected', handleToggleLockRequest)
      window.removeEventListener('whiteboard:group-selected', handleGroupRequest)
      window.removeEventListener('whiteboard:undo', handleUndoRequest)
      window.removeEventListener('whiteboard:redo', handleRedoRequest)
      window.removeEventListener('whiteboard:save', handleSaveRequest)
      window.removeEventListener('whiteboard:export-json', handleExportJsonRequest)
      window.removeEventListener('whiteboard:export-svg', handleExportSvgRequest)
      window.removeEventListener('whiteboard:toggle-grid', handleToggleGridRequest)
    }
  }, [elements, selectedIds, history, future])

  function pushHistory(snapshot = elements) {
    setHistory((current) => [...current.slice(-39), snapshot.map(cloneElement)])
    setFuture([])
  }

  function commitElements(nextElements: CanvasElement[], message: string, nextSelection = selectedIds) {
    pushHistory()
    setElements(nextElements)
    setSelectedIds(nextSelection)
    setStatus(message)
  }

  function deleteSelectedElements() {
    if (!selectedIds.length) {
      setStatus('Selecione um elemento para excluir')
      return
    }

    const nextElements = elements.filter((element) => !selectedIds.includes(element.id) || element.locked)
    const removed = elements.length - nextElements.length

    if (!removed) {
      setStatus('Elemento bloqueado')
      return
    }

    commitElements(nextElements, removed > 1 ? 'Elementos excluidos' : 'Elemento excluido', [])
    setInteraction(null)
  }

  function duplicateSelectedElements() {
    if (!selectedIds.length) {
      setStatus('Selecione algo para duplicar')
      return
    }

    const copies = elements
      .filter((element) => selectedIds.includes(element.id))
      .map((element) => ({
        ...cloneElement(element),
        id: `${element.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        x: element.x + 36,
        y: element.y + 36,
        points: element.points?.map((point) => ({ x: point.x + 36, y: point.y + 36 })),
      }))

    commitElements([...elements, ...copies], 'Duplicado', copies.map((element) => element.id))
  }

  function moveSelectedLayer(action: string) {
    if (!selectedIds.length) {
      setStatus('Selecione uma camada')
      return
    }

    const selected = elements.filter((element) => selectedIds.includes(element.id))
    const rest = elements.filter((element) => !selectedIds.includes(element.id))
    const nextElements = action === 'backward' ? [...selected, ...rest] : [...rest, ...selected]
    commitElements(nextElements, action === 'backward' ? 'Enviado para tras' : 'Trazido para frente')
  }

  function alignSelectedElements(action: string) {
    const selected = elements.filter((element) => selectedIds.includes(element.id) && !element.locked)

    if (selected.length < 2 && action === 'distribute') {
      setStatus('Distribuir requer 2 ou mais elementos')
      return
    }

    if (!selected.length) {
      setStatus('Selecione elementos para alinhar')
      return
    }

    const bounds = getSelectionBounds(selected)
    const sorted = [...selected].sort((a, b) => a.x - b.x)
    const gap = selected.length > 1 ? (bounds.width - selected.reduce((sum, element) => sum + element.width, 0)) / (selected.length - 1) : 0

    const nextElements = elements.map((element) => {
      if (!selectedIds.includes(element.id) || element.locked) return element

      if (action === 'left') return { ...element, x: bounds.x }
      if (action === 'center') return { ...element, x: bounds.x + bounds.width / 2 - element.width / 2 }
      if (action === 'right') return { ...element, x: bounds.x + bounds.width - element.width }

      if (action === 'distribute') {
        const index = sorted.findIndex((item) => item.id === element.id)
        const previousWidth = sorted.slice(0, index).reduce((sum, item) => sum + item.width, 0)
        return { ...element, x: bounds.x + previousWidth + gap * index }
      }

      return element
    })

    commitElements(nextElements, 'Alinhamento aplicado')
  }

  function applySelectedStyle(style: Partial<Pick<CanvasElement, 'stroke' | 'fill' | 'strokeWidth' | 'opacity' | 'strokeStyle'>>) {
    if (!selectedIds.length) {
      setStatus('Selecione um elemento para estilizar')
      return
    }

    commitElements(
      elements.map((element) => (selectedIds.includes(element.id) && !element.locked ? { ...element, ...style } : element)),
      'Estilo aplicado',
    )
  }

  function toggleSelectedLock() {
    if (!selectedIds.length) {
      setStatus('Selecione um elemento para bloquear')
      return
    }

    commitElements(
      elements.map((element) => (selectedIds.includes(element.id) ? { ...element, locked: !element.locked } : element)),
      'Bloqueio alternado',
    )
  }

  function groupSelectedElements() {
    if (selectedIds.length < 2) {
      setStatus('Selecione 2 ou mais elementos')
      return
    }

    const groupId = `group-${Date.now()}`
    commitElements(
      elements.map((element) => (selectedIds.includes(element.id) ? { ...element, groupId } : element)),
      'Grupo criado',
    )
  }

  function undo() {
    const previous = history.at(-1)

    if (!previous) {
      setStatus('Nada para desfazer')
      return
    }

    setFuture((current) => [elements.map(cloneElement), ...current.slice(0, 39)])
    setElements(previous.map(cloneElement))
    setHistory((current) => current.slice(0, -1))
    setSelectedIds([])
    setStatus('Acao desfeita')
  }

  function redo() {
    const next = future[0]

    if (!next) {
      setStatus('Nada para refazer')
      return
    }

    setHistory((current) => [...current.slice(-39), elements.map(cloneElement)])
    setElements(next.map(cloneElement))
    setFuture((current) => current.slice(1))
    setSelectedIds([])
    setStatus('Acao refeita')
  }

  function saveBoard() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements }))
    setStatus('Salvo neste navegador')
  }

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
    if (viewportLocked) {
      return
    }

    const clampedZoom = Math.min(3, Math.max(0.12, nextZoom))
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
    const element = createCanvasElement(id, type, snapPoint(point), content, src)

    pushHistory()
    setElements((current) => [...current, element])
    setSelectedIds([id])
    setStatus(`${getToolLabel(type)} criado`)
    return element
  }

  function updateElement(id: string, updater: (element: CanvasElement) => CanvasElement) {
    setElements((current) => current.map((element) => (element.id === id ? updater(element) : element)))
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('[data-canvas-control="true"]')) {
      return
    }

    viewportRef.current?.focus()
    const point = screenToWorld(event.clientX, event.clientY)

    if (activeToolId === 'hand' || event.button === 1) {
      setInteraction({ type: 'pan', start: { x: event.clientX, y: event.clientY }, origin: pan })
      setStatus('Movendo canvas')
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    if (activeToolId === 'select') {
      setInteraction({ type: 'select-box', start: point, current: point })
      setStatus('Selecionando area')
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    if (activeToolId === 'draw') {
      const id = `draw-${Date.now()}`
      pushHistory()
      setElements((current) => [
        ...current,
        {
          id,
          type: 'draw',
          x: point.x,
          y: point.y,
          width: 1,
          height: 1,
          points: [point],
          stroke: '#0f1b2e',
          fill: 'transparent',
          strokeWidth: 3,
          opacity: 1,
          strokeStyle: 'solid',
        },
      ])
      setSelectedIds([id])
      setInteraction({ type: 'draw', id })
      setStatus('Desenhando')
      event.currentTarget.setPointerCapture(event.pointerId)
      return
    }

    const created = addElement(activeToolId, point)
    setInteraction({ type: 'create', id: created.id, start: snapPoint(point) })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleElementPointerDown(event: PointerEvent<HTMLDivElement>, element: CanvasElement) {
    event.stopPropagation()
    viewportRef.current?.focus()

    const relatedIds = element.groupId
      ? elements.filter((item) => item.groupId === element.groupId).map((item) => item.id)
      : [element.id]

    const nextSelection = event.shiftKey
      ? toggleIds(selectedIds, relatedIds)
      : selectedIds.includes(element.id)
        ? selectedIds
        : relatedIds

    setSelectedIds(nextSelection)
    setStatus(`${getToolLabel(element.type)} selecionado`)

    if (activeToolId !== 'select' || element.locked) {
      return
    }

    pushHistory()
    const point = screenToWorld(event.clientX, event.clientY)
    const origins = Object.fromEntries(
      elements
        .filter((item) => nextSelection.includes(item.id))
        .map((item) => [item.id, { x: item.x, y: item.y, points: item.points?.map((pathPoint) => ({ ...pathPoint })) }]),
    )

    setInteraction({ type: 'move', ids: nextSelection, start: point, origins })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleResizePointerDown(event: PointerEvent<HTMLDivElement>, element: CanvasElement) {
    event.stopPropagation()
    viewportRef.current?.focus()

    if (element.locked) {
      setStatus('Elemento bloqueado')
      return
    }

    pushHistory()
    setSelectedIds([element.id])
    setInteraction({
      type: 'resize',
      id: element.id,
      start: screenToWorld(event.clientX, event.clientY),
      origin: { x: element.x, y: element.y, width: element.width, height: element.height },
    })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleElementDoubleClick(event: React.MouseEvent<HTMLDivElement>, element: CanvasElement) {
    event.stopPropagation()

    if (element.locked || (element.type !== 'text' && element.type !== 'note')) {
      return
    }

    const nextText = window.prompt('Editar texto', element.content ?? '')

    if (nextText === null) {
      return
    }

    commitElements(
      elements.map((item) => (item.id === element.id ? { ...item, content: nextText } : item)),
      'Texto editado',
      [element.id],
    )
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

    if (interaction.type === 'select-box') {
      setInteraction({ ...interaction, current: point })
      return
    }

    if (interaction.type === 'draw') {
      updateElement(interaction.id, (element) => {
        if (element.type !== 'draw') return element

        const points = [...(element.points ?? []), point]
        return { ...element, ...getPathBounds(points), points }
      })
      return
    }

    if (interaction.type === 'create') {
      updateElement(interaction.id, (element) => resizeElementFromDrag(element, interaction.start, snapPoint(point)))
      return
    }

    if (interaction.type === 'resize') {
      updateElement(interaction.id, (element) => {
        if (element.type === 'draw') return element

        const snapped = snapPoint(point)
        return {
          ...element,
          width: Math.max(24, snapped.x - interaction.origin.x),
          height: Math.max(24, snapped.y - interaction.origin.y),
        }
      })
      return
    }

    if (interaction.type === 'move') {
      const snappedPoint = snapPoint(point)
      const dx = snappedPoint.x - snapPoint(interaction.start).x
      const dy = snappedPoint.y - snapPoint(interaction.start).y

      setElements((current) =>
        current.map((element) => {
          if (!interaction.ids.includes(element.id) || element.locked) {
            return element
          }

          const origin = interaction.origins[element.id]

          if (!origin) {
            return element
          }

          if (element.type === 'draw') {
            const points = origin.points?.map((pathPoint) => ({ x: pathPoint.x + dx, y: pathPoint.y + dy })) ?? element.points
            return { ...element, ...getPathBounds(points ?? []), points }
          }

          return { ...element, x: origin.x + dx, y: origin.y + dy }
        }),
      )
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (interaction?.type === 'select-box') {
      const box = normalizeBox(interaction.start, interaction.current)

      if (box.width < 4 && box.height < 4) {
        setSelectedIds([])
        setStatus('Selecao limpa')
      } else {
        const selected = elements.filter((element) => intersects(box, element)).map((element) => element.id)
        setSelectedIds(selected)
        setStatus(selected.length ? `${selected.length} selecionado(s)` : 'Nada selecionado')
      }
    }

    if (interaction) {
      setInteraction(null)
      if (interaction.type !== 'select-box') setStatus('Pronto')
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

    if (!viewportLocked) {
      setPan((current) => ({ x: current.x - event.deltaX, y: current.y - event.deltaY }))
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const imageFile = Array.from(event.clipboardData.files).find((file) => file.type.startsWith('image/'))
    const text = event.clipboardData.getData('text/plain')
    const center = getViewportCenter()

    if (imageFile) {
      event.preventDefault()
      const reader = new FileReader()
      reader.onload = () => addElement('image', center, undefined, String(reader.result))
      reader.readAsDataURL(imageFile)
      return
    }

    if (text.trim()) {
      event.preventDefault()
      try {
        const parsed = JSON.parse(text) as { whiteboardStudioElements?: CanvasElement[] }
        if (Array.isArray(parsed.whiteboardStudioElements)) {
          pasteInternal(parsed.whiteboardStudioElements, center)
          return
        }
      } catch {
        // Plain text paste remains supported.
      }

      addElement('text', center, text.trim().slice(0, 220))
      return
    }

    if (clipboardElements.length) {
      event.preventDefault()
      pasteInternal(clipboardElements, center)
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const isMod = event.ctrlKey || event.metaKey
    const key = event.key.toLowerCase()

    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      deleteSelectedElements()
      return
    }

    if (isMod && key === 'z' && !event.shiftKey) {
      event.preventDefault()
      undo()
      return
    }

    if ((isMod && key === 'y') || (isMod && event.shiftKey && key === 'z')) {
      event.preventDefault()
      redo()
      return
    }

    if (isMod && key === 's') {
      event.preventDefault()
      saveBoard()
      return
    }

    if (isMod && key === 'd') {
      event.preventDefault()
      duplicateSelectedElements()
      return
    }

    if (isMod && key === 'c') {
      event.preventDefault()
      copySelectedElements()
      return
    }

    if (isMod && key === 'x') {
      event.preventDefault()
      copySelectedElements()
      deleteSelectedElements()
      return
    }

    if (isMod && key === 'v' && clipboardElements.length) {
      event.preventDefault()
      pasteInternal(clipboardElements, getViewportCenter())
      return
    }

    const shortcutTool = getToolFromShortcut(key)

    if (shortcutTool && onToolChange) {
      event.preventDefault()
      onToolChange(shortcutTool)
      setStatus(`${getToolLabel(shortcutTool)} ativo`)
    }
  }

  function copySelectedElements() {
    const copied = elements.filter((element) => selectedIds.includes(element.id)).map(cloneElement)

    if (!copied.length) {
      setStatus('Nada selecionado para copiar')
      return
    }

    setClipboardElements(copied)
    const payload = JSON.stringify({ whiteboardStudioElements: copied })
    void navigator.clipboard?.writeText(payload).catch(() => undefined)
    setStatus('Copiado')
  }

  function pasteInternal(sourceElements: CanvasElement[], center: Point) {
    if (!sourceElements.length) return

    const bounds = getSelectionBounds(sourceElements)
    const offset = { x: center.x - (bounds.x + bounds.width / 2), y: center.y - (bounds.y + bounds.height / 2) }
    const copies = sourceElements.map((element) => ({
      ...cloneElement(element),
      id: `${element.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      x: snap(element.x + offset.x),
      y: snap(element.y + offset.y),
      points: element.points?.map((point) => ({ x: snap(point.x + offset.x), y: snap(point.y + offset.y) })),
      groupId: element.groupId ? `group-${Date.now()}` : undefined,
    }))

    commitElements([...elements, ...copies], 'Colado', copies.map((element) => element.id))
  }

  function getViewportCenter() {
    const bounds = viewportRef.current?.getBoundingClientRect()
    return bounds ? screenToWorld(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2) : WORLD_CENTER
  }

  function exportJson() {
    downloadFile('whiteboard-studio-board.json', 'application/json', JSON.stringify({ elements }, null, 2))
    setStatus('JSON exportado')
  }

  function exportSvg() {
    const svg = createSvgExport(elements)
    downloadFile('whiteboard-studio-board.svg', 'image/svg+xml', svg)
    setStatus('SVG exportado')
  }

  const viewportClass = mobile
    ? 'canvas-reference-grid relative h-dvh overflow-hidden rounded-none border-0 bg-[#fffdf7] shadow-none outline-none focus:ring-2 focus:ring-[#d4af37]/35'
    : `${gridVisible ? 'canvas-reference-grid' : 'bg-[#fffdf7]'} absolute inset-3 overflow-hidden rounded-[14px] border border-[#cfd7e3] outline-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0.68),0_16px_34px_rgba(15,27,46,0.08)] focus:ring-2 focus:ring-[#d4af37]/35`
  const selectionBox = interaction?.type === 'select-box' ? normalizeBox(interaction.start, interaction.current) : null

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
      onKeyDown={handleKeyDown}
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
            selected={selectedIds.includes(element.id)}
            onPointerDown={(event) => handleElementPointerDown(event, element)}
            onDoubleClick={(event) => handleElementDoubleClick(event, element)}
            onResizePointerDown={(event) => handleResizePointerDown(event, element)}
          />
        ))}

        {selectionBox && (
          <div
            className="pointer-events-none absolute border border-[#2563eb] bg-[#2563eb]/8"
            style={{ left: selectionBox.x, top: selectionBox.y, width: selectionBox.width, height: selectionBox.height }}
          />
        )}

        <CollaborationHints />
      </div>

      {!mobile && (
        <>
          <div className="absolute right-4 top-4 z-20 flex h-11 items-center rounded-[10px] border border-[#d7dee8] bg-white/94 px-2 shadow-[0_12px_26px_rgba(15,27,46,0.13)]" data-canvas-control="true">
            <CanvasToolButton icon={Hand} label="Mover canvas" active={activeControl === 'pan'} onClick={() => setActiveControl('pan')} />
            <ToolbarDivider />
            <CanvasToolButton icon={SlidersHorizontal} label="Exportar SVG" active={activeControl === 'settings'} onClick={exportSvg} />
            <ToolbarDivider />
            <CanvasToolButton icon={MoveHorizontal} label="Alinhar elementos" active={activeControl === 'align'} onClick={() => alignSelectedElements('center')} />
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
              data-canvas-control="true"
            >
              <div className="relative h-[82px] w-[118px] overflow-hidden rounded-[8px] bg-[#f8f4ed]">
                <div className="absolute left-4 top-6 h-11 w-16 bg-[#eee6da]" />
                <div className="absolute right-3 top-3 h-10 w-20 bg-[#f3ede5]" />
                <div className="absolute left-9 top-5 h-13 w-16 border border-[#c78e2b] bg-white/36" />
                {elements.slice(-10).map((element) => (
                  <span
                    key={element.id}
                    className="absolute h-1.5 w-1.5 rounded-full bg-[#0f1b2e]/50"
                    style={{
                      left: `${Math.min(108, Math.max(4, (element.x / WORLD_WIDTH) * 118))}px`,
                      top: `${Math.min(72, Math.max(4, (element.y / WORLD_HEIGHT) * 82))}px`,
                    }}
                  />
                ))}
                <Maximize2 size={16} className="absolute bottom-2 right-2 text-[#0f1b2e]" />
              </div>
            </button>
          )}

          <div className="absolute bottom-6 left-6 z-20 flex h-11 items-center rounded-[10px] border border-[#d7dee8] bg-white/94 px-2 shadow-[0_12px_26px_rgba(15,27,46,0.1)]" data-canvas-control="true">
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
            <ZoomButton icon={Lock} label="Bloquear zoom" active={viewportLocked} onClick={() => setViewportLocked((isLocked) => !isLocked)} />
          </div>
        </>
      )}

      <div className={`${mobile ? 'left-4 top-[5.4rem]' : 'left-5 top-5'} pointer-events-none absolute z-20 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[0.68rem] font-bold text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.06)]`}>
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
    hand: 'Mao',
    shape: 'Forma',
    circle: 'Circulo',
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

function getToolFromShortcut(key: string) {
  const shortcuts: Record<string, string> = {
    v: 'select',
    h: 'hand',
    r: 'shape',
    o: 'circle',
    l: 'line',
    a: 'arrow',
    t: 'text',
    p: 'draw',
    n: 'note',
    i: 'image',
    m: 'motif',
  }

  return shortcuts[key]
}

function createCanvasElement(id: string, type: string, point: Point, content?: string, src?: string): CanvasElement {
  const base = { id, x: point.x, y: point.y, ...defaultStyle }
  if (type === 'shape') return { ...base, type: 'shape', x: point.x - 60, y: point.y - 45, width: 120, height: 90 }
  if (type === 'circle') return { ...base, type: 'circle', x: point.x - 50, y: point.y - 50, width: 100, height: 100, stroke: '#0f1b2e' }
  if (type === 'line') return { ...base, type: 'line', width: 160, height: 80, fill: 'transparent', stroke: '#0f1b2e' }
  if (type === 'arrow') return { ...base, type: 'arrow', width: 160, height: 80, fill: 'transparent', stroke: '#0f1b2e' }
  if (type === 'text') return { ...base, type: 'text', x: point.x - 90, y: point.y - 28, width: 180, height: 56, content: content ?? 'Texto', fill: 'rgba(255,255,255,0.72)', stroke: '#0f1b2e' }
  if (type === 'note') return { ...base, type: 'note', x: point.x - 85, y: point.y - 60, width: 170, height: 120, content: content ?? 'Nova nota', fill: '#fff0b8' }
  if (type === 'image') return { ...base, type: 'image', x: point.x - 90, y: point.y - 70, width: 180, height: 140, src, stroke: '#e2e8f0', fill: '#f3ede5' }
  return { ...base, type: 'motif', x: point.x - 55, y: point.y - 55, width: 110, height: 110, fill: 'transparent' }
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
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onResizePointerDown: (event: PointerEvent<HTMLDivElement>) => void
  onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => void
}

function CanvasElementView({ element, selected, onPointerDown, onResizePointerDown, onDoubleClick }: CanvasElementViewProps) {
  return (
    <div
      role="button"
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className={`absolute cursor-move rounded-[10px] transition ${
        selected ? 'ring-2 ring-[#2563eb] ring-offset-2 ring-offset-[#fffdf7]' : 'hover:ring-2 hover:ring-[#d4af37]/35'
      } ${element.locked ? 'cursor-not-allowed opacity-80' : ''}`}
      style={{ left: element.x, top: element.y, width: element.width, height: element.height, opacity: element.opacity }}
      aria-label={`Selecionar ${getToolLabel(element.type)}`}
    >
      <CanvasElementBody element={element} />

      {selected && (
        <>
          <div className="pointer-events-none absolute -inset-1 rounded-[12px] border border-[#2563eb]/60" />
          {!element.locked && element.type !== 'draw' && (
            <div
              role="button"
              tabIndex={-1}
              data-canvas-control="true"
              onPointerDown={onResizePointerDown}
              className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-[4px] border border-[#2563eb] bg-white shadow-[0_4px_10px_rgba(15,27,46,0.15)]"
              aria-label="Redimensionar"
            />
          )}
        </>
      )}
    </div>
  )
}

function CanvasElementBody({ element }: { element: CanvasElement }) {
  const strokeDasharray = element.strokeStyle === 'dash' ? '10 8' : element.strokeStyle === 'dot' ? '2 8' : undefined

  if (element.type === 'shape') {
    return <div className="h-full w-full rounded-[10px]" style={{ border: `${element.strokeWidth}px solid ${element.stroke}`, background: element.fill }} />
  }

  if (element.type === 'circle') {
    return <div className="h-full w-full rounded-full" style={{ border: `${element.strokeWidth}px solid ${element.stroke}`, background: element.fill }} />
  }

  if (element.type === 'line' || element.type === 'arrow') {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" fill="none" aria-hidden="true" preserveAspectRatio="none">
        <path d="M4 92L96 8" stroke={element.stroke} strokeWidth={element.strokeWidth} strokeDasharray={strokeDasharray} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {element.type === 'arrow' && <path d="M76 8H96V28" stroke={element.stroke} strokeWidth={element.strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
      </svg>
    )
  }

  if (element.type === 'draw') {
    return <DrawPath element={element} selected={false} />
  }

  if (element.type === 'text') {
    return <div className="flex h-full items-center justify-center whitespace-pre-wrap rounded-[8px] px-2 text-center text-lg font-semibold text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.08)]" style={{ background: element.fill }}>{element.content}</div>
  }

  if (element.type === 'note') {
    return <div className="flex h-full items-center justify-center rounded-[8px] px-3 text-center text-sm font-bold leading-5 text-[#0f1b2e] shadow-[0_10px_18px_rgba(15,27,46,0.1)]" style={{ border: `${element.strokeWidth}px solid ${element.stroke}`, background: element.fill }}>{element.content}</div>
  }

  if (element.type === 'image') {
    return element.src ? (
      <img src={element.src} alt="Imagem colada" className="h-full w-full rounded-[8px] object-cover shadow-[0_10px_18px_rgba(15,27,46,0.1)]" />
    ) : (
      <div className="flex h-full items-center justify-center rounded-[8px] text-xs font-bold text-[#64748b]" style={{ border: `${element.strokeWidth}px solid ${element.stroke}`, background: element.fill }}>Imagem</div>
    )
  }

  return <CanvasFlowerMark className="h-full w-full text-[#c78e2b]" />
}

function DrawPath({ element }: { element: CanvasElement; selected?: boolean }) {
  const points = element.points ?? []
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x - element.x} ${point.y - element.y}`).join(' ')

  return (
    <svg className="pointer-events-none h-full w-full overflow-visible" viewBox={`0 0 ${Math.max(1, element.width)} ${Math.max(1, element.height)}`} fill="none" aria-hidden="true">
      <path d={path} stroke={element.stroke} strokeWidth={element.strokeWidth} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function CanvasStaticNotes() {
  return (
    <>
      <CanvasNote className="absolute" style={{ left: WORLD_CENTER.x - 1320, top: WORLD_CENTER.y + 220 }} title="Estrutura" body="Traz clareza ao que e complexo." />
      <CanvasNote className="absolute" style={{ left: WORLD_CENTER.x + 820, top: WORLD_CENTER.y - 470 }} title="Ideias" body="Nascem da conexao de pensamentos." align="right" />
      <CanvasNote className="absolute" style={{ left: WORLD_CENTER.x - 120, top: WORLD_CENTER.y + 820 }} title="Proposito" body="Transforme ideias em realidade." centered />
    </>
  )
}

type CanvasNoteProps = {
  title: string
  body: string
  className: string
  style?: CSSProperties
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

function CollaborationHints() {
  return (
    <>
      <div className="pointer-events-none absolute left-[4280px] top-[1540px] z-20">
        <div className="h-0 w-0 border-l-[10px] border-r-[4px] border-t-[16px] border-l-[#2563eb] border-r-transparent border-t-transparent" />
        <span className="mt-1 inline-flex rounded-full bg-[#2563eb] px-2 py-1 text-[0.65rem] font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.22)]">Ana</span>
      </div>
      <div className="pointer-events-none absolute left-[2480px] top-[2580px] z-20">
        <div className="h-0 w-0 border-l-[10px] border-r-[4px] border-t-[16px] border-l-[#0f6a54] border-r-transparent border-t-transparent" />
        <span className="mt-1 inline-flex rounded-full bg-[#0f6a54] px-2 py-1 text-[0.65rem] font-bold text-white shadow-[0_8px_18px_rgba(15,106,84,0.22)]">Leo</span>
      </div>
    </>
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
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  active?: boolean
  onClick: () => void
}

function CanvasToolButton({ icon: Icon, label, active = false, onClick }: ButtonIconProps) {
  return (
    <button type="button" onClick={onClick} data-active={active} className="ws-icon-button flex h-9 w-9 items-center justify-center rounded-[8px]" aria-label={label} title={label} data-canvas-control="true">
      <Icon size={18} />
    </button>
  )
}

function ZoomButton({ icon: Icon, label, active = false, onClick }: ButtonIconProps) {
  return (
    <button type="button" onClick={onClick} data-active={active} className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${active ? 'studio-button-active' : 'ws-icon-button'}`} aria-label={label} title={label} data-canvas-control="true">
      <Icon size={16} />
    </button>
  )
}

function ToolbarDivider() {
  return <span className="mx-1 h-7 w-px bg-[#e2e8f0]" />
}

function snap(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

function snapPoint(point: Point) {
  return { x: snap(point.x), y: snap(point.y) }
}

function cloneElement(element: CanvasElement): CanvasElement {
  return { ...element, points: element.points?.map((point) => ({ ...point })) }
}

function toggleIds(current: string[], ids: string[]) {
  const next = new Set(current)

  ids.forEach((id) => {
    if (next.has(id)) next.delete(id)
    else next.add(id)
  })

  return Array.from(next)
}

function normalizeBox(start: Point, end: Point) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  }
}

function intersects(box: { x: number; y: number; width: number; height: number }, element: CanvasElement) {
  return element.x < box.x + box.width && element.x + element.width > box.x && element.y < box.y + box.height && element.y + element.height > box.y
}

function getSelectionBounds(elements: CanvasElement[]) {
  const left = Math.min(...elements.map((element) => element.x))
  const top = Math.min(...elements.map((element) => element.y))
  const right = Math.max(...elements.map((element) => element.x + element.width))
  const bottom = Math.max(...elements.map((element) => element.y + element.height))

  return { x: left, y: top, width: right - left, height: bottom - top }
}

function getPathBounds(points: Point[]) {
  if (!points.length) {
    return { x: 0, y: 0, width: 1, height: 1 }
  }

  const left = Math.min(...points.map((point) => point.x))
  const top = Math.min(...points.map((point) => point.y))
  const right = Math.max(...points.map((point) => point.x))
  const bottom = Math.max(...points.map((point) => point.y))

  return { x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) }
}

function loadStoredElements() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as { elements?: CanvasElement[] }
    return Array.isArray(parsed.elements) ? parsed.elements : null
  } catch {
    return null
  }
}

function downloadFile(name: string, type: string, contents: string) {
  const blob = new Blob([contents], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(url)
}

function createSvgExport(elements: CanvasElement[]) {
  const body = elements.map((element) => {
    if (element.type === 'shape') return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="10" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" opacity="${element.opacity}" />`
    if (element.type === 'circle') return `<ellipse cx="${element.x + element.width / 2}" cy="${element.y + element.height / 2}" rx="${element.width / 2}" ry="${element.height / 2}" fill="${element.fill}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" opacity="${element.opacity}" />`
    if (element.type === 'line' || element.type === 'arrow') return `<line x1="${element.x}" y1="${element.y + element.height}" x2="${element.x + element.width}" y2="${element.y}" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" stroke-linecap="round" opacity="${element.opacity}" />`
    if (element.type === 'draw') return `<polyline points="${(element.points ?? []).map((point) => `${point.x},${point.y}`).join(' ')}" fill="none" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${element.opacity}" />`
    if (element.type === 'text' || element.type === 'note') return `<text x="${element.x + element.width / 2}" y="${element.y + element.height / 2}" text-anchor="middle" dominant-baseline="middle" fill="#0f1b2e" font-family="Inter, sans-serif" font-size="24" opacity="${element.opacity}">${escapeHtml(element.content ?? '')}</text>`
    return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="12" fill="none" stroke="#c78e2b" stroke-width="2" opacity="${element.opacity}" />`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}" width="${WORLD_WIDTH}" height="${WORLD_HEIGHT}"><rect width="100%" height="100%" fill="#fffdf7" />${body}</svg>`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }

    return entities[character]
  })
}
