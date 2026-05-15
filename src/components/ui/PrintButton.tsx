export function PrintButton() {
  return (
    <button
      data-testid="print-button"
      onClick={() => window.print()}
      className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-md text-sm hover:bg-gray-700 dark:hover:bg-gray-300 print:hidden transition-colors"
    >
      Imprimir
    </button>
  )
}
