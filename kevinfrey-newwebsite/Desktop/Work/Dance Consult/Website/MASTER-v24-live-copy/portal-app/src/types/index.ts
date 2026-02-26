export type UserRole = 'client' | 'consultant' | 'admin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  email: string
  timezone?: string
  created_at?: string
}

export interface ClientIntake {
  bookingFor: 'self' | 'parent'
  guardianName?: string
  clientName: string
  age?: number
  birthday?: string
  timezone: string
  contactEmail: string
  contactPhone?: string
  goals: {
    shortTerm: string
    longTerm: string
  }
  passions: {
    focuses: string[]
    intensities: Record<string, number>
  }
  personality: {
    learningStyle: string
    likes: string
    dislikes: string
  }
  constraints: {
    preferredDays: string[]
    preferredTimes: string
    notes: string
  }
}

export interface ClientProfile {
  profile_id: string
  intake_jsonb: ClientIntake
  updated_at?: string
}

export interface Consultant {
  profile_id: string
  display_name: string
  bio: string
  specialties: string[]
  calendly_url?: string
  is_active: boolean
  services?: string[]
  avatar?: string
}

export interface Booking {
  id: string
  client_profile_id: string
  consultant_profile_id: string
  status: 'pending' | 'confirmed' | 'completed'
  start_time?: string
  end_time?: string
  source: 'calendly' | 'custom'
  external_ref?: string
  payment_status?: 'unpaid' | 'paid' | 'refunded'
  focus?: string
}

export interface Note {
  id: string
  booking_id: string
  source: string
  raw_text: string
  structured_jsonb?: Record<string, unknown>
}
