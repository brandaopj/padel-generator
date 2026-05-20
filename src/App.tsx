import { lazy, Suspense, useContext, useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider, Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Trophy, Clock, HelpCircle, Menu, X } from 'lucide-react'
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
      <span className="font-display font-black text-fg tracking-tight text-lg leading-none select-none">
        PADEL
      </span>
      {/* Padel ball */}
      <span className="w-[18px] h-[18px] rounded-full bg-lime-400 flex items-center justify-center shrink-0" aria-hidden="true">
        <svg className="w-3 h-3 text-lime-700" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5 Q5 1.5 8.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M1.5 5 Q5 8.5 8.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-body font-light text-fg3 tracking-widest text-sm leading-none select-none">
        GENERATOR
      </span>
    </Link>
  )
}

function Shell() {
  const { dark, toggle } = useDarkMode()
  const { state, dispatch } = useContext(AppContext)
  const { lang, setLang, t } = useLanguage()
  const location = useLocation()
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(location.pathname)
  if (lastPathname !== location.pathname) {
    setLastPathname(location.pathname)
    if (menuOpen) setMenuOpen(false)
  }

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
    `flex items-center gap-1.5 text-sm transition-colors ${isActive ? 'text-brand font-medium' : 'text-fg2 hover:text-fg'}`

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 w-full px-3 py-3 rounded-md text-sm transition-colors ${isActive ? 'text-brand font-medium bg-brand/10' : 'text-fg hover:bg-surface2'}`

  return (
    <div className="min-h-screen bg-canvas text-fg font-body overflow-x-hidden relative">
      <header className="border-b border-border bg-surface/90 backdrop-blur-sm print:hidden sticky top-0 z-30 relative">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <PadelLogo onClick={handleReset} />
            {/* Desktop nav — hidden below lg */}
            <nav className="hidden lg:flex gap-4">
              <NavLink to="/" end onClick={handleReset} className={navLinkClass}>
                <Trophy className="w-4 h-4 shrink-0" />
                <span>{t.nav.newTournament}</span>
              </NavLink>
              <NavLink to="/history" className={navLinkClass}>
                <Clock className="w-4 h-4 shrink-0" />
                <span>{t.nav.history}</span>
              </NavLink>
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="flex items-center gap-1.5 text-sm text-fg2 hover:text-fg transition-colors"
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
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
            <div className="flex items-center gap-1 border border-border rounded-md overflow-hidden text-xs font-medium">
              <button
                onClick={() => { setLang('pt'); analytics.languageChanged('pt') }}
                className={`px-2 py-1 transition-colors ${lang === 'pt' ? 'bg-brand text-brand-on' : 'text-fg3 hover:text-fg2'}`}
              >
                PT
              </button>
              <button
                onClick={() => { setLang('en'); analytics.languageChanged('en') }}
                className={`px-2 py-1 transition-colors ${lang === 'en' ? 'bg-brand text-brand-on' : 'text-fg3 hover:text-fg2'}`}
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
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -mr-1.5 rounded-md text-fg3 hover:text-fg2 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile/tablet drawer — below lg */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 lg:hidden bg-surface border-b border-border shadow-lg">
            <nav className="px-4 py-3 space-y-1">
              <NavLink to="/" end onClick={() => { setMenuOpen(false); handleReset() }} className={mobileNavLinkClass}>
                <Trophy className="w-4 h-4 shrink-0" />
                <span>{t.nav.newTournament}</span>
              </NavLink>
              <NavLink to="/history" onClick={() => setMenuOpen(false)} className={mobileNavLinkClass}>
                <Clock className="w-4 h-4 shrink-0" />
                <span>{t.nav.history}</span>
              </NavLink>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setHelpOpen(true) }}
                className="flex items-center gap-2 w-full px-3 py-3 rounded-md text-sm text-fg hover:bg-surface2 transition-colors"
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>{t.nav.howItWorks}</span>
              </button>
              {showPrint && (
                <div className="pt-2 border-t border-border flex flex-col gap-1">
                  <PrintButton className="w-full justify-start" />
                  {state.generated && <ShareButton tournament={state.generated} source="drawer" className="w-full justify-start" />}
                </div>
              )}
              <div className="pt-2 border-t border-border">
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

      <main className="relative z-10">
        <Suspense fallback={<div className="flex justify-center items-center h-48"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="text-center text-xs text-fg3 border-t border-border py-3 pb-20 lg:pb-3 mt-4 print:hidden">
        {lang === 'pt' ? 'Última atualização' : 'Last updated'}: {new Date(__BUILD_DATE__).toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </footer>
      {helpOpen && <HowItWorksModal onClose={() => setHelpOpen(false)} />}
      <Analytics />
    </div>
  )
}

function AppProviders() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <ToastProvider>
            <Shell />
          </ToastProvider>
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

const router = createBrowserRouter([
  {
    element: <AppProviders />,
    children: [
      { index: true, element: <GeneratorPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'history/:id', element: <TournamentDetailPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
