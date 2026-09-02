import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle, AlertTriangle, CalendarDays, ChevronDown, ClipboardList,
  FileText, Keyboard, LifeBuoy, Loader2, MessageSquare, Paperclip, Play,
  RefreshCw, Rocket, Send, Shield, ShieldCheck, Sparkles,
} from 'lucide-react'
import {
  type FAQ, DISCLAIMER_TEXT, faqs, helpCategories, keyboardShortcuts, tourSteps,
} from '../data/help'
import GuidedTour, { getTourResumeStep } from './GuidedTour'

type LoadState = 'loading' | 'success' | 'error'
type FeedbackStatus = 'idle' | 'submitting' | 'success' | 'error'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  rocket: Rocket,
  clipboard: ClipboardList,
  calendar: CalendarDays,
  paperclip: Paperclip,
  accessibility: ShieldCheck,
  shield: Shield,
}

export default function HelpGuidedTour() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaqIds, setOpenFaqIds] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourResumeFrom, setTourResumeFrom] = useState<number | undefined>(undefined)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'question'>('suggestion')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle')

  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoadState('success'), 700)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard shortcut: ? opens shortcuts panel
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '?' && !showShortcuts) {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
        e.preventDefault()
        setShowShortcuts(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showShortcuts])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 2800)
  }

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStartTour = () => {
    setTourResumeFrom(undefined)
    setTourOpen(true)
  }

  const handleResumeTour = () => {
    const resumeStep = getTourResumeStep()
    setTourResumeFrom(resumeStep ?? 0)
    setTourOpen(true)
  }

  const handleTourComplete = () => {
    setTourOpen(false)
    showToast('Guided tour complete!')
  }

  const handleTourClose = () => {
    setTourOpen(false)
    showToast('Tour skipped — resume anytime from here', 'success')
  }

  const handleFeedbackSubmit = () => {
    if (!feedbackMessage.trim()) return
    setFeedbackStatus('submitting')
    setTimeout(() => {
      const success = Math.random() > 0.1
      if (success) {
        setFeedbackStatus('success')
        setFeedbackMessage('')
        setFeedbackEmail('')
        showToast('Feedback submitted. Thank you!')
        setTimeout(() => setFeedbackStatus('idle'), 2000)
      } else {
        setFeedbackStatus('error')
        showToast('Submission failed — please try again', 'error')
      }
    }, 1000)
  }

  // Filter FAQs by search and category
  const filteredFaqs = useMemo(() => {
    let result = faqs
    if (activeCategory) {
      result = result.filter((f) => f.category === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
      )
    }
    return result
  }, [activeCategory, searchQuery])

  const canResumeTour = getTourResumeStep() !== null

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-sm text-navy-400">Loading help center...</p>
        </div>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (loadState === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-16 w-16 rounded-full bg-error-bg flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-navy-900 dark:text-navy-100">Something went wrong</h2>
          <p className="text-sm text-navy-400">We couldn't load the help center. Please try again.</p>
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
    <div className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900 dark:text-navy-100">Help & Guided Tour</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Find answers, take a tour, and send feedback
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStartTour}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
          >
            <Play className="h-4 w-4" />
            Start tour
          </button>
          {canResumeTour && (
            <button
              type="button"
              onClick={handleResumeTour}
              className="inline-flex items-center gap-2 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-4 py-2 text-sm font-medium text-navy-600 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700"
            >
              <RefreshCw className="h-4 w-4" />
              Resume tour
            </button>
          )}
        </div>
      </div>

      {/* Guided tour banner */}
      <section className="rounded-2xl bg-gradient-to-r from-navy-800 to-teal-600 p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">New here? Take the guided tour</h2>
            <p className="text-sm text-navy-100 mt-1">
              A quick {tourSteps.length}-step walkthrough of the key features. You can skip and resume anytime.
            </p>
            <button
              type="button"
              onClick={handleStartTour}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 active:scale-95"
            >
              <Play className="h-4 w-4" />
              Start guided tour
            </button>
          </div>
        </div>
      </section>

      {/* Help categories */}
      <section>
        <h2 className="text-base font-semibold text-navy-900 dark:text-navy-100 mb-3 flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-teal-500" />
          Help Categories
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] ?? FileText
            const isActive = activeCategory === cat.title
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(isActive ? null : cat.title)}
                aria-pressed={isActive}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-teal-500 bg-mint-50 dark:bg-navy-800'
                    : 'border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-900 hover:border-teal-400 hover:shadow-sm'
                }`}
              >
                <div className={`h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-teal-500 text-white' : 'bg-navy-50 dark:bg-navy-800 text-teal-500'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-100">{cat.title}</p>
                  <p className="text-xs text-navy-400 mt-0.5 leading-relaxed">{cat.description}</p>
                  <p className="text-xs text-navy-300 mt-1">{cat.articleCount} articles</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* FAQ accordion */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-base font-semibold text-navy-900 dark:text-navy-100 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-teal-500" />
            Frequently Asked Questions
          </h2>
          <div className="relative sm:w-64">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              aria-label="Search FAQs"
              className="w-full rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2 text-sm text-navy-900 dark:text-navy-100 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </div>
        </div>

        {activeCategory && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-navy-400">Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 text-mint-800 px-3 py-1 text-xs font-medium">
              {activeCategory}
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                aria-label="Clear category filter"
                className="hover:bg-mint-200 rounded-full p-0.5"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {filteredFaqs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center rounded-xl border border-navy-100 dark:border-navy-700">
            <MessageSquare className="h-8 w-8 text-navy-200" />
            <p className="text-sm text-navy-400">No FAQs match your search. Try a different query.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq: FAQ) => {
              const isOpen = openFaqIds.has(faq.id)
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-900 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${faq.id}`}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-navy-50 dark:hover:bg-navy-800"
                  >
                    <span className="text-sm font-medium text-navy-900 dark:text-navy-100">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-navy-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-content-${faq.id}`}
                      className="px-4 pb-4 pt-0"
                    >
                      <p className="text-sm text-navy-500 dark:text-navy-300 leading-relaxed">
                        {faq.answer}
                      </p>
                      <span className="mt-2 inline-block text-xs text-navy-300">
                        Category: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Keyboard shortcuts + Feedback (two-column on desktop) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Keyboard shortcuts */}
        <section className="rounded-2xl bg-white dark:bg-navy-900 shadow-sm border border-navy-100 dark:border-navy-700 overflow-hidden">
          <div className="border-b border-navy-100 dark:border-navy-700 px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-900 dark:text-navy-100 flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-teal-500" />
              Keyboard Shortcuts
            </h2>
            <button
              type="button"
              onClick={() => setShowShortcuts((prev) => !prev)}
              aria-expanded={showShortcuts}
              className="text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              {showShortcuts ? 'Hide' : 'Show all'}
            </button>
          </div>
          <div className="p-5">
            {showShortcuts ? (
              <ul className="space-y-2.5">
                {keyboardShortcuts.map((sc, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-navy-500 dark:text-navy-300">{sc.description}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {sc.keys.map((key, j) => (
                        <span key={j}>
                          {j > 0 && <span className="text-navy-300 text-xs mx-0.5">+</span>}
                          <kbd className="inline-block rounded-md border border-navy-200 dark:border-navy-600 bg-navy-50 dark:bg-navy-800 px-2 py-1 text-xs font-medium text-navy-700 dark:text-navy-200">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-navy-400">
                Press <kbd className="inline-block rounded-md border border-navy-200 dark:border-navy-600 bg-navy-50 dark:bg-navy-800 px-2 py-0.5 text-xs font-medium text-navy-700 dark:text-navy-200">?</kbd> anywhere to view shortcuts, or click "Show all".
              </p>
            )}
          </div>
        </section>

        {/* Feedback form */}
        <section className="rounded-2xl bg-white dark:bg-navy-900 shadow-sm border border-navy-100 dark:border-navy-700 overflow-hidden">
          <div className="border-b border-navy-100 dark:border-navy-700 px-5 py-4">
            <h2 className="text-base font-semibold text-navy-900 dark:text-navy-100 flex items-center gap-2">
              <Send className="h-5 w-5 text-teal-500" />
              Send Feedback
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Feedback type */}
            <div>
              <label className="text-sm font-medium text-navy-700 dark:text-navy-200 mb-2 block">
                Type
              </label>
              <div className="flex gap-2">
                {(['bug', 'suggestion', 'question'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFeedbackType(type)}
                    aria-pressed={feedbackType === type}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-all ${
                      feedbackType === type
                        ? 'border-teal-500 bg-teal-500 text-white'
                        : 'border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-600 dark:text-navy-200 hover:border-teal-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="feedback-message" className="text-sm font-medium text-navy-700 dark:text-navy-200 mb-1.5 block">
                Message
              </label>
              <textarea
                id="feedback-message"
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                rows={4}
                placeholder={`Describe your ${feedbackType}...`}
                className="w-full rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm text-navy-900 dark:text-navy-100 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 resize-y"
              />
            </div>

            {/* Email (optional) */}
            <div>
              <label htmlFor="feedback-email" className="text-sm font-medium text-navy-700 dark:text-navy-200 mb-1.5 block">
                Email <span className="text-navy-400 font-normal">(optional)</span>
              </label>
              <input
                id="feedback-email"
                type="email"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm text-navy-900 dark:text-navy-100 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </div>

            {/* Submit / status */}
            {feedbackStatus === 'success' ? (
              <div className="flex items-center gap-2 rounded-lg bg-success-bg px-4 py-3 text-sm font-medium text-success">
                <ShieldCheck className="h-5 w-5" />
                Feedback sent. Thank you!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleFeedbackSubmit}
                disabled={!feedbackMessage.trim() || feedbackStatus === 'submitting'}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-500"
              >
                {feedbackStatus === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : feedbackStatus === 'error' ? (
                  <>
                    <AlertCircle className="h-4 w-4" />
                    Failed — tap to retry
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit feedback
                  </>
                )}
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Safety / disclaimer */}
      <section className="rounded-2xl border-2 border-warning/30 bg-warning-bg p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-warning/20 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-navy-900 dark:text-navy-100">
              Medical Disclaimer
            </h2>
            <p className="text-sm text-navy-600 dark:text-navy-300 mt-1.5 leading-relaxed">
              {DISCLAIMER_TEXT}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <p className="text-center text-xs text-navy-300 dark:text-navy-500 pb-4">
        AYUSH Case-Taking System · Help & Support
      </p>

      {/* Guided tour overlay */}
      <GuidedTour
        open={tourOpen}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
        resumeFrom={tourResumeFrom}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === 'success' ? 'bg-navy-900 dark:bg-navy-700' : 'bg-error'
            }`}
          >
            {toast.type === 'success' ? (
              <ShieldCheck className="h-5 w-5 text-mint-400" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  )
}
