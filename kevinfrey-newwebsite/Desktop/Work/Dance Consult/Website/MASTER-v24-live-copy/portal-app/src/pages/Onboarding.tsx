import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import type { ClientIntake } from '@/types'
import { portalApi } from '@/lib/portalApi'
import { demoClientIntake } from '@/lib/demoData'
import { GradientButton } from '@/components/GradientButton'
import { Skeleton } from '@/components/Skeleton'

const steps = [
  { title: 'Who is this for?', description: 'Adult client vs. parent booking for a dancer.', fields: ['bookingFor', 'clientName'] },
  { title: 'Basics', description: 'Core info so consultants can prep.', fields: ['clientName', 'timezone', 'contactEmail', 'age', 'birthday'] },
  { title: 'Goals & Dreams', description: 'Capture short- and long-term targets.', fields: ['goals.shortTerm', 'goals.longTerm'] },
  { title: 'Creative Passions', description: 'What lights you up + intensity sliders.', fields: ['passions.focuses'] },
  { title: 'Personality & Learning', description: 'Preferred coaching style.', fields: ['personality.learningStyle'] },
  { title: 'Constraints', description: 'Schedule guardrails & preferences.', fields: ['constraints.preferredDays', 'constraints.preferredTimes'] },
  { title: 'Review & Save', description: 'Confirm details before saving.' },
]

const focusOptions = ['Dance', 'Film', 'Business', 'Creative Direction', 'Music', 'Brand Systems']
const intensityKeys = ['dance', 'film', 'business', 'music']
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const OnboardingPage = () => {
  const { profile } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const queryClient = useQueryClient()
  const form = useForm<ClientIntake>({ defaultValues: demoClientIntake })
  const { register, watch, setValue, handleSubmit, trigger, reset } = form

  const intakeQueryKey = useMemo(() => ['client-intake', profile?.id], [profile?.id])

  const intakeQuery = useQuery({
    queryKey: intakeQueryKey,
    queryFn: () => portalApi.getClientIntake(profile!.id),
    enabled: Boolean(profile?.id),
  })

  useEffect(() => {
    if (intakeQuery.data) {
      reset(intakeQuery.data)
    }
  }, [intakeQuery.data, reset])

  const mutation = useMutation({
    mutationFn: (payload: ClientIntake) => portalApi.saveClientIntake(profile!.id, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: intakeQueryKey })
      const previous = queryClient.getQueryData(intakeQueryKey)
      queryClient.setQueryData(intakeQueryKey, payload)
      return { previous }
    },
    onError: (_error, _newValue, context) => {
      if (context?.previous) {
        queryClient.setQueryData(intakeQueryKey, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: intakeQueryKey })
    },
  })

  const focuses = watch('passions.focuses') ?? []
  const intensities = watch('passions.intensities') ?? demoClientIntake.passions.intensities

  const goNext = async () => {
    const fields = steps[currentStep].fields
    if (fields && fields.length > 0) {
      const valid = await trigger(fields as any)
      if (!valid) return
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const toggleFocus = (focus: string) => {
    const next = focuses.includes(focus) ? focuses.filter((item: string) => item !== focus) : [...focuses, focus]
    setValue('passions.focuses', next)
  }

  const saveProfile = handleSubmit(async (values) => {
    await mutation.mutateAsync(values)
  })

  if (intakeQuery.isLoading) {
    return (
      <div className="glass-card p-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="mt-4 h-5 w-full" />
        <Skeleton className="mt-6 h-56 w-full" />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {['self', 'parent'].map((option) => (
              <label
                key={option}
                className={`glass-card cursor-pointer p-5 ${watch('bookingFor') === option ? 'ring-2 ring-electricBlue/60' : ''}`}
              >
                <input type="radio" value={option} {...register('bookingFor', { required: true })} className="sr-only" />
                <p className="text-lg font-semibold capitalize">
                  {option === 'self' ? 'I am the client' : 'Parent / guardian booking'}
                </p>
                <p className="mt-2 text-sm text-ink/70">
                  {option === 'self'
                    ? 'Adult or pro talent booking their own session.'
                    : 'Parents booking for under-18 or dependent talent.'}
                </p>
              </label>
            ))}
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-ink/70">Client full name</span>
              <input
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('clientName', { required: true })}
                placeholder="Jordan Morgan"
              />
            </label>
          </div>
        )
      case 1:
        return (
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-sm font-medium text-ink/70">Age</span>
              <input
                type="number"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('age', { valueAsNumber: true })}
              />
            </label>
            <label>
              <span className="text-sm font-medium text-ink/70">Birthday</span>
              <input
                type="date"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('birthday')}
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-ink/70">Timezone</span>
              <input
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('timezone', { required: true })}
                placeholder="America/Los_Angeles"
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-ink/70">Primary contact email</span>
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('contactEmail', { required: true })}
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-sm font-medium text-ink/70">Phone / WhatsApp</span>
              <input
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('contactPhone')}
              />
            </label>
          </div>
        )
      case 2:
        return (
          <div className="grid gap-6">
            <label>
              <span className="text-sm font-medium text-ink/70">Short-term goals</span>
              <textarea
                rows={3}
                className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('goals.shortTerm', { required: true })}
                placeholder="Dial in my audition package for summer tours."
              />
            </label>
            <label>
              <span className="text-sm font-medium text-ink/70">Longer horizon</span>
              <textarea
                rows={3}
                className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('goals.longTerm', { required: true })}
                placeholder="Creative director for film + brand collaborations."
              />
            </label>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-ink/70">Focus areas</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {focusOptions.map((focus) => (
                  <button
                    type="button"
                    key={focus}
                    onClick={() => toggleFocus(focus)}
                    className={`rounded-full px-4 py-2 text-sm focus-ring ${
                      focuses.includes(focus)
                        ? 'bg-electricBlue/15 text-electricBlue'
                        : 'bg-white/70 text-ink/70'
                    }`}
                  >
                    {focus}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {intensityKeys.map((key) => (
                <label key={key} className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold capitalize">
                    <span>{key}</span>
                    <span>{intensities[key] ?? 50}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    className="mt-3 w-full accent-electricBlue"
                    {...register(`passions.intensities.${key}` as const, { valueAsNumber: true })}
                  />
                </label>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="grid gap-6">
            <label>
              <span className="text-sm font-medium text-ink/70">Learning style</span>
              <textarea
                rows={3}
                className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('personality.learningStyle', { required: true })}
                placeholder="Hands-on, fast-paced drills with targeted notes."
              />
            </label>
            <label>
              <span className="text-sm font-medium text-ink/70">Loves</span>
              <textarea
                rows={2}
                className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('personality.likes')}
              />
            </label>
            <label>
              <span className="text-sm font-medium text-ink/70">Avoids</span>
              <textarea
                rows={2}
                className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('personality.dislikes')}
              />
            </label>
          </div>
        )
      case 5:
        return (
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-ink/70">Preferred days</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {days.map((day) => {
                  const selected = watch('constraints.preferredDays') ?? []
                  const active = selected.includes(day)
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => {
                        const next = active
                          ? selected.filter((item: string) => item !== day)
                          : [...selected, day]
                        setValue('constraints.preferredDays', next)
                      }}
                      className={`rounded-full px-4 py-1.5 text-sm focus-ring ${
                        active ? 'bg-electricBlue/15 text-electricBlue' : 'bg-white/70 text-ink/70'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  )
                })}
              </div>
            </div>
            <label>
              <span className="text-sm font-medium text-ink/70">Preferred times</span>
              <input
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('constraints.preferredTimes', { required: true })}
                placeholder="10a–2p PT"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-ink/70">Notes / constraints</span>
              <textarea
                rows={3}
                className="mt-2 w-full rounded-3xl border border-ink/10 bg-white/70 px-4 py-3 focus-ring"
                {...register('constraints.notes')}
              />
            </label>
          </div>
        )
      case 6:
        const values = watch()
        return (
          <div className="grid gap-4">
            <div className="gradient-border">
              <div className="glass-card p-5">
                <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Snapshot</p>
                <p className="mt-2 text-xl font-semibold">{values.clientName}</p>
                <p className="text-sm text-ink/70">{values.timezone}</p>
                <p className="mt-4 text-sm text-ink/70">{values.goals.shortTerm}</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="glass-card p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Focus</p>
                <p className="mt-2 text-sm text-ink/80">{values.passions.focuses.join(', ')}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Schedule</p>
                <p className="mt-2 text-sm text-ink/80">
                  {values.constraints.preferredDays.join(', ')} · {values.constraints.preferredTimes}
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <section className="glass-card p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/40 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-ink/60">
            Step {currentStep + 1} / {steps.length}
          </p>
          <h2 className="mt-2 text-3xl font-semibold">{steps[currentStep].title}</h2>
          <p className="mt-1 text-ink/70">{steps[currentStep].description}</p>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-electricBlue to-hotMagenta"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-ink/70">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
      </div>
      <div className="mt-6 space-y-6">{renderStep()}</div>
      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 0}
          className="rounded-full border border-ink/10 px-5 py-2 text-sm font-semibold text-ink/70 disabled:opacity-50"
        >
          Back
        </button>
        {currentStep === steps.length - 1 ? (
          <GradientButton onClick={saveProfile} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving…' : 'Save profile'}
          </GradientButton>
        ) : (
          <GradientButton type="button" onClick={goNext}>
            Next
          </GradientButton>
        )}
      </div>
      {mutation.isSuccess && (
        <p className="mt-4 text-sm text-electricBlue">Profile saved. Consultants will now see the updated intake.</p>
      )}
    </section>
  )
}
