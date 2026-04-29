import { useState } from 'react'
import {
  BellIcon,
  ChevronDownIcon,
  CloudIcon,
  GridIcon,
  RedoIcon,
  ShareIcon,
  UndoIcon,
  UserIcon,
} from '../icons/StudioIcons'
import { PremiumPanel } from '../ui/PremiumPanel'

export function StudioTopbar() {
  const [projectMenuOpen, setProjectMenuOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [status, setStatus] = useState('Pronto')
  const [historyIndex, setHistoryIndex] = useState(1)
  const [viewMode, setViewMode] = useState('Grade')

  function runUndo() {
    setHistoryIndex((index) => Math.max(0, index - 1))
    setStatus('Acao desfeita')
  }

  function runRedo() {
    setHistoryIndex((index) => Math.min(3, index + 1))
    setStatus('Acao refeita')
  }

  function saveCloud() {
    setStatus('Salvo agora')
  }

  function toggleView() {
    setViewMode((currentMode) => (currentMode === 'Grade' ? 'Livre' : 'Grade'))
    setStatus(viewMode === 'Grade' ? 'Modo livre ativo' : 'Grade ativa')
  }

  function shareProject() {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href).catch(() => undefined)
    }
    setStatus('Link copiado')
  }

  return (
    <PremiumPanel className="flex h-full items-center justify-between rounded-[18px] px-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => setProjectMenuOpen((isOpen) => !isOpen)}
          className="ws-btn-secondary flex h-11 min-w-[180px] items-center gap-3 rounded-[12px] px-4 text-sm font-bold"
          aria-expanded={projectMenuOpen}
        >
          <UserIcon size={17} className="text-[var(--ws-navy-soft)]" />
          <span>Projeto Atlas</span>
          <ChevronDownIcon size={16} className={`ml-auto transition ${projectMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {projectMenuOpen && (
          <div className="absolute left-0 top-14 z-40 w-56 rounded-[16px] border border-[var(--ws-line)] bg-white/95 p-2 shadow-[0_18px_40px_rgba(16,40,71,0.12)]">
            {['Projeto Atlas', 'Estudo geometrico', 'Mapa de ideias'].map((project) => (
              <button
                key={project}
                type="button"
                onClick={() => {
                  setStatus(`${project} selecionado`)
                  setProjectMenuOpen(false)
                }}
                className="w-full rounded-[12px] px-3 py-2 text-left text-sm font-bold text-[var(--ws-navy)] hover:bg-[rgba(214,160,76,0.1)]"
              >
                {project}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-[16px] border border-[var(--ws-line)] bg-white/72 px-2 py-2">
        <ActionIcon icon={UndoIcon} label="Desfazer" onClick={runUndo} muted={historyIndex === 0} />
        <ActionIcon icon={RedoIcon} label="Refazer" onClick={runRedo} muted={historyIndex === 3} />
        <span className="mx-1 h-7 w-px bg-[var(--ws-line)]" />
        <ActionIcon icon={CloudIcon} label="Salvar na nuvem" onClick={saveCloud} />
        <ActionIcon icon={GridIcon} label="Organizar tela" onClick={toggleView} active={viewMode === 'Grade'} />
      </div>

      <div className="hidden min-w-[120px] text-center text-xs font-bold text-[var(--ws-gold)] xl:block">
        {status}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={shareProject}
          className="ws-btn-primary flex h-11 items-center gap-3 rounded-[12px] px-5 text-sm font-bold"
        >
          <ShareIcon size={16} className="text-[var(--ws-gold)]" />
          Compartilhar
        </button>

        <button
          type="button"
          onClick={() => setNoticeOpen((isOpen) => !isOpen)}
          className="ws-icon-button flex h-11 w-11 items-center justify-center rounded-[12px]"
          aria-label="Notificacoes"
          aria-expanded={noticeOpen}
        >
          <BellIcon size={17} />
        </button>

        <div className="relative">
          {noticeOpen && (
            <div className="absolute right-14 top-14 z-40 w-60 rounded-[16px] border border-[var(--ws-line)] bg-white/95 p-3 text-sm shadow-[0_18px_40px_rgba(16,40,71,0.12)]">
              <p className="font-extrabold text-[var(--ws-navy)]">Tudo certo por aqui</p>
              <p className="mt-1 text-xs leading-5 text-[var(--ws-navy-soft)]">Seu canvas esta pronto para edicao visual.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setProfileOpen((isOpen) => !isOpen)}
            className="ws-icon-button flex h-11 items-center gap-2 rounded-[12px] px-2.5"
            aria-label="Perfil do usuario"
            aria-expanded={profileOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#102847,#294569)] text-xs font-extrabold text-white">
              WS
            </div>
            <ChevronDownIcon size={15} className={`text-[var(--ws-navy)] transition ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-40 w-44 rounded-[16px] border border-[var(--ws-line)] bg-white/95 p-2 shadow-[0_18px_40px_rgba(16,40,71,0.12)]">
              {['Perfil', 'Preferencias', 'Sair'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setStatus(`${item} aberto`)
                    setProfileOpen(false)
                  }}
                  className="w-full rounded-[12px] px-3 py-2 text-left text-sm font-bold text-[var(--ws-navy)] hover:bg-[rgba(214,160,76,0.1)]"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </PremiumPanel>
  )
}

type ActionIconProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  onClick: () => void
  muted?: boolean
  active?: boolean
}

function ActionIcon({ icon: Icon, label, onClick, muted = false, active = false }: ActionIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={`ws-icon-button flex h-9 w-9 items-center justify-center rounded-[10px] ${
        muted ? 'opacity-45' : ''
      }`}
      aria-label={label}
      title={label}
    >
      <Icon size={17} />
    </button>
  )
}
