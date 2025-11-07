// contexts/ToastContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { MyToast } from '@components/core/MyToast'

interface ToastContextType {
  showToast: (title: string, description: string, variant?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    open: boolean
    title: string
    description: string
    variant: 'success' | 'error' | 'info'
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'success'
  })

  const showToast = (
    title: string,
    description: string,
    variant: 'success' | 'error' | 'info' = 'success'
  ): void => {
    setToast({
      open: true,
      title,
      description,
      variant
    })
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <MyToast
        open={toast.open}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onOpenChange={(open) => setToast({ ...toast, open })}
      />
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
