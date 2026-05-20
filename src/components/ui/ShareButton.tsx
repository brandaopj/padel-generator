import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import type { Tournament } from '../../types'
import { shareTournament } from '../../utils/shareTournament'

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
}

export function ShareButton({ tournament, variant = 'button', className }: Props) {
  const { showToast } = useToast()
  const { t } = useLanguage()

  function handleShare() {
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
        className="p-1.5 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors rounded"
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
      className={`flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${className ?? ''}`}
    >
      <ShareIcon />
      {t.share}
    </button>
  )
}
