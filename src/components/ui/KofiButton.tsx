export function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/brandaopj"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a beer on Ko-fi"
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-fg3 hover:text-amber-600 dark:hover:text-amber-400 border border-border hover:border-amber-400 dark:hover:border-amber-500 rounded-md transition-colors print:hidden"
    >
      <span aria-hidden="true">🍺</span>
      <span>Buy me a beer</span>
    </a>
  )
}
