import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { DarkModeToggle } from './components/ui/DarkModeToggle'
import { useDarkMode } from './hooks/useDarkMode'
import { GeneratorPage } from './routes/GeneratorPage'
import { HistoryPage } from './routes/HistoryPage'
import { TournamentDetailPage } from './routes/TournamentDetailPage'

function Shell() {
  const { dark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 print:hidden sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-lg text-blue-600 hover:text-blue-700">
              Padel Generator
            </Link>
            <nav className="flex gap-4">
              <NavLink
                to="/"
                end
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
          <DarkModeToggle dark={dark} onToggle={toggle} />
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
