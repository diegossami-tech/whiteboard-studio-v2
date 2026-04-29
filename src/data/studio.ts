import type { ComponentType } from 'react'
import {
  ArchiveIcon,
  ArrowIcon,
  ArrowUpDownIcon,
  BookIcon,
  CircleIcon,
  CompassIcon,
  FolderIcon,
  GridIcon,
  HandIcon,
  ImageIcon,
  LayersIcon,
  LineIcon,
  MagicIcon,
  NoteIcon,
  PenIcon,
  SearchIcon,
  SelectIcon,
  SettingsIcon,
  ShareIcon,
  SquareIcon,
  TextIcon,
  type StudioIconProps,
} from '../components/icons/StudioIcons'

export type StudioItem = {
  id: string
  label: string
  icon: ComponentType<StudioIconProps>
}

export const sidebarPrimary: StudioItem[] = [
  { id: 'files', label: 'Meus arquivos', icon: FolderIcon },
  { id: 'recent', label: 'Recentes', icon: SearchIcon },
  { id: 'shared', label: 'Compartilhados', icon: ShareIcon },
  { id: 'templates', label: 'Modelos', icon: GridIcon },
]

export const sidebarLibrary: StudioItem[] = [
  { id: 'inspiration', label: 'Biblioteca', icon: BookIcon },
  { id: 'layers', label: 'Camadas', icon: LayersIcon },
  { id: 'archive', label: 'Arquivo', icon: ArchiveIcon },
]

export const sidebarFolders = ['Projetos', 'Rascunhos', 'Estruturas', 'Moodboards']

export const toolbarTools: StudioItem[] = [
  { id: 'select', label: 'Selecionar', icon: SelectIcon },
  { id: 'hand', label: 'Mão', icon: HandIcon },
  { id: 'shape', label: 'Forma', icon: SquareIcon },
  { id: 'circle', label: 'Círculo', icon: CircleIcon },
  { id: 'line', label: 'Linha', icon: LineIcon },
  { id: 'arrow', label: 'Conexão', icon: ArrowIcon },
  { id: 'text', label: 'Texto', icon: TextIcon },
  { id: 'draw', label: 'Desenho', icon: PenIcon },
  { id: 'note', label: 'Notas', icon: NoteIcon },
  { id: 'image', label: 'Imagem', icon: ImageIcon },
]

export const propertyColors = ['#102847', '#D6A04C', '#2E6F5A', '#8B735B', '#EFE4CF']

export const mobileNavItems: StudioItem[] = [
  { id: 'files', label: 'Arquivos', icon: FolderIcon },
  { id: 'library', label: 'Biblioteca', icon: BookIcon },
  { id: 'share', label: 'Compart.', icon: ShareIcon },
  { id: 'settings', label: 'Ajustes', icon: SettingsIcon },
]

export const canvasMetrics = [
  { label: 'Zoom', value: '125%' },
  { label: 'Grade', value: 'Ativa' },
  { label: 'Modo', value: 'Conceito' },
]

export const topbarActions: StudioItem[] = [
  { id: 'search', label: 'Pesquisar', icon: SearchIcon },
  { id: 'arrange', label: 'Alinhar', icon: ArrowUpDownIcon },
  { id: 'explore', label: 'Explorar', icon: CompassIcon },
  { id: 'magic', label: 'Refinar', icon: MagicIcon },
]
