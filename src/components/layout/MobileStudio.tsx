import { useState } from 'react'
import { MenuIcon, PlusIcon } from '../icons/StudioIcons'
import { mobileNavItems } from '../../data/studio'
import { CanvasStage } from './CanvasStage'
import { PropertiesPanel } from './PropertiesPanel'
import { ToolDock } from './ToolDock'
import { BottomSheet } from '../ui/BottomSheet'

type MobileStudioProps = {
  activeToolId: string
  onToolChange: (toolId: string) => void
}

export function MobileStudio({ activeToolId, onToolChange }: MobileStudioProps) {
  const [toolsOpen, setToolsOpen] = useState(true)
  const [propertiesOpen, setPropertiesOpen] = useState(false)
  const [activeNavId, setActiveNavId] = useState('files')

  const navTabs = mobileNavItems.map((item) => ({
    ...item,
    label: item.id === 'share' ? 'Compartilhados' : item.label,
  }))

  function handleMobileToolChange(toolId: string) {
    onToolChange(toolId)
    setToolsOpen(false)
    setPropertiesOpen(false)
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#fffdf7] pb-28">
      <div className="fixed inset-x-0 top-0 z-30 h-[4.5rem] overflow-hidden border-b border-[#eae3d7] bg-white/96 backdrop-blur-xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <TopbarIcon icon={MenuIcon} label="Menu" />
        </div>

        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <TopbarLogoMark />
        </div>

        <div className="absolute right-10 top-1/2 flex -translate-y-1/2 justify-end">
          <ProfileTopbarIcon />
        </div>
      </div>

      <CanvasStage mobile activeToolId={activeToolId} />

      <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2">
        <div className="relative grid h-[5.55rem] grid-cols-[1fr_1fr_4.9rem_1fr_1fr] items-center rounded-[2rem] border border-[#d4af37]/20 bg-[#0f1b2e] px-3 pb-5 pt-3 shadow-[0_20px_42px_rgba(15,27,46,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <MobileNavItem item={navTabs[0]} active={activeNavId === navTabs[0].id} onSelect={setActiveNavId} />
          <MobileNavItem item={navTabs[1]} active={activeNavId === navTabs[1].id} onSelect={setActiveNavId} />

          <div aria-hidden="true" />

          <MobileNavItem item={navTabs[2]} active={activeNavId === navTabs[2].id} onSelect={setActiveNavId} />
          <MobileNavItem
            item={navTabs[3]}
            active={activeNavId === navTabs[3].id}
            onSelect={(itemId) => {
              setActiveNavId(itemId)
              setPropertiesOpen(true)
              setToolsOpen(false)
            }}
          />

          <button
            type="button"
            onClick={() => {
              setActiveNavId('create')
              setToolsOpen((value) => !value)
              setPropertiesOpen(false)
            }}
            className="absolute left-1/2 top-[-0.75rem] z-10 flex h-[4.7rem] w-[4.7rem] -translate-x-1/2 items-center justify-center text-[#d4af37] drop-shadow-[0_16px_22px_rgba(15,27,46,0.32)] transition duration-150 active:scale-95 disabled:text-[#9ca3af] disabled:drop-shadow-none"
            aria-label="Abrir ferramentas"
            aria-pressed={toolsOpen}
          >
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 76 76" fill="none" aria-hidden="true">
              <path
                d="M24.5 3.5H51.5L72.5 24.5V51.5L51.5 72.5H24.5L3.5 51.5V24.5Z"
                fill="#0F1B2E"
                stroke="#D4AF37"
                strokeWidth="2.4"
              />
            </svg>
            <PlusIcon size={34} strokeWidth={1.9} className="relative z-10" />
          </button>

          <div className="absolute bottom-2 left-1/2 h-1.5 w-28 -translate-x-1/2 rounded-full bg-white/90 shadow-[0_1px_4px_rgba(255,255,255,0.24)]" />
        </div>
      </nav>

      <BottomSheet open={toolsOpen} onClose={() => setToolsOpen(false)} title="Ferramentas">
        <ToolDock activeToolId={activeToolId} onToolChange={handleMobileToolChange} mobile />
      </BottomSheet>

      <BottomSheet open={propertiesOpen} onClose={() => setPropertiesOpen(false)} title="Propriedades">
        <PropertiesPanel mobile />
      </BottomSheet>
    </div>
  )
}

type MobileNavItemProps = {
  item: (typeof mobileNavItems)[number]
  active: boolean
  disabled?: boolean
  onSelect: (itemId: string) => void
}

function MobileNavItem({ item, active, disabled = false, onSelect }: MobileNavItemProps) {
  const Icon = item.icon
  const compactLabel = item.label.length > 10

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(item.id)}
      data-active={active}
      className="group flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-[18px] px-1 py-1 text-center text-white/82 transition duration-150 active:scale-95 disabled:pointer-events-none disabled:text-white/28 data-[active=true]:text-[#d4af37]"
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
    >
      <Icon
        size={24}
        strokeWidth={1.85}
        className="text-current transition duration-150 group-hover:text-white group-data-[active=true]:text-[#d4af37]"
      />
      <span
        className={`max-w-full whitespace-nowrap font-extrabold leading-none tracking-[-0.01em] ${
          compactLabel ? 'text-[0.5rem] min-[380px]:text-[0.54rem]' : 'text-[0.58rem] min-[380px]:text-[0.63rem]'
        }`}
      >
        {item.label}
      </span>
    </button>
  )
}

type TopbarIconProps = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
}

function TopbarIcon({ icon: Icon, label }: TopbarIconProps) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-[14px] text-[#0f1b2e] transition hover:bg-[#fff7e8] active:scale-95"
      aria-label={label}
    >
      <Icon size={28} strokeWidth={1.7} />
    </button>
  )
}

function TopbarLogoMark() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g stroke="#C78E2B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        <path d="M32 4.8C37.8 10 40.7 15.8 40.7 22.1C40.7 27.8 37.8 31 32 32C26.2 31 23.3 27.8 23.3 22.1C23.3 15.8 26.2 10 32 4.8Z" />
        <path d="M32 59.2C26.2 54 23.3 48.2 23.3 41.9C23.3 36.2 26.2 33 32 32C37.8 33 40.7 36.2 40.7 41.9C40.7 48.2 37.8 54 32 59.2Z" />
        <path d="M59.2 32C54 37.8 48.2 40.7 41.9 40.7C36.2 40.7 33 37.8 32 32C33 26.2 36.2 23.3 41.9 23.3C48.2 23.3 54 26.2 59.2 32Z" />
        <path d="M4.8 32C10 26.2 15.8 23.3 22.1 23.3C27.8 23.3 31 26.2 32 32C31 37.8 27.8 40.7 22.1 40.7C15.8 40.7 10 37.8 4.8 32Z" />
        <path d="M51.2 12.8C51.9 20.6 50.2 26.6 46 30.8C41.9 34.9 37.2 35.3 32 32C28.7 26.8 29.1 22.1 33.2 18C37.4 13.8 43.4 12.1 51.2 12.8Z" />
        <path d="M12.8 51.2C12.1 43.4 13.8 37.4 18 33.2C22.1 29.1 26.8 28.7 32 32C35.3 37.2 34.9 41.9 30.8 46C26.6 50.2 20.6 51.9 12.8 51.2Z" />
        <path d="M51.2 51.2C43.4 51.9 37.4 50.2 33.2 46C29.1 41.9 28.7 37.2 32 32C37.2 28.7 41.9 29.1 46 33.2C50.2 37.4 51.9 43.4 51.2 51.2Z" />
        <path d="M12.8 12.8C20.6 12.1 26.6 13.8 30.8 18C34.9 22.1 35.3 26.8 32 32C26.8 35.3 22.1 34.9 18 30.8C13.8 26.6 12.1 20.6 12.8 12.8Z" />
        <path d="M32 22.3L35.3 28.7L41.7 32L35.3 35.3L32 41.7L28.7 35.3L22.3 32L28.7 28.7Z" />
      </g>
    </svg>
  )
}

function ProfileTopbarIcon() {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-full text-[#0f1b2e] transition hover:bg-[#fff7e8] active:scale-95"
      aria-label="Perfil"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
          <circle cx="16" cy="16" r="13.4" />
          <circle cx="16" cy="12.2" r="4" />
          <path d="M8.8 25.1c1.1-5.1 3.5-7.6 7.2-7.6s6.1 2.5 7.2 7.6" />
        </g>
      </svg>
    </button>
  )
}
