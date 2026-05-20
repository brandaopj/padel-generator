import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initPostHog } from './analytics'

// Fire and forget — PostHog loads asynchronously without blocking the render.
void initPostHog()

// Only load and initialize Sentry when a DSN is configured.
// This keeps the bundle lean in local development and preview deployments.
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN as string,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
