import React, { JSX, useEffect } from 'react'
import { MemoryRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Sidebar } from './components/core/Sidebar'
import { TitleBar } from './components/core/TitleBar'
import { useConfigStore } from './store/configProvider'
import { useTheme } from './components/core/ThemeProvider'
import { appRoutes } from './routes/appRoutes'
import { IAppRoute } from './interface/config.interface'

// ================= TOKEN =================
const getToken = (): string | null => localStorage.getItem('token')

// ================= PROTECTED LAYOUT =================
interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps): JSX.Element => {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// ================= SIDEBAR LAYOUT =================
interface SidebarLayoutProps {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: SidebarLayoutProps): JSX.Element => {
  const { theme, setTheme } = useTheme()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  const handleLogout = (): void => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <TitleBar
        username={userData?.username}
        onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 bg-slate-100 dark:bg-black p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

// ================= LOGIN LAYOUT =================
interface LoginLayoutProps {
  children: React.ReactNode
}

const LoginLayout = ({ children }: LoginLayoutProps): JSX.Element => (
  <div className="flex flex-col h-screen w-screen overflow-hidden">
    <TitleBar />
    <main className="flex flex-1 items-center justify-center bg-slate-100 dark:bg-slate-900">
      {children}
    </main>
  </div>
)

const CustomLayout = ({ children }: LoginLayoutProps): JSX.Element => (
  <div className="flex flex-col h-screen w-screen overflow-hidden">
    <TitleBar />
    <main className="">{children}</main>
  </div>
)

// ================= ROUTE WRAPPER =================
const renderRoute = (route: IAppRoute, key: number): JSX.Element => {
  const { element, protected: isProtected, path } = route

  // PUBLIC (login)
  if (!isProtected && path === '/login') {
    return <Route key={key} path={path} element={<LoginLayout>{element}</LoginLayout>} />
  }

  // PUBLIC (lainnya)
  if (!isProtected) {
    return (
      <>
        <Route key={key} path={path} element={<CustomLayout>{element}</CustomLayout>} />
      </>
    )
  }

  // PROTECTED
  return (
    <Route
      key={key}
      path={path}
      element={
        <ProtectedLayout>
          <SidebarLayout>{element}</SidebarLayout>
        </ProtectedLayout>
      }
    />
  )
}

// ================= APP =================
const App: React.FC = () => {
  const { fetchConfig, isLoading } = useConfigStore()

  useEffect(() => {
    fetchConfig()
  }, [])

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      <Router>
        <Routes>
          {appRoutes.filter((r) => r.active).map((route, i) => renderRoute(route, i))}

          {/* 404 */}
          <Route
            path="*"
            element={
              <SidebarLayout>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">404</h1>
                    <p className="text-slate-600 dark:text-slate-400">Page Not Found</p>
                  </div>
                </div>
              </SidebarLayout>
            }
          />
        </Routes>
      </Router>

      <Toaster position="top-center" />
    </>
  )
}

export default App
