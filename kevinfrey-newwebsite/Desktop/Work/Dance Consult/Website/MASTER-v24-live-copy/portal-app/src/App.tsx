import { Navigate, Route, Routes } from 'react-router-dom'
import { PortalShell } from '@/layout/PortalShell'
import { LoginPage } from '@/pages/Login'
import { ClientDashboard } from '@/pages/ClientDashboard'
import { ConsultantDirectoryPage } from '@/pages/Consultants'
import { BookingPage } from '@/pages/Booking'
import { ConsultantDashboardPage } from '@/pages/ConsultantDashboard'
import { AdminConsolePage } from '@/pages/Admin'
import { OnboardingPage } from '@/pages/Onboarding'
import { NotFoundPage } from '@/pages/NotFound'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const App = () => (
  <Routes>
    <Route element={<PortalShell />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['client', 'admin']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute roles={['client', 'admin']}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultants"
        element={
          <ProtectedRoute roles={['client', 'admin']}>
            <ConsultantDirectoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute roles={['client', 'admin']}>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultant"
        element={
          <ProtectedRoute roles={['consultant']}>
            <ConsultantDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultant/dashboard"
        element={
          <ProtectedRoute roles={['consultant']}>
            <ConsultantDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminConsolePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
)

export default App
