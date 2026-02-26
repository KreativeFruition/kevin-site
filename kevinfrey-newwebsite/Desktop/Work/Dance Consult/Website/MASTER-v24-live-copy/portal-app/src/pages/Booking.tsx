import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { portalApi } from '@/lib/portalApi'
import { GradientButton } from '@/components/GradientButton'
import { Skeleton } from '@/components/Skeleton'

export const BookingPage = () => {
  const { profile, role } = useAuth()
  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: portalApi.listConsultants,
  })
  const intakeQuery = useQuery({
    queryKey: ['client-intake', profile?.id],
    queryFn: () => portalApi.getClientIntake(profile!.id),
    enabled: Boolean(profile?.id),
  })

  const [focus, setFocus] = useState('Strategy Intensive')
  const [selectedConsultant, setSelectedConsultant] = useState<string>()
  const [calendlyRef, setCalendlyRef] = useState('')
  const [notes, setNotes] = useState('')
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [checkoutMessage, setCheckoutMessage] = useState<string>()
  const depositPriceId = import.meta.env.VITE_STRIPE_DEPOSIT_PRICE_ID

  const mutation = useMutation({
    mutationFn: () =>
      portalApi.createBookingIntent(
        {
          client_profile_id: profile!.id,
          consultant_profile_id: selectedConsultant!,
          focus,
          external_ref: calendlyRef || undefined,
          status: calendlyRef ? 'confirmed' : 'pending',
          source: 'calendly',
          payment_status: 'unpaid',
        },
        notes,
      ),
    onSuccess: () => {
      setCalendlyRef('')
      setNotes('')
    },
  })

  const selected = consultantsQuery.data?.find((c) => c.profile_id === selectedConsultant)
  const intakeComplete = useMemo(() => {
    if (role === 'admin') return true
    const data = intakeQuery.data
    if (!data) return false
    const hasFocus = (data.passions?.focuses ?? []).length > 0
    const hasEssentials = Boolean(
      data.clientName && data.goals?.shortTerm && data.constraints?.preferredTimes && data.contactEmail,
    )
    return hasFocus && hasEssentials
  }, [intakeQuery.data, role])

  const startCheckout = async () => {
    if (!depositPriceId) {
      setCheckoutStatus('error')
      setCheckoutMessage('Set VITE_STRIPE_DEPOSIT_PRICE_ID to enable Stripe checkout.')
      return
    }
    if (!selected) {
      setCheckoutStatus('error')
      setCheckoutMessage('Select a consultant first.')
      return
    }
    setCheckoutStatus('loading')
    setCheckoutMessage(undefined)
    try {
      const response = await fetch('/.netlify/functions/createCheckoutSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: depositPriceId,
          metadata: {
            client_profile_id: profile?.id,
            consultant_profile_id: selected.profile_id,
            focus,
          },
          customerEmail: profile?.email,
        }),
      })
      const payload = await response.json()
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error ?? 'Unable to start checkout')
      }
      window.location.assign(payload.url)
    } catch (error) {
      console.error(error)
      setCheckoutStatus('error')
      setCheckoutMessage('Unable to start checkout. Confirm env vars are set.')
    } finally {
      setCheckoutStatus('idle')
    }
  }

  if (intakeQuery.isLoading && role !== 'admin') {
    return (
      <section className="glass-card p-6">
        <Skeleton className="h-24 w-full" />
      </section>
    )
  }

  if (!intakeComplete) {
    return (
      <section className="glass-card p-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Finish onboarding</p>
        <h1 className="mt-2 text-3xl font-semibold">Complete your creative profile first</h1>
        <p className="mt-2 text-sm text-ink/70 max-w-2xl mx-auto">
          Booking unlocks once we have your full intake (goals, focus areas, availability). This keeps consultants
          prepped and ensures the admin team matches you correctly.
        </p>
        <Link
          to="/onboarding"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-ink/10 px-5 py-2 text-sm font-semibold text-electricBlue focus-ring"
        >
          Complete onboarding
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="glass-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Phase 1 booking</p>
        <h1 className="mt-2 text-3xl font-semibold">Bridge into Calendly</h1>
        <p className="mt-2 text-ink/70">
          Select a focus + consultant. We&apos;ll open their Calendly link so you can pick times. After booking, paste the confirmation ID (optional) and the portal will notify the team.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-ink/70">Focus</span>
            <select
              className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
            >
              <option>Strategy Intensive</option>
              <option>Audition Coaching</option>
              <option>Creative Direction Lab</option>
              <option>Brand Systems</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-ink/70">Consultant</span>
            <select
              className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
              value={selectedConsultant}
              onChange={(event) => setSelectedConsultant(event.target.value)}
            >
              <option value="">Choose a consultant</option>
              {consultantsQuery.data?.map((consultant) => (
                <option key={consultant.profile_id} value={consultant.profile_id}>
                  {consultant.display_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {selected && (
          <div className="mt-6 rounded-3xl border border-white/50 bg-white/80 p-5">
            <p className="text-sm font-semibold">{selected.display_name}</p>
            <p className="text-sm text-ink/70">{selected.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selected.specialties.map((tag) => (
                <span key={tag} className="rounded-full bg-electricBlue/10 px-3 py-1 text-xs font-semibold text-electricBlue">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <GradientButton
            type="button"
            disabled={!selected?.calendly_url}
            onClick={() => {
              if (selected?.calendly_url) {
                window.open(selected.calendly_url, '_blank', 'noopener')
              }
            }}
          >
            Open Calendly
          </GradientButton>
          <p className="text-xs text-ink/60">
            The portal will remember your selection and create a booking intent for admin review.
          </p>
        </div>
      </div>
      {selected && (
        <form
          className="glass-card p-6 sm:p-8"
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate()
          }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-ink/60">Confirm booking</p>
          <h2 className="mt-2 text-2xl font-semibold">After Calendly</h2>
          <p className="mt-2 text-sm text-ink/70">
            Paste your Calendly confirmation link or leave blank to flag as pending. Admin will nudge if no confirmation is added within 24h.
          </p>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink/70">Calendly reference</span>
            <input
              className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
              placeholder="https://calendly.com/..."
              value={calendlyRef}
              onChange={(event) => setCalendlyRef(event.target.value)}
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink/70">Notes for consultant</span>
            <textarea
              rows={3}
              className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <GradientButton type="submit" className="mt-6" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : calendlyRef ? 'Confirm booking' : 'Mark pending'}
          </GradientButton>
          <button
            type="button"
            onClick={startCheckout}
            className="ml-0 mt-3 inline-flex rounded-full border border-ink/10 px-5 py-2 text-sm font-semibold text-ink/70"
            disabled={checkoutStatus === 'loading'}
          >
            {checkoutStatus === 'loading' ? 'Preparing checkout…' : 'Start Stripe checkout'}
          </button>
          {mutation.isSuccess && (
            <p className="mt-3 text-sm text-electricBlue">
              Booking intent captured. Concierge will confirm details shortly.
            </p>
          )}
          {checkoutMessage && (
            <p className={`mt-2 text-sm ${checkoutStatus === 'error' ? 'text-brightRed' : 'text-electricBlue'}`}>
              {checkoutMessage}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
