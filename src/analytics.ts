// PostHog is loaded lazily — only when VITE_POSTHOG_KEY is configured.
// This avoids bundling ~50 kB of analytics code in builds that don't use it.
import { onCLS, onINP, onLCP, onTTFB, onFCP, type Metric } from 'web-vitals'

export async function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  if (!key) return
  const { default: posthog } = await import('posthog-js')
  posthog.init(key, {
    api_host: 'https://eu.i.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
  })
  initWebVitals()
}

// Safe fire-and-forget wrapper: only captures when posthog is loaded & available.
function capture(event: string, props?: Record<string, unknown>) {
  // posthog-js exposes a global on window when initialized
  const ph = (window as unknown as { posthog?: { capture: (e: string, p?: Record<string, unknown>) => void } }).posthog
  ph?.capture(event, props)
}

function reportVital({ name, value, rating }: Metric) {
  capture('web_vital', { name, value, rating })
}

function initWebVitals() {
  onCLS(reportVital)
  onINP(reportVital)
  onLCP(reportVital)
  onTTFB(reportVital)
  onFCP(reportVital)
}

export const analytics = {
  tournamentGenerated: (props: { mode: string; rounds: number; matches: number; courts: number }) =>
    capture('tournament_generated', props),

  modeSelected: (mode: string) =>
    capture('mode_selected', { mode }),

  shareClicked: (source: string) =>
    capture('share_clicked', { source }),

  exampleLoaded: () =>
    capture('example_loaded'),

  tournamentDeleted: () =>
    capture('tournament_deleted'),

  languageChanged: (lang: string) =>
    capture('language_changed', { lang }),
}
