"use client";

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize theme from localStorage on client side
    const stored = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
    if (stored && (stored === 'dark' || stored === 'light' || stored === 'system')) {
      setThemeState(stored)
    }
    setIsInitialized(true)
  }, [storageKey])

  useEffect(() => {
    if (!isInitialized) return

    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, isInitialized])

  const setTheme = (theme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, theme)
    }
    setThemeState(theme)
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
