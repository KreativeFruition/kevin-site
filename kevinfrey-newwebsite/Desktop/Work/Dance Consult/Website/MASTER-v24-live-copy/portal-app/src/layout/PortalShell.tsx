import { Outlet, useLocation } from 'react-router-dom'
import { AmbientBackground } from '@/components/AmbientBackground'
import { PortalNav } from '@/components/PortalNav'

const NAVLESS_ROUTES = ['/login']

export const PortalShell = () => {
  const location = useLocation()
  const hideNav = NAVLESS_ROUTES.includes(location.pathname)

  return (
    <div className="relative min-h-screen bg-white">
      <AmbientBackground />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-10">
        {!hideNav && <PortalNav />}
        <main className={hideNav ? 'pt-10' : 'mt-10'}>
          <div className="hairline-glow space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
