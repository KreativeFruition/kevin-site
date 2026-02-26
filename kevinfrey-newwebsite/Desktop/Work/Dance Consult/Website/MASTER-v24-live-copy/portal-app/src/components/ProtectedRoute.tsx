import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types'
import { FullScreenLoader } from './FullScreenLoader'

interface Props {
  roles?: UserRole[]
  children: ReactNode
}

export const ProtectedRoute = ({ roles, children }: Props) => {
  const { profile, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <FullScreenLoader />
  }

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && role && !roles.includes(role)) {
    const fallback =
      role === 'consultant' ? '/consultant/dashboard' : role === 'admin' ? '/admin' : '/dashboard'
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
