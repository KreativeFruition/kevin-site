import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { portalApi } from '@/lib/portalApi'
import type { Consultant } from '@/types'
import { GradientButton } from '@/components/GradientButton'
import { Skeleton } from '@/components/Skeleton'

export const ConsultantDashboardPage = () => {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  const bookingsQuery = useQuery({
    queryKey: ['bookings', profile?.id],
    queryFn: () => portalApi.listBookings('consultant', profile!.id),
    enabled: Boolean(profile?.id),
  })

  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: portalApi.listConsultants,
  })

  const [formState, setFormState] = useState<Partial<Consultant>>({})

  useEffect(() => {
    if (consultantsQuery.data) {
      const consultant = consultantsQuery.data.find((item) => item.profile_id === profile?.id)
      if (consultant) {
        setFormState(consultant)
      }
    }
  }, [consultantsQuery.data, profile?.id])

  const mutation = useMutation({
    mutationFn: (payload: Partial<Consultant>) => portalApi.saveConsultantProfile(profile!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] })
    },
  })

  return (
    <section className="space-y-6">
      <div className="glass-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Consultant HQ</p>
        <h1 className="mt-2 text-3xl font-semibold">Your bookings & profile</h1>
        <p className="mt-2 text-ink/70">
          Review upcoming sessions, preview client profiles, and fine-tune how you appear to clients. Updates save with optimistic UI.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Assigned bookings</p>
          {bookingsQuery.isLoading ? (
            <Skeleton className="mt-4 h-48" />
          ) : (
            <div className="mt-5 space-y-4">
              {bookingsQuery.data?.map((booking) => (
                <div key={booking.id} className="rounded-3xl border border-white/50 bg-white/70 p-4">
                  <p className="text-sm font-semibold text-ink">Client: {booking.client_profile_id}</p>
                  <p className="text-sm text-ink/70">Focus: {booking.focus}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-hotMagenta">{booking.status}</p>
                  {booking.start_time && (
                    <p className="text-xs text-ink/60">
                      {new Date(booking.start_time).toLocaleString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
              ))}
              {!bookingsQuery.data?.length && <p className="text-sm text-ink/70">No bookings yet.</p>}
            </div>
          )}
        </div>
        <form
          className="glass-card p-6"
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate(formState)
          }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Profile</p>
          {consultantsQuery.isLoading ? (
            <Skeleton className="mt-4 h-60" />
          ) : (
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-ink/70">
                Display name
                <input
                  className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                  value={formState.display_name ?? ''}
                  onChange={(event) => setFormState((state) => ({ ...state, display_name: event.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium text-ink/70">
                Bio
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                  value={formState.bio ?? ''}
                  onChange={(event) => setFormState((state) => ({ ...state, bio: event.target.value }))}
                />
              </label>
              <label className="block text-sm font-medium text-ink/70">
                Specialties (comma separated)
                <input
                  className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                  value={(formState.specialties ?? []).join(', ')}
                  onChange={(event) =>
                    setFormState((state) => ({
                      ...state,
                      specialties: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                    }))
                  }
                />
              </label>
              <label className="block text-sm font-medium text-ink/70">
                Services (comma separated)
                <input
                  className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                  value={(formState.services ?? []).join(', ')}
                  onChange={(event) =>
                    setFormState((state) => ({
                      ...state,
                      services: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                    }))
                  }
                />
              </label>
              <label className="block text-sm font-medium text-ink/70">
                Calendly URL
                <input
                  className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                  value={formState.calendly_url ?? ''}
                  onChange={(event) => setFormState((state) => ({ ...state, calendly_url: event.target.value }))}
                />
              </label>
              <GradientButton type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save changes'}
              </GradientButton>
              {mutation.isSuccess && (
                <p className="text-sm text-electricBlue">Profile updated. Clients will see changes instantly.</p>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
