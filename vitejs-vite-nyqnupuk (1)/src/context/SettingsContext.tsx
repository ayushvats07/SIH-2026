import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'
export type FontSize = 'small' | 'medium' | 'large'
export type Language = 'English' | 'Hindi' | 'Kannada' | 'Tamil' | 'Telugu' | 'Bengali' | 'Marathi' | 'Gujarati'

export interface NotificationPrefs {
  emailNotifications: boolean
  smsAlerts: boolean
  appointmentReminders: boolean
  caseUpdates: boolean
  marketingTips: boolean
}

export interface Settings {
  theme: Theme
  fontSize: FontSize
  highContrast: boolean
  reducedMotion: boolean
  language: Language
  notifications: NotificationPrefs
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  language: 'English',
  notifications: {
    emailNotifications: true,
    smsAlerts: false,
    appointmentReminders: true,
    caseUpdates: true,
    marketingTips: false,
  },
}

const STORAGE_KEY = 'ayush-settings'

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

interface SettingsContextValue {
  settings: Settings
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  updateNotification: (key: keyof NotificationPrefs, value: boolean) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings)

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // ignore write failures
    }
  }, [settings])

  // Apply theme (dark mode) to <html>
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.theme])

  // Apply font-size to <html>
  useEffect(() => {
    const root = document.documentElement
    root.dataset.fontSize = settings.fontSize
  }, [settings.fontSize])

  // Apply high-contrast
  useEffect(() => {
    const root = document.documentElement
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
  }, [settings.highContrast])

  // Apply reduced-motion
  useEffect(() => {
    const root = document.documentElement
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
  }, [settings.reducedMotion])

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateNotification = useCallback((key: keyof NotificationPrefs, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, updateNotification, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
