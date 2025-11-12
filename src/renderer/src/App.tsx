import React, { useEffect } from 'react'
import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom'
import { Toaster } from 'sonner'

import { Sidebar } from './components/core/Sidebar'
import { HomePage, LoginPage } from './pages'
import { useConfigStore } from './store/configProvider'

const getToken = (): string | null => localStorage.getItem('token')

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

interface SidebarLayoutProps {
  children: React.ReactNode
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleProfileClick = (): void => {
    console.log('Profile clicked')
  }

  const handleTabChange = (tabId: string): void => {
    console.log('Tab changed to:', tabId)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
      />
      <main className="flex-1 bg-slate-100 dark:bg-slate-900 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}

/* ----------------------------------- App ---------------------------------- */
const App: React.FC = () => {
  const { isLoading, fetchConfig } = useConfigStore()

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <SidebarLayout>
                  <HomePage />
                </SidebarLayout>
              </ProtectedLayout>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <SidebarLayout>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                      404
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Page Not Found</p>
                  </div>
                </div>
              </SidebarLayout>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App
