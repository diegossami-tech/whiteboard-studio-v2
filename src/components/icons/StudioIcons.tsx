import type { ReactNode } from 'react'

export type StudioIconProps = {
  size?: number
  strokeWidth?: number
  className?: string
}

type IconShellProps = StudioIconProps & {
  children: ReactNode
}

function IconShell({ size = 24, strokeWidth = 1.8, className, children }: IconShellProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      >
        {children}
      </g>
    </svg>
  )
}

export function FolderIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M3.8 7.4h6l1.7 2h8.7v8.8a1.6 1.6 0 0 1-1.6 1.6H5.4a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path d="M3.8 7.4v-.8A1.6 1.6 0 0 1 5.4 5h4.2l1.7 1.8h7.3a1.6 1.6 0 0 1 1.6 1.6v1" />
    </IconShell>
  )
}

export function FolderPlusIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M3.8 7.4h6l1.7 2h8.7v8.8a1.6 1.6 0 0 1-1.6 1.6H5.4a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path d="M3.8 7.4v-.8A1.6 1.6 0 0 1 5.4 5h4.2l1.7 1.8h7.3a1.6 1.6 0 0 1 1.6 1.6" />
      <path d="M15 14.8h4.4M17.2 12.6V17" />
    </IconShell>
  )
}

export function FileIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M7 3.8h7l3.8 3.8v12.6H7a1.5 1.5 0 0 1-1.5-1.5V5.3A1.5 1.5 0 0 1 7 3.8Z" />
      <path d="M14 3.8v4h3.8" />
      <path d="M8.8 12h6M8.8 15h4" />
    </IconShell>
  )
}

export function TrashIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 7.2h14" />
      <path d="M9 7.2V4.8h6v2.4" />
      <path d="M7 7.2l.8 12h8.4l.8-12" />
      <path d="M10.2 10.8v5.3M13.8 10.8v5.3" />
    </IconShell>
  )
}

export function ClockIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3.2 2" />
      <path d="M12 3.8v1.1M12 19.1v1.1M3.8 12h1.1M19.1 12h1.1" />
    </IconShell>
  )
}

export function StarIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 3.8l2.15 4.35 4.8.7-3.47 3.38.82 4.77L12 14.75 7.7 17l.82-4.77-3.47-3.38 4.8-.7Z" />
      <path d="M12 8.4l.9 1.8 2 .3-1.45 1.42.35 2-1.8-.95-1.8.95.35-2L9.1 10.5l2-.3Z" />
    </IconShell>
  )
}

export function UsersIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="9" cy="8.3" r="2.7" />
      <circle cx="16.5" cy="9.1" r="2.1" />
      <path d="M4.4 18.5c.5-3 2.2-4.6 4.6-4.6s4.1 1.6 4.6 4.6" />
      <path d="M13.4 15.2c1.1-.7 2.5-.8 3.6-.3 1.4.6 2.3 1.8 2.6 3.6" />
    </IconShell>
  )
}

export function GridIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <rect x="4.4" y="4.4" width="5.4" height="5.4" rx="1.2" />
      <rect x="14.2" y="4.4" width="5.4" height="5.4" rx="1.2" />
      <rect x="4.4" y="14.2" width="5.4" height="5.4" rx="1.2" />
      <rect x="14.2" y="14.2" width="5.4" height="5.4" rx="1.2" />
    </IconShell>
  )
}

export function BookIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M4.8 5.2h5.4c1 0 1.8.8 1.8 1.8v12.2c0-1-.8-1.8-1.8-1.8H4.8Z" />
      <path d="M19.2 5.2h-5.4C12.8 5.2 12 6 12 7v12.2c0-1 .8-1.8 1.8-1.8h5.4Z" />
      <path d="M8 8.6h2M14 8.6h2" />
    </IconShell>
  )
}

export function ShareIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="6.2" cy="12" r="2.1" />
      <circle cx="17.8" cy="6.3" r="2.1" />
      <circle cx="17.8" cy="17.7" r="2.1" />
      <path d="M8.1 11.1l7.8-3.9M8.1 12.9l7.8 3.9" />
    </IconShell>
  )
}

export function SettingsIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 3.7l1.6 2.4 2.9-.4.4 2.9 2.4 1.6-1.2 2.6 1.2 2.6-2.4 1.6-.4 2.9-2.9-.4L12 20.3l-1.6-2.4-2.9.4-.4-2.9-2.4-1.6 1.2-2.6-1.2-2.6 2.4-1.6.4-2.9 2.9.4Z" />
      <circle cx="12" cy="12" r="2.8" />
    </IconShell>
  )
}

export function ArchiveIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M4.6 8h14.8v11H4.6Z" />
      <path d="M3.8 5h16.4v3H3.8Z" />
      <path d="M9.3 12h5.4" />
    </IconShell>
  )
}

export function LayersIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 4.4l8 4.2-8 4.2-8-4.2Z" />
      <path d="M4 12l8 4.2 8-4.2" />
      <path d="M4 15.5l8 4.2 8-4.2" />
    </IconShell>
  )
}

export function SearchIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="10.8" cy="10.8" r="6.2" />
      <path d="M15.2 15.2l4.6 4.6" />
    </IconShell>
  )
}

export function CompassIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M14.8 9.2l-1.5 4.1-4.1 1.5 1.5-4.1Z" />
    </IconShell>
  )
}

export function MagicIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 19L19 5" />
      <path d="M15.2 5h3.8v3.8" />
      <path d="M6 5.5l.7 1.5 1.5.7-1.5.7L6 9.9l-.7-1.5-1.5-.7 1.5-.7Z" />
      <path d="M17.5 15l.7 1.5 1.5.7-1.5.7-.7 1.5-.7-1.5-1.5-.7 1.5-.7Z" />
    </IconShell>
  )
}

export function ArrowUpDownIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M8 4.6v14.8M8 4.6l-2.5 2.5M8 4.6l2.5 2.5" />
      <path d="M16 19.4V4.6M16 19.4l-2.5-2.5M16 19.4l2.5-2.5" />
    </IconShell>
  )
}

export function MenuIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 7h14M5 12h11M5 17h14" />
    </IconShell>
  )
}

export function UserIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="8.2" r="3.2" />
      <path d="M5.8 19.6c.7-4 3-6.1 6.2-6.1s5.5 2.1 6.2 6.1" />
    </IconShell>
  )
}

export function PlusIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 5.5v13M5.5 12h13" />
    </IconShell>
  )
}

export function MinusIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5.5 12h13" />
    </IconShell>
  )
}

export function ChevronsLeftIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M13 6l-6 6 6 6M19 6l-6 6 6 6" />
    </IconShell>
  )
}

export function ChevronsRightIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 6l6 6-6 6M11 6l6 6-6 6" />
    </IconShell>
  )
}

export function ChevronDownIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M6.5 9l5.5 5.5L17.5 9" />
    </IconShell>
  )
}

export function BellIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M6.8 10.3a5.2 5.2 0 0 1 10.4 0v3.5l1.7 2.3H5.1l1.7-2.3Z" />
      <path d="M9.6 18.2a2.6 2.6 0 0 0 4.8 0" />
    </IconShell>
  )
}

export function CloseIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </IconShell>
  )
}

export function CloudIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M7.8 18.2h8.7a3.6 3.6 0 0 0 .4-7.2 5.2 5.2 0 0 0-10-1.6 4.4 4.4 0 0 0 .9 8.8Z" />
      <path d="M12 14.8V8.9M12 8.9l-2.2 2.2M12 8.9l2.2 2.2" />
    </IconShell>
  )
}

export function UndoIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M9 7H5v-4" />
      <path d="M5.4 7.2a8 8 0 1 1 .6 10.2" />
    </IconShell>
  )
}

export function RedoIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M15 7h4v-4" />
      <path d="M18.6 7.2a8 8 0 1 0-.6 10.2" />
    </IconShell>
  )
}

export function SelectIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M6 4.8l10.8 10.4-5.1.7-2.2 4.6Z" />
      <path d="M13.6 15.5l3.1 3.1" />
    </IconShell>
  )
}

export function HandIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M8.2 12V7.2a1.2 1.2 0 0 1 2.4 0v4.2" />
      <path d="M10.6 11V6a1.2 1.2 0 0 1 2.4 0v5" />
      <path d="M13 11V7a1.2 1.2 0 0 1 2.4 0v5" />
      <path d="M15.4 12V9.4a1.2 1.2 0 0 1 2.4 0v4.7c0 3.6-2.4 5.9-5.7 5.9h-.4c-2.1 0-3.5-.9-4.7-2.5l-1.8-2.4a1.3 1.3 0 0 1 2-1.6l1 1.1" />
    </IconShell>
  )
}

export function SquareIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2.4" />
    </IconShell>
  )
}

export function CircleIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <circle cx="12" cy="12" r="7.2" />
    </IconShell>
  )
}

export function LineIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 19L19 5" />
    </IconShell>
  )
}

export function ArrowIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5 19L18.5 5.5" />
      <path d="M11 5.5h7.5V13" />
    </IconShell>
  )
}

export function TextIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5.5 6h13" />
      <path d="M12 6v12" />
      <path d="M8.6 18h6.8" />
    </IconShell>
  )
}

export function PenIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M4.8 19.2l3.3-.7 10-10a2 2 0 0 0-2.8-2.8l-10 10Z" />
      <path d="M13.8 7.2l3 3" />
      <path d="M4.8 19.2l3.5-3.5" />
    </IconShell>
  )
}

export function NoteIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M5.5 5.5h13v9.2l-4 3.8h-9Z" />
      <path d="M14.5 18.5v-4h4" />
      <path d="M8.3 9.2h6M8.3 12h4" />
    </IconShell>
  )
}

export function ImageIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <rect x="4.6" y="5.2" width="14.8" height="13.6" rx="2" />
      <circle cx="15.2" cy="9.2" r="1.2" />
      <path d="M6.8 16l3.6-4 2.7 2.9 1.6-1.7 2.5 2.8" />
    </IconShell>
  )
}

export function LockIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <rect x="5.8" y="10.4" width="12.4" height="9" rx="1.8" />
      <path d="M8.6 10.4V8.1a3.4 3.4 0 0 1 6.8 0v2.3" />
      <path d="M12 14v2" />
    </IconShell>
  )
}

export function CopyIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <rect x="8.4" y="8.4" width="10.3" height="10.3" rx="1.8" />
      <path d="M5.3 15.6V7.1a1.8 1.8 0 0 1 1.8-1.8h8.5" />
    </IconShell>
  )
}

export function MoveUpIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 19V5M12 5L7.2 9.8M12 5l4.8 4.8" />
      <path d="M5 19h14" />
    </IconShell>
  )
}

export function MoveDownIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 5v14M12 19l-4.8-4.8M12 19l4.8-4.8" />
      <path d="M5 5h14" />
    </IconShell>
  )
}

export function AlignLeftIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M6 5v14" />
      <path d="M9.5 7h8.5M9.5 12h6.5M9.5 17h8.5" />
    </IconShell>
  )
}

export function AlignCenterIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M12 5v14" />
      <path d="M7.5 7h9M9.5 12h5M7.5 17h9" />
    </IconShell>
  )
}

export function AlignRightIcon(props: StudioIconProps) {
  return (
    <IconShell {...props}>
      <path d="M18 5v14" />
      <path d="M6 7h8.5M8 12h6.5M6 17h8.5" />
    </IconShell>
  )
}

export function MotifIcon(props: StudioIconProps) {
  const { size = 24, strokeWidth = 1.8, className } = props

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}>
        {[0, 45, 90, 135].map((rotation) => (
          <ellipse key={rotation} cx="24" cy="15" rx="5.8" ry="11.5" transform={`rotate(${rotation} 24 24)`} />
        ))}
        <path d="M24 17.5L27.2 22L32.5 24L27.2 26L24 30.5L20.8 26L15.5 24L20.8 22L24 17.5Z" />
        <circle cx="24" cy="24" r="2" />
      </g>
    </svg>
  )
}
