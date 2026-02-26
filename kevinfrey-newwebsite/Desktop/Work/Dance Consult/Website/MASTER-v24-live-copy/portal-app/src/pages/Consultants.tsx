import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { portalApi } from '@/lib/portalApi'
import { GradientButton } from '@/components/GradientButton'
import { Skeleton } from '@/components/Skeleton'

const specialtyFilters = ['Career Strategy', 'Film Prep', 'Brand', 'Touring', 'Mentorship']

export const ConsultantDirectoryPage = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>()
  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: portalApi.listConsultants,
  })

  const filtered = useMemo(() => {
    if (!consultantsQuery.data) return []
    return consultantsQuery.data.filter((consultant) => {
      const matchesSearch =
        consultant.display_name.toLowerCase().includes(search.toLowerCase()) ||
        consultant.bio.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter ? consultant.specialties.some((tag) => tag.includes(filter)) : true
      return matchesSearch && matchesFilter
    })
  }, [consultantsQuery.data, search, filter])

  return (
    <section className="space-y-6">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Consultants</p>
            <h1 className="mt-2 text-3xl font-semibold">Match with your creative partner</h1>
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-2">
            {specialtyFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter((prev) => (prev === item ? undefined : item))}
                className={`rounded-full px-4 py-1.5 text-sm focus-ring ${
                  filter === item ? 'bg-electricBlue/15 text-electricBlue' : 'bg-white/70 text-ink/70'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search by name, specialty, focus…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring md:flex-1"
          />
        </div>
      </div>
      {consultantsQuery.isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((consultant) => (
            <article key={consultant.profile_id} className="gradient-border">
              <div className="glass-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{consultant.display_name}</h3>
                    <p className="text-sm text-ink/70">{consultant.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {consultant.specialties.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-electricBlue/10 px-3 py-1 text-xs font-semibold text-electricBlue"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink/60">
                  {(consultant.services ?? []).map((service) => (
                    <span key={service} className="rounded-full bg-ink/5 px-3 py-1 text-xs">
                      {service}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={consultant.calendly_url} target="_blank" rel="noreferrer">
                    <GradientButton>Open Calendly</GradientButton>
                  </a>
                  <a
                    href={`mailto:concierge@1on1consult.org?subject=Match%20me%20with%20${encodeURIComponent(consultant.display_name)}`}
                    className="focus-ring rounded-full border border-ink/10 px-5 py-2 text-sm font-semibold text-ink/70"
                  >
                    Ask concierge
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
