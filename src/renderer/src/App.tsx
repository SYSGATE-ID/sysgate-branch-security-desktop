import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage, LoginPage } from './pages'
import { Toaster } from 'sonner'
import { HeaderContent } from './components/core/HeaderContent'
import { FooterContent } from './components/core/FooterContent'

interface LayoutProps {
  children: React.ReactNode
}

// eslint-disable-next-line react/prop-types
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header>
        <HeaderContent />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-white">{children}</main>

      {/* Footer */}
      <footer>
        <FooterContent />
      </footer>
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </>
  )
}

export default App
