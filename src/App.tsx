import { useState } from 'react'
import { Stethoscope, CalendarDays, User, Paperclip, Settings2, LifeBuoy } from 'lucide-react'
import { SettingsProvider } from './context/SettingsContext'
import PractitionerProfilePage from './components/PractitionerProfile'
import AppointmentMock from './components/AppointmentMock'
import AttachmentCenter from './components/AttachmentCenter'
import SettingsAccessibility from './components/SettingsAccessibility'
import HelpGuidedTour from './components/HelpGuidedTour'

type Page = 'profile' | 'appointments' | 'attachments' | 'settings' | 'help'

function App() {
  const [page, setPage] = useState<Page>('appointments')

  return (
    <SettingsProvider>
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
        {/* Nav bar */}
        <nav className="sticky top-0 z-30 border-b border-navy-200 dark:border-navy-700 bg-navy-900 dark:bg-navy-950 text-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
                <Stethoscope className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight hidden sm:inline">AYUSH Case-Taking</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-navy-800 dark:bg-navy-800 p-1 ml-auto" role="group" aria-label="Page navigation">
              <button
                type="button"
                onClick={() => setPage('profile')}
                aria-pressed={page === 'profile'}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  page === 'profile' ? 'bg-teal-500 text-white shadow' : 'text-navy-200 hover:text-white'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setPage('appointments')}
                aria-pressed={page === 'appointments'}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  page === 'appointments' ? 'bg-teal-500 text-white shadow' : 'text-navy-200 hover:text-white'
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Appointments</span>
              </button>
              <button
                type="button"
                onClick={() => setPage('attachments')}
                aria-pressed={page === 'attachments'}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  page === 'attachments' ? 'bg-teal-500 text-white shadow' : 'text-navy-200 hover:text-white'
                }`}
              >
                <Paperclip className="h-4 w-4" />
                <span className="hidden sm:inline">Files</span>
              </button>
              <button
                type="button"
                onClick={() => setPage('settings')}
                aria-pressed={page === 'settings'}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  page === 'settings' ? 'bg-teal-500 text-white shadow' : 'text-navy-200 hover:text-white'
                }`}
              >
                <Settings2 className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                type="button"
                onClick={() => setPage('help')}
                aria-pressed={page === 'help'}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                  page === 'help' ? 'bg-teal-500 text-white shadow' : 'text-navy-200 hover:text-white'
                }`}
              >
                <LifeBuoy className="h-4 w-4" />
                <span className="hidden sm:inline">Help</span>
              </button>
            </div>
          </div>
        </nav>

        {page === 'profile' && <PractitionerProfilePage />}
        {page === 'appointments' && <AppointmentMock />}
        {page === 'attachments' && <AttachmentCenter />}
        {page === 'settings' && <SettingsAccessibility />}
        {page === 'help' && <HelpGuidedTour />}
      </div>
    </SettingsProvider>
  )
}

export default App
