export interface WorkingHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface PractitionerProfile {
  id: string;
  name: string;
  qualification: string;
  registrationNumber: string;
  clinicName: string;
  clinicAddress: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  workingHours: WorkingHours[];
  specializations: string[];
  yearsOfExperience: number;
  languages: string[];
  about: string;
  avatarUrl: string | null;
  signatureUrl: string | null;
}

export const mockPractitioner: PractitionerProfile = {
  id: 'pr-001',
  name: 'Dr. Ananya Sharma',
  qualification: 'BAMS, MD (Ayurveda)',
  registrationNumber: 'CCIM-AY-2018-4521',
  clinicName: 'Ayur Wellness Clinic',
  clinicAddress: '14, Heritage Lane, Green Park Colony',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560016',
  phone: '+91 80 4567 8901',
  email: 'ananya.sharma@ayurwellness.in',
  yearsOfExperience: 12,
  languages: ['English', 'Hindi', 'Kannada', 'Sanskrit'],
  about:
    'Dedicated Ayurvedic practitioner specializing in holistic wellness and chronic disease management. Trained in classical Panchakarma therapies and personalized diet-lifestyle counseling based on Prakriti assessment.',
  avatarUrl: null,
  signatureUrl: null,
  workingHours: [
    { day: 'Monday', open: '09:00', close: '18:00', closed: false },
    { day: 'Tuesday', open: '09:00', close: '18:00', closed: false },
    { day: 'Wednesday', open: '09:00', close: '18:00', closed: false },
    { day: 'Thursday', open: '09:00', close: '18:00', closed: false },
    { day: 'Friday', open: '09:00', close: '18:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '14:00', closed: false },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  specializations: [
    'Panchakarma',
    'Chronic Disorders',
    'Prakriti Assessment',
    'Diet & Lifestyle Counseling',
    'Women\'s Health',
  ],
}

export const emptyPractitioner: PractitionerProfile = {
  id: '',
  name: '',
  qualification: '',
  registrationNumber: '',
  clinicName: '',
  clinicAddress: '',
  city: '',
  state: '',
  pincode: '',
  phone: '',
  email: '',
  yearsOfExperience: 0,
  languages: [],
  about: '',
  avatarUrl: null,
  signatureUrl: null,
  workingHours: [
    { day: 'Monday', open: '', close: '', closed: false },
    { day: 'Tuesday', open: '', close: '', closed: false },
    { day: 'Wednesday', open: '', close: '', closed: false },
    { day: 'Thursday', open: '', close: '', closed: false },
    { day: 'Friday', open: '', close: '', closed: false },
    { day: 'Saturday', open: '', close: '', closed: false },
    { day: 'Sunday', open: '', close: '', closed: true },
  ],
  specializations: [],
}

export const specializationSuggestions = [
  'Panchakarma',
  'Kshara Sutra',
  'Ayurvedic Surgery',
  'Chronic Disorders',
  'Prakriti Assessment',
  'Diet & Lifestyle Counseling',
  'Women\'s Health',
  'Pediatric Care',
  'Geriatric Care',
  'Mental Wellness',
  'Yoga Therapy',
  'Naturopathy',
  'Unani Medicine',
  'Siddha Medicine',
  'Homeopathy',
  'Sowa-Rigpa',
]
