import { useState } from 'react'
import { DesktopStudio } from './components/layout/DesktopStudio'
import { MobileStudio } from './components/layout/MobileStudio'
import { toolbarTools } from './data/studio'

function App() {
  const [activeToolId, setActiveToolId] = useState(toolbarTools[0]?.id ?? 'select')

  return (
    <main className="min-h-screen bg-[var(--ws-page)] text-[var(--ws-navy)]">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(205,157,84,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(15,36,64,0.08),_transparent_30%)]" />
      </div>

      <div className="relative">
        <div className="hidden lg:block">
          <DesktopStudio activeToolId={activeToolId} onToolChange={setActiveToolId} />
        </div>

        <div className="lg:hidden">
          <MobileStudio activeToolId={activeToolId} onToolChange={setActiveToolId} />
        </div>
      </div>
    </main>
  )
}

export default App
