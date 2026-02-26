import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Profile, UserRole } from '@/types'
import { portalApi } from '@/lib/portalApi'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { demoProfile, demoConsultantProfile } from '@/lib/demoData'

type AuthContextValue = {
  session: Session | null
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  mode: 'supabase' | 'demo'
  signInWithEmail: (email: string, roleHint?: UserRole) => Promise<'supabase' | 'demo'>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const demoRoleMap: Record<UserRole, Profile> = {
  client: demoProfile,
  consultant: demoConsultantProfile,
  admin: {
    id: 'admin-demo',
    role: 'admin',
    full_name: 'Portal Admin',
    email: 'admin@example.com',
    timezone: 'America/Los_Angeles',
  },
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)
  const [demoState, setDemoState] = useState<{
    authenticated: boolean
    profile: Profile
  }>({ authenticated: false, profile: demoProfile })
  const queryClient = useQueryClient()

  const loadDemoProfile = (email: string, roleHint: UserRole) => {
    setDemoState({
      authenticated: true,
      profile: {
        ...demoRoleMap[roleHint],
        email,
        id: `${roleHint}-${Date.now()}`,
      },
    })
  }

  useEffect(() => {
    if (!supabase) return
    let isMounted = true
    ;(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error(error)
      }
      if (isMounted) {
        setSession(data?.session ?? null)
        setAuthReady(true)
      }
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (!nextSession) {
        queryClient.removeQueries({ queryKey: ['profile'] })
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [queryClient])

  const profileQuery = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: () =>
      portalApi.getProfile(session!.user.id, {
        email: session?.user?.email ?? undefined,
        full_name: session?.user?.user_metadata?.full_name,
        role: 'client',
      }),
    enabled: Boolean(session?.user?.id && isSupabaseConfigured && authReady),
    staleTime: 1000 * 60 * 5,
  })

  const profile = isSupabaseConfigured
    ? (profileQuery.data ?? null)
    : demoState.authenticated
      ? demoState.profile
      : null

  const loading = isSupabaseConfigured ? !authReady || profileQuery.isLoading : false

  const signInWithEmail = async (email: string, roleHint: UserRole = 'client') => {
    if (!supabase) {
      loadDemoProfile(email, roleHint)
      return 'demo'
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/portal/dashboard`,
      },
    })

    if (error) {
      throw error
    }

    return 'supabase'
  }

  const signOut = async () => {
    if (!supabase) {
      setDemoState({ authenticated: false, profile: demoProfile })
      return
    }
    await supabase.auth.signOut()
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      role: profile?.role ?? null,
      loading,
      mode: isSupabaseConfigured ? 'supabase' : 'demo',
      signInWithEmail,
      signOut,
    }),
    [loading, profile, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
