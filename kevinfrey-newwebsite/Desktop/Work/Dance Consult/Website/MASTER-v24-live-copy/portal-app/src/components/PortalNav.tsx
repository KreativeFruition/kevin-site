import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'
import { GradientButton } from './GradientButton'
import clsx from 'clsx'

type LinkItem = {
  label: string
  to: string
  roles: UserRole[]
}

const links: LinkItem[] = [
  { label: 'Dashboard', to: '/dashboard', roles: ['client', 'consultant', 'admin'] },
  { label: 'Consultants', to: '/consultants', roles: ['client', 'admin'] },
  { label: 'Booking', to: '/booking', roles: ['client'] },
  { label: 'Consultant HQ', to: '/consultant/dashboard', roles: ['consultant'] },
  { label: 'Admin', to: '/admin', roles: ['admin'] },
]

export const PortalNav = () => {
  const { profile, role, signOut, mode } = useAuth()
  const filteredLinks = links.filter((link) => (role ? link.roles.includes(role) : false))

  return (
    <header className="sticky top-6 z-50">
      <div className="glass-nav relative overflow-hidden">
        <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-electricBlue/70 to-transparent" />
        <div className="flex flex-wrap items-center gap-4 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/60">1:1 Dance Consult</p>
            <p className="text-lg font-semibold">{role === 'consultant' ? 'Consultant Portal' : 'Client Portal'}</p>
          </div>
          <nav className="flex flex-1 flex-wrap gap-1">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'focus-ring rounded-full px-4 py-1.5 text-sm font-medium transition',
                    isActive ? 'gradient-text' : 'text-ink/65 hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold">{profile?.full_name ?? 'Guest'}</p>
              <p className="text-xs text-ink/60">
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Select role'}
              </p>
            </div>
            <GradientButton
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              onClick={async () => {
                await signOut()
              }}
            >
              {mode === 'demo' ? 'Reset' : 'Sign out'}
            </GradientButton>
          </div>
        </div>
      </div>
    </header>
  )
}
