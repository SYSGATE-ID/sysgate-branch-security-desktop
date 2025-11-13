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
import { TitleBar } from './components/core/TitleBar'
import { HomePage, LoginPage } from './pages'
import { useConfigStore } from './store/configProvider'
import { useTheme } from './components/core/ThemeProvider'

const getToken = (): string | null => localStorage.getItem('token')

/* ---------------------------- Protected Layout ---------------------------- */
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

/* ---------------------------- Sidebar Layout ----------------------------- */
interface SidebarLayoutProps {
  children: React.ReactNode
}
const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const { setTheme, theme } = useTheme()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

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
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Custom Title Bar */}
      <TitleBar
        username={userData && userData.username}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
        />
        <main className="flex-1 bg-slate-100 dark:bg-black p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

/* ----------------------------- Login Layout ------------------------------ */
interface LoginLayoutProps {
  children: React.ReactNode
}
const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TitleBar />
      <main className="flex flex-1 items-center justify-center bg-slate-100 dark:bg-slate-900 p-6">
        {children}
      </main>
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
          {/* Public Route - Login */}
          <Route
            path="/login"
            element={
              <LoginLayout>
                <LoginPage />
              </LoginLayout>
            }
          />

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
