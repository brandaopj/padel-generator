import { useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppContext } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import { LanguageProvider } from './context/LanguageContext'
import { useLanguage } from './context/LanguageContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { DarkModeToggle } from './components/ui/DarkModeToggle'
import { PrintButton } from './components/ui/PrintButton'
import { ShareButton } from './components/ui/ShareButton'
import { HowItWorksModal } from './components/ui/HowItWorksModal'
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

function TrophyIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v.5h4.5a.75.75 0 010 1.5h-.5v1.5a5.25 5.25 0 01-4 5.101V12h1.25a.75.75 0 010 1.5H8A.75.75 0 018 12h1.25v-1.649A5.25 5.25 0 015.25 5.25V3.75h-.5a.75.75 0 010-1.5h4.5v-.5A.75.75 0 0110 1zM6.75 3.75v1.5a3.75 3.75 0 007.5 0v-1.5h-7.5zM7 14.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H7z" clipRule="evenodd" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  )
}

function Shell() {
  const { dark, toggle } = useDarkMode()
  const { state, dispatch } = useContext(AppContext)
  const { lang, setLang, t } = useLanguage()
  const location = useLocation()
  const [helpOpen, setHelpOpen] = useState(false)

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  const showPrint = location.pathname === '/' && state.generated !== null
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 text-sm transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 print:hidden sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <PadelLogo onClick={handleReset} />
            <nav className="flex gap-4">
              <NavLink to="/" end onClick={handleReset} className={navLinkClass}>
                <TrophyIcon />
                <span>{t.nav.newTournament}</span>
              </NavLink>
              <NavLink to="/history" className={navLinkClass}>
                <HistoryIcon />
                <span>{t.nav.history}</span>
              </NavLink>
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <HelpIcon />
                <span>{t.nav.howItWorks}</span>
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {showPrint && <PrintButton />}
            {showPrint && state.generated && <ShareButton tournament={state.generated} />}
            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden text-xs font-medium">
              <button
                onClick={() => setLang('pt')}
                className={`px-2 py-1 transition-colors ${lang === 'pt' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                PT
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                EN
              </button>
            </div>
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
      {helpOpen && <HowItWorksModal onClose={() => setHelpOpen(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <ToastProvider>
            <BrowserRouter>
              <Shell />
            </BrowserRouter>
          </ToastProvider>
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
