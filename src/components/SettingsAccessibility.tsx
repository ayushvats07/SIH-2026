import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle, Bell, Check, Contrast, Globe, LogOut, Moon, Palette,
  RefreshCw, RotateCcw, Settings2, Sun, Type, Zap,
} from 'lucide-react'
import { type FontSize, type Language, type Theme, useSettings } from '../context/SettingsContext'

type LoadState = 'loading' | 'success' | 'error'

const LANGUAGES: Language[] = [
  'English', 'Hindi', 'Kannada', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati',
]

const FONT_SIZES: { value: FontSize; label: string; sample: string }[] = [
  { value: 'small', label: 'Small', sample: 'A' },
  { value: 'medium', label: 'Medium', sample: 'A' },
  { value: 'large', label: 'Large', sample: 'A' },
]

const NOTIFICATION_FIELDS: { key: keyof import('../context/SettingsContext').NotificationPrefs; label: string; description: string }[] = [
  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive updates and alerts via email' },
  { key: 'smsAlerts', label: 'SMS Alerts', description: 'Get text messages for urgent updates' },
  { key: 'appointmentReminders', label: 'Appointment Reminders', description: 'Notifications before scheduled appointments' },
  { key: 'caseUpdates', label: 'Case Updates', description: 'Alerts when patient cases are updated' },
  { key: 'marketingTips', label: 'AYUSH Tips & Newsletter', description: 'Occasional wellness tips and system news' },
]

export default function SettingsAccessibility() {
  const { settings, updateSetting, updateNotification, resetSettings } = useSettings()
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)

  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const logoutBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoadState('success'), 700)
    return () => clearTimeout(timer)
  }, [])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  const handleReset = () => {
    resetSettings()
    showToast('Settings reset to defaults')
  }

  const handleLogout = () => {
    setLoggedOut(true)
    setShowLogoutConfirm(false)
    showToast('You have been logged out (demo)')
  }

  const handleLoginBack = () => {
    setLoggedOut(false)
    showToast('Signed back in (demo)')
  }

  if (loadState === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-sm text-navy-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-16 w-16 rounded-full bg-error-bg flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-navy-900 dark:text-navy-100">Something went wrong</h2>
          <p className="text-sm text-navy-400">We couldn't load your settings. Please try again.</p>
          <button
            type="button"
            onClick={() => setLoadState('success')}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-xl font-bold text-navy-900 dark:text-navy-100">Settings & Accessibility</h1>
        <p className="text-sm text-navy-400 mt-0.5">
          Customize appearance, motion, language, and notifications
        </p>
      </div>

      {loggedOut && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-navy-200 bg-white dark:bg-navy-900 dark:border-navy-700 p-8 text-center">
          <div className="h-14 w-14 rounded-full bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
            <LogOut className="h-7 w-7 text-navy-400" />
          </div>
          <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-100">You've been logged out</h2>
          <p className="text-sm text-navy-400 max-w-sm">
            This is a demo logout. Your settings are still saved on this device.
          </p>
          <button
            type="button"
            onClick={handleLoginBack}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
          >
            Sign back in
          </button>
        </div>
      )}

      {/* Appearance section */}
      <SettingsCard icon={<Palette className="h-5 w-5 text-teal-500" />} title="Appearance">
        {/* Theme toggle */}
        <SettingsRow
          icon={<Sun className="h-4 w-4 text-navy-400" />}
          label="Theme"
          description="Switch between light and dark mode"
        >
          <div className="flex items-center rounded-lg bg-navy-100 dark:bg-navy-800 p-1" role="group" aria-label="Theme">
            <button
              type="button"
              onClick={() => updateSetting('theme', 'light' as Theme)}
              aria-pressed={settings.theme === 'light'}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                settings.theme === 'light' ? 'bg-teal-500 text-white shadow' : 'text-navy-500 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Light</span>
            </button>
            <button
              type="button"
              onClick={() => updateSetting('theme', 'dark' as Theme)}
              aria-pressed={settings.theme === 'dark'}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                settings.theme === 'dark' ? 'bg-teal-500 text-white shadow' : 'text-navy-500 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span className="hidden sm:inline">Dark</span>
            </button>
          </div>
        </SettingsRow>

        {/* Font size */}
        <SettingsRow
          icon={<Type className="h-4 w-4 text-navy-400" />}
          label="Font Size"
          description="Adjust text size for readability"
        >
          <div className="flex items-center rounded-lg bg-navy-100 dark:bg-navy-800 p-1" role="group" aria-label="Font size">
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.value}
                type="button"
                onClick={() => updateSetting('fontSize', fs.value)}
                aria-pressed={settings.fontSize === fs.value}
                className={`flex items-center justify-center rounded-md px-3 py-1.5 font-medium transition-all ${
                  settings.fontSize === fs.value
                    ? 'bg-teal-500 text-white shadow'
                    : 'text-navy-500 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white'
                }`}
              >
                <span style={{ fontSize: fs.value === 'small' ? '12px' : fs.value === 'medium' ? '14px' : '16px' }}>
                  {fs.sample}
                </span>
                <span className="ml-1.5 text-xs hidden sm:inline">{fs.label}</span>
              </button>
            ))}
          </div>
        </SettingsRow>
      </SettingsCard>

      {/* Accessibility section */}
      <SettingsCard icon={<Contrast className="h-5 w-5 text-teal-500" />} title="Accessibility">
        <SettingsRow
          icon={<Contrast className="h-4 w-4 text-navy-400" />}
          label="High Contrast"
          description="Increase visual contrast for better readability"
        >
          <Toggle
            checked={settings.highContrast}
            onChange={(v) => updateSetting('highContrast', v)}
            label="High contrast"
          />
        </SettingsRow>

        <SettingsRow
          icon={<Zap className="h-4 w-4 text-navy-400" />}
          label="Reduced Motion"
          description="Disable decorative animations and transitions"
        >
          <Toggle
            checked={settings.reducedMotion}
            onChange={(v) => updateSetting('reducedMotion', v)}
            label="Reduced motion"
          />
        </SettingsRow>
      </SettingsCard>

      {/* Language section */}
      <SettingsCard icon={<Globe className="h-5 w-5 text-teal-500" />} title="Language">
        <SettingsRow
          icon={<Globe className="h-4 w-4 text-navy-400" />}
          label="Interface Language"
          description="Choose your preferred language (UI only)"
        >
          <div className="relative">
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value as Language)}
              aria-label="Interface language"
              className="appearance-none rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2 pr-9 text-sm font-medium text-navy-900 dark:text-navy-100 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 text-xs">▾</span>
          </div>
        </SettingsRow>
      </SettingsCard>

      {/* Notifications section */}
      <SettingsCard icon={<Bell className="h-5 w-5 text-teal-500" />} title="Notification Preferences">
        <div className="space-y-1">
          {NOTIFICATION_FIELDS.map((field) => (
            <SettingsRow
              key={field.key}
              icon={<Bell className="h-4 w-4 text-navy-400" />}
              label={field.label}
              description={field.description}
            >
              <Toggle
                checked={settings.notifications[field.key]}
                onChange={(v) => updateNotification(field.key, v)}
                label={field.label}
              />
            </SettingsRow>
          ))}
        </div>
      </SettingsCard>

      {/* Session section */}
      <SettingsCard icon={<Settings2 className="h-5 w-5 text-teal-500" />} title="Session & Account">
        <SettingsRow
          icon={<LogOut className="h-4 w-4 text-navy-400" />}
          label="Sign Out"
          description="Log out of your account (demo)"
        >
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            disabled={loggedOut}
            className="inline-flex items-center gap-2 rounded-lg border border-error/30 bg-error-bg px-4 py-2 text-sm font-medium text-error hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </SettingsRow>
        <SettingsRow
          icon={<RotateCcw className="h-4 w-4 text-navy-400" />}
          label="Reset All Settings"
          description="Restore all preferences to their defaults"
        >
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-4 py-2 text-sm font-medium text-navy-600 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </SettingsRow>
      </SettingsCard>

      {/* Footer */}
      <p className="text-center text-xs text-navy-300 dark:text-navy-500 pb-4">
        Settings are saved locally on this device and persist across sessions.
      </p>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowLogoutConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-navy-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-navy-100 dark:border-navy-700 px-5 py-4">
              <h3 id="logout-title" className="text-lg font-semibold text-navy-900 dark:text-navy-100">
                Confirm Logout
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-navy-500 dark:text-navy-300">
                Are you sure you want to sign out? Your settings will remain saved on this device.
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-4 py-2 text-sm font-medium text-navy-600 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  ref={logoutBtnRef}
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:bg-red-700 active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  Yes, log out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === 'success' ? 'bg-navy-900 dark:bg-navy-700' : 'bg-error'
            }`}
          >
            {toast.type === 'success' && <Check className="h-5 w-5 text-mint-400" />}
            {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

function SettingsCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white dark:bg-navy-900 shadow-sm border border-navy-100 dark:border-navy-700 overflow-hidden">
      <div className="border-b border-navy-100 dark:border-navy-700 px-5 py-4 flex items-center gap-2">
        {icon}
        <h2 className="text-base font-semibold text-navy-900 dark:text-navy-100">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  )
}

function SettingsRow({
  icon, label, description, children,
}: {
  icon: React.ReactNode
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-2">
      <div className="flex items-start gap-2.5 flex-1 min-w-0">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy-800 dark:text-navy-100">{label}</p>
          <p className="text-xs text-navy-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0 sm:ml-auto">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-teal-500' : 'bg-navy-200 dark:bg-navy-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
