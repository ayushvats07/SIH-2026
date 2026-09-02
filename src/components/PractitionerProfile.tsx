import { useEffect, useRef, useState } from 'react'
import type { PractitionerProfile, WorkingHours } from '../data/practitioner'
import { mockPractitioner, emptyPractitioner, specializationSuggestions } from '../data/practitioner'
import {
  AlertIcon, AwardIcon, CheckIcon, ClockIcon, EditIcon, EyeIcon,
  GlobeIcon, MailIcon, MapPinIcon, PenIcon, PhoneIcon, PlusIcon, RefreshIcon,
  SaveIcon, StethoscopeIcon, UploadIcon, UserIcon, XIcon,
} from './icons'

type LoadState = 'loading' | 'success' | 'error' | 'empty'
type Mode = 'edit' | 'preview'

function formatTime(time: string): string {
  if (!time) return ''
  const [h, m] = time.split(':')
  const hour = parseInt(h, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${m} ${period}`
}

function getInitials(name: string): string {
  if (!name.trim()) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

interface AvatarProps {
  url: string | null
  name: string
  onUpload: (dataUrl: string) => void
  editable: boolean
}

function Avatar({ url, name, onUpload, editable }: AvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onUpload(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-navy-700 to-teal-600 flex items-center justify-center ring-4 ring-mint-200 ring-offset-2 ring-offset-navy-50">
          {url ? (
            <img src={url} alt={name || 'Practitioner avatar'} className="h-full w-full object-cover" />
          ) : (
            <span className="text-4xl font-semibold text-white tracking-wide">
              {getInitials(name)}
            </span>
          )}
        </div>
        {editable && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Upload profile photo"
            className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg hover:bg-teal-600 active:scale-95"
          >
            <UploadIcon width={18} height={18} />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      {editable && (
        <p className="text-xs text-navy-400">Click the upload icon to add a photo</p>
      )}
    </div>
  )
}

// ─── Signature ────────────────────────────────────────────────────────────────

interface SignatureProps {
  url: string | null
  onUpload: (dataUrl: string) => void
  editable: boolean
}

function Signature({ url, onUpload, editable }: SignatureProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onUpload(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
        <PenIcon width={16} height={16} />
        Digital Signature
      </label>
      <div className="rounded-xl border-2 border-dashed border-navy-200 bg-navy-50 p-4">
        {url ? (
          <div className="flex items-center justify-between gap-3">
            <img
              src={url}
              alt="Practitioner signature"
              className="max-h-20 object-contain bg-white rounded-lg px-3 py-2"
            />
            {editable && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="shrink-0 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Replace
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!editable}
            className="w-full flex flex-col items-center gap-2 py-4 text-navy-400 hover:text-teal-600 disabled:cursor-not-allowed disabled:hover:text-navy-400"
          >
            <PenIcon width={28} height={28} />
            <span className="text-sm">
              {editable ? 'Click to upload your signature image' : 'No signature uploaded'}
            </span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>
  )
}

// ─── Specialization Tags ──────────────────────────────────────────────────────

interface SpecializationTagsProps {
  tags: string[]
  onChange: (tags: string[]) => void
  editable: boolean
}

function SpecializationTags({ tags, onChange, editable }: SpecializationTagsProps) {
  const [input, setInput] = useState('')

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    onChange([...tags, trimmed])
    setInput('')
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  if (!editable) {
    if (tags.length === 0) {
      return <p className="text-sm text-navy-400 italic">No specializations listed</p>
    }
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 text-mint-800 px-3 py-1.5 text-sm font-medium border border-mint-200"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
            {tag}
          </span>
        ))}
      </div>
    )
  }

  const suggestions = specializationSuggestions.filter(
    (s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()) && input,
  )

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-500 text-white px-3 py-1.5 text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="hover:bg-teal-700 rounded-full p-0.5"
            >
              <XIcon width={14} height={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder="Type a specialization and press Enter"
          aria-label="Add specialization"
          className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-navy-200 bg-white shadow-lg max-h-40 overflow-auto">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => addTag(s)}
                  className="w-full text-left px-3 py-2 text-sm text-navy-700 hover:bg-mint-50"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Working Hours ────────────────────────────────────────────────────────────

interface WorkingHoursProps {
  hours: WorkingHours[]
  onChange: (hours: WorkingHours[]) => void
  editable: boolean
}

function WorkingHoursSection({ hours, onChange, editable }: WorkingHoursProps) {
  const toggleClosed = (idx: number) => {
    const updated = hours.map((h, i) =>
      i === idx ? { ...h, closed: !h.closed, open: !h.closed ? '' : h.open, close: !h.closed ? '' : h.close } : h,
    )
    onChange(updated)
  }

  const updateTime = (idx: number, field: 'open' | 'close', value: string) => {
    const updated = hours.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    onChange(updated)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-navy-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-50 text-navy-600 text-left">
            <th className="px-4 py-2.5 font-medium">Day</th>
            <th className="px-4 py-2.5 font-medium">Opening</th>
            <th className="px-4 py-2.5 font-medium">Closing</th>
            {editable && <th className="px-4 py-2.5 font-medium text-center">Status</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {hours.map((h, idx) => (
            <tr key={h.day} className="bg-white">
              <td className="px-4 py-2.5 font-medium text-navy-800">{h.day}</td>
              <td className="px-4 py-2.5">
                {editable ? (
                  <input
                    type="time"
                    value={h.open}
                    disabled={h.closed}
                    onChange={(e) => updateTime(idx, 'open', e.target.value)}
                    aria-label={`${h.day} opening time`}
                    className="rounded-md border border-navy-200 px-2 py-1 text-sm disabled:bg-navy-50 disabled:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-300"
                  />
                ) : h.closed ? (
                  <span className="text-navy-300">—</span>
                ) : (
                  formatTime(h.open)
                )}
              </td>
              <td className="px-4 py-2.5">
                {editable ? (
                  <input
                    type="time"
                    value={h.close}
                    disabled={h.closed}
                    onChange={(e) => updateTime(idx, 'close', e.target.value)}
                    aria-label={`${h.day} closing time`}
                    className="rounded-md border border-navy-200 px-2 py-1 text-sm disabled:bg-navy-50 disabled:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-300"
                  />
                ) : h.closed ? (
                  <span className="text-navy-300">—</span>
                ) : (
                  formatTime(h.close)
                )}
              </td>
              {editable && (
                <td className="px-4 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => toggleClosed(idx)}
                    aria-pressed={h.closed}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      h.closed
                        ? 'bg-error-bg text-error hover:bg-red-100'
                        : 'bg-success-bg text-success hover:bg-teal-100'
                    }`}
                  >
                    {h.closed ? 'Closed' : 'Open'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Field helpers ────────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  value: string
  onChange?: (value: string) => void
  editable: boolean
  type?: string
  placeholder?: string
  icon?: React.ReactNode
  multiline?: boolean
}

function Field({ label, value, onChange, editable, type = 'text', placeholder, icon, multiline }: FieldProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-1.5">
        {icon}
        {label}
      </label>
      {editable ? (
        multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 resize-y"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
        )
      ) : (
        <p className={`text-sm ${value ? 'text-navy-900' : 'text-navy-300 italic'}`}>
          {value || `No ${label.toLowerCase()} provided`}
        </p>
      )}
    </div>
  )
}

// ─── State components ─────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="animate-pulse space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-32 w-32 rounded-full bg-navy-200" />
          <div className="h-7 w-56 rounded-lg bg-navy-200" />
          <div className="h-4 w-72 rounded-lg bg-navy-100" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-navy-100" />
          ))}
        </div>
        <div className="h-40 rounded-xl bg-navy-100" />
      </div>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-full bg-error-bg flex items-center justify-center">
          <AlertIcon width={32} height={32} className="text-error" />
        </div>
        <h2 className="text-xl font-semibold text-navy-900">Something went wrong</h2>
        <p className="text-sm text-navy-400 max-w-sm">
          We couldn't load the practitioner profile. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
        >
          <RefreshIcon width={16} height={16} />
          Try again
        </button>
      </div>
    </div>
  )
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-16 w-16 rounded-full bg-mint-100 flex items-center justify-center">
          <UserIcon width={32} height={32} className="text-mint-600" />
        </div>
        <h2 className="text-xl font-semibold text-navy-900">No profile created yet</h2>
        <p className="text-sm text-navy-400 max-w-sm">
          Set up your practitioner profile to start managing patient case records in the AYUSH system.
        </p>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
        >
          <PlusIcon width={16} height={16} />
          Create profile
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PractitionerProfilePage() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [mode, setMode] = useState<Mode>('preview')
  const [profile, setProfile] = useState<PractitionerProfile>(mockPractitioner)
  const [draft, setDraft] = useState<PractitionerProfile>(mockPractitioner)
  const [toast, setToast] = useState<string | null>(null)

  // Simulate async fetch
  useEffect(() => {
    setLoadState('loading')
    const timer = setTimeout(() => {
      setLoadState('success')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = () => {
    setProfile(draft)
    setMode('preview')
    showToast('Profile saved successfully')
  }

  const handleCancel = () => {
    setDraft(profile)
    setMode('preview')
  }

  const handleCreate = () => {
    setDraft(emptyPractitioner)
    setProfile(emptyPractitioner)
    setLoadState('success')
    setMode('edit')
  }

  const updateDraft = (field: keyof PractitionerProfile, value: unknown) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const updateWorkingHours = (hours: WorkingHours[]) => {
    setDraft((prev) => ({ ...prev, workingHours: hours }))
  }

  const updateSpecializations = (tags: string[]) => {
    setDraft((prev) => ({ ...prev, specializations: tags }))
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todayHours = profile.workingHours.find((h) => h.day === today)
  const isOpenToday = todayHours ? !todayHours.closed : false

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (loadState === 'loading') return <LoadingState />
  if (loadState === 'error') return <ErrorState onRetry={() => setLoadState('success')} />
  if (loadState === 'empty' && mode === 'preview') return <EmptyState onCreate={handleCreate} />

  const data = mode === 'edit' ? draft : profile

  return (
    <div className="min-h-screen bg-navy-50">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Mode toggle */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-900">Practitioner Profile</h1>
          <div className="flex items-center rounded-lg bg-navy-100 p-1" role="group" aria-label="Profile mode">
            <button
              type="button"
              onClick={() => setMode('edit')}
              aria-pressed={mode === 'edit'}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                mode === 'edit' ? 'bg-teal-500 text-white shadow' : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              <EditIcon width={15} height={15} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              aria-pressed={mode === 'preview'}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                mode === 'preview' ? 'bg-teal-500 text-white shadow' : 'text-navy-500 hover:text-navy-800'
              }`}
            >
              <EyeIcon width={15} height={15} />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
        {/* Status banner */}
        {mode === 'preview' && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
              isOpenToday ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOpenToday ? 'bg-success animate-pulse' : 'bg-warning'}`} />
            {isOpenToday
              ? `Open today · ${formatTime(todayHours?.open ?? '')} – ${formatTime(todayHours?.close ?? '')}`
              : 'Closed today'}
          </div>
        )}

        {/* Edit mode banner */}
        {mode === 'edit' && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-lg bg-mint-50 border border-mint-200 px-4 py-3">
            <p className="text-sm text-mint-800 font-medium flex items-center gap-2">
              <EditIcon width={16} height={16} />
              Editing profile — changes apply when you save
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
              >
                <SaveIcon width={15} height={15} />
                Save
              </button>
            </div>
          </div>
        )}

        {/* Profile card */}
        <div className="rounded-2xl bg-white shadow-sm border border-navy-100 overflow-hidden">
          {/* Banner strip */}
          <div className="h-24 bg-gradient-to-r from-navy-800 via-navy-700 to-teal-600" />

          <div className="px-6 pb-6 -mt-16 sm:px-8">
            {/* Avatar + name */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
              <Avatar
                url={data.avatarUrl}
                name={data.name}
                onUpload={(url) => updateDraft('avatarUrl', url)}
                editable={mode === 'edit'}
              />
              <div className="flex-1 text-center sm:text-left pb-2">
                {mode === 'edit' ? (
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateDraft('name', e.target.value)}
                    placeholder="Practitioner name"
                    aria-label="Practitioner name"
                    className="w-full text-2xl font-bold text-navy-900 bg-transparent border-b-2 border-navy-200 focus:border-teal-500 focus:outline-none pb-1"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-navy-900">{data.name || 'Unnamed Practitioner'}</h2>
                )}
                {data.qualification && (
                  <p className="mt-1 text-sm font-medium text-teal-600 flex items-center justify-center sm:justify-start gap-1.5">
                    <AwardIcon width={15} height={15} />
                    {data.qualification}
                  </p>
                )}
                {data.registrationNumber && (
                  <p className="mt-0.5 text-xs text-navy-400">Reg. No: {data.registrationNumber}</p>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-navy-50 px-3 py-3 text-center">
                <p className="text-2xl font-bold text-navy-800">{data.yearsOfExperience}</p>
                <p className="text-xs text-navy-400 mt-0.5">Years Experience</p>
              </div>
              <div className="rounded-xl bg-navy-50 px-3 py-3 text-center">
                <p className="text-2xl font-bold text-navy-800">{data.specializations.length}</p>
                <p className="text-xs text-navy-400 mt-0.5">Specializations</p>
              </div>
              <div className="rounded-xl bg-navy-50 px-3 py-3 text-center">
                <p className="text-2xl font-bold text-navy-800">{data.languages.length}</p>
                <p className="text-xs text-navy-400 mt-0.5">Languages</p>
              </div>
              <div className="rounded-xl bg-navy-50 px-3 py-3 text-center">
                <p className="text-2xl font-bold text-navy-800">
                  {data.workingHours.filter((h) => !h.closed).length}
                </p>
                <p className="text-xs text-navy-400 mt-0.5">Working Days</p>
              </div>
            </div>

            {/* About */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-2">
                <UserIcon width={16} height={16} />
                About
              </h3>
              <Field
                label="About"
                value={data.about}
                onChange={(v) => updateDraft('about', v)}
                editable={mode === 'edit'}
                multiline
                placeholder="Brief professional summary..."
              />
            </div>

            {/* Contact & clinic info */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Qualification"
                value={data.qualification}
                onChange={(v) => updateDraft('qualification', v)}
                editable={mode === 'edit'}
                icon={<AwardIcon width={15} height={15} />}
                placeholder="e.g. BAMS, MD (Ayurveda)"
              />
              <Field
                label="Registration Number"
                value={data.registrationNumber}
                onChange={(v) => updateDraft('registrationNumber', v)}
                editable={mode === 'edit'}
                placeholder="CCIM registration number"
              />
              <Field
                label="Clinic Name"
                value={data.clinicName}
                onChange={(v) => updateDraft('clinicName', v)}
                editable={mode === 'edit'}
                icon={<StethoscopeIcon width={15} height={15} />}
                placeholder="Clinic or hospital name"
              />
              <Field
                label="Years of Experience"
                type="number"
                value={String(data.yearsOfExperience)}
                onChange={(v) => updateDraft('yearsOfExperience', parseInt(v, 10) || 0)}
                editable={mode === 'edit'}
                placeholder="0"
              />
              <Field
                label="Clinic Address"
                value={data.clinicAddress}
                onChange={(v) => updateDraft('clinicAddress', v)}
                editable={mode === 'edit'}
                icon={<MapPinIcon width={15} height={15} />}
                multiline
                placeholder="Street address"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="City"
                  value={data.city}
                  onChange={(v) => updateDraft('city', v)}
                  editable={mode === 'edit'}
                  placeholder="City"
                />
                <Field
                  label="PIN Code"
                  value={data.pincode}
                  onChange={(v) => updateDraft('pincode', v)}
                  editable={mode === 'edit'}
                  placeholder="PIN"
                />
              </div>
              <Field
                label="State"
                value={data.state}
                onChange={(v) => updateDraft('state', v)}
                editable={mode === 'edit'}
                placeholder="State"
              />
              <Field
                label="Phone"
                type="tel"
                value={data.phone}
                onChange={(v) => updateDraft('phone', v)}
                editable={mode === 'edit'}
                icon={<PhoneIcon width={15} height={15} />}
                placeholder="Contact number"
              />
              <Field
                label="Email"
                type="email"
                value={data.email}
                onChange={(v) => updateDraft('email', v)}
                editable={mode === 'edit'}
                icon={<MailIcon width={15} height={15} />}
                placeholder="email@example.com"
              />
              <Field
                label="Languages Spoken"
                value={data.languages.join(', ')}
                onChange={(v) => updateDraft('languages', v.split(',').map((s) => s.trim()).filter(Boolean))}
                editable={mode === 'edit'}
                icon={<GlobeIcon width={15} height={15} />}
                placeholder="Comma-separated list"
              />
            </div>

            {/* Specializations */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-2">
                <AwardIcon width={16} height={16} />
                Specializations
              </h3>
              <SpecializationTags
                tags={data.specializations}
                onChange={updateSpecializations}
                editable={mode === 'edit'}
              />
            </div>

            {/* Working hours */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-2">
                <ClockIcon width={16} height={16} />
                Working Hours
              </h3>
              <WorkingHoursSection
                hours={data.workingHours}
                onChange={updateWorkingHours}
                editable={mode === 'edit'}
              />
            </div>

            {/* Signature */}
            <div className="mt-6">
              <Signature
                url={data.signatureUrl}
                onUpload={(url) => updateDraft('signatureUrl', url)}
                editable={mode === 'edit'}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-navy-300">
          AYUSH Case-Taking System · Practitioner Profile
        </p>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div className="flex items-center gap-2 rounded-xl bg-navy-900 px-4 py-3 text-sm text-white shadow-lg">
            <CheckIcon width={18} height={18} className="text-mint-400" />
            {toast}
          </div>
        </div>
      )}
    </div>
  )
}
