export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface HelpCategory {
  id: string
  title: string
  description: string
  icon: string
  articleCount: number
}

export interface TourStep {
  id: string
  title: string
  body: string
  target: string
}

export interface KeyboardShortcut {
  keys: string[]
  description: string
}

export const helpCategories: HelpCategory[] = [
  {
    id: 'cat-1',
    title: 'Getting Started',
    description: 'Set up your practitioner profile and navigate the system',
    icon: 'rocket',
    articleCount: 6,
  },
  {
    id: 'cat-2',
    title: 'Patient Case-Taking',
    description: 'Record patient consultations, Prakriti assessments, and treatment plans',
    icon: 'clipboard',
    articleCount: 8,
  },
  {
    id: 'cat-3',
    title: 'Appointments',
    description: 'Schedule, reschedule, and manage patient appointments',
    icon: 'calendar',
    articleCount: 5,
  },
  {
    id: 'cat-4',
    title: 'Attachments & Records',
    description: 'Upload lab reports, photos, and manage patient documents',
    icon: 'paperclip',
    articleCount: 4,
  },
  {
    id: 'cat-5',
    title: 'Accessibility',
    description: 'Dark mode, font sizing, reduced motion, and language options',
    icon: 'accessibility',
    articleCount: 3,
  },
  {
    id: 'cat-6',
    title: 'Account & Security',
    description: 'Session management, data privacy, and logout procedures',
    icon: 'shield',
    articleCount: 5,
  },
]

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    category: 'Getting Started',
    question: 'How do I set up my practitioner profile?',
    answer: 'Navigate to the Profile page from the top navigation bar. Click the Edit button to enter edit mode, fill in your name, qualification, clinic details, working hours, and specializations, then click Save. Your profile will switch to Preview mode showing the final layout.',
  },
  {
    id: 'faq-2',
    category: 'Getting Started',
    question: 'What is Prakriti assessment and how is it used here?',
    answer: 'Prakriti refers to an individual\'s unique mind-body constitution in Ayurveda (Vata, Pitta, Kapha, or combinations). In this system, Prakriti is recorded during patient case-taking to guide personalized treatment and diet recommendations.',
  },
  {
    id: 'faq-3',
    category: 'Appointments',
    question: 'How do I book an appointment for a patient?',
    answer: 'Go to the Appointments page, select a date from the calendar strip, choose an available time slot, select a patient from the dropdown, enter the reason for visit, and click Book Appointment. A confirmation modal will appear to review the details before finalizing.',
  },
  {
    id: 'faq-4',
    category: 'Appointments',
    question: 'Can I reschedule or cancel an appointment?',
    answer: 'Yes. Each appointment in the Upcoming Appointments list has Reschedule and Cancel buttons. Reschedule pre-fills the booking form with the appointment details so you can pick a new date or time. Cancel removes it from the confirmed list.',
  },
  {
    id: 'faq-5',
    category: 'Attachments & Records',
    question: 'What file types are supported for upload?',
    answer: 'The Attachment Center accepts JPG, PNG, and PDF files up to 10 MB each. Unsupported file types will trigger a warning banner. You can drag and drop files or browse from your device.',
  },
  {
    id: 'faq-6',
    category: 'Attachments & Records',
    question: 'Can I add notes or tags to uploaded files?',
    answer: 'Yes. Once a file finishes uploading successfully, you can add tags (press Enter after typing each one) and a free-text note to describe the file\'s contents or relevance to the case.',
  },
  {
    id: 'faq-7',
    category: 'Accessibility',
    question: 'How do I enable dark mode or change the font size?',
    answer: 'Open the Settings page from the navigation bar. Under Appearance, toggle between Light and Dark themes, and choose Small, Medium, or Large font size. All changes are saved automatically and persist across sessions.',
  },
  {
    id: 'faq-8',
    category: 'Accessibility',
    question: 'What does the reduced motion setting do?',
    answer: 'Reduced motion disables all decorative animations and transitions across the app — such as toast slide-ins, progress bar animations, and hover transitions. This is useful for users sensitive to motion. The system also respects your OS-level reduced motion preference automatically.',
  },
  {
    id: 'faq-9',
    category: 'Account & Security',
    question: 'Are my settings and data stored anywhere?',
    answer: 'All data in this demo is stored locally in your browser. Settings are persisted via localStorage. No data is sent to any server. Clearing your browser data will reset everything.',
  },
  {
    id: 'faq-10',
    category: 'Getting Started',
    question: 'Is this system a substitute for medical diagnosis?',
    answer: 'No. This tool is designed to assist AYUSH practitioners with case-taking and record management. It does not replace professional medical diagnosis, clinical judgment, or in-person consultation. Always refer to standard medical guidelines.',
  },
]

export const tourSteps: TourStep[] = [
  {
    id: 'tour-1',
    title: 'Welcome to AYUSH Case-Taking',
    body: 'This guided tour will walk you through the key features of the system. You can skip at any time and resume later from the Help page.',
    target: 'nav',
  },
  {
    id: 'tour-2',
    title: 'Practitioner Profile',
    body: 'Set up and manage your professional details, clinic information, working hours, and specializations. Toggle between Edit and Preview modes to make changes.',
    target: 'profile',
  },
  {
    id: 'tour-3',
    title: 'Appointment Scheduling',
    body: 'Book, reschedule, and cancel patient appointments. Use the date strip to pick a day, select an available time slot, choose a patient, and confirm.',
    target: 'appointments',
  },
  {
    id: 'tour-4',
    title: 'Attachment Center',
    body: 'Upload patient records, lab reports, and case photos. Drag and drop files, add tags and notes, and retry failed uploads.',
    target: 'attachments',
  },
  {
    id: 'tour-5',
    title: 'Settings & Accessibility',
    body: 'Customize the theme, font size, contrast, motion, language, and notification preferences. All settings persist across sessions.',
    target: 'settings',
  },
  {
    id: 'tour-6',
    title: 'You\'re all set!',
    body: 'That covers the main features. You can restart this tour anytime from the Help page. If you have questions, check the FAQ or submit feedback below.',
    target: 'help',
  },
]

export const keyboardShortcuts: KeyboardShortcut[] = [
  { keys: ['Tab'], description: 'Move focus to the next interactive element' },
  { keys: ['Shift', 'Tab'], description: 'Move focus to the previous interactive element' },
  { keys: ['Enter'], description: 'Activate the focused button or link' },
  { keys: ['Space'], description: 'Toggle switches or activate buttons' },
  { keys: ['Esc'], description: 'Close modals, dialogs, or cancel edits' },
  { keys: ['?'], description: 'Open this keyboard shortcuts panel' },
  { keys: ['Ctrl', 'K'], description: 'Quick navigate (future feature)' },
]

export const DISCLAIMER_TEXT =
  'This AYUSH case-taking system is a digital assistant tool for qualified practitioners. It does not replace professional medical diagnosis, clinical examination, or the judgment of a licensed healthcare provider. All assessments and recommendations generated or recorded through this system should be validated against standard medical guidelines and the practitioner\'s own clinical expertise. In emergencies, contact your nearest emergency services immediately.'
