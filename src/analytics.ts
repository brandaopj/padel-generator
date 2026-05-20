import posthog from 'posthog-js'

export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  if (!key) return
  posthog.init(key, {
    api_host: 'https://eu.i.posthog.com',
    capture_pageview: true,
    capture_pageleave: true,
    persistence: 'localStorage',
  })
}

export const analytics = {
  tournamentGenerated: (props: { mode: string; rounds: number; matches: number; courts: number }) =>
    posthog.capture('tournament_generated', props),

  modeSelected: (mode: string) =>
    posthog.capture('mode_selected', { mode }),

  shareClicked: (source: string) =>
    posthog.capture('share_clicked', { source }),

  exampleLoaded: () =>
    posthog.capture('example_loaded'),

  tournamentDeleted: () =>
    posthog.capture('tournament_deleted'),

  languageChanged: (lang: string) =>
    posthog.capture('language_changed', { lang }),
}
