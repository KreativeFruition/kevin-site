import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { portalApi } from '@/lib/portalApi'
import { GradientButton } from '@/components/GradientButton'
import { Skeleton } from '@/components/Skeleton'

export const ClientDashboard = () => {
  const { profile } = useAuth()

  const bookingsQuery = useQuery({
    queryKey: ['bookings', profile?.id],
    queryFn: () => portalApi.listBookings('client', profile!.id),
    enabled: Boolean(profile?.id),
  })

  const intakeQuery = useQuery({
    queryKey: ['client-intake', profile?.id],
    queryFn: () => portalApi.getClientIntake(profile!.id),
    enabled: Boolean(profile?.id),
  })

  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: portalApi.listConsultants,
  })

  const nextBooking = bookingsQuery.data?.[0]

  return (
    <section className="space-y-8">
      <div className="glass-card grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Client dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold">Welcome back, {profile?.full_name?.split(' ')[0]}</h1>
          <p className="mt-3 max-w-xl text-ink/70">
            Track onboarding, confirm bookings, and share signals with your consultants. Phase 1 routes to Calendly; Phase 2 will bring native scheduling.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/onboarding">
              <GradientButton>Complete intake</GradientButton>
            </Link>
            <Link
              to="/booking"
              className="focus-ring rounded-full border border-ink/10 px-5 py-2 text-sm font-semibold text-ink/70"
            >
              Book a consult
            </Link>
          </div>
        </div>
        <div className="glass-card bg-white/70 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Next booking</p>
          {bookingsQuery.isLoading ? (
            <Skeleton className="mt-4 h-24" />
          ) : nextBooking ? (
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-lg font-semibold">{nextBooking.focus}</p>
              <p className="text-ink/70">
                {new Date(nextBooking.start_time ?? '').toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-electricBlue">{nextBooking.status}</p>
              {nextBooking.external_ref && (
                <p className="text-xs text-ink/60">Calendly: {nextBooking.external_ref}</p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/70">No sessions yet. Tap “Book a consult” to start.</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Onboarding</p>
              <p className="mt-1 text-xl font-semibold">Deep intake</p>
            </div>
            <Link to="/onboarding" className="text-sm text-electricBlue">
              Update →
            </Link>
          </div>
          {intakeQuery.isLoading ? (
            <Skeleton className="mt-4 h-40" />
          ) : (
            <div className="mt-6 space-y-4 text-sm text-ink/70">
              <p>
                <span className="font-semibold text-ink">Goals:</span> {intakeQuery.data?.goals.shortTerm}
              </p>
              <p>
                <span className="font-semibold text-ink">Focus:</span>{' '}
                {intakeQuery.data?.passions.focuses.join(', ')}
              </p>
              <p>
                <span className="font-semibold text-ink">Schedule:</span>{' '}
                {intakeQuery.data?.constraints.preferredDays.join(', ')} ·{' '}
                {intakeQuery.data?.constraints.preferredTimes}
              </p>
            </div>
          )}
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Consultants</p>
              <p className="mt-1 text-xl font-semibold">Curated for you</p>
            </div>
            <Link to="/consultants" className="text-sm text-electricBlue">
              View all →
            </Link>
          </div>
          {consultantsQuery.isLoading ? (
            <Skeleton className="mt-4 h-48" />
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {consultantsQuery.data?.slice(0, 2).map((consultant) => (
                <div key={consultant.profile_id} className="rounded-3xl border border-white/50 bg-white/70 p-4">
                  <p className="text-lg font-semibold">{consultant.display_name}</p>
                  <p className="text-sm text-ink/70">{consultant.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {consultant.specialties.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-electricBlue/10 px-3 py-1 text-xs font-semibold text-electricBlue">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={consultant.calendly_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-electricBlue"
                  >
                    View Calendly →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
