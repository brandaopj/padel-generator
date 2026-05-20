import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import type { Tournament } from '../../types'
import { shareTournament } from '../../utils/shareTournament'
import { analytics } from '../../analytics'

function ShareIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
  )
}

type Props = {
  tournament: Tournament
  variant?: 'button' | 'icon'
  className?: string
  source?: string
}

export function ShareButton({ tournament, variant = 'button', className, source = 'unknown' }: Props) {
  const { showToast } = useToast()
  const { t } = useLanguage()

  function handleShare() {
    analytics.shareClicked(source)
    shareTournament(tournament, showToast, {
      shareCopied: t.toast.shareCopied,
      shareError: t.toast.shareError,
      copyError: t.toast.copyError,
    })
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleShare}
        title={t.share}
        aria-label={t.share}
        className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-fg3 hover:text-brand transition-colors rounded"
      >
        <ShareIcon />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      title={t.share}
      aria-label={t.share}
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-surface2 text-fg2 rounded-md text-sm hover:bg-surface2 transition-colors ${className ?? ''}`}
    >
      <ShareIcon />
      {t.share}
    </button>
  )
}
