import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem('padel-theme') === 'dark' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('padel-theme', dark ? 'dark' : 'light') } catch { /* quota or restricted */ }
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}
