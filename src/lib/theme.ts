// ========================================
// THEME.TS - TypeScript Theme Tokens
// ========================================

// ... существующий код (cssVars, bgColors, textColors и т.д.) ...

/**
 * Типы для темы
 */
export type Theme = 'light' | 'dark'

/**
 * Получение текущей темы
 */
export function getTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored) return stored
  
  // Проверка системной темы
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

/**
 * Переключение темы
 */
export function setTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  localStorage.setItem('theme', theme)
}

/**
 * Инициализация темы при загрузке приложения
 */
export function initTheme(): () => void {
  // Убедимся, что код выполняется только в браузере
  if (typeof window === 'undefined') {
    return () => {}
  }
  
  const theme = getTheme()
  setTheme(theme)
  
  // Слушатель системной темы
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    // Если нет сохраненной темы в localStorage, следуем системной
    if (!localStorage.getItem('theme')) {
      const isDark = mediaQuery.matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}

/**
 * Тема с поддержкой "system"
 */
export type ExtendedTheme = Theme | 'system'

export function getExtendedTheme(): ExtendedTheme {
  return localStorage.getItem('theme') as ExtendedTheme || 'system'
}

export function setExtendedTheme(theme: ExtendedTheme): void {
  if (theme === 'system') {
    localStorage.removeItem('theme')
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }
  } else {
    setTheme(theme)
  }
}