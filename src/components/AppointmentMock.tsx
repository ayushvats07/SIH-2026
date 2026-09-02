import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight,
  Clock, Loader2, RefreshCw, Stethoscope, User, Users, X,
} from 'lucide-react'
import {
  type Appointment, type Patient, type TimeSlot,
  formatDateDisplay, formatDateKey, formatTime, generateDateStrip, generateTimeSlots,
  mockExistingAppointments, mockPatients,
} from '../data/appointments'

type LoadState = 'loading' | 'success' | 'error'
type BookingResult = 'idle' | 'submitting' | 'success' | 'error'

const DATE_STRIP_LENGTH = 14
const DATE_STRIP_VISIBLE = 7

export default function AppointmentMock() {
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [patients] = useState<Patient[]>(mockPatients)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [dateStrip] = useState(generateDateStrip(DATE_STRIP_LENGTH))

  // Form state
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [reason, setReason] = useState('')

  // UI state
  const [stripOffset, setStripOffset] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [bookingResult, setBookingResult] = useState<BookingResult>('idle')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [reschedulingId, setReschedulingId] = useState<string | null>(null)

  const dateStripRef = useRef<HTMLDivElement>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const selectedDate = dateStrip[selectedDateIdx]?.date ?? new Date()
  const selectedDateKey = formatDateKey(selectedDate)

  // Simulate async fetch
  useEffect(() => {
    setLoadState('loading')
    const timer = setTimeout(() => {
      setSlots(generateTimeSlots())
      setAppointments(mockExistingAppointments)
      setLoadState('success')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  // Regenerate slots when date changes (deterministic per date)
  useEffect(() => {
    if (loadState !== 'success') return
    const seed = selectedDate.getDate() + selectedDate.getMonth() * 31
    const newSlots = generateTimeSlots().map((s, i) => ({
      ...s,
      available: (i * 7 + seed) % 5 !== 0,
    }))
    setSlots(newSlots)
    setSelectedSlot(null)
  }, [selectedDateIdx, loadState]) // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg: string, type: 'success' | 'error') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const isFormValid = selectedPatientId && selectedSlot && reason.trim()

  const handleOpenConfirm = () => {
    if (!isFormValid) return
    setShowConfirm(true)
    setTimeout(() => confirmBtnRef.current?.focus(), 50)
  }

  const handleConfirmBooking = () => {
    setBookingResult('submitting')
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() > 0.1
      if (success) {
        const patient = patients.find((p) => p.id === selectedPatientId)
        const newAppt: Appointment = {
          id: `a${Date.now()}`,
          patientId: selectedPatientId,
          patientName: patient?.name ?? 'Unknown',
          date: reschedulingId ? selectedDateKey : selectedDateKey,
          slot: selectedSlot!,
          reason: reason.trim(),
          status: 'confirmed',
        }
        if (reschedulingId) {
          setAppointments((prev) => prev.filter((a) => a.id !== reschedulingId).concat(newAppt))
          showToast('Appointment rescheduled successfully', 'success')
        } else {
          setAppointments((prev) => [...prev, newAppt])
          showToast('Appointment booked successfully', 'success')
        }
        setBookingResult('success')
        setShowConfirm(false)
        resetForm()
      } else {
        setBookingResult('error')
        showToast('Booking failed — please try again', 'error')
      }
    }, 1200)
  }

  const resetForm = () => {
    setSelectedSlot(null)
    setSelectedPatientId('')
    setReason('')
    setReschedulingId(null)
    setBookingResult('idle')
  }

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)),
    )
    showToast('Appointment cancelled', 'success')
  }

  const handleReschedule = (appt: Appointment) => {
    setReschedulingId(appt.id)
    setSelectedPatientId(appt.patientId)
    setReason(appt.reason)
    // Find the date in the strip
    const dateIdx = dateStrip.findIndex((d) => formatDateKey(d.date) === appt.date)
    if (dateIdx >= 0) {
      setSelectedDateIdx(dateIdx)
      setStripOffset(Math.max(0, dateIdx - 1))
    }
    setSelectedSlot(appt.slot)
    showToast('Select a new date or time to reschedule', 'success')
    dateStripRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const scrollStrip = (dir: 'left' | 'right') => {
    if (dir === 'left') {
      setStripOffset((prev) => Math.max(0, prev - 1))
    } else {
      setStripOffset((prev) => Math.min(DATE_STRIP_LENGTH - DATE_STRIP_VISIBLE, prev + 1))
    }
  }

  const visibleDates = dateStrip.slice(stripOffset, stripOffset + DATE_STRIP_VISIBLE)
  const todayKey = formatDateKey(new Date())
  const todaysAppointments = appointments.filter(
    (a) => a.date === todayKey && a.status === 'confirmed',
  )
  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loadState === 'loading') {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-sm text-navy-400">Loading appointments...</p>
        </div>
      </div>
    )
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (loadState === 'error') {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-16 w-16 rounded-full bg-error-bg flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-navy-900">Something went wrong</h2>
          <p className="text-sm text-navy-400">
            We couldn't load the appointment scheduler. Please try again.
          </p>
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
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-navy-200 bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <Stethoscope className="h-4 w-4" />
          </div>
          <h1 className="text-base font-semibold tracking-tight">AYUSH Appointments</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Today's summary */}
        <section className="rounded-2xl bg-gradient-to-r from-navy-800 to-teal-600 p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
          </div>
          {todaysAppointments.length === 0 ? (
            <p className="text-sm text-navy-100">No appointments scheduled for today.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {todaysAppointments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-medium">{formatTime(a.slot)}</span>
                  <span className="text-navy-100">·</span>
                  <span>{a.patientName}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Booking form */}
        <section className="rounded-2xl bg-white shadow-sm border border-navy-100 overflow-hidden">
          <div className="border-b border-navy-100 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-teal-500" />
              {reschedulingId ? 'Reschedule Appointment' : 'Book New Appointment'}
            </h2>
            {reschedulingId && (
              <p className="mt-1 text-sm text-mint-600 flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Rescheduling mode — select a new date and time
              </p>
            )}
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Date strip */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
                <CalendarDays className="h-4 w-4" />
                Select Date
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollStrip('left')}
                  disabled={stripOffset === 0}
                  aria-label="Previous dates"
                  className="shrink-0 rounded-lg border border-navy-200 bg-white p-2 text-navy-500 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div
                  ref={dateStripRef}
                  className="flex-1 overflow-x-auto scrollbar-hide"
                  role="radiogroup"
                  aria-label="Appointment date"
                >
                  <div className="flex gap-2 min-w-max">
                    {visibleDates.map (d => {
                      const globalIdx = stripOffset + visibleDates.indexOf(d)
                      const isSelected = globalIdx === selectedDateIdx
                      const isToday = formatDateKey(d.date) === todayKey
                      return (
                        <button
                          key={formatDateKey(d.date)}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedDateIdx(globalIdx)}
                          className={`flex flex-col items-center justify-center rounded-xl border px-3 py-2.5 min-w-[60px] transition-all ${
                            isSelected
                              ? 'bg-teal-500 border-teal-500 text-white shadow-md'
                              : 'bg-white border-navy-200 text-navy-700 hover:border-teal-400 hover:bg-mint-50'
                          }`}
                        >
                          <span className={`text-xs ${isSelected ? 'text-teal-100' : 'text-navy-400'}`}>
                            {d.dayName}
                          </span>
                          <span className="text-lg font-semibold">{d.label}</span>
                          {isToday && (
                            <span className={`mt-0.5 text-[10px] font-medium ${isSelected ? 'text-teal-100' : 'text-teal-500'}`}>
                              Today
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => scrollStrip('right')}
                  disabled={stripOffset >= DATE_STRIP_LENGTH - DATE_STRIP_VISIBLE}
                  aria-label="Next dates"
                  className="shrink-0 rounded-lg border border-navy-200 bg-white p-2 text-navy-500 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-navy-500">
                <span className="font-medium text-navy-700">{formatDateDisplay(selectedDate)}</span>
              </p>
            </div>

            {/* Time slots */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
                <Clock className="h-4 w-4" />
                Available Time Slots
              </label>
              {slots.filter((s) => s.available).length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CalendarDays className="h-8 w-8 text-navy-200" />
                  <p className="text-sm text-navy-400">No slots available on this date. Please try another day.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      aria-pressed={selectedSlot === slot.time}
                      className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition-all ${
                        !slot.available
                          ? 'border-navy-100 bg-navy-50 text-navy-300 cursor-not-allowed line-through'
                          : selectedSlot === slot.time
                            ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
                            : 'border-navy-200 bg-white text-navy-700 hover:border-teal-400 hover:bg-mint-50'
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Patient select */}
            <div>
              <label htmlFor="patient-select" className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
                <Users className="h-4 w-4" />
                Select Patient
              </label>
              <div className="relative">
                <select
                  id="patient-select"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-navy-200 bg-white px-3 py-2.5 pr-10 text-sm text-navy-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.age}y · {p.gender} · {p.prakriti}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-navy-400" />
              </div>
              {selectedPatient && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-mint-50 px-3 py-2 text-sm text-mint-800">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{selectedPatient.name}</span>
                  <span className="text-mint-600">·</span>
                  <span>Prakriti: {selectedPatient.prakriti}</span>
                  {selectedPatient.lastVisit && (
                    <>
                      <span className="text-mint-600">·</span>
                      <span>Last visit: {selectedPatient.lastVisit}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Reason for visit */}
            <div>
              <label htmlFor="reason" className="flex items-center gap-2 text-sm font-medium text-navy-700 mb-2">
                <Stethoscope className="h-4 w-4" />
                Reason for Visit
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Describe the patient's chief complaint or reason for consultation..."
                className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-sm font-medium text-navy-600 hover:bg-navy-50"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleOpenConfirm}
                disabled={!isFormValid}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-500"
              >
                <CalendarDays className="h-4 w-4" />
                {reschedulingId ? 'Confirm Reschedule' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </section>

        {/* Existing appointments */}
        <section className="rounded-2xl bg-white shadow-sm border border-navy-100 overflow-hidden">
          <div className="border-b border-navy-100 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold text-navy-900 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-teal-500" />
              Upcoming Appointments
            </h2>
          </div>
          <div className="p-5 sm:p-6">
            {appointments.filter((a) => a.status === 'confirmed').length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <CalendarDays className="h-8 w-8 text-navy-200" />
                <p className="text-sm text-navy-400">No upcoming appointments. Book one above to get started.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {appointments
                  .filter((a) => a.status === 'confirmed')
                  .map((appt) => {
                    const patient = patients.find((p) => p.id === appt.patientId)
                    return (
                      <li
                        key={appt.id}
                        className="flex flex-col gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                            {appt.patientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-navy-900">{appt.patientName}</p>
                            <p className="text-sm text-navy-500 flex items-center gap-1.5 mt-0.5">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDateDisplay(new Date(appt.date))} · {formatTime(appt.slot)}
                            </p>
                            <p className="text-sm text-navy-400 mt-0.5">{appt.reason}</p>
                            {patient && (
                              <p className="text-xs text-navy-400 mt-0.5">
                                {patient.age}y · {patient.gender} · {patient.prakriti}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 sm:shrink-0">
                          <button
                            type="button"
                            onClick={() => handleReschedule(appt)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-600 hover:bg-mint-50 hover:border-teal-400"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-bg px-3 py-1.5 text-sm font-medium text-error hover:bg-red-100"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </div>
                      </li>
                    )
                  })}
              </ul>
            )}
          </div>
        </section>
      </main>

      {/* Confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4 backdrop-blur-sm"
          onClick={() => bookingResult !== 'submitting' && setShowConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-navy-100 px-5 py-4 flex items-center justify-between">
              <h3 id="confirm-title" className="text-lg font-semibold text-navy-900">
                Confirm Appointment
              </h3>
              {bookingResult !== 'submitting' && (
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  aria-label="Close dialog"
                  className="rounded-lg p-1 text-navy-400 hover:bg-navy-50 hover:text-navy-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="p-5 space-y-4">
              {bookingResult === 'error' ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="h-12 w-12 rounded-full bg-error-bg flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-error" />
                  </div>
                  <p className="text-sm text-navy-600">
                    Booking failed. The selected slot may no longer be available.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingResult('idle')}
                    className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
                  >
                    Try again
                  </button>
                </div>
              ) : bookingResult === 'submitting' ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                  <p className="text-sm text-navy-500">Booking appointment...</p>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-navy-50 p-3">
                      <User className="h-5 w-5 text-teal-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-navy-400">Patient</p>
                        <p className="text-sm font-medium text-navy-900">{selectedPatient?.name}</p>
                        {selectedPatient && (
                          <p className="text-xs text-navy-400">
                            {selectedPatient.age}y · {selectedPatient.gender} · {selectedPatient.prakriti}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-navy-50 p-3">
                      <CalendarDays className="h-5 w-5 text-teal-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-navy-400">Date & Time</p>
                        <p className="text-sm font-medium text-navy-900">
                          {formatDateDisplay(selectedDate)} · {selectedSlot && formatTime(selectedSlot)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-lg bg-navy-50 p-3">
                      <Stethoscope className="h-5 w-5 text-teal-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-navy-400">Reason</p>
                        <p className="text-sm text-navy-700">{reason.trim()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirm(false)}
                      className="rounded-lg border border-navy-200 bg-white px-4 py-2 text-sm font-medium text-navy-600 hover:bg-navy-50"
                    >
                      Go back
                    </button>
                    <button
                      type="button"
                      ref={confirmBtnRef}
                      onClick={handleConfirmBooking}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-2 text-sm font-medium text-white hover:bg-teal-600 active:scale-95"
                    >
                      <Check className="h-4 w-4" />
                      Confirm Booking
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === 'success' ? 'bg-navy-900' : 'bg-error'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-mint-400" />
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
