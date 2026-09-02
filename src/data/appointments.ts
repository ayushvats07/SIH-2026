export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  prakriti: string
  lastVisit: string | null
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  slot: string
  reason: string
  status: 'confirmed' | 'cancelled'
}

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'Rajesh Iyer', age: 45, gender: 'Male', prakriti: 'Vata-Pitta', lastVisit: '2026-08-15' },
  { id: 'p2', name: 'Meera Nair', age: 32, gender: 'Female', prakriti: 'Pitta-Kapha', lastVisit: '2026-08-20' },
  { id: 'p3', name: 'Arjun Reddy', age: 28, gender: 'Male', prakriti: 'Vata', lastVisit: null },
  { id: 'p4', name: 'Lakshmi Pillai', age: 54, gender: 'Female', prakriti: 'Kapha', lastVisit: '2026-08-10' },
  { id: 'p5', name: 'Vikram Gowda', age: 38, gender: 'Male', prakriti: 'Pitta', lastVisit: '2026-08-22' },
  { id: 'p6', name: 'Saritha Hegde', age: 41, gender: 'Female', prakriti: 'Vata-Kapha', lastVisit: null },
  { id: 'p7', name: 'Nikhil Shetty', age: 23, gender: 'Male', prakriti: 'Pitta', lastVisit: '2026-08-18' },
]

export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const times = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
  ]
  // Deterministic pseudo-random availability based on index
  times.forEach((time, i) => {
    slots.push({ time, available: (i * 7 + 3) % 5 !== 0 })
  })
  return slots
}

export function generateDateStrip(daysAhead: number): { date: Date; label: string; dayName: string }[] {
  const dates: { date: Date; label: string; dayName: string }[] = []
  const today = new Date()
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({
      date: d,
      label: `${d.getDate()}`,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
    })
  }
  return dates
}

export function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = parseInt(h, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${m} ${period}`
}

export const mockExistingAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p2',
    patientName: 'Meera Nair',
    date: formatDateKey(new Date()),
    slot: '10:00',
    reason: 'Follow-up for digestive issues',
    status: 'confirmed',
  },
  {
    id: 'a2',
    patientId: 'p5',
    patientName: 'Vikram Gowda',
    date: formatDateKey(new Date()),
    slot: '15:30',
    reason: 'Panchakarma consultation',
    status: 'confirmed',
  },
]
