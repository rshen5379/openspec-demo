import { useState, useEffect } from 'react'
import { themes } from './themes'

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme() {
  const saved = localStorage.getItem('ai-chat-theme')
  return saved ? saved : getSystemTheme()
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('ai-chat-theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!localStorage.getItem('ai-chat-theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const colors = themes[theme]

  return { theme, colors, toggle }
}
