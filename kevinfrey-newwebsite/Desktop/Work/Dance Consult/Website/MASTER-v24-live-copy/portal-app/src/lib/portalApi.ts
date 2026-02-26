import type { Booking, ClientIntake, Consultant, Profile, UserRole } from '@/types'
import { demoBookings, demoClientIntake, demoConsultants, demoProfile } from './demoData'
import { supabase, isSupabaseConfigured } from './supabaseClient'

type ProfileFallback = {
  email?: string
  role?: UserRole
  full_name?: string
  timezone?: string
}

const LOCAL_INTAKE_KEY = 'portal_demo_intake'

const persistDemoIntake = (intake: ClientIntake) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_INTAKE_KEY, JSON.stringify(intake))
}

const readDemoIntake = (): ClientIntake => {
  if (typeof window === 'undefined') return demoClientIntake
  const cached = localStorage.getItem(LOCAL_INTAKE_KEY)
  return cached ? (JSON.parse(cached) as ClientIntake) : demoClientIntake
}

export const portalApi = {
  async getProfile(userId: string, fallback?: ProfileFallback): Promise<Profile> {
    const buildFallback = () => ({
      id: userId,
      role: fallback?.role ?? 'client',
      full_name: fallback?.full_name ?? fallback?.email ?? 'Portal Member',
      email: fallback?.email ?? 'client@1on1consult.org',
      timezone: fallback?.timezone,
      created_at: new Date().toISOString(),
    })

    if (!isSupabaseConfigured || !supabase) {
      return fallback ? buildFallback() : { ...demoProfile, id: userId }
    }

    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error && status !== 406) {
      console.warn('profiles fetch failed, using fallback profile', error)
      return buildFallback()
    }

    if (!data) {
      const fallbackProfile = buildFallback()
      try {
        if (isSupabaseConfigured && supabase) {
          await supabase.from('profiles').upsert(
            {
              id: userId,
              role: fallbackProfile.role,
              full_name: fallbackProfile.full_name,
              email: fallbackProfile.email,
              timezone: fallbackProfile.timezone,
            },
            { onConflict: 'id' },
          )
        }
      } catch (upsertError) {
        console.warn('profiles upsert failed', upsertError)
      }
      return fallbackProfile
    }

    const profile = data as Profile
    return {
      ...profile,
      role: (profile.role as UserRole | null) ?? (fallback?.role ?? 'client'),
    }
  },

  async getClientIntake(profileId: string): Promise<ClientIntake> {
    if (!isSupabaseConfigured || !supabase) {
      return readDemoIntake()
    }

    const { data, error } = await supabase
      .from('client_profiles')
      .select('intake_jsonb')
      .eq('profile_id', profileId)
      .maybeSingle()

    if (error) throw error
    return (data?.intake_jsonb as ClientIntake) ?? demoClientIntake
  },

  async saveClientIntake(profileId: string, intake: ClientIntake) {
    if (!isSupabaseConfigured || !supabase) {
      persistDemoIntake(intake)
      return intake
    }

    const { error } = await supabase.from('client_profiles').upsert(
      {
        profile_id: profileId,
        intake_jsonb: intake,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'profile_id' },
    )
    if (error) throw error
    return intake
  },

  async listConsultants(): Promise<Consultant[]> {
    if (!isSupabaseConfigured || !supabase) {
      return demoConsultants
    }

    const { data, error } = await supabase
      .from('consultants')
      .select('profile_id, display_name, bio, specialties, calendly_url, is_active, services')
      .eq('is_active', true)
      .order('display_name', { ascending: true })
    if (error) throw error
    return (data as Consultant[]) ?? []
  },

  async listBookings(role: UserRole, profileId: string): Promise<Booking[]> {
    if (!isSupabaseConfigured || !supabase) {
      return demoBookings
    }

    const query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

    if (role === 'client') {
      query.eq('client_profile_id', profileId)
    }
    if (role === 'consultant') {
      query.eq('consultant_profile_id', profileId)
    }

    const { data, error } = await query
    if (error) throw error
    return (data as Booking[]) ?? []
  },

  async saveConsultantProfile(profileId: string, payload: Partial<Consultant>) {
    if (!isSupabaseConfigured || !supabase) {
      return { ...demoConsultants[0], ...payload }
    }

    const { error, data } = await supabase
      .from('consultants')
      .update(payload)
      .eq('profile_id', profileId)
      .select()
      .single()

    if (error) throw error
    return data as Consultant
  },

  async createBookingIntent(payload: Partial<Booking>, note?: string) {
    if (!isSupabaseConfigured || !supabase) {
      const draft = {
        ...payload,
        id: `demo-${Date.now()}`,
        status: 'pending',
        source: 'calendly',
      } as Booking
      demoBookings.unshift(draft)
      if (note) {
        console.info('Note saved (demo mode):', note)
      }
      return draft
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...payload,
        status: payload.status ?? 'pending',
        source: payload.source ?? 'calendly',
      })
      .select()
      .single()

    if (error) throw error
    const booking = data as Booking

    if (note) {
      await portalApi.saveNote(booking.id, note)
    }

    return booking
  },

  async saveNote(bookingId: string, rawText: string) {
    if (!isSupabaseConfigured || !supabase) {
      console.info('Note saved (demo):', bookingId, rawText)
      return
    }
    const { error } = await supabase.from('notes').insert({
      booking_id: bookingId,
      source: 'portal',
      raw_text: rawText,
    })
    if (error) throw error
  },
}
