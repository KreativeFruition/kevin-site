import type { Booking, ClientIntake, Consultant, Profile } from '@/types'

export const demoProfile: Profile = {
  id: 'demo-client',
  role: 'client',
  full_name: 'Taylor Alvarez',
  email: 'taylor@example.com',
  timezone: 'America/Los_Angeles',
}

export const demoClientIntake: ClientIntake = {
  bookingFor: 'self',
  clientName: demoProfile.full_name,
  age: 24,
  birthday: '2001-05-14',
  timezone: demoProfile.timezone ?? 'America/Los_Angeles',
  contactEmail: demoProfile.email,
  contactPhone: '+1 (555) 204-1400',
  goals: {
    shortTerm: 'Dial in my rep package for a film callback.',
    longTerm: 'Land creative director roles for artist tours.',
  },
  passions: {
    focuses: ['Dance', 'Film', 'Creative Direction'],
    intensities: {
      dance: 85,
      film: 65,
      business: 55,
      music: 30,
    },
  },
  personality: {
    learningStyle: 'Hands-on with real-time feedback loops.',
    likes: 'Clean references, playlists, actionable notes.',
    dislikes: 'Vague direction or unclear timelines.',
  },
  constraints: {
    preferredDays: ['Tuesday', 'Thursday', 'Friday'],
    preferredTimes: '10a–2p PT',
    notes: 'Traveling mid-June, prefer virtual sessions until then.',
  },
}

export const demoConsultants: Consultant[] = [
  {
    profile_id: 'consultant-1',
    display_name: 'Caroline Linton',
    bio: 'Creative director + artist coach shaping Grammy, Emmy, and Broadway talent.',
    specialties: ['Career Strategy', 'Film Prep', 'Brand Systems'],
    calendly_url: 'https://calendly.com/demo-caroline/60min',
    is_active: true,
    services: ['Audition Coaching', 'Creative Direction', 'Brand Intensive'],
    avatar: '/assets/consultants/caroline.png',
  },
  {
    profile_id: 'consultant-2',
    display_name: 'Miles Carter',
    bio: 'Tour choreographer + movement director with a pulse on breaking artists.',
    specialties: ['Touring', 'Movement Labs', 'Mentorship'],
    calendly_url: 'https://calendly.com/demo-miles/45min',
    is_active: true,
    services: ['Tour Blueprint', 'Signature Move Session'],
    avatar: '/assets/consultants/miles.png',
  },
]

export const demoBookings: Booking[] = [
  {
    id: 'booking-1',
    client_profile_id: demoProfile.id,
    consultant_profile_id: demoConsultants[0].profile_id,
    status: 'pending',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    source: 'calendly',
    focus: 'Film callback coaching',
    external_ref: '#CAL-83902',
    payment_status: 'unpaid',
  },
]

export const demoConsultantProfile: Profile = {
  id: 'consultant-1',
  role: 'consultant',
  full_name: 'Caroline Linton',
  email: 'caroline@example.com',
  timezone: 'America/New_York',
}
