import { useQuery } from '@tanstack/react-query'
import { portalApi } from '@/lib/portalApi'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/Skeleton'

export const AdminConsolePage = () => {
  const { profile } = useAuth()
  const bookingsQuery = useQuery({
    queryKey: ['bookings', profile?.id, 'admin'],
    queryFn: () => portalApi.listBookings('admin', profile!.id),
    enabled: Boolean(profile?.id),
  })
  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: portalApi.listConsultants,
  })

  const stats = {
    total: bookingsQuery.data?.length ?? 0,
    pending: bookingsQuery.data?.filter((booking) => booking.status === 'pending').length ?? 0,
    calendly: bookingsQuery.data?.filter((booking) => booking.source === 'calendly').length ?? 0,
  }

  return (
    <section className="space-y-6">
      <div className="glass-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Admin console</p>
        <h1 className="mt-2 text-3xl font-semibold">Control tower</h1>
        <p className="mt-2 text-ink/70">
          Oversee bookings, monitor Calendly bridge stats, and sync notes between consultants + concierge.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Open bookings', value: stats.total },
          { label: 'Pending confirmation', value: stats.pending },
          { label: 'Calendly sourced', value: stats.calendly },
        ].map((card) => (
          <div key={card.label} className="gradient-border">
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-semibold">{card.value}</p>
              <p className="text-xs uppercase tracking-[0.35em] text-ink/60">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/60 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.35em] text-ink/60">
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Consultant</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {bookingsQuery.isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6">
                    <Skeleton className="h-8" />
                  </td>
                </tr>
              ) : (
                bookingsQuery.data?.map((booking) => {
                  const consultant = consultantsQuery.data?.find(
                    (item) => item.profile_id === booking.consultant_profile_id,
                  )
                  return (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 font-semibold">{booking.client_profile_id}</td>
                      <td className="px-6 py-4">{consultant?.display_name ?? 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-electricBlue/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-electricBlue">
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-ink/70">{booking.source}</td>
                      <td className="px-6 py-4 text-ink/80">{booking.focus}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
