import { Component, type ReactNode, type ErrorInfo } from 'react'
import { useLanguage } from '../../context/LanguageContext'

type Props = { children: ReactNode }
type State = { hasError: boolean }

// Functional component for the error fallback so it can access the language context.
function ErrorFallback() {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-canvas">
      <h1 className="text-2xl font-bold text-red-600 mb-4">{t.errorBoundary.title}</h1>
      <p className="text-fg2 mb-6">
        {t.errorBoundary.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-brand text-brand-on rounded-md hover:bg-brand/90"
      >
        {t.errorBoundary.reload}
      </button>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Sentry is loaded lazily in main.tsx — only capture if it's available.
    if (import.meta.env.VITE_SENTRY_DSN) {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
