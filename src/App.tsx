import { lazy, Suspense, useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { analytics } from './analytics'
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
import { KofiButton } from './components/ui/KofiButton'
import { useDarkMode } from './hooks/useDarkMode'
import { GeneratorPage } from './routes/GeneratorPage'
const HistoryPage = lazy(() => import('./routes/HistoryPage').then(m => ({ default: m.HistoryPage })))
const TournamentDetailPage = lazy(() => import('./routes/TournamentDetailPage').then(m => ({ default: m.TournamentDetailPage })))

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

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function Shell() {
  const { dark, toggle } = useDarkMode()
  const { state, dispatch } = useContext(AppContext)
  const { lang, setLang, t } = useLanguage()
  const location = useLocation()
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [menuOpen])

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  const showPrint = location.pathname === '/' && state.generated !== null
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 text-sm transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 w-full px-3 py-3 rounded-md text-sm transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 print:hidden sticky top-0 z-30 relative">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <PadelLogo onClick={handleReset} />
            {/* Desktop nav — hidden below lg */}
            <nav className="hidden lg:flex gap-4">
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
          <div className="flex items-center gap-2">
            {/* Print + Share: desktop only (lg+) — below lg they live in the drawer */}
            {showPrint && (
              <div className="hidden lg:flex">
                <PrintButton />
              </div>
            )}
            {showPrint && state.generated && (
              <div className="hidden lg:flex">
                <ShareButton tournament={state.generated} source="header" />
              </div>
            )}
            {/* Ko-fi — desktop only */}
            <div className="hidden lg:flex">
              <KofiButton />
            </div>
            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden text-xs font-medium">
              <button
                onClick={() => { setLang('pt'); analytics.languageChanged('pt') }}
                className={`px-2 py-1 transition-colors ${lang === 'pt' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                PT
              </button>
              <button
                onClick={() => { setLang('en'); analytics.languageChanged('en') }}
                className={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                EN
              </button>
            </div>
            <DarkModeToggle dark={dark} onToggle={toggle} />
            {/* Hamburger — below lg */}
            <button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="lg:hidden p-1.5 -mr-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile/tablet drawer — below lg */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="px-4 py-3 space-y-1">
              <NavLink to="/" end onClick={() => { setMenuOpen(false); handleReset() }} className={mobileNavLinkClass}>
                <TrophyIcon />
                <span>{t.nav.newTournament}</span>
              </NavLink>
              <NavLink to="/history" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                <HistoryIcon />
                <span>{t.nav.history}</span>
              </NavLink>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setHelpOpen(true) }}
                className="flex items-center gap-2 w-full px-3 py-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <HelpIcon />
                <span>{t.nav.howItWorks}</span>
              </button>
              {showPrint && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                  <PrintButton className="w-full justify-start" />
                  {state.generated && <ShareButton tournament={state.generated} source="drawer" className="w-full justify-start" />}
                </div>
              )}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <KofiButton />
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Backdrop for mobile/tablet menu — below header (z-30) but above page content */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <main>
        <Suspense fallback={<div className="flex justify-center items-center h-48"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<TournamentDetailPage />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 py-3 pb-20 lg:pb-3 mt-4 print:hidden">
        {lang === 'pt' ? 'Última atualização' : 'Last updated'}: {new Date(__BUILD_DATE__).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </footer>
      {helpOpen && <HowItWorksModal onClose={() => setHelpOpen(false)} />}
      <Analytics />
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
