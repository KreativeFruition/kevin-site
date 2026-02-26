import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthApiError } from '@supabase/supabase-js'
import { useAuth } from '@/context/AuthContext'
import { GradientButton } from '@/components/GradientButton'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithEmail, mode, profile } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>()

  useEffect(() => {
    if (profile) {
      navigate('/dashboard', { replace: true })
    }
  }, [profile, navigate])

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''))
    const errorDescription = hashParams.get('error_description')
    if (errorDescription) {
      setStatus('error')
      setMessage(decodeURIComponent(errorDescription.replace(/\+/g, ' ')))
    }
  }, [location.hash])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    setMessage(undefined)
    try {
      const result = await signInWithEmail(email, 'client')
      setStatus('success')
      if (result === 'demo') {
        setMessage('Demo profile loaded. Redirecting you now.')
        navigate('/dashboard', { replace: true })
      } else {
        setMessage('Magic link sent. Please check your inbox and open it within 60 seconds.')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      if (error instanceof AuthApiError && error.message.toLowerCase().includes('rate limit')) {
        setMessage('You requested too many links. Wait 60 seconds before trying again.')
      } else if (error instanceof AuthApiError && error.message) {
        setMessage(error.message)
      } else if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('Unable to start sign-in. Try again or contact support.')
      }
    }
  }

  return (
    <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-card p-8 lg:p-10">
        <p className="text-sm uppercase tracking-[0.35em] text-ink/60">1:1 Dance Consult</p>
        <h1 className="mt-3 text-4xl font-semibold">Portal access</h1>
        <p className="mt-2 text-ink/70">
          Sign in with the email linked to your 1:1 Dance Consult experience. Clients manage onboarding, bookings, and
          confirmations inside this secure workspace.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-ink/80">
            Email
            <input
              type="email"
              required
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-base focus-ring"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <GradientButton
            type="submit"
            disabled={status === 'sending'}
            className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'sending' ? 'Sending link…' : mode === 'demo' ? 'Enter demo portal' : 'Email magic link'}
          </GradientButton>
          {message && (
            <p className={`text-sm ${status === 'error' ? 'text-brightRed' : 'text-electricBlue'}`}>{message}</p>
          )}
        </form>
      </div>
      <div className="glass-card p-8">
        <p className="text-sm font-semibold text-ink/70">What to expect</p>
        <ul className="mt-4 space-y-4 text-sm text-ink/70">
          <li>• Premium onboarding with deep creative intake.</li>
          <li>• Booking confirmations + payments tracked in one place.</li>
          <li>• Direct concierge updates for your sessions.</li>
          <li>• Private notes shared between you and your consultants.</li>
        </ul>
      </div>
    </section>
  )
}
