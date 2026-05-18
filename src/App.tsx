import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppContext } from './context/AppContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { DarkModeToggle } from './components/ui/DarkModeToggle'
import { PrintButton } from './components/ui/PrintButton'
import { useDarkMode } from './hooks/useDarkMode'
import { GeneratorPage } from './routes/GeneratorPage'
import { HistoryPage } from './routes/HistoryPage'
import { TournamentDetailPage } from './routes/TournamentDetailPage'

function PadelLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
      <span className="font-black text-gray-900 dark:text-white tracking-tight text-lg leading-none select-none">
        PADEL
      </span>
      {/* Padel ball */}
      <span className="w-[18px] h-[18px] rounded-full bg-lime-400 flex items-center justify-center shrink-0" aria-hidden="true">
        <svg className="w-3 h-3 text-lime-700" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5 Q5 1.5 8.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M1.5 5 Q5 8.5 8.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-light text-gray-400 dark:text-gray-500 tracking-widest text-sm leading-none select-none">
        GENERATOR
      </span>
    </Link>
  )
}

function Shell() {
  const { dark, toggle } = useDarkMode()
  const { state, dispatch } = useContext(AppContext)
  const location = useLocation()

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  const showPrint = location.pathname === '/' && state.generated !== null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 print:hidden sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <PadelLogo onClick={handleReset} />
            <nav className="flex gap-4">
              <NavLink
                to="/"
                end
                onClick={handleReset}
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`
                }
              >
                Novo Torneio
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`
                }
              >
                Histórico
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {showPrint && <PrintButton />}
            <DarkModeToggle dark={dark} onToggle={toggle} />
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<GeneratorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<TournamentDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
