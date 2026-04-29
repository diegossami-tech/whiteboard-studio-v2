import { CanvasStage } from './CanvasStage'
import { DesktopSidebar } from './DesktopSidebar'
import { PropertiesPanel } from './PropertiesPanel'
import { StudioTopbar } from './StudioTopbar'
import { ToolDock } from './ToolDock'

type DesktopStudioProps = {
  activeToolId: string
  onToolChange: (toolId: string) => void
}

export function DesktopStudio({ activeToolId, onToolChange }: DesktopStudioProps) {
  return (
    <div className="h-screen overflow-hidden p-4">
      <div className="grid h-full grid-cols-[270px_minmax(0,1fr)_300px] grid-rows-[76px_minmax(0,1fr)_112px] gap-4">
        <div className="row-span-3">
          <DesktopSidebar />
        </div>

        <div className="col-span-2">
          <StudioTopbar />
        </div>

        <div className="min-h-0">
          <CanvasStage activeToolId={activeToolId} onToolChange={onToolChange} />
        </div>

        <div className="row-span-2 min-h-0">
          <PropertiesPanel />
        </div>

        <div>
          <ToolDock activeToolId={activeToolId} onToolChange={onToolChange} />
        </div>
      </div>
    </div>
  )
}
