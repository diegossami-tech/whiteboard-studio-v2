import { useState } from 'react'
import {
  ChevronsLeftIcon,
  ClockIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  UsersIcon,
} from '../icons/StudioIcons'
import { PremiumPanel } from '../ui/PremiumPanel'

const primaryItems = [
  { id: 'files', label: 'Meus arquivos', icon: FolderIcon },
  { id: 'recent', label: 'Recentes', icon: ClockIcon },
  { id: 'favorites', label: 'Favoritos', icon: StarIcon },
  { id: 'shared', label: 'Compartilhados', icon: UsersIcon },
]

const libraryItems = [
  { id: 'templates', label: 'Templates', icon: GridIcon },
  { id: 'examples', label: 'Exemplos', icon: FileIcon },
  { id: 'trash', label: 'Lixeira', icon: TrashIcon },
]

const initialFolders = ['Projetos', 'Estudos', 'Ideias', 'Pessoais', 'Arquivos']

export function DesktopSidebar() {
  const [activeItem, setActiveItem] = useState('files')
  const [activeFolder, setActiveFolder] = useState(initialFolders[0])
  const [folders, setFolders] = useState(initialFolders)
  const [collapsed, setCollapsed] = useState(false)
  const [upgraded, setUpgraded] = useState(false)

  function addFolder() {
    const nextFolder = `Nova pasta ${folders.length + 1}`
    setFolders((currentFolders) => [...currentFolders, nextFolder])
    setActiveFolder(nextFolder)
  }

  return (
    <PremiumPanel className="flex h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[12px] border-[#e2e8f0] bg-[#f8fafc] p-0 text-[#0f1b2e]">
      <header className="flex h-[88px] items-center justify-between border-b border-[#e2e8f0] px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarLogoMark className="h-12 w-12 shrink-0 text-[#d4af37]" />

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-display text-[1.35rem] leading-none text-[#0f1b2e]">
                Whiteboard Studio
              </h1>
              <p className="mt-1 text-[0.58rem] font-extrabold uppercase tracking-[0.18em] text-[#c78e2b]">
                Pense. Desenhe. Conecte.
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((isCollapsed) => !isCollapsed)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#e2e8f0] bg-white text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.08)] transition hover:border-[#c78e2b] hover:text-[#c78e2b]"
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          <ChevronsLeftIcon size={18} className={collapsed ? 'rotate-180 transition' : 'transition'} />
        </button>
      </header>

      <div className="flex-1 overflow-hidden px-5 py-4">
        <nav className="space-y-5">
          <SidebarGroup
            title="Inicio"
            items={primaryItems}
            activeItem={activeItem}
            collapsed={collapsed}
            onItemChange={setActiveItem}
          />

          <div className="h-px bg-[#e2e8f0]" />

          <SidebarGroup
            title="Biblioteca"
            items={libraryItems}
            activeItem={activeItem}
            collapsed={collapsed}
            onItemChange={setActiveItem}
          />

          <div className="h-px bg-[#e2e8f0]" />

          <section>
            <div className="mb-3 flex h-6 items-center justify-between">
              {!collapsed && (
                <h2 className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#0f1b2e]">
                  Pastas
                </h2>
              )}
              <button
                type="button"
                onClick={addFolder}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-[8px] text-[#0f1b2e] transition hover:bg-[#fdf6e9] hover:text-[#c78e2b]"
                aria-label="Adicionar pasta"
                title="Adicionar pasta"
              >
                <PlusIcon size={18} />
              </button>
            </div>

            <div className="space-y-1">
              {folders.map((folder) => {
                const active = activeFolder === folder

                return (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setActiveFolder(folder)}
                    className={`flex h-8 w-full items-center gap-3 rounded-[8px] px-2 text-left text-sm font-medium transition ${
                      active
                        ? 'bg-white text-[#0f1b2e] shadow-[0_8px_18px_rgba(15,27,46,0.05)]'
                        : 'text-[#0f1b2e] hover:bg-white'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    title={folder}
                  >
                    <FolderIcon size={18} strokeWidth={1.8} className="shrink-0 text-[#c78e2b]" />
                    {!collapsed && <span className="truncate">{folder}</span>}
                  </button>
                )
              })}
            </div>
          </section>
        </nav>
      </div>

      <section className="mx-5 mb-5 rounded-[12px] border border-[#e2e8f0] bg-white p-3 shadow-[0_12px_28px_rgba(15,27,46,0.06)]">
        <div className={`flex items-start ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#f1e6d1] bg-[#fffdfa]">
            <StarIcon size={20} strokeWidth={1.8} className="text-[#c78e2b]" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h3 className="text-sm font-extrabold leading-5 text-[#0f1b2e]">Plano Pro</h3>
              <p className="mt-0.5 text-xs leading-5 text-[#64748b]">
                Recursos avancados para suas ideias.
              </p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={() => setUpgraded((isUpgraded) => !isUpgraded)}
            className={`mt-3 flex h-10 items-center gap-2 rounded-[8px] border px-4 text-sm font-extrabold transition ${
              upgraded
                ? 'border-[#0f1b2e] bg-[#0f1b2e] text-white'
                : 'border-[#c78e2b] bg-white text-[#c78e2b] hover:bg-[#fdf6e9]'
            }`}
          >
            <StarIcon size={18} strokeWidth={1.8} />
            {upgraded ? 'Ativo' : 'Upgrade'}
          </button>
        )}
      </section>
    </PremiumPanel>
  )
}

type SidebarLogoMarkProps = {
  className?: string
}

function SidebarLogoMark({ className }: SidebarLogoMarkProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55">
        <path d="M32 6.5C37.6 11.2 40.4 16.4 40.4 22.1C40.4 27.5 37.6 31 32 32C26.4 31 23.6 27.5 23.6 22.1C23.6 16.4 26.4 11.2 32 6.5Z" />
        <path d="M32 57.5C26.4 52.8 23.6 47.6 23.6 41.9C23.6 36.5 26.4 33 32 32C37.6 33 40.4 36.5 40.4 41.9C40.4 47.6 37.6 52.8 32 57.5Z" />
        <path d="M57.5 32C52.8 37.6 47.6 40.4 41.9 40.4C36.5 40.4 33 37.6 32 32C33 26.4 36.5 23.6 41.9 23.6C47.6 23.6 52.8 26.4 57.5 32Z" />
        <path d="M6.5 32C11.2 26.4 16.4 23.6 22.1 23.6C27.5 23.6 31 26.4 32 32C31 37.6 27.5 40.4 22.1 40.4C16.4 40.4 11.2 37.6 6.5 32Z" />
        <path d="M50 14C50.6 21.3 49 26.9 45 30.9C41.2 34.7 36.7 35.1 32 32C28.9 27.3 29.3 22.8 33.1 19C37.1 15 42.7 13.4 50 14Z" />
        <path d="M14 50C13.4 42.7 15 37.1 19 33.1C22.8 29.3 27.3 28.9 32 32C35.1 36.7 34.7 41.2 30.9 45C26.9 49 21.3 50.6 14 50Z" />
        <path d="M50 50C42.7 50.6 37.1 49 33.1 45C29.3 41.2 28.9 36.7 32 32C36.7 28.9 41.2 29.3 45 33.1C49 37.1 50.6 42.7 50 50Z" />
        <path d="M14 14C21.3 13.4 26.9 15 30.9 19C34.7 22.8 35.1 27.3 32 32C27.3 35.1 22.8 34.7 19 30.9C15 26.9 13.4 21.3 14 14Z" />
        <path d="M32 21.8L35.2 28.8L42.2 32L35.2 35.2L32 42.2L28.8 35.2L21.8 32L28.8 28.8L32 21.8Z" />
      </g>
    </svg>
  )
}

type SidebarItem = {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}

type SidebarGroupProps = {
  title: string
  items: SidebarItem[]
  activeItem: string
  collapsed: boolean
  onItemChange: (itemId: string) => void
}

function SidebarGroup({ title, items, activeItem, collapsed, onItemChange }: SidebarGroupProps) {
  return (
    <section>
      {!collapsed && (
        <h2 className="mb-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[#0f1b2e]">
          {title}
        </h2>
      )}

      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = activeItem === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemChange(item.id)}
              className={`flex h-10 w-full items-center gap-4 rounded-[8px] px-3 text-left text-sm font-medium transition ${
                active
                  ? 'bg-[#fdf6e9] text-[#0f1b2e] shadow-[0_8px_18px_rgba(199,142,43,0.08)]'
                  : 'text-[#0f1b2e] hover:bg-white'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={item.label}
            >
              <Icon
                size={20}
                strokeWidth={1.8}
                className={`shrink-0 ${active ? 'text-[#c78e2b]' : 'text-[#0f1b2e]'}`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
