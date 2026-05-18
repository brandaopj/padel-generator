export function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/brandaopj"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buy me a beer on Ko-fi"
      className="fixed bottom-4 left-4 z-[90] flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all print:hidden"
    >
      <span aria-hidden="true">🍺</span>
      Buy me a beer
    </a>
  )
}
