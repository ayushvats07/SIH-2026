import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, SkipForward, X } from 'lucide-react'
import { tourSteps } from '../data/help'

const STORAGE_KEY = 'ayush-tour-progress'

interface GuidedTourProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
  resumeFrom?: number
}

export default function GuidedTour({ open, onClose, onComplete, resumeFrom }: GuidedTourProps) {
  const [stepIdx, setStepIdx] = useState(resumeFrom ?? 0)
  const nextBtnRef = useRef<HTMLButtonElement>(null)

  const totalSteps = tourSteps.length
  const step = tourSteps[stepIdx]
  const isFirst = stepIdx === 0
  const isLast = stepIdx === totalSteps - 1

  // Reset to resumeFrom when opened
  useEffect(() => {
    if (open) {
      setStepIdx(resumeFrom ?? 0)
      setTimeout(() => nextBtnRef.current?.focus(), 100)
    }
  }, [open, resumeFrom])

  // Persist progress
  useEffect(() => {
    if (!open) return
    try {
      localStorage.setItem(STORAGE_KEY, String(stepIdx))
    } catch {
      // ignore
    }
  }, [stepIdx, open])

  const handleNext = useCallback(() => {
    if (isLast) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      onComplete()
    } else {
      setStepIdx((prev) => prev + 1)
    }
  }, [isLast, onComplete])

  const handlePrev = useCallback(() => {
    setStepIdx((prev) => Math.max(0, prev - 1))
  }, [])

  const handleSkip = useCallback(() => {
    // Persist current step so user can resume
    try {
      localStorage.setItem(STORAGE_KEY, String(stepIdx))
    } catch {
      // ignore
    }
    onClose()
  }, [stepIdx, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, handleNext, handlePrev, handleSkip])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-navy-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-navy-800 to-teal-600 px-5 py-4 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-teal-100">
              Step {stepIdx + 1} of {totalSteps}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip tour"
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-navy-100 dark:bg-navy-700">
          <div
            className="h-full bg-teal-500 transition-all duration-300 ease-out"
            style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 id="tour-title" className="text-lg font-bold text-navy-900 dark:text-navy-100 mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-navy-500 dark:text-navy-300 leading-relaxed">
            {step.body}
          </p>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {tourSteps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepIdx(i)}
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === stepIdx}
                className={`h-2 rounded-full transition-all ${
                  i === stepIdx ? 'w-6 bg-teal-500' : 'w-2 bg-navy-200 dark:bg-navy-600 hover:bg-navy-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-navy-100 dark:border-navy-700 px-5 py-4">
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-400 hover:text-navy-600 dark:hover:text-navy-200"
          >
            <SkipForward className="h-4 w-4" />
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isFirst}
              className="inline-flex items-center gap-1 rounded-lg border border-navy-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-3 py-2 text-sm font-medium text-navy-600 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <button
              type="button"
              ref={nextBtnRef}
              onClick={handleNext}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
            >
              {isLast ? 'Finish' : 'Next'}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility: check if tour was skipped and can be resumed
export function getTourResumeStep(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const idx = parseInt(raw, 10)
    if (isNaN(idx) || idx < 0 || idx >= tourSteps.length) return null
    return idx
  } catch {
    return null
  }
}
