"use client"

import * as React from "react"

type Theme = "dark" | "light" | "system"

interface CustomThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const CustomThemeContext = React.createContext<CustomThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = React.useContext(CustomThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a CustomThemeProvider")
  }
  return context
}

interface CustomThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
}

export function CustomThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
}: CustomThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey) as Theme | null
      if (stored) {
        setThemeState(stored)
      }
    }
  }, [storageKey])

  React.useEffect(() => {
    if (!mounted || typeof window === "undefined") return

    const root = document.documentElement
    const resolvedTheme = theme === "system" && enableSystem 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme

    if (attribute === "class") {
      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)
    } else {
      root.setAttribute(attribute, resolvedTheme)
    }
  }, [theme, attribute, enableSystem, mounted])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, newTheme)
    }
  }, [storageKey])

  const resolvedTheme = React.useMemo(() => {
    if (typeof window === "undefined") return "light"
    if (theme === "system" && enableSystem) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme as "dark" | "light"
  }, [theme, enableSystem])

  const value = React.useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme,
  }), [theme, setTheme, resolvedTheme])

  return (
    <CustomThemeContext.Provider value={value}>
      {children}
    </CustomThemeContext.Provider>
  )
}
