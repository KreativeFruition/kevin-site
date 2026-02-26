import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <div className="glass-card p-10 text-center">
    <p className="text-xs uppercase tracking-[0.35em] text-ink/60">404</p>
    <h1 className="mt-3 text-3xl font-semibold">Portal route not found</h1>
    <p className="mt-2 text-ink/70">Return to the dashboard to continue.</p>
    <Link to="/dashboard" className="mt-6 inline-flex text-sm font-semibold text-electricBlue">
      Back to dashboard →
    </Link>
  </div>
)
